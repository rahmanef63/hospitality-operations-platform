import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { getAdminSessionToken } from "@/shared/admin/cookie";

let cachedClient: ConvexHttpClient | undefined;
let cachedUrl: string | undefined;

function requireConvexUrl(): string {
  const value = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!value) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  const url = new URL(value);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_CONVEX_URL must use HTTPS in production.");
  }
  return url.toString().replace(/\/$/, "");
}

export function getConvexClient(): ConvexHttpClient {
  const url = requireConvexUrl();
  if (!cachedClient || cachedUrl !== url) {
    cachedClient = new ConvexHttpClient(url);
    cachedUrl = url;
  }
  return cachedClient;
}

export function getConvexSiteUrl(): string {
  const url = new URL(requireConvexUrl());
  if (!url.hostname.endsWith(".convex.cloud")) throw new Error("Convex Cloud URL is invalid.");
  url.hostname = url.hostname.replace(/\.convex\.cloud$/, ".convex.site");
  return url.origin;
}

export async function adminFetch<T>(path: string, body: unknown): Promise<T> {
  const token = await getAdminSessionToken();
  if (!token) throw new Error("Admin session is unavailable.");
  const response = await fetch(`${getConvexSiteUrl()}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const payload = await response.json() as { ok: boolean; data?: T; error?: string };
  if (!response.ok || !payload.ok || payload.data === undefined) {
    throw new Error(payload.error ?? "Convex admin operation failed.");
  }
  return payload.data;
}
