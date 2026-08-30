import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { isBlockingReservation } from "./lib";

type InventoryRange = {
  propertyId: Id<"properties">;
  unitId?: Id<"units">;
  start: string;
  end: string;
};

function sameInventory(left: { unitId?: string }, right: { unitId?: string }) {
  return !left.unitId || !right.unitId || left.unitId === right.unitId;
}

export async function assertReservationAvailability(
  ctx: MutationCtx,
  range: InventoryRange,
  currentId?: Id<"reservations">,
) {
  const reservations = await ctx.db.query("reservations")
    .withIndex("by_property_checkin", (q) => q.eq("propertyId", range.propertyId).lt("checkIn", range.end))
    .take(500);
  const reservationConflict = reservations.find((reservation) => (
    reservation._id !== currentId
    && !reservation.archived
    && isBlockingReservation(reservation.status)
    && reservation.checkOut > range.start
    && sameInventory(reservation, range)
  ));
  if (reservationConflict) throw new Error(`Dates overlap reservation ${reservationConflict.reference}.`);

  const blocks = await ctx.db.query("availabilityBlocks")
    .withIndex("by_property_start", (q) => q.eq("propertyId", range.propertyId).lt("startDate", range.end))
    .take(500);
  const blockConflict = blocks.find((block) => (
    !block.archived && block.endDate > range.start && sameInventory(block, range)
  ));
  if (blockConflict) throw new Error(`Dates overlap availability block “${blockConflict.title}”.`);
}

export async function assertBlockAvailability(
  ctx: MutationCtx,
  range: InventoryRange,
  currentId?: Id<"availabilityBlocks">,
) {
  const blocks = await ctx.db.query("availabilityBlocks")
    .withIndex("by_property_start", (q) => q.eq("propertyId", range.propertyId).lt("startDate", range.end))
    .take(500);
  const blockConflict = blocks.find((block) => (
    block._id !== currentId && !block.archived && block.endDate > range.start && sameInventory(block, range)
  ));
  if (blockConflict) throw new Error(`Dates overlap availability block “${blockConflict.title}”.`);

  const reservations = await ctx.db.query("reservations")
    .withIndex("by_property_checkin", (q) => q.eq("propertyId", range.propertyId).lt("checkIn", range.end))
    .take(500);
  const reservationConflict = reservations.find((reservation) => (
    !reservation.archived
    && isBlockingReservation(reservation.status)
    && reservation.checkOut > range.start
    && sameInventory(reservation, range)
  ));
  if (reservationConflict) throw new Error(`Dates overlap reservation ${reservationConflict.reference}.`);
}
