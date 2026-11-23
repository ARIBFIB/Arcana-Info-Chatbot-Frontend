import { publicRequest } from "@/api/client";
import type { LoginRequest, RegisterRequest, TokenResponse } from "@/api/types";

export const authApi = {
  login: (data: LoginRequest) =>
    publicRequest.post<TokenResponse>("/api/auth/login", data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    publicRequest
      .post<TokenResponse>("/api/auth/register", data)
      .then((res) => res.data),
};
