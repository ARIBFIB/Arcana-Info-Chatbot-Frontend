export { API_BASE_URL } from "./api";
export { ROUTES, type AppRoute } from "./routes";

export const APP_NAME = "AI chatbot" as const;
export { CHAT_HINTS } from "./chatHints";
export {
  CHAT_SUGGESTIONS,
  CHAT_SUGGESTION_DISPLAY_COUNT,
  type ChatSuggestion,
} from "./chatSuggestions";
export {
  CHAT_THINKING_MESSAGES,
  type ChatThinkingMessage,
} from "./chatThinkingMessages";
