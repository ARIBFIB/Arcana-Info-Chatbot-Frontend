"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import type { ChatThinkingMessage } from "@/constants";

import { ThinkingSkeletonBars } from "./ThinkingSkeletonBars";

type ThinkingDetailAccordionProps = {
  message: ChatThinkingMessage;
  className?: string;
};

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function ThinkingDetailAccordion({
  message,
  className,
}: ThinkingDetailAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordCountRef = useRef(0);

  const words = message.detail.split(" ");

  // ── Chunked reveal: small chunk → pause (skeleton) → repeat ──
  useEffect(() => {
    wordCountRef.current = 0;

    const scheduleNextChunk = () => {
      const chunkSize = randomBetween(2, 5);
      wordCountRef.current = Math.min(wordCountRef.current + chunkSize, words.length);
      setVisibleWordCount(wordCountRef.current);
      setIsPaused(false);

      if (wordCountRef.current >= words.length) {
        setIsPaused(true);
        return;
      }

      const pauseDuration = randomBetween(1800, 3800);
      timeoutRef.current = setTimeout(() => {
        setIsPaused(true);
        timeoutRef.current = setTimeout(scheduleNextChunk, pauseDuration);
      }, 50);
    };

    timeoutRef.current = setTimeout(scheduleNextChunk, randomBetween(600, 1200));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.detail]);

  // ── Expand / collapse animation ─────────────────────────────
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
          duration: 0.6,
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
        duration: 0.45,
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
      duration: 0.35,
      ease: "power2.out",
    });
  }, [isOpen]);

  const visibleText = words.slice(0, visibleWordCount).join(" ");
  const isRevealing = visibleWordCount < words.length;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start gap-2 text-left"
      >
        <svg
          ref={chevronRef}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="mt-1 shrink-0 text-white/50"
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
        <span className="font-body text-sm leading-relaxed text-white/70">
          {message.title}
        </span>
      </button>

      <div ref={bodyRef} style={{ display: "none", height: 0, overflow: "hidden" }}>
        <div className="pt-2 pl-6">
          <p className="font-body text-sm leading-relaxed text-white/55">
            {visibleText}
            {isPaused && isRevealing && (
              <>
                {visibleWordCount > 0 && " "}
                <ThinkingSkeletonBars />
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
