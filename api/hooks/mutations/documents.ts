"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { documentKeys } from "@/api/keys";
import { documentsApi } from "@/api/requests";
import type { UploadDocumentPayload } from "@/api/types";

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...documentKeys.all, "upload"] as const,
    mutationFn: (payload: UploadDocumentPayload) => documentsApi.upload(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...documentKeys.all, "delete"] as const,
    mutationFn: (documentId: number) => documentsApi.delete(documentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
