import { v } from "convex/values";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "./_generated/server";

const key = "platform";
const LEASE_TIMEOUT_MS = 10 * 60 * 1000;
const checkState = v.union(v.literal("success"), v.literal("pending"), v.literal("failure"), v.literal("unknown"));
const updateState = v.union(v.literal("current"), v.literal("checking"), v.literal("ready"), v.literal("applying"), v.literal("failed"), v.literal("blocked"));

async function current(ctx: QueryCtx | MutationCtx) {
  return ctx.db.query("platformUpdateControl").withIndex("by_key", (q) => q.eq("key", key)).unique();
}

export const getAdminStatus = internalQuery({
  args: {},
  handler: (ctx) => current(ctx),
});

export const queueApply = internalMutation({
  args: { prNumber: v.number(), expectedVersion: v.string(), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const row = await current(ctx);
    if (!row || row.state !== "ready" || row.checkState !== "success") throw new Error("Platform update is not ready.");
    if (row.prNumber !== args.prNumber || row.latestVersion !== args.expectedVersion || row.majorUpgrade) {
      throw new Error("Platform update request is stale.");
    }
    const now = Date.now();
    await ctx.db.patch(row._id, {
      requestPrNumber: args.prNumber, requestVersion: args.expectedVersion, requestState: "queued",
      requestActorHash: args.actorEmailHash, requestedAt: now, leaseStartedAt: undefined,
      lastDispatchError: undefined, updatedAt: now,
    });
    return { queued: true, requestedAt: now };
  },
});

export const syncWorker = internalMutation({
  args: {
    repository: v.string(), defaultBranch: v.string(), installedVersion: v.string(), latestVersion: v.optional(v.string()),
    prNumber: v.optional(v.number()), prUrl: v.optional(v.string()), prTitle: v.optional(v.string()),
    headRef: v.optional(v.string()), headSha: v.optional(v.string()), mergeable: v.optional(v.boolean()),
    checkState, state: updateState, majorUpgrade: v.boolean(), applyRunStatus: v.optional(v.string()),
    applyRunConclusion: v.optional(v.string()), applyRunUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const row = await current(ctx);
    const requestStillRelevant = Boolean(row && row.requestPrNumber === args.prNumber && row.requestVersion === args.latestVersion);
    const leaseExpired = row?.requestState === "dispatching" && Boolean(row.leaseStartedAt)
      && now - (row.leaseStartedAt ?? 0) >= LEASE_TIMEOUT_MS;
    const requestState = requestStillRelevant
      ? (leaseExpired ? "queued" : row?.requestState)
      : undefined;
    const fields = {
      key, ...args, workerSyncedAt: now, updatedAt: now,
      ...(requestStillRelevant ? {
        requestPrNumber: row?.requestPrNumber, requestVersion: row?.requestVersion, requestState,
        requestActorHash: row?.requestActorHash, requestedAt: row?.requestedAt,
        leaseStartedAt: leaseExpired ? undefined : row?.leaseStartedAt, lastDispatchError: row?.lastDispatchError,
      } : {
        requestPrNumber: undefined, requestVersion: undefined, requestState: undefined, requestActorHash: undefined,
        requestedAt: undefined, leaseStartedAt: undefined, lastDispatchError: undefined,
      }),
    };
    const id = row ? row._id : await ctx.db.insert("platformUpdateControl", fields);
    if (row) await ctx.db.patch(row._id, fields);
    const live = row ? { ...row, ...fields } : { ...fields, _id: id };
    if (live.requestState !== "queued" || args.state !== "ready" || args.checkState !== "success") return { request: null };
    await ctx.db.patch(id, { requestState: "dispatching", leaseStartedAt: now, updatedAt: now });
    return { request: { prNumber: live.requestPrNumber!, expectedVersion: live.requestVersion! } };
  },
});

export const ackWorker = internalMutation({
  args: { prNumber: v.number(), expectedVersion: v.string(), success: v.boolean(), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const row = await current(ctx);
    if (!row || row.requestPrNumber !== args.prNumber || row.requestVersion !== args.expectedVersion) return { acknowledged: false };
    const now = Date.now();
    await ctx.db.patch(row._id, args.success ? {
      requestState: "dispatched", leaseStartedAt: undefined, lastDispatchError: undefined, updatedAt: now,
    } : {
      requestState: "queued", leaseStartedAt: undefined, lastDispatchError: (args.error ?? "dispatch failed").slice(0, 240), updatedAt: now,
    });
    return { acknowledged: true };
  },
});
