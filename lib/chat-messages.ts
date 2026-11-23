import type { MessageResponse } from "@/api/types";
import type { ChatMessage } from "@/types/chat";

export function mapApiMessageToChatMessage(
  message: MessageResponse,
  index: number,
): ChatMessage {
  const id = `${message.created_at}-${message.role}-${index}`;

  if (message.role === "user") {
    return { id, role: "user", text: message.content };
  }

  return {
    id,
    role: "assistant",
    content: [{ kind: "text", bold: false, text: message.content }],
  };
}
