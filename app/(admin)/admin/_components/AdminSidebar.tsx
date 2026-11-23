"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FileText, Gauge, LogOut, MessageSquare, Newspaper } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { chatKeys } from "@/api/keys";
import { ROUTES } from "@/constants";
import { clearAuthSession } from "@/lib/auth-session";
import { showToast } from "@/lib/toast";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.admin.dashboard, icon: Gauge },
  { label: "Documents", href: ROUTES.admin.documents, icon: FileText },
  { label: "Announcements", href: ROUTES.admin.announcements, icon: Newspaper },
  { label: "Chat", href: ROUTES.chat, icon: MessageSquare },
];

type AdminSidebarProps = {
  isDesktop: boolean;
  isMobileOpen: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({
  isDesktop,
  isMobileOpen,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const isVisible = isDesktop || isMobileOpen;

  const handleLogout = () => {
    clearAuthSession();
    void queryClient.invalidateQueries({ queryKey: chatKeys.all });
    showToast.success("Logged out", "You've been signed out successfully.");
    router.push(ROUTES.home);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen w-[min(200px,88vw)] flex-col border-r px-5 pt-8 pb-8 transition-transform duration-300 sm:pt-[41px] ${isVisible ? "translate-x-0" : "-translate-x-full"}${isDesktop ? " lg:translate-x-0" : ""}`}
      style={{
        background: "var(--color-admin-sidebar-bg)",
        borderRightColor: "var(--color-sidebar-border)",
      }}
    >
      <div className="mb-10 sm:mb-[52px]">
        <Image
          src={logoSrc}
          alt="arca+AI"
          width={115}
          height={19}
          priority
          className="h-[19px] w-auto max-w-[115px]"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <nav className="flex flex-col gap-6 sm:gap-7">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className="flex h-6 items-center gap-3 no-underline"
            >
              <Icon
                size={20}
                strokeWidth={1.75}
                className={`shrink-0 ${isActive ? "text-off-white" : "text-off-white/70"}`}
              />
              <span
                className={`font-sans text-base leading-normal whitespace-nowrap ${isActive ? "font-medium text-off-white" : "font-normal text-off-white/70"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between">
        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-off-white"
        >
          <LogOut size={20} strokeWidth={1.75} className="shrink-0 text-off-white" />
          <span className="font-sans text-base leading-normal font-normal whitespace-nowrap text-off-white">
            Logout
          </span>
        </button>

        <div className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#eaeaea] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          <Image
            src="/avatar_image.png"
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </aside>
  );
}
