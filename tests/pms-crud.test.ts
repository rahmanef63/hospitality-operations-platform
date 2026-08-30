import { beforeEach, describe, expect, it } from "vitest";
import { convexTest, type TestConvex } from "convex-test";
import { internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
import { createTestProperty, TEST_ACTOR_HASH } from "./fixtures/pms";

const modules = import.meta.glob("../convex/**/*.{ts,js}");
const actorEmailHash = TEST_ACTOR_HASH;
type TestBackend = ReturnType<typeof convexTest<typeof schema.tables>>;

async function seeded(t: TestConvex<typeof schema>) { return createTestProperty(t); }

describe("multi-property PMS CRUD", () => {
  let t: TestBackend;
  beforeEach(() => { t = convexTest(schema, modules); });

  it("supports property and amenity CRUD from an explicitly created generic property", async () => {
    const { catalog, property } = await seeded(t);
    expect(property).toMatchObject({
      slug: "test-property",
      name: "Test Property",
      bedroomCount: 3,
      currency: "IDR",
      publicationStatus: "published",
    });
    expect(catalog.amenities.map((amenity) => amenity.key).sort()).toEqual(["garden-view", "gym", "pool", "spa"]);
    expect(property).not.toHaveProperty("bathroomCount");
    expect(property).not.toHaveProperty("maxGuests");
    expect(property).not.toHaveProperty("baseNightlyRate");

    await t.mutation(internal.pms.catalog.upsertProperty, {
      id: property.id,
      slug: property.slug,
      name: property.name,
      propertyType: property.propertyType,
      status: property.status,
      publicationStatus: property.publicationStatus,
      locationLabel: "Test District",
      locality: "Test City",
      region: "Test Region",
      postalCode: "10000",
      countryCode: "ID",
      timezone: "Asia/Jakarta",
      currency: "IDR",
      bedroomCount: 3,
      publicSummary: "Verified operational summary.",
      publicPath: "/stays/test-property",
      actorEmailHash,
    });
    const createdAmenity = await t.mutation(internal.pms.catalog.upsertAmenity, {
      propertyId: property.id,
      key: "fire-pit",
      name: "Fire pit",
      category: "leisure",
      featured: false,
      publicVisible: false,
      active: true,
      actorEmailHash,
    });
    await t.mutation(internal.pms.catalog.archiveAmenity, { id: createdAmenity.id, actorEmailHash });
    const updated = await t.query(internal.pms.catalog.list, {});
    expect(updated.properties[0]?.publicSummary).toBe("Verified operational summary.");
    expect(updated.amenities.some((amenity) => amenity.key === "fire-pit")).toBe(false);
  });

  it("creates guests and reservations, updates them, and prevents overlapping inventory", async () => {
    const { property } = await seeded(t);
    const guest = await t.mutation(internal.pms.guests.upsert, {
      fullName: "Test Guest",
      email: "guest@example.com",
      preferredLocale: "ja",
      actorEmailHash,
    });
    await t.mutation(internal.pms.catalog.upsertProperty, {
      id: property.id,
      slug: property.slug,
      name: property.name,
      propertyType: property.propertyType,
      status: property.status,
      publicationStatus: property.publicationStatus,
      locationLabel: property.locationLabel,
      locality: property.locality,
      region: property.region,
      postalCode: property.postalCode,
      countryCode: property.countryCode,
      timezone: property.timezone,
      currency: property.currency,
      bedroomCount: property.bedroomCount,
      publicSummary: property.publicSummary,
      publicPath: property.publicPath,
      baseNightlyRate: 750_000,
      actorEmailHash,
    });
    const reservation = await t.mutation(internal.pms.reservations.upsert, {
      propertyId: property.id,
      guestId: guest.id,
      status: "confirmed",
      source: "direct",
      checkIn: "2026-09-10",
      checkOut: "2026-09-12",
      extraFees: 100_000,
      discountAmount: 50_000,
      actorEmailHash,
    });
    await t.mutation(internal.pms.reservations.upsert, {
      id: reservation.id,
      propertyId: property.id,
      guestId: guest.id,
      status: "checked_in",
      source: "direct",
      checkIn: "2026-09-10",
      checkOut: "2026-09-12",
      extraFees: 100_000,
      discountAmount: 50_000,
      actorEmailHash,
    });
    await expect(t.mutation(internal.pms.availability.upsertBlock, {
      propertyId: property.id,
      title: "Maintenance overlap",
      reason: "maintenance",
      startDate: "2026-09-11",
      endDate: "2026-09-13",
      actorEmailHash,
    })).rejects.toThrow(/overlap reservation/i);
    const rows = await t.query(internal.pms.reservations.list, {});
    expect(rows[0]).toMatchObject({
      reference: reservation.reference,
      guestName: "Test Guest",
      status: "checked_in",
      nights: 2,
      nightlyRate: 750_000,
      accommodationAmount: 1_500_000,
      extraFees: 100_000,
      discountAmount: 50_000,
      totalAmount: 1_550_000,
      currency: "IDR",
      paidAmount: 0,
      outstandingAmount: 1_550_000,
      welcomeLocale: "ja",
      guestPreferredLocale: "ja",
    });
    const context = await t.query(internal.welcomeReservations.getContext, { reservationId: reservation.id });
    expect(context).toMatchObject({ guestName: "Test Guest", propertyName: "Test Property", locale: "ja" });
    expect(context).not.toHaveProperty("totalAmount");
    expect(context).not.toHaveProperty("notes");
    await t.mutation(internal.pms.reservations.archive, { id: reservation.id, actorEmailHash });
    await t.mutation(internal.pms.guests.archive, { id: guest.id, actorEmailHash });
    await expect(t.query(internal.pms.reservations.list, {})).resolves.toHaveLength(0);
    await expect(t.query(internal.pms.guests.list, {})).resolves.toHaveLength(0);
  });

  it("supports finance and operational task CRUD without preloading fake activity", async () => {
    const { property } = await seeded(t);
    const initialFinance = await t.query(internal.pms.finance.list, {});
    const initialTasks = await t.query(internal.pms.tasks.list, {});
    expect(initialFinance.transactions).toHaveLength(0);
    expect(initialTasks).toHaveLength(0);

    const payment = await t.mutation(internal.pms.finance.upsert, {
      propertyId: property.id,
      kind: "payment",
      category: "Deposit",
      amount: 500_000,
      method: "bank_transfer",
      status: "completed",
      occurredOn: "2026-09-01",
      actorEmailHash,
    });
    const task = await t.mutation(internal.pms.tasks.upsert, {
      propertyId: property.id,
      title: "Inspect guest area",
      category: "inspection",
      priority: "high",
      status: "open",
      dueOn: "2026-09-05",
      actorEmailHash,
    });
    expect((await t.query(internal.pms.finance.list, {})).totals.payments).toBe(500_000);
    expect((await t.query(internal.pms.tasks.list, {}))[0]?.title).toBe("Inspect guest area");
    await t.mutation(internal.pms.finance.archive, { id: payment.id, actorEmailHash });
    await t.mutation(internal.pms.tasks.archive, { id: task.id, actorEmailHash });
    expect((await t.query(internal.pms.finance.list, {})).transactions).toHaveLength(0);
    expect(await t.query(internal.pms.tasks.list, {})).toHaveLength(0);
  });
});
