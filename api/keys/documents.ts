import type { GetDocumentsParams } from "@/api/types";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (params?: GetDocumentsParams) =>
    [...documentKeys.lists(), params ?? {}] as const,
};
