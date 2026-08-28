import { httpRouter } from "convex/server";
import { httpAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { authorizeAdminRequest } from "./lib/admin";

const http = httpRouter();
const MAX_BODY_BYTES = 32_768;

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be an object.");
  }
  return body as Record<string, unknown>;
}

function localeValue(value: unknown): "id" | "en" {
  if (value !== "id" && value !== "en") throw new Error("Invalid welcome locale.");
  return value;
}

function adminAction(handler: (ctx: ActionCtx, body: Record<string, unknown>) => Promise<unknown>) {
  return httpAction(async (ctx, request) => {
    if (!authorizeAdminRequest(request)) return json({ ok: false, error: "Unauthorized" }, 401);
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
    try {
      const body = await readJson(request);
      return json({ ok: true, data: await handler(ctx, body) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request";
      return json({ ok: false, error: message }, 400);
    }
  });
}

http.route({
  path: "/admin/welcome-overview",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runQuery(internal.welcome.getAdminOverview, {
    propertySlug: String(body.propertySlug ?? ""),
  })),
});

http.route({
  path: "/admin/welcome-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.welcome.upsert, {
    propertySlug: String(body.propertySlug ?? ""),
    locale: localeValue(body.locale),
    headline: String(body.headline ?? ""),
    body: String(body.body ?? ""),
    signature: String(body.signature ?? ""),
    publish: body.publish === true,
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/login-attempt",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.adminSecurity.recordAttempt, {
    fingerprint: String(body.fingerprint ?? ""),
    success: body.success === true,
  })),
});

http.route({
  path: "/admin/ensure-welcome-defaults",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.welcome.ensureDefaults, {
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

export default http;
