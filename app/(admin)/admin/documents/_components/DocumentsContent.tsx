"use client";

import { MoreVertical, Plus } from "lucide-react";
import { useMemo } from "react";

import { useDeleteDocumentMutation, useDocumentsQuery } from "@/api";
import type { DocumentResponse } from "@/api/types";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatShortDate } from "@/lib/format-date";
import { showToast } from "@/lib/toast";

type DocCardItemProps = {
  document: DocumentResponse;
  onDelete: (document: DocumentResponse) => void;
};

function DocCardItem({ document, onDelete }: DocCardItemProps) {
  return (
    <div className="flex w-[436px] max-w-full min-h-[201px] flex-col rounded-[10px] border border-transparent bg-charcoal px-5 pt-3.5 pb-5 transition-[border-color] hover:border-white/[0.08]">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/[0.06]">
          <Plus size={14} className="text-white" />
        </div>
        <button
          type="button"
          aria-label={`Delete ${document.name}`}
          onClick={() => onDelete(document)}
          className="flex cursor-pointer items-center border-none bg-transparent p-0 text-white/50 hover:text-error"
        >
          <MoreVertical size={18} />
        </button>
      </div>
      <h4 className="font-body m-0 mb-2 text-[15px] font-semibold leading-snug text-off-white">
        {document.name}
      </h4>
      <p className="font-body flex-1 text-[13px] font-normal leading-[1.5] text-white/40">
        {document.description ?? "No description provided."}
      </p>
      <p className="font-body mt-3 block text-right text-[13px] font-normal leading-none text-off-white/45">
        {formatShortDate(document.created_at)}
      </p>
    </div>
  );
}

type DocumentsContentProps = {
  onAddClick: () => void;
};

export function DocumentsContent({ onAddClick }: DocumentsContentProps) {
  const { data: documents = [], isLoading, isError } = useDocumentsQuery();
  const deleteDocument = useDeleteDocumentMutation();
  const { requestDelete, modal } = useDeleteConfirm();

  const groupedDocuments = useMemo(() => {
    return documents.reduce<Record<string, DocumentResponse[]>>((groups, document) => {
      const category = document.category?.trim() || "Uncategorized";
      groups[category] ??= [];
      groups[category].push(document);
      return groups;
    }, {});
  }, [documents]);

  const handleDelete = (document: DocumentResponse) => {
    requestDelete({
      title: "Delete document?",
      description: `"${document.name}" and its embeddings will be permanently removed.`,
      onConfirm: async () => {
        try {
          await deleteDocument.mutateAsync(document.id);
          showToast.success("Document deleted");
        } catch (error) {
          showToast.error(getApiErrorMessage(error, "Failed to delete document"));
          throw error;
        }
      },
    });
  };

  return (
    <div className="pt-1">
      {modal}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[28px] font-bold leading-tight text-white">
          Documents
        </h1>
        <button
          type="button"
          onClick={onAddClick}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
        >
          <Plus size={16} className="text-white" />
          Add Document
        </button>
      </div>

      {isLoading && (
        <p className="font-body mb-8 block text-base font-normal leading-[1.4] text-ash">
          Loading documents…
        </p>
      )}

      {isError && (
        <p className="font-body mb-8 block text-base font-normal leading-[1.4] text-error">
          Failed to load documents. Please sign in and try again.
        </p>
      )}

      {!isLoading && !isError && documents.length === 0 && (
        <p className="font-body mb-8 block text-base font-normal leading-[1.4] text-ash">
          No documents yet. Upload your first document to get started.
        </p>
      )}

      {Object.entries(groupedDocuments).map(([category, items]) => (
        <section key={category} className="mb-6">
          <h2 className="font-display m-0 mb-3 text-[13px] font-semibold uppercase tracking-wider text-white/40">
            {category}
          </h2>
          <div className="flex flex-wrap gap-3">
            {items.map((document) => (
              <DocCardItem
                key={document.id}
                document={document}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
