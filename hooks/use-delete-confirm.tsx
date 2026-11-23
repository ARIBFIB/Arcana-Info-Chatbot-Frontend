"use client";

import { useCallback, useState } from "react";

import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

export type DeleteConfirmRequest = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function useDeleteConfirm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<DeleteConfirmRequest | null>(null);

  const close = useCallback(() => {
    if (isLoading) return;
    setOpen(false);
    setRequest(null);
  }, [isLoading]);

  const requestDelete = useCallback((options: DeleteConfirmRequest) => {
    setRequest(options);
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      await request.onConfirm();
      setOpen(false);
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  const modal = (
    <DeleteConfirmModal
      open={open}
      title={request?.title ?? "Delete?"}
      description={request?.description ?? "This action cannot be undone."}
      confirmLabel={request?.confirmLabel}
      isLoading={isLoading}
      onCancel={close}
      onConfirm={() => {
        void handleConfirm();
      }}
    />
  );

  return { requestDelete, close, modal };
}
