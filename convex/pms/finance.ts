import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { transactionKindValidator, transactionMethodValidator, transactionStatusValidator } from "./validators";
import {
  cleanCurrency,
  cleanIsoDate,
  cleanText,
  optionalText,
  positiveInteger,
  recordPmsAudit,
  requireProperty,
  requireReservation,
} from "./lib";
import { transactionRows } from "./readModels";

export const list = internalQuery({
  args: { propertyId: v.optional(v.id("properties")), startDate: v.optional(v.string()), endDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const upper = args.endDate ?? "9999-12-31";
    const transactions = args.propertyId
      ? await ctx.db.query("transactions")
          .withIndex("by_property_date", (q) => q.eq("propertyId", args.propertyId!).lt("occurredOn", upper)).take(1_000)
      : await ctx.db.query("transactions")
          .withIndex("by_archived_date", (q) => q.eq("archived", false).lt("occurredOn", upper)).take(1_000);
    const filtered = transactions
      .filter((transaction) => !transaction.archived && (!args.startDate || transaction.occurredOn >= args.startDate))
      .sort((left, right) => right.occurredOn.localeCompare(left.occurredOn));
    const rows = await transactionRows(ctx, filtered);
    const completed = rows.filter((transaction) => transaction.status === "completed");
    const payments = completed.filter((item) => item.kind === "payment").reduce((sum, item) => sum + item.amount, 0);
    const refunds = completed.filter((item) => item.kind === "refund").reduce((sum, item) => sum + item.amount, 0);
    const expenses = completed.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
    return { transactions: rows, totals: { payments, refunds, expenses, net: payments - refunds - expenses } };
  },
});

export const upsert = internalMutation({
  args: {
    id: v.optional(v.id("transactions")), propertyId: v.id("properties"),
    reservationId: v.optional(v.id("reservations")), kind: transactionKindValidator,
    category: v.string(), amount: v.number(), method: transactionMethodValidator,
    status: transactionStatusValidator, occurredOn: v.string(), reference: v.optional(v.string()),
    notes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const property = await requireProperty(ctx, args.propertyId);
    const reservation = args.reservationId
      ? await requireReservation(ctx, args.reservationId, args.propertyId)
      : undefined;
    const now = Date.now();
    const fields = {
      propertyId: args.propertyId,
      reservationId: args.reservationId,
      kind: args.kind,
      category: cleanText(args.category, "Transaction category", 2, 80),
      amount: positiveInteger(args.amount, "Transaction amount"),
      currency: cleanCurrency(reservation?.currency ?? property.currency),
      method: args.method,
      status: args.status,
      occurredOn: cleanIsoDate(args.occurredOn, "Transaction date"),
      reference: optionalText(args.reference, 100),
      notes: optionalText(args.notes, 1_000),
      updatedAt: now,
      archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Transaction was not found.");
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("transactions", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "transaction", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} ${args.kind} at ${property.name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archive = internalMutation({
  args: { id: v.id("transactions"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.archived) throw new Error("Transaction was not found.");
    await ctx.db.patch(args.id, { archived: true, status: "void", updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: transaction.propertyId, resource: "transaction", resourceId: args.id, action: "archive",
      summary: `Voided ${transaction.kind} transaction`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});
