import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export const recordAttempt = internalMutation({
  args: {
    fingerprint: v.string(),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("adminLoginAttempts")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .unique();
    if (existing?.lockedUntil && existing.lockedUntil > now) {
      return {
        allowed: false,
        locked: true,
        retryAfterSeconds: Math.ceil((existing.lockedUntil - now) / 1000),
      };
    }
    if (args.success) {
      if (existing) await ctx.db.delete(existing._id);
      return { allowed: true, locked: false, retryAfterSeconds: 0 };
    }
    const windowExpired = !existing || now - existing.windowStartedAt >= WINDOW_MS;
    const failures = windowExpired ? 1 : existing.failures + 1;
    const lockedUntil = failures >= MAX_FAILURES ? now + LOCK_MS : undefined;
    const values = {
      fingerprint: args.fingerprint,
      failures,
      windowStartedAt: windowExpired ? now : existing.windowStartedAt,
      lockedUntil,
      updatedAt: now,
    };
    if (existing) await ctx.db.patch(existing._id, values);
    else await ctx.db.insert("adminLoginAttempts", values);
    return {
      allowed: false,
      locked: Boolean(lockedUntil),
      retryAfterSeconds: lockedUntil ? Math.ceil((lockedUntil - now) / 1000) : 0,
    };
  },
});
