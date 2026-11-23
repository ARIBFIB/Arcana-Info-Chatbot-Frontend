"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { SIDEBAR_WIDTH } from "../_components/ChatSidebar";
import { useChatController, type ChatController } from "../_hooks/use-chat-controller";

type ChatContextValue = ChatController & {
  mainRef: RefObject<HTMLDivElement | null>;
  searchBarRef: RefObject<HTMLDivElement | null>;
  handleSlideUpdate: (x: number) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const controller = useChatController();
  const mainRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSlideUpdate = useCallback(
    (x: number) => {
      if (!controller.isDesktop) {
        if (mainRef.current) {
          mainRef.current.style.marginLeft = "";
          mainRef.current.style.width = "";
        }
        return;
      }

      const margin = Math.max(0, SIDEBAR_WIDTH + x);

      if (mainRef.current) {
        mainRef.current.style.marginLeft = `${margin}px`;
      }
    },
    [controller.isDesktop],
  );

  return (
    <ChatContext.Provider
      value={{
        ...controller,
        mainRef,
        searchBarRef,
        handleSlideUpdate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
}
