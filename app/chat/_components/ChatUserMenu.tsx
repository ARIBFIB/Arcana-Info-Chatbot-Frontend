"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Gauge, LogOut, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ROUTES } from "@/constants";
import { tokens } from "@/design-system";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { isAdminUser } from "@/lib/auth-routing";
import { clearAuthSession, getAuthUser } from "@/lib/auth-session";
import { showToast } from "@/lib/toast";

type ChatUserMenuProps = {
  onOpenAuth: () => void;
  refreshKey?: number;
};

export function ChatUserMenu({ onOpenAuth, refreshKey = 0 }: ChatUserMenuProps) {
  void refreshKey;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { requestDelete, modal: logoutConfirmModal } = useDeleteConfirm();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading client-only auth state after hydration
    setUser(getAuthUser());
  }, [refreshKey]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const performLogout = () => {
    clearAuthSession();
    void queryClient.clear();
    // NOTE: clearAuthSession() session/localStorage clear karta hai, lekin
    // is component ka apna "user" state stale reh jata tha jab tak page
    // reload na ho (kyunki useEffect sirf refreshKey change par re-run
    // hota hai, aur logout par refreshKey nahi badalta). Isliye yahan
    // explicitly local state bhi turant null karna zaroori hai.
    setUser(null);
    showToast.success("Logged out", "You've been signed out successfully.");
    // NOTE: router.push() sirf client-side navigation karta hai (page
    // reload nahi hota). Logout ke baad user ne ek full page refresh
    // maanga hai taake sab client state (queries, memoized hooks, etc.)
    // ekdum clean state se load ho - isliye yahan poori browser
    // navigation trigger ki hai instead of router.push.
    window.location.href = ROUTES.chat;
  };

  const handleLogoutClick = () => {
    setOpen(false);
    requestDelete({
      title: "Log out?",
      description: "You'll need to sign in again to access your chats.",
      confirmLabel: "Log out",
      onConfirm: performLogout,
    });
  };

  if (!user) {
    return (
      <button
        type="button"
        aria-label="Open sign in"
        onClick={onOpenAuth}
        className="relative mr-14 h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full border border-off-white/20 shadow-[0_8px_20px_rgba(0,0,0,.18)] transition-transform duration-300 hover:scale-[1.03]"
      >
        <Image
          src="/avatar_image.png"
          alt=""
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </button>
    );
  }

  return (
    <>
      {logoutConfirmModal}

      <div ref={menuRef} className="relative mr-14">
        <button
          type="button"
          aria-label="Open account menu"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
          className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full border border-off-white/20 shadow-[0_8px_20px_rgba(0,0,0,.18)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <Image
            src="/avatar_image.png"
            alt={user.name}
            fill
            sizes="44px"
            className="object-cover"
            priority
          />
        </button>

        <div
          role="menu"
          className={`absolute top-[calc(100%+10px)] right-0 z-[2000] w-[220px] overflow-hidden rounded-xl border border-white/10 p-1 backdrop-blur-[20px] transition-[opacity,transform] duration-200 ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
          style={{
            background: "var(--color-dropdown-bg)",
            boxShadow: tokens.shadow.dropdown,
          }}
        >
          <div className="border-b border-off-white/[0.07] px-3 py-2.5">
            <p className="truncate text-sm font-medium text-off-white">{user.name}</p>
            <p className="truncate text-xs text-off-white/55">{user.email}</p>
          </div>

          {isAdminUser(user) && (
            <Link
              href={ROUTES.admin.dashboard}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left no-underline transition-colors hover:bg-white/[0.07]"
            >
              <Gauge size={16} className="text-off-white/70" />
              <span className="text-[13px] text-off-white/85">Admin dashboard</span>
            </Link>
          )}

          <Link
            href={ROUTES.chat}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left no-underline transition-colors hover:bg-white/[0.07]"
          >
            <MessageSquare size={16} className="text-off-white/70" />
            <span className="text-[13px] text-off-white/85">Chat</span>
          </Link>

          <div className="mx-2 my-0.5 h-px bg-white/[0.07]" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogoutClick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg border-none bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-[rgba(239,68,68,0.12)]"
          >
            <LogOut size={16} className="text-[rgba(239,68,68,0.90)]" />
            <span className="text-[13px] text-[rgba(239,68,68,0.90)]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
