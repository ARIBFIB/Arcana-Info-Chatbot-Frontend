import { privateRequest } from "@/api/client";
import type {
  ChatRequest,
  ChatResponse,
  SessionCreateResponse,
  SessionHistoryResponse,
  SessionListItem,
} from "@/api/types";

export const chatApi = {
  listSessions: () =>
    privateRequest.get<SessionListItem[]>("/api/chat/sessions").then((res) => res.data),

  createSession: () =>
    privateRequest
      .post<SessionCreateResponse>("/api/chat/sessions")
      .then((res) => res.data),

  getSession: (uuid: string) =>
    privateRequest
      .get<SessionHistoryResponse>(`/api/chat/sessions/${uuid}`)
      .then((res) => res.data),

  sendMessage: (uuid: string, data: ChatRequest, signal?: AbortSignal) =>
    privateRequest
      .post<ChatResponse>(`/api/chat/sessions/${uuid}`, data, { signal })
      .then((res) => res.data),

  closeSession: (uuid: string) =>
    privateRequest.delete(`/api/chat/sessions/${uuid}`).then((res) => res.data),
};
