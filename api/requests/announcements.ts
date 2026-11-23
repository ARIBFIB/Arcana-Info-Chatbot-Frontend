import { privateRequest } from "@/api/client";
import type {
  AnnouncementCreate,
  AnnouncementResponse,
  GetAnnouncementsParams,
} from "@/api/types";

export const announcementsApi = {
  getAll: (params?: GetAnnouncementsParams) =>
    privateRequest
      .get<AnnouncementResponse[]>("/api/announcements/", { params })
      .then((res) => res.data),

  create: (data: AnnouncementCreate) =>
    privateRequest
      .post<AnnouncementResponse>("/api/announcements/", data)
      .then((res) => res.data),
};
