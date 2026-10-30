import { v } from "convex/values";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "./_generated/server";
import { aiProviderValidator } from "./aiValidators";
import { cleanText, optionalText } from "./pms/lib";

const scope = "global";

async function current(ctx: QueryCtx | MutationCtx) {
  return ctx.db.query("aiProviderSettings").withIndex("by_scope", (q) => q.eq("scope", scope)).unique();
}

export const getOverview = internalQuery({
  args: {},
  handler: async (ctx) => {
    const config = await current(ctx);
    if (!config) return { exists: false, configured: false, enabled: false };
    return {
      exists: true,
      configured: Boolean(config.encryptedApiKey),
      enabled: config.enabled,
      provider: config.provider,
      model: config.model,
      keyFingerprint: config.keyFingerprint,
      updatedAt: config.updatedAt,
    };
  },
});

export const getSecret = internalQuery({
  args: {},
  handler: async (ctx) => {
    const config = await current(ctx);
    if (!config) return { exists: false, configured: false, enabled: false };
    return {
      exists: true,
      configured: Boolean(config.encryptedApiKey),
      enabled: config.enabled,
      provider: config.provider,
      model: config.model,
      keyFingerprint: config.keyFingerprint,
      encryptedApiKey: config.encryptedApiKey,
      updatedAt: config.updatedAt,
    };
  },
});

export const upsert = internalMutation({
  args: {
    provider: aiProviderValidator,
    model: v.string(),
    enabled: v.boolean(),
    encryptedApiKey: v.optional(v.string()),
    keyFingerprint: v.optional(v.string()),
    clearKey: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aiProviderSettings").withIndex("by_scope", (q) => q.eq("scope", scope)).unique();
    const now = Date.now();
    const encryptedApiKey = args.clearKey ? undefined : args.encryptedApiKey ?? existing?.encryptedApiKey;
    const keyFingerprint = args.clearKey ? undefined : args.keyFingerprint ?? existing?.keyFingerprint;
    const fields = {
      scope,
      provider: args.provider,
      model: cleanText(args.model, "AI model", 2, 160),
      enabled: args.enabled,
      encryptedApiKey: optionalText(encryptedApiKey, 2_000),
      keyFingerprint: optionalText(keyFingerprint, 80),
      updatedAt: now,
    };
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert("aiProviderSettings", { ...fields, createdAt: now });
    return { configured: Boolean(fields.encryptedApiKey), updatedAt: now };
  },
});

export const recordEvent = internalMutation({
  args: {
    action: v.union(v.literal("save"), v.literal("test"), v.literal("translate")),
    provider: v.optional(aiProviderValidator),
    targetCount: v.optional(v.number()),
    actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiAuditEvents", {
      ...args,
      actorEmailHash: cleanText(args.actorEmailHash, "Actor hash", 16, 128),
      createdAt: Date.now(),
    });
    return { ok: true };
  },
});
