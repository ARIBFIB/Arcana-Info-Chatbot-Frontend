"use client";

import { useSyncExternalStore } from "react";

import { SuggestionChip } from "@/components/ui";
import {
  CHAT_SUGGESTIONS,
  CHAT_SUGGESTION_DISPLAY_COUNT,
  type ChatSuggestion,
} from "@/constants";

function pickRandomSuggestions(count: number): ChatSuggestion[] {
  const pool = [...CHAT_SUGGESTIONS];
  const picked: ChatSuggestion[] = [];

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }

  return picked;
}

let clientSuggestions: ChatSuggestion[] | null = null;
let serverSuggestions: ChatSuggestion[] | null = null;

function getServerSuggestions(): ChatSuggestion[] {
  serverSuggestions ??= CHAT_SUGGESTIONS.slice(0, CHAT_SUGGESTION_DISPLAY_COUNT);
  return serverSuggestions;
}

function getClientSuggestions(): ChatSuggestion[] {
  clientSuggestions ??= pickRandomSuggestions(CHAT_SUGGESTION_DISPLAY_COUNT);
  return clientSuggestions;
}

function subscribeToSuggestions() {
  return () => {};
}

type ChatSuggestionChipsProps = {
  onChipClick?: (query: string) => void;
};

export function ChatSuggestionChips({ onChipClick }: ChatSuggestionChipsProps) {
  const suggestions = useSyncExternalStore(
    subscribeToSuggestions,
    getClientSuggestions,
    getServerSuggestions,
  );

  return (
    <div className="flex w-full max-w-[878px] flex-nowrap items-center justify-center gap-[10px] px-4">
      {suggestions.map(({ label, query }) => (
        <SuggestionChip
          key={query}
          label={label}
          onClick={() => onChipClick?.(query)}
        />
      ))}
    </div>
  );
}
