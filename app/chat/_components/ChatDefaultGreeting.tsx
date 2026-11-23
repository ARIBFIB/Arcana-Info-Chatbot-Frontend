"use client";

import { FadeIn, SlideUp } from "@/components/animations";

import { ChatAssistantMessage } from "./ChatAssistantMessage";

const DEFAULT_GREETING = "Hi, I am HR Assistant, How can I help you?";

export function ChatDefaultGreeting() {
  return (
    <FadeIn duration={0.5} delay={0.1}>
      <SlideUp duration={0.6} delay={0.15} distance={24}>
        <div id="chat-msg-default-greeting" className="w-full">
          <ChatAssistantMessage content={[{ kind: "text", text: DEFAULT_GREETING }]} />
        </div>
      </SlideUp>
    </FadeIn>
  );
}
