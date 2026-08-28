import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { cleanText, optionalText, recordPmsAudit, requireGuest } from "./lib";

export const list = internalQuery({
  args: {},
  handler: async (ctx) => {
    const guests = await ctx.db.query("guests").withIndex("by_archived", (q) => q.eq("archived", false))
      .order("desc").take(500);
    return guests.map(({ _id, ...guest }) => ({ id: _id, ...guest }));
  },
});

export const upsert = internalMutation({
  args: {
    id: v.optional(v.id("guests")), fullName: v.string(), email: v.optional(v.string()),
    phone: v.optional(v.string()), nationality: v.optional(v.string()), notes: v.optional(v.string()),
    actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fullName = cleanText(args.fullName, "Guest name", 2, 120);
    const email = optionalText(args.email, 254)?.toLowerCase();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Guest email is invalid.");
    const fields = {
      fullName,
      email,
      phone: optionalText(args.phone, 40),
      nationality: optionalText(args.nationality, 80),
      notes: optionalText(args.notes, 2_000),
      updatedAt: now,
      archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      await requireGuest(ctx, id);
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("guests", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      resource: "guest", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} guest ${fullName}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archive = internalMutation({
  args: { id: v.id("guests"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const guest = await requireGuest(ctx, args.id);
    await ctx.db.patch(args.id, { archived: true, updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      resource: "guest", resourceId: args.id, action: "archive",
      summary: `Archived guest ${guest.fullName}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});
