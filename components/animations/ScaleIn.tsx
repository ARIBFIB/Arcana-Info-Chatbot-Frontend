"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type ScaleInProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  from?: number;
  className?: string;
};

export function ScaleIn({
  children,
  duration = 0.5,
  delay = 0,
  from = 0.85,
  className,
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: from },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "back.out(1.4)",
      },
    );
  }, [duration, delay, from]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, display: "contents" }}>
      {children}
    </div>
  );
}
