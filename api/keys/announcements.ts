import type { GetAnnouncementsParams } from "@/api/types";

export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (params?: GetAnnouncementsParams) =>
    [...announcementKeys.lists(), params ?? {}] as const,
};
