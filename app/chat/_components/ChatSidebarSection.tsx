"use client";

import { useState, type ReactNode } from "react";

type ChatSidebarSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function ChatSidebarSection({
  title,
  children,
  defaultOpen = true,
}: ChatSidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="mb-1 flex w-full shrink-0 cursor-pointer items-center justify-between rounded-md border-none bg-transparent px-1 py-0.5 pl-2 transition-colors hover:bg-white/[0.04]"
      >
        <span className="font-display text-base leading-normal font-medium text-fog select-none">
          {title}
        </span>
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-[250ms]${!isOpen ? " -rotate-90" : ""}`}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="rgba(170,170,170,0.8)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/*
        Yahi wo hissa hai jo independently scroll karta hai. Parent
        (mt-6 flex min-h-0 flex-1 flex-col) apni height "Recent" title
        ke neeche jitni space bachi hai utni le leta hai, aur ye div
        us fixed space ke andar hi scroll karta hai - baaki sab (logo,
        New Chat, "Recent" label) apni jagah fixed rehta hai.
      */}
      {isOpen && (
        <div className="flex min-h-0 w-[217px] flex-1 flex-col overflow-y-auto pr-1 pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
          {children}
        </div>
      )}
    </div>
  );
}
