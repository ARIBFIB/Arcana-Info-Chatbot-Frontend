"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { announcementKeys } from "@/api/keys";
import { announcementsApi } from "@/api/requests";
import type { AnnouncementCreate } from "@/api/types";

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...announcementKeys.all, "create"] as const,
    mutationFn: (data: AnnouncementCreate) => announcementsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
}
