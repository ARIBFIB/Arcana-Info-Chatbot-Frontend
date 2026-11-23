"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  useChatSessionQuery,
  useChatSessionsQuery,
  useCloseChatSessionMutation,
  useCreateChatSessionMutation,
  useSendChatMessageMutation,
} from "@/api";
import { getAccessToken } from "@/api/client";
import { ROUTES } from "@/constants";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { useIsDesktop } from "@/hooks/use-media-query";
import { getApiErrorMessage } from "@/lib/api-error";
import { mapApiMessageToChatMessage } from "@/lib/chat-messages";
import { showToast } from "@/lib/toast";
import type { ChatHistoryItem, ChatMessage } from "@/types/chat";

export function useChatController() {
  const router = useRouter();
  const params = useParams<{ sessionUuid?: string }>();
  const sessionUuid = params.sessionUuid;
  const isDesktop = useIsDesktop();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading client-only auth token after hydration
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);
  const [sidebarPreference, setSidebarPreference] = useState<boolean | null>(null);
  const [titleOverrides, setTitleOverrides] = useState<Record<string, string>>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [optimisticSessionId, setOptimisticSessionId] = useState<string | null>(null);
  const [thinkingDurations, setThinkingDurations] = useState<Record<string, number>>(
    {},
  );
  const thinkingStartRef = useRef<number | null>(null);
  const manualStopRef = useRef(false);
  const [interruptedEntries, setInterruptedEntries] = useState(
    [] as { anchorIndex: number; messages: ChatMessage[] }[],
  );
  const prevSessionUuidRef = useRef<string | undefined>(sessionUuid);
  const { requestDelete, modal: deleteModal } = useDeleteConfirm();

  const { data: sessions = [] } = useChatSessionsQuery();
  const {
    data: sessionData,
    isError: isSessionError,
    isLoading: isSessionLoading,
  } = useChatSessionQuery(sessionUuid ?? "", Boolean(sessionUuid));

  const createSession = useCreateChatSessionMutation();
  const sendMessage = useSendChatMessageMutation();
  const closeSession = useCloseChatSessionMutation();

  const handleStop = useCallback(() => {
    manualStopRef.current = true;
    sendMessage.abort();
  }, [sendMessage]);

  const isLoading =
    optimisticSessionId === sessionUuid &&
    (createSession.isPending || sendMessage.isPending);

  const chatHistory = useMemo<ChatHistoryItem[]>(
    () =>
      sessions.map((session) => ({
        id: session.session_uuid,
        label: titleOverrides[session.session_uuid] ?? session.title,
      })),
    [sessions, titleOverrides],
  );

  const messages = useMemo(() => {
    const apiMessages = sessionData?.messages.map(mapApiMessageToChatMessage) ?? [];
    const activeOptimistic =
      optimisticSessionId === sessionUuid ? optimisticMessages : [];

    const merged: ChatMessage[] = [];
    let entryIdx = 0;
    for (let i = 0; i <= apiMessages.length; i++) {
      while (
        entryIdx < interruptedEntries.length &&
        interruptedEntries[entryIdx].anchorIndex === i
      ) {
        merged.push(...interruptedEntries[entryIdx].messages);
        entryIdx++;
      }
      if (i < apiMessages.length) merged.push(apiMessages[i]);
    }
    merged.push(...activeOptimistic);

    return merged.map((msg) =>
      msg.role === "assistant" && thinkingDurations[msg.id] !== undefined
        ? { ...msg, thinkingDurationSeconds: thinkingDurations[msg.id] }
        : msg,
    );
  }, [
    sessionData?.messages,
    optimisticMessages,
    optimisticSessionId,
    sessionUuid,
    thinkingDurations,
    interruptedEntries,
  ]);

  const conversationTitle = sessionUuid
    ? (titleOverrides[sessionUuid] ?? sessionData?.title)
    : undefined;

  const isConversationMode = Boolean(sessionUuid);

  const sidebarOpen = useMemo(() => {
    if (!isLoggedIn) return false;
    if (sidebarPreference !== null) return sidebarPreference;
    return isDesktop;
  }, [isDesktop, isLoggedIn, sidebarPreference]);

  useEffect(() => {
    if (sessionUuid && isSessionError) {
      router.replace(ROUTES.chat);
    }
  }, [sessionUuid, isSessionError, router]);

  useEffect(() => {
    if (sessionUuid && !getAccessToken()) {
      router.replace(ROUTES.chat);
    }
  }, [sessionUuid, router]);

  useEffect(() => {
    const prevSessionUuid = prevSessionUuidRef.current;
    if (prevSessionUuid && sessionUuid && prevSessionUuid !== sessionUuid) {
      setInterruptedEntries([]);
    }
    prevSessionUuidRef.current = sessionUuid;
  }, [sessionUuid]);

  useEffect(() => {
    if (thinkingStartRef.current === null) return;

    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (
      lastAssistantMessage &&
      thinkingDurations[lastAssistantMessage.id] === undefined
    ) {
      const durationSeconds = Math.round(
        (Date.now() - thinkingStartRef.current) / 1000,
      );

      setThinkingDurations((prev) => ({
        ...prev,
        [lastAssistantMessage.id]: durationSeconds,
      }));
      thinkingStartRef.current = null;
    }
  }, [messages, thinkingDurations]);

  const requireAuth = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (value: string, options?: { force?: boolean }) => {
      const question = value.trim();
      if (!question || (isLoadingRef.current && !options?.force)) return;

      if (!getAccessToken()) {
        setPendingQuestion(question);
        requireAuth();
        return;
      }

      const optimisticUserMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        text: question,
      };

      try {
        if (!sessionUuid) {
          const session = await createSession.mutateAsync();
          setOptimisticSessionId(session.session_uuid);
          setOptimisticMessages([optimisticUserMessage]);
          // Sidebar "Recent" title turant update karo, backend response ka wait kiye baghair.
          setTitleOverrides((prev) => ({ ...prev, [session.session_uuid]: question }));
          thinkingStartRef.current = Date.now();
          router.push(ROUTES.chatSession(session.session_uuid));
          await sendMessage.mutateAsync({
            uuid: session.session_uuid,
            data: { question },
          });
          setOptimisticMessages([]);
          return;
        }

        setOptimisticSessionId(sessionUuid);
        setOptimisticMessages([optimisticUserMessage]);
        // Sidebar "Recent" title turant update karo, backend response ka wait kiye baghair.
        setTitleOverrides((prev) => ({ ...prev, [sessionUuid]: question }));
        thinkingStartRef.current = Date.now();

        await sendMessage.mutateAsync({
          uuid: sessionUuid,
          data: { question },
        });
        setOptimisticMessages([]);
      } catch (error) {
        const isAborted =
          error instanceof Error &&
          (error.name === "AbortError" ||
            error.message.toLowerCase().includes("cancel"));

        if (isAborted) {
          if (manualStopRef.current) {
            manualStopRef.current = false;
            thinkingStartRef.current = null;
            const anchorIndex = sessionData?.messages.length ?? 0;
            setInterruptedEntries((prev) => [
              ...prev,
              {
                anchorIndex,
                messages: [
                  optimisticUserMessage,
                  {
                    id: `interrupted-${Date.now()}`,
                    role: "assistant",
                    content: [
                      { kind: "text", bold: false, text: "Interrupted Response" },
                    ],
                  },
                ],
              },
            ]);
            setOptimisticMessages([]);
            return;
          }
          return;
        }

        setOptimisticMessages([]);
        thinkingStartRef.current = null;
        showToast.error(getApiErrorMessage(error, "Failed to send message"));
      }
    },
    [
      createSession,
      requireAuth,
      router,
      sendMessage,
      sessionUuid,
      sessionData?.messages.length,
    ],
  );

  const handleRetry = useCallback(
    (question: string) => {
      if (isLoadingRef.current) {
        sendMessage.abort();
        showToast.info("Response interrupted", "Retrying your message...");
      }
      void handleSubmit(question, { force: true });
    },
    [sendMessage, handleSubmit],
  );

  // "New Chat" now creates the session immediately (instead of waiting for
  // the first message), so it always lands on /chat/<session_uuid>.
  const handleNewChat = useCallback(async () => {
    if (!getAccessToken()) {
      router.push(ROUTES.chat);
      return;
    }

    try {
      const session = await createSession.mutateAsync();
      router.push(ROUTES.chatSession(session.session_uuid));
    } catch (error) {
      showToast.error(getApiErrorMessage(error, "Failed to create new chat"));
    }
  }, [createSession, router]);

  const handleRenameHistory = useCallback((item: ChatHistoryItem, newLabel: string) => {
    setTitleOverrides((prev) => ({ ...prev, [item.id]: newLabel }));
  }, []);

  const handleDeleteHistory = useCallback(
    (item: ChatHistoryItem) => {
      requestDelete({
        title: "Delete conversation?",
        description: `"${item.label}" will be removed from your chat history.`,
        onConfirm: async () => {
          try {
            await closeSession.mutateAsync(item.id);
            showToast.success("Conversation deleted");
            if (sessionUuid === item.id) {
              router.push(ROUTES.chat);
            }
          } catch (error) {
            showToast.error(getApiErrorMessage(error, "Failed to delete conversation"));
            throw error;
          }
        },
      });
    },
    [closeSession, requestDelete, router, sessionUuid],
  );

  const handleSelectChat = useCallback(
    (id: string) => {
      if (!getAccessToken()) {
        requireAuth();
        return;
      }

      router.push(ROUTES.chatSession(id));
      if (!isDesktop) {
        setSidebarPreference(false);
      }
    },
    [isDesktop, requireAuth, router],
  );

  const toggleSidebar = useCallback(() => {
    if (!getAccessToken()) return;
    setSidebarPreference((open) => {
      const current = open ?? isDesktop;
      return !current;
    });
  }, [isDesktop]);

  const handleAuthSuccess = useCallback(() => {
    const loggedIn = Boolean(getAccessToken());
    setIsLoggedIn(loggedIn);
    setSidebarPreference(loggedIn ? isDesktop : null);

    if (loggedIn && pendingQuestion) {
      const question = pendingQuestion;
      setPendingQuestion(null);
      void handleSubmit(question);
    }
  }, [isDesktop, pendingQuestion, handleSubmit]);

  return {
    sessionUuid,
    isDesktop,
    isLoggedIn,
    sidebarOpen,
    toggleSidebar,
    chatHistory,
    messages,
    conversationTitle,
    isConversationMode,
    isLoading,
    isSessionLoading,
    authModalOpen,
    setAuthModalOpen,
    pendingQuestion,
    deleteModal,
    handleSubmit,
    handleRetry,
    handleNewChat,
    handleRenameHistory,
    handleDeleteHistory,
    handleSelectChat,
    handleAuthSuccess,
    handleStop,
  };
}

export type ChatController = ReturnType<typeof useChatController>;
