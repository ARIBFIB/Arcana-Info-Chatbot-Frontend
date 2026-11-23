import { privateRequest } from "@/api/client";
import type {
  DeleteDocumentResponse,
  DocumentResponse,
  DocumentUploadResponse,
  GetDocumentsParams,
  UploadDocumentPayload,
} from "@/api/types";

export const documentsApi = {
  getAll: (params?: GetDocumentsParams) =>
    privateRequest
      .get<DocumentResponse[]>("/api/documents/", { params })
      .then((res) => res.data),

  upload: ({ file, category, description }: UploadDocumentPayload) => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    if (description) formData.append("description", description);

    return privateRequest
      .post<DocumentUploadResponse>("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  delete: (documentId: number) =>
    privateRequest
      .delete<DeleteDocumentResponse>(`/api/documents/${documentId}`)
      .then((res) => res.data),
};
