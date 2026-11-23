"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type StaggerChildrenProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  stagger?: number;
  distance?: number;
  className?: string;
};

export function StaggerChildren({
  children,
  duration = 0.6,
  delay = 0,
  stagger = 0.12,
  distance = 30,
  className,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const items = ref.current.children;
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
      },
    );
  }, [duration, delay, stagger, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
