"use client";

import { motion } from "framer-motion";

export type RotatingGlowProps = {
  /** Size (px) of the container this glow surrounds. Used to scale the glow. */
  size: number;
  /** Base color for the glow (hex, e.g. "#A855F7"). */
  color?: string;
  /** Rotation duration in seconds for the glow orbit. */
  glowDuration?: number;
  /** Rotation duration in seconds for the border sweep. */
  borderDuration?: number;
};

/**
 * A rotating purple-style glow + border sweep, designed to sit behind an
 * icon inside a rounded-square container. Used by ChatIconCard.
 */
export function RotatingGlow({
  size,
  color = "#A855F7",
  glowDuration = 12,
  borderDuration = 14,
}: RotatingGlowProps) {
  const glowInset = Math.round(size / 6);
  const mainGlowSize = Math.round(size * 0.4);
  const outerGlowSize = Math.round(size * 0.6);

  return (
    <>
      {/* Rotating Purple Glow */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ inset: -glowInset }}
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{
          duration: glowDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Main glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-[10px]"
          style={{
            width: mainGlowSize,
            height: mainGlowSize,
            backgroundColor: color,
            opacity: 0.75,
          }}
        />

        {/* Outer soft glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full blur-[16px]"
          style={{
            width: outerGlowSize,
            height: outerGlowSize,
            top: -4,
            backgroundColor: color,
            opacity: 0.4,
          }}
        />
      </motion.div>

      {/* Rotating border sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[14px] opacity-70"
        animate={{ rotate: 360 }}
        transition={{
          duration: borderDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </>
  );
}
