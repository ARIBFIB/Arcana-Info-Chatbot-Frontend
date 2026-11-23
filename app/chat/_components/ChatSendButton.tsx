"use client";

import { ArrowUp, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ChatSendButtonProps = {
  hasContent: boolean;
  isLoading: boolean;
  onClick: (e: React.MouseEvent) => void;
};

export function ChatSendButton({
  hasContent,
  isLoading,
  onClick,
}: ChatSendButtonProps) {
  const title = isLoading ? "Stop generation" : "Send message";

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);
  const isLight = mounted && resolvedTheme === "light";
  const iconColorClass = isLight ? "text-black" : "text-violet";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hasContent && !isLoading}
      title={title}
      aria-label={title}
      className="flex h-[48px] w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[image:var(--gradient-send-button)] shadow-[-2px_0px_10px_0px_#00000040] transition-[opacity,transform] duration-150 hover:scale-[1.04] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isLoading ? (
        <Square size={18} className={iconColorClass} />
      ) : (
        <ArrowUp
          size={24}
          strokeWidth={2.5}
          className={`size-[18px] rounded-full ${iconColorClass}`}
        />
      )}
    </button>
  );
}
