"use client";

import { useCallback, useState } from "react";

import { ScaleIn, SlideUp, StaggerChildren } from "@/components/animations";

import { useChat } from "../_context/chat-context";
import { ChatHero } from "./ChatHero";
import { ChatSearchBar } from "./ChatSearchBar";
import { ChatSuggestionChips } from "./ChatSuggestionChips";

export function ChatHomeView() {
  const { handleSubmit, isLoading } = useChat();
  const [draft, setDraft] = useState("");
  const [focusToken, setFocusToken] = useState(0);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      handleSubmit(value);
      setDraft("");
    },
    [handleSubmit],
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setDraft(suggestion);
    setFocusToken((token) => token + 1);
  }, []);

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-y-auto"
      style={{ paddingTop: "var(--chat-content-offset, 96px)" }}
    >
      <SlideUp duration={0.8} delay={0.1} distance={50}>
        <ChatHero />
      </SlideUp>

      <div className="mt-6 flex w-full justify-center px-4">
        <ScaleIn duration={0.6} delay={0.35} from={0.9}>
          <ChatSearchBar
            value={draft}
            onChange={setDraft}
            focusToken={focusToken}
            onSubmit={handleSearchSubmit}
            isLoading={isLoading}
          />
        </ScaleIn>
      </div>

      <div className="mt-3 mb-6 w-full flex justify-center">
        <StaggerChildren duration={0.5} delay={0.55} stagger={0.1} distance={20}>
          <ChatSuggestionChips onChipClick={handleSuggestionClick} />
        </StaggerChildren>
      </div>
    </div>
  );
}
