"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import { ThinkingDetailAccordion } from "@/components/animations";
import { Loader } from "@/components/ui";
import { CHAT_THINKING_MESSAGES, type ChatThinkingMessage } from "@/constants";

function formatThinkingTime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const LONGER_NOTICE = "This is taking longer than usual, still working on it.";
const NOTICE_TRIGGER_MS = 60000; // show notice after 60s of no progress
const NOTICE_VISIBLE_MS = 8000; // notice stays visible this long, then swaps for a new step

function pickRandomMessage(exclude: ChatThinkingMessage[]): ChatThinkingMessage {
  const excludeTitles = new Set(exclude.map((m) => m.title));
  const pool = CHAT_THINKING_MESSAGES.filter((m) => !excludeTitles.has(m.title));
  const source = pool.length > 0 ? pool : CHAT_THINKING_MESSAGES;
  return source[Math.floor(Math.random() * source.length)];
}

type ChatThinkingBlockProps = {
  isLive?: boolean;
  finalDuration?: number;
};

export function ChatThinkingBlock({
  isLive = true,
  finalDuration,
}: ChatThinkingBlockProps) {
  const [timer, setTimer] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChatThinkingMessage[]>(() => [
    pickRandomMessage([]),
  ]);
  const [showNotice, setShowNotice] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Elapsed timer - only runs while live
  useEffect(() => {
    if (!isLive) return;
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [isLive]);

  // "Taking longer than usual" cycle - repeats while live
  useEffect(() => {
    if (!isLive) return;

    const runCycle = () => {
      cycleTimeoutRef.current = setTimeout(() => {
        setShowNotice(true);

        cycleTimeoutRef.current = setTimeout(() => {
          setShowNotice(false);
          setItems((prev) => [...prev, pickRandomMessage(prev)]);
          runCycle(); // schedule next cycle
        }, NOTICE_VISIBLE_MS);
      }, NOTICE_TRIGGER_MS);
    };

    runCycle();

    return () => {
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    };
  }, [isLive]);

  // Expand / collapse the whole "Arca thinking" block
  useEffect(() => {
    if (!bodyRef.current) return;
    gsap.killTweensOf(bodyRef.current);

    if (isOpen) {
      gsap.set(bodyRef.current, { display: "block", height: "auto" });
      const fullHeight = bodyRef.current.offsetHeight;
      gsap.fromTo(
        bodyRef.current,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            if (bodyRef.current) bodyRef.current.style.height = "auto";
          },
        },
      );
    } else {
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          if (bodyRef.current) bodyRef.current.style.display = "none";
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!chevronRef.current) return;
    gsap.to(chevronRef.current, {
      rotate: isOpen ? 90 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isOpen]);

  const displayTime = isLive ? timer : (finalDuration ?? timer);

  return (
    <div className="box-border flex w-full flex-col gap-3 px-10">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        {isLive && <Loader size="sm" className="text-white/60" />}
        <p
          className="font-body bg-[length:200%_100%] bg-clip-text text-sm text-transparent"
          style={{
            backgroundImage: isLive
              ? "linear-gradient(110deg, #6b6b6b 35%, var(--color-white) 50%, #6b6b6b 65%)"
              : "none",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: isLive ? "transparent" : "var(--text-secondary)",
            animation: isLive ? "hr-thinking-shimmer 2.5s linear infinite" : "none",
          }}
        >
          {isLive ? "Arca✦ai Thinking" : "Arca✦ai Thought"}
        </p>
        <span className="font-body text-xs text-ash">
          {isLive
            ? formatThinkingTime(displayTime)
            : `for ${formatThinkingTime(displayTime)}`}
        </span>
        <svg
          ref={chevronRef}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white/50"
          style={{ transformOrigin: "50% 50%" }}
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div ref={bodyRef} style={{ display: "none", height: 0, overflow: "hidden" }}>
        <div className="flex flex-col gap-2 rounded-md bg-charcoal px-4 py-3">
          {items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="border-b border-white/5 py-2 last:border-none"
            >
              <ThinkingDetailAccordion message={item} />
            </div>
          ))}

          {showNotice && (
            <p className="font-body px-1 pb-1 text-xs text-white/35 italic">
              {LONGER_NOTICE}
            </p>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes hr-thinking-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
