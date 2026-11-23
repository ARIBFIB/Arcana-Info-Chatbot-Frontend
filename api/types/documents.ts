export type DocumentStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export type GetDocumentsParams = {
  category?: string;
  status_filter?: DocumentStatus;
};

export type DocumentResponse = {
  id: number;
  name: string;
  file_path: string | null;
  file_type: string | null;
  category: string | null;
  description: string | null;
  file_hash: string | null;
  file_size: number | null;
  status: string;
  total_chunks: number;
  uploaded_by: number | null;
  created_at: string;
};

export type UploadDocumentPayload = {
  file: File;
  category?: string;
  description?: string;
};

export type DocumentUploadResponse = {
  message: string;
  doc_name: string;
  chunks_created: number;
  total_vectors: number;
  category: string;
  file_hash: string;
};

export type DeleteDocumentResponse = {
  message: string;
  document_id: number;
  document_name: string;
  chunks_deleted: number;
};
