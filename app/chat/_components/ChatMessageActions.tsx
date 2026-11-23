"use client";

import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { showToast } from "@/lib/toast";

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
};

function ActionButton({ label, onClick, active, children }: ActionButtonProps) {
  return (
    <div className="group/tooltip relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent transition-colors duration-150 hover:bg-white/[0.08] ${
          active ? "text-violet" : "text-white/50 hover:text-white/85"
        }`}
      >
        {children}
      </button>
      {/*
        NOTE: tooltip ka background hardcoded dark hai (dono themes mein
        waisa hi rehna chahiye), lekin text color pehle Tailwind class
        (text-white/80) se aa raha tha jo light-theme ke kisi global CSS
        rule se override ho raha tha - dark text dark bg par invisible
        ho jata tha. Ab color inline style se force kiya hai taake ye
        hamesha theme se independent, fixed white hi rahe.
      */}
      <span
        className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#1c1c1e] px-2 py-1 text-[11px] whitespace-nowrap opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-opacity duration-150 group-hover/tooltip:opacity-100"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        {label}
      </span>
    </div>
  );
}

type ChatMessageActionsProps = {
  copyText: string;
  onRetry?: () => void;
  showFeedback?: boolean;
  align?: "left" | "right";
};

export function ChatMessageActions({
  copyText,
  onRetry,
  showFeedback = false,
  align = "left",
}: ChatMessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      showToast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast.error("Failed to copy");
    }
  };

  const handleFeedback = (value: "up" | "down") => {
    setFeedback((prev) => (prev === value ? null : value));
    showToast.info(
      value === "up" ? "Thanks for the feedback!" : "Thanks, we'll work on this.",
    );
  };

  return (
    <div
      className={`mt-1 flex items-center gap-1 px-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <ActionButton label={copied ? "Copied!" : "Copy"} onClick={handleCopy}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </ActionButton>

      {onRetry && (
        <ActionButton label="Retry" onClick={onRetry}>
          <RotateCcw size={15} />
        </ActionButton>
      )}

      {showFeedback && (
        <>
          <ActionButton
            label="Good response"
            onClick={() => handleFeedback("up")}
            active={feedback === "up"}
          >
            <ThumbsUp size={15} />
          </ActionButton>
          <ActionButton
            label="Bad response"
            onClick={() => handleFeedback("down")}
            active={feedback === "down"}
          >
            <ThumbsDown size={15} />
          </ActionButton>
        </>
      )}
    </div>
  );
}
