"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { useChat } from "../_context/chat-context";
import { ChatMessageList } from "./ChatMessageList";
import { ChatSearchBar } from "./ChatSearchBar";

export function ChatConversationView() {
  const {
    messages,
    handleSubmit,
    isLoading,
    isDesktop,
    sidebarOpen,
    searchBarRef,
    handleStop,
  } = useChat();

  const maxWidth = sidebarOpen && isDesktop ? 900 : 1100;

  // FIX: chat ko hamesha bottom par rakhein â€” instant scrollTop, "smooth"
  // scrollIntoView unreliable hai jab render/streaming chal raha ho.
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // Turant, bina flash ke, har render ke baad bottom par rakhein.
  useLayoutEffect(() => {
    scrollToBottom();
  });

  // Content ki height badhne par bhi (streaming text, images load hona)
  // bottom pakde rahein.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => scrollToBottom());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="relative min-h-0 flex-1 overflow-y-auto"
      style={{
        paddingTop: "var(--chat-content-offset, 96px)",
        scrollPaddingTop: "var(--chat-content-offset, 96px)",
      }}
    >
      <ChatMessageList messages={messages} isLoading={isLoading} />

      <div
        ref={searchBarRef}
        style={{
          left: sidebarOpen && isDesktop ? "280px" : "120px",
          right: "0px",
          transition: "left 0.3s ease",
          transform: "translateZ(0)",
        }}
        className="fixed bottom-4 z-[500] flex justify-center will-change-transform sm:bottom-6 md:bottom-8"
      >
        <div
          style={{
            maxWidth: `${maxWidth}px`,
            transition: "max-width 0.3s ease",
          }}
          className="w-[94%] px-2 sm:w-[90%] sm:px-4"
        >
          <ChatSearchBar
            onSubmit={handleSubmit}
            onStop={handleStop}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
