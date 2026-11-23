/** Backend base URL — override via `NEXT_PUBLIC_API_BASE_URL` in `.env.local`. */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.20.40:8000";
