"use client";

import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import { useIsDesktop } from "@/hooks/use-media-query";

import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const isDesktop = useIsDesktop();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard to avoid hydration mismatch before theme is resolved
    setMounted(true);
  }, []);
  const logoSrc =
    mounted && resolvedTheme === "light"
      ? "/arcaAI_light_theme.svg"
      : "/arca_ai_logo.svg";

  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-graphite">
      {!isDesktop && mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          onClick={closeMobileSidebar}
        />
      )}

      <AdminSidebar
        isDesktop={isDesktop}
        isMobileOpen={mobileOpen}
        onNavigate={closeMobileSidebar}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col lg:ml-[200px]">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 bg-transparent px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-white/[0.04] text-white"
          >
            <Menu size={18} />
          </button>
          <Image
            src={logoSrc}
            alt="Arca AI"
            width={90}
            height={26}
            priority
            className="h-[22px] w-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </header>

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-graphite">
          {children}
        </main>
      </div>
    </div>
  );
}
