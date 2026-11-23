"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/api/client";
import { documentKeys } from "@/api/keys";
import { documentsApi } from "@/api/requests";
import type { GetDocumentsParams } from "@/api/types";

export function useDocumentsQuery(params?: GetDocumentsParams) {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () => documentsApi.getAll(params),
    enabled: Boolean(getAccessToken()),
  });
}
