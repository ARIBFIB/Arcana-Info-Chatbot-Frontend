"use client";

import type { ReactNode } from "react";

import { useChat } from "../_context/chat-context";
import { ChatBackground } from "./ChatBackground";
import { ChatHeader } from "./ChatHeader";
import { ChatMainArea } from "./ChatMainArea";
import { ChatSidebar } from "./ChatSidebar";

type ChatLayoutProps = {
  children: ReactNode;
};

export function ChatLayout({ children }: ChatLayoutProps) {
  const {
    deleteModal,
    sidebarOpen,
    toggleSidebar,
    isDesktop,
    isLoggedIn,
    sessionUuid,
    chatHistory,
    conversationTitle,
    authModalOpen,
    setAuthModalOpen,
    handleNewChat,
    handleSelectChat,
    handleSlideUpdate,
    handleRenameHistory,
    handleDeleteHistory,
    mainRef,
    handleAuthSuccess,
  } = useChat();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {deleteModal}

      {isLoggedIn && !isDesktop && sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-850 bg-black/45 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {isLoggedIn && (
        <ChatSidebar
          isOpen={sidebarOpen}
          activeId={sessionUuid}
          history={chatHistory}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onSlideUpdate={handleSlideUpdate}
          onRenameChat={handleRenameHistory}
          onDeleteChat={handleDeleteHistory}
        />
      )}

      <div ref={mainRef} className="h-full min-h-0 flex-1 min-w-0">
        <ChatBackground>
          {/*
            IMPORTANT: ChatHeader ko kabhi bhi transform-based animation
            wrapper (FadeIn/SlideIn/ScaleIn) ke andar mat rakhein. Header
            "position: fixed" hai, aur agar koi ancestor "transform" ya
            "filter"/"backdrop-filter" apply karta hai (jaisa animation
            libraries aksar karti hain), to fixed positioning viewport ke
            bajaye us ancestor ke relative ho jati hai -- isi se header
            "detach"/ghost/overlap wale glitches aate the.
          */}
          <ChatHeader
            onToggleSidebar={toggleSidebar}
            showSidebarToggle={isLoggedIn}
            conversationTitle={conversationTitle}
            activeChatId={sessionUuid}
            authModalOpen={authModalOpen}
            onAuthModalOpenChange={setAuthModalOpen}
            onAuthSuccess={handleAuthSuccess}
          />

          <ChatMainArea>{children}</ChatMainArea>
        </ChatBackground>
      </div>
    </div>
  );
}
