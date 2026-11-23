"use client";

import { motion, type PanInfo } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

/**
 * Dark theme colors are unchanged from the original design.
 * Light theme intentionally avoids pure white (#fff) - it uses
 * muted stone/graphite tones so the switch never looks "blank white".
 *
 * Supports both a plain click/tap AND dragging the knob left/right.
 */
const TRACK_PADDING = 4;
const KNOB_SIZE = 28;
const TRACK_WIDTH = 64;
const DRAG_RANGE = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2; // 28px

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const wasDragged = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const handleToggle = () => {
    if (wasDragged.current) {
      // Suppress the click that fires right after a drag release.
      wasDragged.current = false;
      return;
    }
    setTheme(isDark ? "light" : "dark");
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    wasDragged.current = true;
    const startX = isDark ? DRAG_RANGE : 0;
    const finalX = Math.min(Math.max(startX + info.offset.x, 0), DRAG_RANGE);
    const shouldBeDark = finalX > DRAG_RANGE / 2;
    setTheme(shouldBeDark ? "dark" : "light");
    // Allow the next click (e.g. keyboard/AT) to work normally shortly after.
    setTimeout(() => {
      wasDragged.current = false;
    }, 150);
  };

  if (!mounted) {
    return <div className="h-[36px] w-[64px] shrink-0 rounded-full bg-white/[0.06]" />;
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      role="switch"
      aria-checked={isDark}
      whileTap={{ scale: 0.96 }}
      className="relative flex h-[36px] w-[64px] shrink-0 cursor-pointer items-center rounded-full p-[4px] transition-colors duration-300 focus:outline-none"
      style={{
        background: isDark
          ? "radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)"
          : "radial-gradient(ellipse at top left, #c9c6c0 0%, #b3afa7 45%, #9a968d 100%)",
        boxShadow: isDark
          ? "inset 2px 2px 6px rgba(0,0,0,0.85), inset -2px -2px 6px rgba(71,85,105,0.35), 0 2px 6px rgba(0,0,0,0.4)"
          : "inset 2px 2px 6px rgba(90,86,78,0.35), inset -2px -2px 6px rgba(217,213,205,0.6), 0 2px 6px rgba(0,0,0,0.15)",
        border: isDark
          ? "1.5px solid rgba(51,65,85,0.6)"
          : "1.5px solid rgba(120,115,105,0.4)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <Sun size={13} className={isDark ? "text-white/25" : "text-[#4a4640]"} />
        <Moon size={13} className={isDark ? "text-white/70" : "text-[#4a4640]/40"} />
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: DRAG_RANGE }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={() => {
          wasDragged.current = true;
        }}
        onDragEnd={handleDragEnd}
        className="relative z-10 flex h-[28px] w-[28px] cursor-grab items-center justify-center rounded-full active:cursor-grabbing"
        style={{
          background: isDark
            ? "linear-gradient(145deg, #64748b 0%, #475569 50%, #334155 100%)"
            : "linear-gradient(145deg, #f0eeea 0%, #e3e0da 50%, #d4d0c8 100%)",
          boxShadow: isDark
            ? "inset 1px 1px 2px rgba(148,163,184,0.4), inset -1px -1px 2px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)"
            : "inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(154,150,141,0.35), 0 2px 6px rgba(0,0,0,0.12)",
          border: isDark
            ? "1px solid rgba(148,163,184,0.3)"
            : "1px solid rgba(154,150,141,0.4)",
        }}
        animate={{ x: isDark ? DRAG_RANGE : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {isDark ? (
          <Moon size={13} className="text-yellow-200" />
        ) : (
          <Sun size={13} className="text-[#8a6a2f]" />
        )}
      </motion.div>
    </motion.button>
  );
}
