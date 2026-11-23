"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

import { tokens } from "@/design-system";

type HintRotatorProps = {
  hints: string[];
  visible: boolean;
  interval?: number;
  leftOffset?: string;
  fontSize?: number;
};

export function HintRotator({
  hints,
  visible,
  interval = 3500,
  leftOffset = "0px",
  fontSize = 18,
}: HintRotatorProps) {
  const [index, setIndex] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Animate out ──────────────────────────────────────────────
  const animateOut = (onComplete?: () => void) => {
    if (!spanRef.current) return;
    gsap.killTweensOf(spanRef.current);
    gsap.to(spanRef.current, {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
      duration: 0.35,
      ease: "power2.in",
      onComplete,
    });
  };

  // ── Animate in ───────────────────────────────────────────────
  const animateIn = () => {
    if (!spanRef.current) return;
    gsap.killTweensOf(spanRef.current);
    gsap.fromTo(
      spanRef.current,
      { opacity: 0, y: 10, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power3.out",
      },
    );
  };

  // ── Initial entrance ─────────────────────────────────────────
  useEffect(() => {
    if (!spanRef.current) return;
    gsap.killTweensOf(spanRef.current);
    gsap.fromTo(
      spanRef.current,
      { opacity: 0, y: 10, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
      },
    );
  }, []);

  // ── Auto-rotate — FIX 1: add hints.length and interval to deps ──
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!visible) return;

      animateOut(() => {
        setIndex((prev) => (prev + 1) % hints.length); // uses hints.length from closure
        requestAnimationFrame(() => animateIn());
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hints.length, interval, visible]); // ✅ added hints.length + interval

  // ── React to visible prop ────────────────────────────────────
  useEffect(() => {
    if (!visible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      animateOut();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        animateOut(() => {
          setIndex((prev) => (prev + 1) % hints.length);
          requestAnimationFrame(() => animateIn());
        });
      }, interval);

      setTimeout(() => animateIn(), 120);
    }
  }, [visible, hints.length, interval]); // ✅ added hints.length + interval

  // ── Cleanup on unmount — FIX 2: copy ref to local variable ──
  useEffect(() => {
    const span = spanRef.current; // ✅ copy ref to local variable
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (span) gsap.killTweensOf(span); // ✅ use local variable in cleanup
    };
  }, []);

  return (
    <span
      ref={spanRef}
      style={{
        position: "absolute",
        top: "50%",
        left: leftOffset,
        transform: "translateY(-50%)",
        fontSize,
        fontFamily: tokens.typography.fontFamily,
        fontWeight: 400,
        lineHeight: "26px",
        color: "var(--color-placeholder)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        userSelect: "none",
        zIndex: 1,
        opacity: 0,
        willChange: "transform, opacity, filter",
      }}
    >
      {hints[index]}
    </span>
  );
}
