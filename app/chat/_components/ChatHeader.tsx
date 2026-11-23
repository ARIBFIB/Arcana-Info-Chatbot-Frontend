"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/constants/routes";

import { useChat } from "../_context/chat-context";
import { AuthModal } from "./AuthModal";
import { ChatConversationTitle } from "./ChatConversationTitle";
import { ChatUserMenu } from "./ChatUserMenu";

type ChatHeaderProps = {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  conversationTitle?: string;
  activeChatId?: string;
  authModalOpen?: boolean;
  onAuthModalOpenChange?: (open: boolean) => void;
  onAuthSuccess?: () => void;
};

export function ChatHeader({
  onToggleSidebar,
  showSidebarToggle = true,
  conversationTitle,
  activeChatId,
  authModalOpen,
  onAuthModalOpenChange,
  onAuthSuccess,
}: ChatHeaderProps) {
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [userMenuKey, setUserMenuKey] = useState(0);
  const { messages } = useChat();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  const logoSrc = isLight ? "/arcaAI_light_theme.svg" : "/arca_ai_logo.svg";

  const isAuthModalOpen = authModalOpen ?? internalAuthOpen;
  const setAuthModalOpen = onAuthModalOpenChange ?? setInternalAuthOpen;

  const handleAuthSuccess = () => {
    setUserMenuKey((value) => value + 1);
    onAuthSuccess?.();
  };

  return (
    <>
      <header
        className="pointer-events-none fixed top-0 right-0 left-0 z-1000 flex h-16 items-center gap-2 bg-transparent px-8 will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="pointer-events-auto flex shrink-0 items-center gap-8">
          <Link href={ROUTES.chat}>
            <Image src={logoSrc} alt="Arcana AI" width={110} height={32} priority />
          </Link>

          {showSidebarToggle && (
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className=" size-8 cursor-pointer  transition-all opacity-85 duration-300 hover:scale-105 hover:opacity-100"
            >
              <Image
                src="/side_bar_drawer_icon.svg"
                alt=""
                width={16}
                height={16}
                className={`opacity-85 ${isLight ? "invert" : ""}`}
                aria-hidden
              />
            </button>
          )}
        </div>

        <div
          className={`hidden min-w-0 flex-1 justify-center px-4 md:flex md:items-center ${
            conversationTitle && activeChatId
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          {conversationTitle && activeChatId && (
            <div className="min-w-0 max-w-[min(280px,40vw)] will-change-transform [transform:translateZ(0)]">
              <ChatConversationTitle
                title={conversationTitle}
                chatId={activeChatId}
                messages={messages}
              />
            </div>
          )}
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <ChatUserMenu
            refreshKey={userMenuKey}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
