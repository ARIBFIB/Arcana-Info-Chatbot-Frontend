"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/api/client";
import { chatKeys } from "@/api/keys";
import { chatApi } from "@/api/requests";

export function useChatSessionsQuery() {
  return useQuery({
    queryKey: chatKeys.sessions(),
    queryFn: () => chatApi.listSessions(),
    enabled: Boolean(getAccessToken()),
  });
}

export function useChatSessionQuery(uuid: string, enabled = true) {
  return useQuery({
    queryKey: chatKeys.session(uuid),
    queryFn: () => chatApi.getSession(uuid),
    enabled: enabled && Boolean(uuid) && Boolean(getAccessToken()),
  });
}
