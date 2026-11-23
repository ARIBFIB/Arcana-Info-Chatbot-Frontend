export type GetAnnouncementsParams = {
  audience?: string;
};

export type AnnouncementCreate = {
  title: string;
  description?: string | null;
  audience?: string;
};

export type AnnouncementResponse = {
  id: number;
  title: string;
  description: string | null;
  audience: string;
  created_by: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
