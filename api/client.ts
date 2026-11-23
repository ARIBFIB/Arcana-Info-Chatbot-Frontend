import axios from "axios";

import { API_BASE_URL } from "@/constants/api";

const ACCESS_TOKEN_KEY = "access_token";

const defaultConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/** Unauthenticated requests (login, register, etc.). */
export const publicRequest = axios.create(defaultConfig);

/** Authenticated requests — attaches Bearer token when available. */
export const privateRequest = axios.create(defaultConfig);

privateRequest.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
