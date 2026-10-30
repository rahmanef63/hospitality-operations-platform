import "server-only";
import type { AdminSessionClaims } from "@/shared/admin/token";
import { getConvexSiteUrl } from "./core";

type LoginResult = { token: string; claims: AdminSessionClaims };

async function post<T>(path: string, body: unknown, token?: string): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const response = await fetch(`${getConvexSiteUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const payload = await response.json() as { ok?: boolean; data?: T; error?: string };
  return response.ok && payload.ok && payload.data !== undefined
    ? { ok: true, data: payload.data }
    : { ok: false, error: payload.error ?? "service" };
}

export function loginAdminSession(input: { email: string; password: string; ip: string; userAgent: string }) {
  return post<LoginResult>("/admin/session/login", input);
}

export async function verifyAdminSession(token: string): Promise<AdminSessionClaims | null> {
  const result = await post<AdminSessionClaims>("/admin/session/verify", {}, token);
  return result.ok ? result.data : null;
}
