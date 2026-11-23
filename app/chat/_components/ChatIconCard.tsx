"use client";

import Image from "next/image";

import { RotatingGlow } from "@/components/animations";

type ChatIconCardProps = {
  size?: number;
  iconSize?: number;
};

export function ChatIconCard({ size = 60, iconSize = 36 }: ChatIconCardProps) {
  const centerGlowSize = Math.round(size * 0.63);
  const bottomGlowWidth = Math.round(size * 0.63);
  const bottomGlowHeight = Math.round(size * 0.33);
  const bottomGlowOffset = -Math.round(size * 0.23);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/[0.08]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(160deg, #29282D 0%, #1F1E22 55%, #17171A 100%)",
      }}
    >
      <RotatingGlow size={size} />

      {/* Center ambient glow behind icon */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A855F7]/25 blur-[15px]"
        style={{ width: centerGlowSize, height: centerGlowSize }}
      />

      {/* Bottom purple ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-[#D946EF]/25 blur-[12px]"
        style={{
          width: bottomGlowWidth,
          height: bottomGlowHeight,
          bottom: bottomGlowOffset,
        }}
      />

      {/* Chat Icon */}
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src="/chat_inside_icon.svg"
          alt="Chat"
          width={iconSize}
          height={iconSize}
          priority
          className="block object-contain drop-shadow-[0_3px_9px_rgba(168,85,247,0.42)]"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>

      {/* Subtle inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-white/[0.04]" />
    </div>
  );
}
