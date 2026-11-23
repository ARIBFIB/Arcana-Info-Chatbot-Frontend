"use client";

import { useEffect, useRef, useState } from "react";

import { HintRotator } from "@/components/animations";
import { CHAT_HINTS } from "@/constants";
import { ui } from "@/design-system/components";
import { showToast } from "@/lib/toast";

import { ChatCharCounter } from "./ChatCharCounter";
import { ChatIconCard } from "./ChatIconCard";
import { ChatSendButton } from "./ChatSendButton";

type ChatSearchBarProps = {
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  focusToken?: number;
};

const MAX_CHARS = 500;
const MAX_VISIBLE_HEIGHT = 400;

export function ChatSearchBar({
  onSubmit,
  onStop,
  isLoading = false,
  value: controlledValue,
  onChange,
  focusToken = 0,
}: ChatSearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasWarnedRef = useRef(false);

  const value = controlledValue ?? internalValue;
  const setValue = onChange ?? setInternalValue;

  const [showScroll, setShowScroll] = useState(false);

  const hasContent = value.trim() !== "";
  const isOverLimit = value.length > MAX_CHARS;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newH = el.scrollHeight;
    if (newH > MAX_VISIBLE_HEIGHT) {
      el.style.height = `${MAX_VISIBLE_HEIGHT}px`;
      el.style.overflowY = "auto";
      setShowScroll(true);
    } else {
      el.style.height = `${newH}px`;
      el.style.overflowY = "hidden";
      setShowScroll(false);
    }
  }, [value]);

  useEffect(() => {
    if (!focusToken) return;
    textareaRef.current?.focus();
  }, [focusToken]);

  useEffect(() => {
    if (isOverLimit && !hasWarnedRef.current) {
      hasWarnedRef.current = true;
      showToast.error(
        "Character limit exceeded",
        `Please keep your message under ${MAX_CHARS} characters.`,
      );
    } else if (!isOverLimit) {
      hasWarnedRef.current = false;
    }
  }, [isOverLimit]);

  const handleSubmit = () => {
    if (isLoading) {
      onStop?.();
      return;
    }
    if (!hasContent || isOverLimit) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`${ui.chatSearchBar}${isLoading ? ` ${ui.chatSearchBarLoading}` : ""}`}
      onClick={() => textareaRef.current?.focus()}
    >
      <div
        className={`relative z-[1] flex w-full min-h-full gap-4 px-6 py-5 ${showScroll ? "items-end" : "items-center"}`}
      >
        <div
          className={`flex shrink-0 items-center ${showScroll ? "self-end pb-1" : "self-center"}`}
        >
          <ChatIconCard />
        </div>

        <div className="relative flex min-w-0 flex-1 items-center self-center">
          <HintRotator
            hints={CHAT_HINTS}
            visible={!value}
            leftOffset="8px"
            fontSize={18}
            interval={3500}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask Arca"
            rows={1}
            disabled={isLoading}
            placeholder=""
            className={`font-display text-[18px] leading-normal relative z-[2] min-h-[28px] w-full resize-none border-none bg-transparent p-0 font-normal text-pearl caret-off-white outline-none disabled:cursor-not-allowed disabled:opacity-60 ${showScroll ? `${ui.chatSearchTextareaScroll} overflow-y-auto` : "overflow-y-hidden"}`}
          />
        </div>

        <div
          className={`ml-auto flex h-[60px] shrink-0 items-center ${showScroll ? "self-end pb-1" : "self-center"}`}
        >
          <div className="relative flex h-full items-center justify-center">
            <ChatSendButton
              hasContent={hasContent && !isOverLimit}
              isLoading={isLoading}
              onClick={handleSubmit}
            />
            <div className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2">
              <ChatCharCounter current={value.length} max={MAX_CHARS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
