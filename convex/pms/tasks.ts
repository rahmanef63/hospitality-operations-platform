import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { taskCategoryValidator, taskPriorityValidator, taskStatusValidator } from "./validators";
import {
  cleanIsoDate,
  cleanText,
  optionalText,
  recordPmsAudit,
  requireProperty,
  requireReservation,
  requireUnit,
} from "./lib";
import { taskRows } from "./readModels";

export const list = internalQuery({
  args: { propertyId: v.optional(v.id("properties")) },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks")
      .withIndex("by_archived_due", (q) => q.eq("archived", false)).take(1_000);
    const filtered = tasks
      .filter((task) => !args.propertyId || task.propertyId === args.propertyId)
      .sort((left, right) => (left.dueOn ?? "9999-12-31").localeCompare(right.dueOn ?? "9999-12-31"));
    return taskRows(ctx, filtered);
  },
});

export const upsert = internalMutation({
  args: {
    id: v.optional(v.id("tasks")), propertyId: v.id("properties"), unitId: v.optional(v.id("units")),
    reservationId: v.optional(v.id("reservations")), title: v.string(), category: taskCategoryValidator,
    priority: taskPriorityValidator, status: taskStatusValidator, dueOn: v.optional(v.string()),
    assignee: v.optional(v.string()), notes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const property = await requireProperty(ctx, args.propertyId);
    if (args.unitId) await requireUnit(ctx, args.unitId, args.propertyId);
    if (args.reservationId) await requireReservation(ctx, args.reservationId, args.propertyId);
    const now = Date.now();
    const fields = {
      propertyId: args.propertyId,
      unitId: args.unitId,
      reservationId: args.reservationId,
      title: cleanText(args.title, "Task title", 2, 140),
      category: args.category,
      priority: args.priority,
      status: args.status,
      dueOn: args.dueOn ? cleanIsoDate(args.dueOn, "Due date") : undefined,
      assignee: optionalText(args.assignee, 100),
      notes: optionalText(args.notes, 2_000),
      completedAt: args.status === "done" ? now : undefined,
      updatedAt: now,
      archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Task was not found.");
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("tasks", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "task", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} task at ${property.name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archive = internalMutation({
  args: { id: v.id("tasks"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task || task.archived) throw new Error("Task was not found.");
    await ctx.db.patch(args.id, { archived: true, status: "cancelled", updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: task.propertyId, resource: "task", resourceId: args.id, action: "archive",
      summary: `Archived task ${task.title}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});
