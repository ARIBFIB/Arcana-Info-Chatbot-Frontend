"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type SlideInProps = {
  children: React.ReactNode;
  isOpen: boolean;
  width?: number;
  /** Open animation config */
  enterDuration?: number;
  enterEase?: string;
  /** Close animation config */
  exitDuration?: number;
  exitEase?: string;
  className?: string;
  onUpdate?: (x: number) => void;
};

/**
 * Single wrapper that handles BOTH directions with separate
 * duration + easing for enter (slide in) and exit (slide out).
 */
export function SlideIn({
  children,
  isOpen,
  width = 296,
  enterDuration = 0.48,
  enterEase = "power4.out",
  exitDuration = 0.3,
  exitEase = "power3.in",
  className,
  onUpdate,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onUpdateRef = useRef(onUpdate);
  const isFirstRender = useRef(true);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // ── Set initial state synchronously before first paint ────────
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const x = isOpen ? 0 : -width;
    gsap.set(el, { x, opacity: isOpen ? 1 : 0 });
    onUpdateRef.current?.(x);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animate on every toggle after mount ───────────────────────
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    gsap.killTweensOf(el);

    if (isOpen) {
      // ── ENTER — spring deceleration ──────────────────────────
      gsap.fromTo(
        el,
        { x: -width, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: enterDuration,
          ease: enterEase,
          onUpdate() {
            onUpdateRef.current?.(gsap.getProperty(el, "x") as number);
          },
          onComplete() {
            onUpdateRef.current?.(0);
          },
        },
      );
    } else {
      // ── EXIT — accelerate out ────────────────────────────────
      gsap.to(el, {
        x: -width,
        opacity: 0,
        duration: exitDuration,
        ease: exitEase,
        onUpdate() {
          onUpdateRef.current?.(gsap.getProperty(el, "x") as number);
        },
        onComplete() {
          onUpdateRef.current?.(-width);
        },
      });
    }
  }, [isOpen, width, enterDuration, enterEase, exitDuration, exitEase]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 900,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
