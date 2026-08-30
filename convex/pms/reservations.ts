import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { welcomeLocaleValidator } from "../welcomeLocale";
import { reservationSourceValidator, reservationStatusValidator } from "./validators";
import {
  cleanCurrency,
  cleanText,
  dateRange,
  isBlockingReservation,
  nightsBetween,
  optionalInteger,
  optionalText,
  recordPmsAudit,
  requireGuest,
  requireProperty,
  requireUnit,
} from "./lib";
import { assertReservationAvailability } from "./availabilityRules";
import { reservationRows } from "./readModels";

export const list = internalQuery({
  args: { propertyId: v.optional(v.id("properties")), startDate: v.optional(v.string()), endDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const upper = args.endDate ?? "9999-12-31";
    const reservations = args.propertyId
      ? await ctx.db.query("reservations")
          .withIndex("by_property_checkin", (q) => q.eq("propertyId", args.propertyId!).lt("checkIn", upper)).take(500)
      : await ctx.db.query("reservations")
          .withIndex("by_archived_checkin", (q) => q.eq("archived", false).lt("checkIn", upper)).take(500);
    const filtered = reservations
      .filter((reservation) => !reservation.archived && (!args.startDate || reservation.checkOut > args.startDate))
      .sort((left, right) => left.checkIn.localeCompare(right.checkIn));
    return reservationRows(ctx, filtered);
  },
});

export const upsert = internalMutation({
  args: {
    id: v.optional(v.id("reservations")), propertyId: v.id("properties"), unitId: v.optional(v.id("units")),
    guestId: v.id("guests"), externalReference: v.optional(v.string()), status: reservationStatusValidator,
    source: reservationSourceValidator, checkIn: v.string(), checkOut: v.string(), adults: v.optional(v.number()),
    children: v.optional(v.number()), nightlyRate: v.optional(v.number()),
    extraFees: v.optional(v.number()), discountAmount: v.optional(v.number()),
    welcomeLocale: v.optional(welcomeLocaleValidator), notes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const [property, guest] = await Promise.all([
      requireProperty(ctx, args.propertyId),
      requireGuest(ctx, args.guestId),
    ]);
    const unit = args.unitId ? await requireUnit(ctx, args.unitId, args.propertyId) : undefined;
    if (unit && (!unit.bookable || unit.status !== "active")) throw new Error("Selected unit is not bookable.");
    const existing = args.id ? await ctx.db.get(args.id) : null;
    if (args.id && (!existing || existing.archived)) throw new Error("Reservation was not found.");
    const range = dateRange(args.checkIn, args.checkOut, "Check-in", "Check-out");
    const nights = nightsBetween(range.start, range.end);
    if (isBlockingReservation(args.status)) {
      await assertReservationAvailability(ctx, {
        propertyId: args.propertyId, unitId: args.unitId, start: range.start, end: range.end,
      }, args.id);
    }
    const nightlyRate = optionalInteger(
      args.nightlyRate ?? unit?.baseNightlyRate ?? property.baseNightlyRate,
      "Nightly rate",
    );
    const accommodationAmount = nightlyRate === undefined ? undefined : nightlyRate * nights;
    const extraFees = optionalInteger(args.extraFees, "Extra fees") ?? 0;
    const discountAmount = optionalInteger(args.discountAmount, "Discount amount") ?? 0;
    if (accommodationAmount !== undefined && discountAmount > accommodationAmount + extraFees) {
      throw new Error("Discount cannot exceed accommodation plus extra fees.");
    }
    const totalAmount = accommodationAmount === undefined
      ? undefined
      : accommodationAmount + extraFees - discountAmount;
    const now = Date.now();
    const reference = existing?.reference
      ?? `${property.slug.replace(/[^a-z0-9]/g, "").slice(0, 4).toUpperCase()}-${now.toString(36).toUpperCase()}`;
    const fields = {
      reference,
      externalReference: optionalText(args.externalReference, 100),
      propertyId: args.propertyId,
      unitId: args.unitId,
      guestId: args.guestId,
      status: args.status,
      source: args.source,
      checkIn: range.start,
      checkOut: range.end,
      nights,
      adults: optionalInteger(args.adults, "Adult count", 100),
      children: optionalInteger(args.children, "Child count", 100),
      nightlyRate,
      accommodationAmount,
      extraFees: args.extraFees === undefined ? undefined : extraFees,
      discountAmount: args.discountAmount === undefined ? undefined : discountAmount,
      totalAmount,
      currency: cleanCurrency(property.currency),
      welcomeLocale: args.welcomeLocale ?? existing?.welcomeLocale ?? guest.preferredLocale ?? "id",
      notes: optionalText(args.notes, 2_000),
      cancelledAt: args.status === "cancelled" ? now : undefined,
      updatedAt: now,
      archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) await ctx.db.patch(id, fields);
    else id = await ctx.db.insert("reservations", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "reservation", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} reservation ${reference}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id, reference };
  },
});

export const archive = internalMutation({
  args: { id: v.id("reservations"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (!reservation || reservation.archived) throw new Error("Reservation was not found.");
    await ctx.db.patch(args.id, { archived: true, updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: reservation.propertyId, resource: "reservation", resourceId: args.id, action: "archive",
      summary: `Archived reservation ${cleanText(reservation.reference, "Reference", 2, 100)}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});
