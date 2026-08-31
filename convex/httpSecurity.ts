import { httpAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { adminRequestFingerprint, authorizeAdminRequest, issueAdminSession, verifyAdminCredentials } from "./lib/admin";
import type { AdminSessionClaims } from "../shared/admin/token";

const MAX_BODY_BYTES = 65_536;

export function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) throw new Error("Request body is too large.");
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Request body must be an object.");
  return body as Record<string, unknown>;
}

export function adminAction(handler: (ctx: ActionCtx, body: Record<string, unknown>, claims: AdminSessionClaims) => Promise<unknown>) {
  return httpAction(async (ctx, request) => {
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
    const claims = await authorizeAdminRequest(request);
    if (!claims) return json({ ok: false, error: "Unauthorized" }, 401);
    try {
      const body = await readJson(request);
      return json({ ok: true, data: await handler(ctx, body, claims) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request";
      return json({ ok: false, error: message }, 400);
    }
  });
}

export const adminSessionLogin = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  try {
    const body = await readJson(request);
    const email = String(body.email ?? "").slice(0, 254);
    const password = String(body.password ?? "").slice(0, 512);
    const ip = String(body.ip ?? "unknown").slice(0, 120);
    const userAgent = String(body.userAgent ?? "unknown").slice(0, 300);
    const credentialsValid = verifyAdminCredentials(email, password);
    const fingerprint = await adminRequestFingerprint(ip, userAgent);
    const attempt = await ctx.runMutation(internal.adminSecurity.recordAttempt, { fingerprint, success: credentialsValid });
    if (!credentialsValid || !attempt.allowed) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return json({ ok: false, error: attempt.locked ? "locked" : "invalid" }, attempt.locked ? 429 : 401);
    }
    return json({ ok: true, data: await issueAdminSession() });
  } catch {
    return json({ ok: false, error: "service" }, 503);
  }
});

export const adminSessionVerify = httpAction(async (_ctx, request) => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  const claims = await authorizeAdminRequest(request);
  return claims ? json({ ok: true, data: claims }) : json({ ok: false, error: "Unauthorized" }, 401);
});
