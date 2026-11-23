import type { ReactNode } from "react";

type ChatBackgroundProps = {
  children: ReactNode;
};

export function ChatBackground({ children }: ChatBackgroundProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center overflow-hidden bg-[var(--color-ink)] [background-image:radial-gradient(circle_at_left,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_right,rgba(168,85,247,0.14),transparent_40%),linear-gradient(180deg,var(--color-ink)_0%,var(--color-charcoal)_100%)]">
      <div className="pointer-events-none absolute -top-[236px] -left-[100px] z-0 h-[500px] w-[500px] rounded-[250px] bg-[#57F1DB] opacity-[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute top-[620px] left-1/2 z-0 h-[120px] w-[600px] -translate-x-1/2 rounded-[300px] bg-[#5653FF] opacity-25 blur-[80px]" />
      {children}
    </div>
  );
}
