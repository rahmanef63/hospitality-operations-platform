import { v } from "convex/values";
import { internalMutation, internalQuery, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const KEY = "public-site";
async function find(ctx: QueryCtx | MutationCtx) {
  return ctx.db.query("cmsSnapshots").withIndex("by_key", (q) => q.eq("key", KEY)).unique();
}
async function audit(ctx: MutationCtx, action: "seed" | "save" | "publish", actorEmailHash: string, version: number) {
  await ctx.db.insert("cmsAuditEvents", { key: KEY, action, actorEmailHash, version, createdAt: Date.now() });
}
function safeJson(value: string) {
  if (!value || value.length > 300_000) throw new Error("CMS payload tidak valid.");
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("CMS payload tidak valid.");
  return value;
}

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    const row = await find(ctx);
    return row?.publishedJson ? { json: row.publishedJson, version: row.version, publishedAt: row.publishedAt } : null;
  },
});

export const getAdminOverview = internalQuery({
  args: {},
  handler: async (ctx) => {
    const row = await find(ctx);
    const events = await ctx.db.query("cmsAuditEvents").withIndex("by_key_created", (q) => q.eq("key", KEY)).order("desc").take(30);
    return {
      configured: Boolean(row),
      draftJson: row?.draftJson, publishedJson: row?.publishedJson,
      version: row?.version ?? 0, updatedAt: row?.updatedAt, publishedAt: row?.publishedAt,
      events: events.map(({ action, actorEmailHash, version, createdAt }) => ({ action, actorEmailHash, version, createdAt })),
    };
  },
});

export const ensure = internalMutation({
  args: { json: v.string(), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await find(ctx);
    if (existing) return { created: false, version: existing.version };
    const json = safeJson(args.json); const now = Date.now();
    await ctx.db.insert("cmsSnapshots", { key: KEY, draftJson: json, publishedJson: json, version: 1, updatedAt: now, publishedAt: now });
    await audit(ctx, "seed", args.actorEmailHash, 1);
    return { created: true, version: 1 };
  },
});

export const saveDraft = internalMutation({
  args: { json: v.string(), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await find(ctx); if (!existing) throw new Error("CMS belum diinisialisasi.");
    const json = safeJson(args.json); const version = existing.version + 1; const now = Date.now();
    await ctx.db.patch(existing._id, { draftJson: json, version, updatedAt: now });
    await audit(ctx, "save", args.actorEmailHash, version);
    return { version, updatedAt: now };
  },
});

export const publish = internalMutation({
  args: { actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await find(ctx); if (!existing) throw new Error("CMS belum diinisialisasi.");
    safeJson(existing.draftJson); const version = existing.version + 1; const now = Date.now();
    await ctx.db.patch(existing._id, { publishedJson: existing.draftJson, version, updatedAt: now, publishedAt: now });
    await audit(ctx, "publish", args.actorEmailHash, version);
    return { version, publishedAt: now };
  },
});
