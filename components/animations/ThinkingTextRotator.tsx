"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

type ThinkingTextRotatorProps = {
  messages: string[];
  interval?: number;
  stopAtLast?: boolean;
  className?: string;
};

const DOTS = ["", ".", "..", "..."];
const DOTS_INTERVAL = 600;

export function ThinkingTextRotator({
  messages,
  interval = 20000,
  stopAtLast = true,
  className,
}: ThinkingTextRotatorProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dotIndex, setDotIndex] = useState(0);

  const textRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Dots pulse (independent, subtle) ─────────────────────
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % DOTS.length);
    }, DOTS_INTERVAL);
    return () => clearInterval(dotsInterval);
  }, []);

  // ── Fade + slide transition helpers (slow, gentle) ───────
  const animateOut = (onComplete?: () => void) => {
    if (!textRef.current) return;
    gsap.killTweensOf(textRef.current);
    gsap.to(textRef.current, {
      opacity: 0,
      y: -14,
      filter: "blur(4px)",
      duration: 0.9,
      ease: "power2.inOut",
      onComplete,
    });
  };

  const animateIn = () => {
    if (!textRef.current) return;
    gsap.killTweensOf(textRef.current);
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 14, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power2.out",
      },
    );
  };

  // ── Initial entrance ──────────────────────────────────────
  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 14, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        delay: 0.15,
        ease: "power2.out",
      },
    );
  }, []);

  // ── Rotate message on interval ─────────────────────────────
  useEffect(() => {
    if (!messages.length) return;

    intervalRef.current = setInterval(() => {
      setMsgIndex((prev) => {
        const isLast = prev >= messages.length - 1;

        if (isLast && stopAtLast) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }

        const next = isLast ? 0 : prev + 1;

        animateOut(() => {
          setMsgIndex(next);
          requestAnimationFrame(() => animateIn());
        });

        return prev;
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [messages.length, interval, stopAtLast]);

  // ── Cleanup gsap tweens on unmount ─────────────────────────
  useEffect(() => {
    const node = textRef.current;
    return () => {
      if (node) gsap.killTweensOf(node);
    };
  }, []);

  const currentMessage = messages[msgIndex] ?? "";

  return (
    <p
      ref={textRef}
      className={className}
      style={{ opacity: 0, willChange: "transform, opacity, filter" }}
    >
      {currentMessage}
      <span className="inline-block w-4 text-left">{DOTS[dotIndex]}</span>
    </p>
  );
}
