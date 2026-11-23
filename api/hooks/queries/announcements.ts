"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/api/client";
import { announcementKeys } from "@/api/keys";
import { announcementsApi } from "@/api/requests";
import type { GetAnnouncementsParams } from "@/api/types";

export function useAnnouncementsQuery(params?: GetAnnouncementsParams) {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () => announcementsApi.getAll(params),
    enabled: Boolean(getAccessToken()),
  });
}
