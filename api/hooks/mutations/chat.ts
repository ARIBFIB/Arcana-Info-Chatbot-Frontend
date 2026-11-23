"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { chatKeys } from "@/api/keys";
import { chatApi } from "@/api/requests";
import type { ChatRequest } from "@/api/types";

export function useCreateChatSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...chatKeys.all, "create-session"] as const,
    mutationFn: () => chatApi.createSession(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
}

type SendMessageVariables = {
  uuid: string;
  data: ChatRequest;
};

export function useSendChatMessageMutation() {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationKey: [...chatKeys.all, "send-message"] as const,
    mutationFn: ({ uuid, data }: SendMessageVariables) => {
      abortControllerRef.current = new AbortController();
      return chatApi.sendMessage(uuid, data, abortControllerRef.current.signal);
    },
    // IMPORTANT: onSuccess ab async hai aur invalidateQueries ko await karta hai.
    // Pehle "void" ke sath fire-and-forget tha, jis se mutateAsync() turant resolve
    // ho jata tha (backend se fresh session data aane se pehle hi) aur us ke foran
    // baad use-chat-controller.ts optimistic user message clear kar deta tha -
    // isi wajah se user ka apna bheja hua message chat mein gayab ho jata tha.
    onSuccess: async (_data, { uuid }) => {
      await queryClient.invalidateQueries({ queryKey: chatKeys.session(uuid) });
      await queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });

  const abort = () => {
    abortControllerRef.current?.abort();
    mutation.reset();
  };

  return { ...mutation, abort };
}

export function useCloseChatSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...chatKeys.all, "close-session"] as const,
    mutationFn: (uuid: string) => chatApi.closeSession(uuid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.sessions() });
    },
  });
}
