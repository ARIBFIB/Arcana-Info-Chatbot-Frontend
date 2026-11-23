"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type SlideUpProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
};

export function SlideUp({
  children,
  duration = 0.7,
  delay = 0,
  distance = 40,
  className,
}: SlideUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: distance },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
      },
    );
  }, [duration, delay, distance]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
