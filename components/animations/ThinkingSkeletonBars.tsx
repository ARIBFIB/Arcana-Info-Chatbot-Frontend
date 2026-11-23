"use client";

import { useMemo } from "react";

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const WIDTH_OPTIONS = [16, 22, 28, 34, 40];

export function ThinkingSkeletonBars() {
  const bars = useMemo(() => {
    const count = randomBetween(2, 5);
    return Array.from({ length: count }, () => ({
      width: WIDTH_OPTIONS[randomBetween(0, WIDTH_OPTIONS.length - 1)],
      delay: randomBetween(0, 250),
    }));
  }, []);

  return (
    <>
      {bars.map((bar, idx) => (
        <span
          key={idx}
          className="mr-1.5 inline-block h-2.5 animate-pulse rounded-full bg-white/15 align-middle"
          style={{ width: `${bar.width}px`, animationDelay: `${bar.delay}ms` }}
        />
      ))}
    </>
  );
}
