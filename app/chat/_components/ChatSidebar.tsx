"use client";

import { SlideIn } from "@/components/animations/SlideIn";
import { tokens } from "@/design-system";
import type { ChatHistoryItem } from "@/types/chat";

import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatSidebarItem } from "./ChatSidebarItem";
import { ChatSidebarSection } from "./ChatSidebarSection";

type ChatSidebarProps = {
  isOpen?: boolean;
  activeId?: string;
  history?: ChatHistoryItem[];
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  onSlideUpdate?: (x: number) => void;
  onRenameChat?: (item: ChatHistoryItem, newLabel: string) => void;
  onDeleteChat?: (item: ChatHistoryItem) => void;
};

export const SIDEBAR_WIDTH = tokens.layout.chatSidebarWidth;

export function ChatSidebar({
  isOpen = true,
  activeId,
  history = [],
  onNewChat,
  onSelectChat,
  onSlideUpdate,
  onRenameChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <SlideIn
      isOpen={isOpen}
      width={SIDEBAR_WIDTH}
      enterDuration={0.48}
      enterEase="power4.out"
      exitDuration={0.3}
      exitEase="power3.in"
      onUpdate={onSlideUpdate}
    >
      <aside
        className="flex h-screen w-[min(296px,88vw)] min-h-0 flex-col overflow-x-hidden border-r backdrop-blur-[16px] sm:w-[296px]"
        style={{
          background: "var(--color-chat-sidebar-bg)",
          borderRightColor: "var(--color-sidebar-border)",
        }}
      >
        {/*
          Sirf history list scroll hoti hai - logo, New Chat button aur
          "Recent" label hamesha fixed/visible rehte hain. Isliye <aside>
          par overflow-y-auto nahi hai; scroll ChatSidebarSection ke
          andar wale list wrapper par hai (min-h-0 + flex-1 trick).
        */}
        <div className="shrink-0">
          <ChatSidebarHeader onNewChat={onNewChat} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 sm:px-10">
          <ChatSidebarSection title="Recent">
            {history.length === 0 ? (
              <p className="py-2 text-sm text-white/35">No recent chats</p>
            ) : (
              history.map((chat) => (
                <ChatSidebarItem
                  key={chat.id}
                  label={chat.label}
                  isActive={activeId === chat.id}
                  onClick={() => onSelectChat?.(chat.id)}
                  onRename={
                    onRenameChat
                      ? (newLabel: string) => onRenameChat(chat, newLabel)
                      : undefined
                  }
                  onDelete={onDeleteChat ? () => onDeleteChat(chat) : undefined}
                />
              ))
            )}
          </ChatSidebarSection>
        </div>
      </aside>
    </SlideIn>
  );
}
