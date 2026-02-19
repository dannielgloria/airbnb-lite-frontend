import { apiFetch } from "./client";
import type { AuthLoginResponse, AuthRegisterResponse, MeResponse } from "./types";

export function registerApi(payload: { name: string; email: string; password: string }) {
  return apiFetch<AuthRegisterResponse>("/api/v1/auth/register", { method: "POST", body: payload });
}

export function loginApi(payload: { email: string; password: string }) {
  return apiFetch<AuthLoginResponse>("/api/v1/auth/login", { method: "POST", body: payload });
}

export function meApi(token: string) {
  return apiFetch<MeResponse>("/api/v1/auth/me", { token });
}
