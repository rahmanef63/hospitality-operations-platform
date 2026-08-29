import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const getContext = internalQuery({
  args: { reservationId: v.id("reservations") },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation || reservation.archived || reservation.status === "cancelled" || reservation.status === "no_show") return null;
    const [guest, property, unit] = await Promise.all([
      ctx.db.get(reservation.guestId),
      ctx.db.get(reservation.propertyId),
      reservation.unitId ? ctx.db.get(reservation.unitId) : null,
    ]);
    if (!guest || guest.archived || !property || property.archived) return null;
    return {
      reference: reservation.reference,
      propertySlug: property.slug,
      guestName: guest.fullName,
      propertyName: property.name,
      unitName: unit && !unit.archived ? unit.name : undefined,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      status: reservation.status,
      locale: reservation.welcomeLocale ?? guest.preferredLocale ?? "id",
    };
  },
});
