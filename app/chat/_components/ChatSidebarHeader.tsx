"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

type ChatSidebarHeaderProps = {
  onNewChat?: () => void;
};

export function ChatSidebarHeader({ onNewChat }: ChatSidebarHeaderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="px-5 pt-20 sm:px-10 sm:pt-[105px]">
      <button
        type="button"
        onClick={onNewChat}
        className="flex h-[50px] w-full max-w-[244px] cursor-pointer items-center justify-center gap-3 rounded-[180px] border bg-transparent transition-[background,border-color] duration-150 hover:border-white/20 hover:bg-white/[0.04]"
        style={{ borderColor: "var(--color-sidebar-border)" }}
      >
        <div className="h-6 w-6 shrink-0">
          <Image
            src="/start_new_chat_icon.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
            className={isLight ? "invert" : ""}
          />
        </div>
        <span className="text-base leading-none font-medium text-off-white">
          New Chat
        </span>
      </button>
    </div>
  );
}
