import { ApiError } from "./errors";
import type { ApiErrorShape } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

function buildUrl(path: string, query?: Record<string, unknown>) {
  const url = new URL(path, API_BASE);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: string;
    body?: unknown;
    token?: string | null;
    query?: Record<string, unknown>;
    headers?: Record<string, string>;
    isFormData?: boolean;
  }
): Promise<T> {
  const url = buildUrl(path, opts?.query);

  const headers: Record<string, string> = {
    ...(opts?.headers || {}),
  };

  let body: BodyInit | undefined;

  if (opts?.isFormData) {
    body = opts.body as FormData;
  } else if (opts?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  if (opts?.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const res = await fetch(url, {
    method: opts?.method || "GET",
    headers,
    body,
  });

  if (!res.ok) {
    const payload = (await parseJsonSafe(res)) as ApiErrorShape | unknown;
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as any).message)
        : `HTTP ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  const data = (await parseJsonSafe(res)) as T;
  return data;
}
