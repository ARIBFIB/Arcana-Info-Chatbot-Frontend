/**
 * Centralized route paths — use these instead of hard-coded strings.
 */

export const ROUTES = {
  home: "/",
  chat: "/chat",
  chatSession: (sessionUuid: string) => `/chat/${sessionUuid}` as const,
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    documents: "/admin/documents",
    announcements: "/admin/announcements",
  },
} as const;

export type AppRoute = typeof ROUTES;
