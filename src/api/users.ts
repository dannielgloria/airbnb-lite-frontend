import { apiFetch } from "./client";

export function updateMeApi(token: string, payload: { name?: string; email?: string; password?: string }) {
  return apiFetch<{ id: string; name: string; email: string }>("/api/v1/users/me", { method: "PUT", body: payload, token });
}
