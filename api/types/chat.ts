export type SessionListItem = {
  session_uuid: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type SessionCreateResponse = {
  session_uuid: string;
  title: string | null;
  created_at: string;
};

export type MessageResponse = {
  role: string;
  content: string;
  sources: string[];
  confidence: number;
  source_type: string | null;
  created_at: string;
};

export type SessionHistoryResponse = {
  session_uuid: string;
  title: string;
  messages: MessageResponse[];
};

export type ChatRequest = {
  question: string;
};

export type ChatResponse = {
  answer: string;
  source_type: string;
  sources: string[];
  confidence: number;
};
