import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // 👇 Apna backend ka format: { user_message: "Email already registered" }
    if (typeof data?.user_message === "string") return data.user_message;

    // FastAPI-style
    const detail = data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string };
      if (typeof first?.msg === "string") return first.msg;
    }

    // Express/Node-style
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;

    // Validation array style: { errors: [{ message: "..." }] }
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first?.message === "string") return first.message;
      if (typeof first === "string") return first;
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
