import type { AssistantMessageContent } from "@/app/chat/_components/ChatAssistantMessage";

export type ChatHistoryItem = {
  id: string;
  label: string;
};

export type ChatMessageContent =
  { kind: "text"; bold: boolean; text: string } | { kind: "holiday_table" };

// NAYA:
export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      content: AssistantMessageContent[];
      thinkingDurationSeconds?: number;
    };
