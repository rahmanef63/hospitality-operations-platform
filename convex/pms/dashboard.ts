import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { isBlockingReservation } from "./lib";
import { reservationRows, taskRows } from "./readModels";

export const get = internalQuery({
  args: { today: v.string(), weekEnd: v.string(), monthStart: v.string(), monthEnd: v.string() },
  handler: async (ctx, args) => {
    const [properties, amenities, reservations, tasks, transactions, activity] = await Promise.all([
      ctx.db.query("properties").withIndex("by_archived", (q) => q.eq("archived", false)).take(100),
      ctx.db.query("amenities").withIndex("by_archived", (q) => q.eq("archived", false)).take(500),
      ctx.db.query("reservations")
        .withIndex("by_archived_checkin", (q) => q.eq("archived", false).lt("checkIn", args.monthEnd)).take(500),
      ctx.db.query("tasks").withIndex("by_archived_due", (q) => q.eq("archived", false)).take(500),
      ctx.db.query("transactions")
        .withIndex("by_archived_date", (q) => q.eq("archived", false).lt("occurredOn", args.monthEnd)).take(1_000),
      ctx.db.query("pmsAuditEvents").withIndex("by_created").order("desc").take(16),
    ]);
    const activeProperties = properties.filter((property) => property.status === "active");
    const relevantReservations = reservations.filter((reservation) => (
      !reservation.archived && reservation.checkOut >= args.today
    ));
    const reservationView = await reservationRows(ctx, relevantReservations);
    const taskView = await taskRows(ctx, tasks.filter((task) => !task.archived));
    const upcoming = reservationView.filter((reservation) => (
      isBlockingReservation(reservation.status) && reservation.checkIn >= args.today
    ));
    const inHouse = reservationView.filter((reservation) => (
      (reservation.status === "confirmed" || reservation.status === "checked_in")
      && reservation.checkIn <= args.today && reservation.checkOut > args.today
    ));
    const arrivals = reservationView
      .filter((reservation) => isBlockingReservation(reservation.status)
        && reservation.checkIn >= args.today && reservation.checkIn < args.weekEnd)
      .slice(0, 8);
    const departures = reservationView
      .filter((reservation) => (reservation.status === "confirmed" || reservation.status === "checked_in")
        && reservation.checkOut >= args.today && reservation.checkOut < args.weekEnd)
      .slice(0, 8);
    const openTasks = taskView.filter((task) => task.status === "open" || task.status === "in_progress");
    const monthTransactions = transactions.filter((transaction) => (
      !transaction.archived && transaction.status === "completed"
      && transaction.occurredOn >= args.monthStart && transaction.occurredOn < args.monthEnd
    ));
    const incomeThisMonth = monthTransactions
      .filter((item) => item.kind === "payment").reduce((sum, item) => sum + item.amount, 0)
      - monthTransactions.filter((item) => item.kind === "refund").reduce((sum, item) => sum + item.amount, 0);
    const expensesThisMonth = monthTransactions
      .filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
    const amenityCounts = new Map<string, number>();
    for (const amenity of amenities) {
      if (!amenity.archived && amenity.active) {
        amenityCounts.set(amenity.propertyId, (amenityCounts.get(amenity.propertyId) ?? 0) + 1);
      }
    }
    return {
      metrics: {
        activeProperties: activeProperties.length,
        upcomingReservations: upcoming.length,
        inHouse: inHouse.length,
        arrivalsNextSevenDays: arrivals.length,
        openTasks: openTasks.length,
        incomeThisMonth,
        expensesThisMonth,
        outstandingBalance: reservationView.reduce((sum, item) => sum + item.outstandingAmount, 0),
      },
      properties: activeProperties.map(({ _id, name, slug, bedroomCount, status }) => ({
        id: _id, name, slug, bedroomCount, status, amenityCount: amenityCounts.get(_id) ?? 0,
      })),
      arrivals,
      departures,
      tasks: openTasks.slice(0, 8),
      activity: activity.map(({ _id, ...event }) => ({ id: _id, ...event })),
    };
  },
});
