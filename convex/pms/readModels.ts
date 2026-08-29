import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

async function getReservationRelations(ctx: QueryCtx, reservations: Doc<"reservations">[]) {
  const propertyIds = [...new Set(reservations.map((item) => item.propertyId))];
  const unitIds = [...new Set(reservations.flatMap((item) => item.unitId ? [item.unitId] : []))];
  const guestIds = [...new Set(reservations.map((item) => item.guestId))];
  const [properties, units, guests] = await Promise.all([
    Promise.all(propertyIds.map((id) => ctx.db.get(id))),
    Promise.all(unitIds.map((id) => ctx.db.get(id))),
    Promise.all(guestIds.map((id) => ctx.db.get(id))),
  ]);
  return {
    properties: new Map(properties.filter(Boolean).map((item) => [item!._id, item!.name])),
    units: new Map(units.filter(Boolean).map((item) => [item!._id, item!.name])),
    guests: new Map(guests.filter(Boolean).map((item) => [item!._id, item!])),
  };
}

export async function reservationRows(ctx: QueryCtx, reservations: Doc<"reservations">[]) {
  const relations = await getReservationRelations(ctx, reservations);
  const transactions = await ctx.db.query("transactions")
    .withIndex("by_archived_date", (q) => q.eq("archived", false)).take(1_000);
  const paidByReservation = new Map<string, number>();
  for (const transaction of transactions) {
    if (!transaction.reservationId || transaction.status !== "completed") continue;
    const direction = transaction.kind === "payment" ? 1 : transaction.kind === "refund" ? -1 : 0;
    paidByReservation.set(
      transaction.reservationId,
      (paidByReservation.get(transaction.reservationId) ?? 0) + direction * transaction.amount,
    );
  }
  return reservations.map(({ _id, ...reservation }) => {
    const guest = relations.guests.get(reservation.guestId);
    const paidAmount = paidByReservation.get(_id) ?? 0;
    return {
      ...reservation,
      id: _id,
      propertyName: relations.properties.get(reservation.propertyId) ?? "Archived property",
      unitName: reservation.unitId ? relations.units.get(reservation.unitId) : undefined,
      guestName: guest?.fullName ?? "Archived guest",
      guestPreferredLocale: guest?.preferredLocale,
      welcomeLocale: reservation.welcomeLocale ?? guest?.preferredLocale ?? "id",
      paidAmount,
      outstandingAmount: Math.max(0, (reservation.totalAmount ?? 0) - paidAmount),
    };
  });
}

export async function blockRows(ctx: QueryCtx, blocks: Doc<"availabilityBlocks">[]) {
  const propertyIds = [...new Set(blocks.map((item) => item.propertyId))];
  const unitIds = [...new Set(blocks.flatMap((item) => item.unitId ? [item.unitId] : []))];
  const [properties, units] = await Promise.all([
    Promise.all(propertyIds.map((id) => ctx.db.get(id))),
    Promise.all(unitIds.map((id) => ctx.db.get(id))),
  ]);
  const propertyNames = new Map(properties.filter(Boolean).map((item) => [item!._id, item!.name]));
  const unitNames = new Map(units.filter(Boolean).map((item) => [item!._id, item!.name]));
  return blocks.map(({ _id, ...block }) => ({
    id: _id,
    propertyName: propertyNames.get(block.propertyId) ?? "Archived property",
    unitName: block.unitId ? unitNames.get(block.unitId) : undefined,
    ...block,
  }));
}

export async function transactionRows(ctx: QueryCtx, transactions: Doc<"transactions">[]) {
  const propertyIds = [...new Set(transactions.map((item) => item.propertyId))];
  const reservationIds = [...new Set(transactions.flatMap((item) => item.reservationId ? [item.reservationId] : []))];
  const [properties, reservations] = await Promise.all([
    Promise.all(propertyIds.map((id) => ctx.db.get(id))),
    Promise.all(reservationIds.map((id) => ctx.db.get(id))),
  ]);
  const propertyNames = new Map(properties.filter(Boolean).map((item) => [item!._id, item!.name]));
  const references = new Map(reservations.filter(Boolean).map((item) => [item!._id, item!.reference]));
  return transactions.map(({ _id, ...transaction }) => ({
    id: _id,
    propertyName: propertyNames.get(transaction.propertyId) ?? "Archived property",
    reservationReference: transaction.reservationId ? references.get(transaction.reservationId) : undefined,
    ...transaction,
  }));
}

export async function taskRows(ctx: QueryCtx, tasks: Doc<"tasks">[]) {
  const propertyIds = [...new Set(tasks.map((item) => item.propertyId))];
  const unitIds = [...new Set(tasks.flatMap((item) => item.unitId ? [item.unitId] : []))];
  const reservationIds = [...new Set(tasks.flatMap((item) => item.reservationId ? [item.reservationId] : []))];
  const [properties, units, reservations] = await Promise.all([
    Promise.all(propertyIds.map((id) => ctx.db.get(id))),
    Promise.all(unitIds.map((id) => ctx.db.get(id))),
    Promise.all(reservationIds.map((id) => ctx.db.get(id))),
  ]);
  const propertyNames = new Map(properties.filter(Boolean).map((item) => [item!._id, item!.name]));
  const unitNames = new Map(units.filter(Boolean).map((item) => [item!._id, item!.name]));
  const references = new Map(reservations.filter(Boolean).map((item) => [item!._id, item!.reference]));
  return tasks.map(({ _id, ...task }) => ({
    id: _id,
    propertyName: propertyNames.get(task.propertyId) ?? "Archived property",
    unitName: task.unitId ? unitNames.get(task.unitId) : undefined,
    reservationReference: task.reservationId ? references.get(task.reservationId) : undefined,
    ...task,
  }));
}
