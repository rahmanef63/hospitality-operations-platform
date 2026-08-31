import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { adminAction, json, readJson } from "./httpSecurity";

function workerSecret() {
  const value = process.env.HOSPITALITY_UPDATE_WORKFLOW_TOKEN?.trim();
  if (!value || value.length < 32) throw new Error("HOSPITALITY_UPDATE_WORKFLOW_TOKEN is not configured correctly.");
  return value;
}

function constantTimeTextEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return mismatch === 0;
}

function workerAuthorized(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  try { return constantTimeTextEqual(header.slice(7), workerSecret()); } catch { return false; }
}

export const platformAdminStatus = adminAction((ctx) => ctx.runQuery(internal.platformUpdates.getAdminStatus, {}));

export const platformAdminQueue = adminAction((ctx, body, claims) => ctx.runMutation(internal.platformUpdates.queueApply, {
  prNumber: Number(body.prNumber),
  expectedVersion: String(body.expectedVersion ?? ""),
  actorEmailHash: claims.actorEmailHash,
}));

export const platformWorkerSync = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  if (!workerAuthorized(request)) return json({ ok: false, error: "Unauthorized" }, 401);
  try {
    const body = await readJson(request);
    return json({ ok: true, data: await ctx.runMutation(internal.platformUpdates.syncWorker, body as never) });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Invalid worker sync" }, 400);
  }
});

export const platformWorkerAck = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  if (!workerAuthorized(request)) return json({ ok: false, error: "Unauthorized" }, 401);
  try {
    const body = await readJson(request);
    const data = await ctx.runMutation(internal.platformUpdates.ackWorker, {
      prNumber: Number(body.prNumber), expectedVersion: String(body.expectedVersion ?? ""),
      success: body.success === true, error: typeof body.error === "string" ? body.error : undefined,
    });
    return json({ ok: true, data });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Invalid worker acknowledgement" }, 400);
  }
});
