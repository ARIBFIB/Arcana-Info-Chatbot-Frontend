"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";

import { getAccessToken } from "@/api/client";
import { ROUTES } from "@/constants";
import { isAdminUser } from "@/lib/auth-routing";
import { getAuthUser } from "@/lib/auth-session";

type AdminGuardProps = {
  children: ReactNode;
};

function checkAuthorized(): boolean {
  return Boolean(getAccessToken() && isAdminUser(getAuthUser()));
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();

  const authorized = useSyncExternalStore(
    subscribe,
    checkAuthorized,
    () => true, // server snapshot — assume authorized to avoid SSR redirect
  );

  if (!authorized) {
    router.replace(ROUTES.chat);
    return null;
  }

  return children;
}
