"use client";

import { useMutation } from "@tanstack/react-query";

import { authKeys } from "@/api/keys";
import { authApi } from "@/api/requests";
import type { LoginRequest, RegisterRequest } from "@/api/types";
import { setAuthSession } from "@/lib/auth-session";

export function useLoginMutation() {
  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuthSession(data);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationKey: authKeys.register(),
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuthSession(data);
    },
  });
}
