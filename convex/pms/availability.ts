import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { blockReasonValidator } from "./validators";
import { assertBlockAvailability } from "./availabilityRules";
import { blockRows, reservationRows } from "./readModels";
import { cleanText, dateRange, optionalText, recordPmsAudit, requireProperty, requireUnit } from "./lib";

export const calendar = internalQuery({
  args: { propertyId: v.optional(v.id("properties")), startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const range = dateRange(args.startDate, args.endDate);
    const reservations = args.propertyId
      ? await ctx.db.query("reservations")
          .withIndex("by_property_checkin", (q) => q.eq("propertyId", args.propertyId!).lt("checkIn", range.end)).take(500)
      : await ctx.db.query("reservations")
          .withIndex("by_archived_checkin", (q) => q.eq("archived", false).lt("checkIn", range.end)).take(500);
    const blocks = args.propertyId
      ? await ctx.db.query("availabilityBlocks")
          .withIndex("by_property_start", (q) => q.eq("propertyId", args.propertyId!).lt("startDate", range.end)).take(500)
      : await ctx.db.query("availabilityBlocks")
          .withIndex("by_archived_start", (q) => q.eq("archived", false).lt("startDate", range.end)).take(500);
    return {
      reservations: await reservationRows(ctx, reservations.filter((item) => !item.archived && item.checkOut > range.start)),
      blocks: await blockRows(ctx, blocks.filter((item) => !item.archived && item.endDate > range.start)),
    };
  },
});

export const upsertBlock = internalMutation({
  args: {
    id: v.optional(v.id("availabilityBlocks")), propertyId: v.id("properties"), unitId: v.optional(v.id("units")),
    title: v.string(), reason: blockReasonValidator, startDate: v.string(), endDate: v.string(),
    notes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const property = await requireProperty(ctx, args.propertyId);
    if (args.unitId) await requireUnit(ctx, args.unitId, args.propertyId);
    const range = dateRange(args.startDate, args.endDate);
    await assertBlockAvailability(ctx, {
      propertyId: args.propertyId, unitId: args.unitId, start: range.start, end: range.end,
    }, args.id);
    const now = Date.now();
    const fields = {
      propertyId: args.propertyId, unitId: args.unitId,
      title: cleanText(args.title, "Block title", 2, 100), reason: args.reason,
      startDate: range.start, endDate: range.end, notes: optionalText(args.notes, 1_000),
      updatedAt: now, archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Availability block was not found.");
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("availabilityBlocks", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "availability block", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} block at ${property.name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archiveBlock = internalMutation({
  args: { id: v.id("availabilityBlocks"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.id);
    if (!block || block.archived) throw new Error("Availability block was not found.");
    await ctx.db.patch(args.id, { archived: true, updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: block.propertyId, resource: "availability block", resourceId: args.id, action: "archive",
      summary: `Archived block ${block.title}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});
