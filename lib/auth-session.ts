import { clearAccessToken, setAccessToken } from "@/api/client";
import type { TokenResponse } from "@/api/types";

const USER_KEY = "auth_user";

export type AuthUser = Pick<
  TokenResponse,
  "employee_id" | "name" | "email" | "department" | "is_admin"
>;

export function setAuthSession(data: TokenResponse): void {
  setAccessToken(data.access_token);
  const user: AuthUser = {
    employee_id: data.employee_id,
    name: data.name,
    email: data.email,
    department: data.department,
    is_admin: data.is_admin,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  clearAccessToken();
  localStorage.removeItem(USER_KEY);
}
