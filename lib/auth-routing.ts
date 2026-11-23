import { ROUTES } from "@/constants";

import type { AuthUser } from "./auth-session";

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.is_admin);
}

export function getPostLoginRoute(user: AuthUser | null | undefined): string {
  return isAdminUser(user) ? ROUTES.admin.dashboard : ROUTES.chat;
}
