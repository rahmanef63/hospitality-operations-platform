import type { Id, TableNames } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import {
  AMENITY_CATEGORIES,
  BLOCK_REASONS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PUBLICATION_STATUSES,
  RESERVATION_SOURCES,
  RESERVATION_STATUSES,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TRANSACTION_KINDS,
  TRANSACTION_METHODS,
  TRANSACTION_STATUSES,
  UNIT_STATUSES,
  UNIT_TYPES,
} from "../../shared/pms/constants";
import { optionalWelcomeLocale } from "../welcomeLocale";

function payloadObject(body: Record<string, unknown>) {
  const payload = body.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {} as Record<string, unknown>;
  return payload as Record<string, unknown>;
}

function text(payload: Record<string, unknown>, key: string): string {
  return typeof payload[key] === "string" ? payload[key] : "";
}

function optionalText(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function numberValue(payload: Record<string, unknown>, key: string): number | undefined {
  const value = payload[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function booleanValue(payload: Record<string, unknown>, key: string): boolean {
  return payload[key] === true;
}

function idValue<T extends TableNames>(payload: Record<string, unknown>, key: string): Id<T> {
  const value = text(payload, key);
  if (!value) throw new Error(`${key} is required.`);
  return value as Id<T>;
}

function optionalId<T extends TableNames>(payload: Record<string, unknown>, key: string): Id<T> | undefined {
  const value = optionalText(payload, key);
  return value as Id<T> | undefined;
}

function enumValue<const T extends readonly string[]>(
  payload: Record<string, unknown>,
  key: string,
  allowed: T,
): T[number] {
  const value = text(payload, key);
  if (!allowed.includes(value)) throw new Error(`${key} is invalid.`);
  return value as T[number];
}

export async function handlePmsAdmin(ctx: ActionCtx, body: Record<string, unknown>) {
  const action = text(body, "action");
  const payload = payloadObject(body);
  const actorEmailHash = text(payload, "actorEmailHash");
  switch (action) {
    case "dashboard.get":
      return ctx.runQuery(internal.pms.dashboard.get, {
        today: text(payload, "today"), weekEnd: text(payload, "weekEnd"),
        monthStart: text(payload, "monthStart"), monthEnd: text(payload, "monthEnd"),
      });
    case "catalog.list":
      return ctx.runQuery(internal.pms.catalog.list, {});
    case "property.upsert":
      return ctx.runMutation(internal.pms.catalog.upsertProperty, {
        id: optionalId<"properties">(payload, "id"), slug: text(payload, "slug"), name: text(payload, "name"),
        propertyType: enumValue(payload, "propertyType", PROPERTY_TYPES),
        status: enumValue(payload, "status", PROPERTY_STATUSES),
        publicationStatus: enumValue(payload, "publicationStatus", PUBLICATION_STATUSES),
        locationLabel: optionalText(payload, "locationLabel"), addressLine: optionalText(payload, "addressLine"),
        locality: optionalText(payload, "locality"), region: optionalText(payload, "region"),
        postalCode: optionalText(payload, "postalCode"), countryCode: text(payload, "countryCode"),
        timezone: text(payload, "timezone"), currency: text(payload, "currency"),
        bedroomCount: numberValue(payload, "bedroomCount"), bathroomCount: numberValue(payload, "bathroomCount"),
        maxGuests: numberValue(payload, "maxGuests"), baseNightlyRate: numberValue(payload, "baseNightlyRate"),
        publicSummary: optionalText(payload, "publicSummary"), publicPath: optionalText(payload, "publicPath"),
        internalNotes: optionalText(payload, "internalNotes"), actorEmailHash,
      });
    case "property.archive":
      return ctx.runMutation(internal.pms.catalog.archiveProperty, { id: idValue<"properties">(payload, "id"), actorEmailHash });
    case "unit.upsert":
      return ctx.runMutation(internal.pms.catalog.upsertUnit, {
        id: optionalId<"units">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"),
        code: text(payload, "code"), name: text(payload, "name"),
        unitType: enumValue(payload, "unitType", UNIT_TYPES),
        status: enumValue(payload, "status", UNIT_STATUSES), bookable: booleanValue(payload, "bookable"),
        bedroomCount: numberValue(payload, "bedroomCount"), bathroomCount: numberValue(payload, "bathroomCount"),
        maxGuests: numberValue(payload, "maxGuests"), baseNightlyRate: numberValue(payload, "baseNightlyRate"),
        notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "unit.archive":
      return ctx.runMutation(internal.pms.catalog.archiveUnit, { id: idValue<"units">(payload, "id"), actorEmailHash });
    case "amenity.upsert":
      return ctx.runMutation(internal.pms.catalog.upsertAmenity, {
        id: optionalId<"amenities">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"),
        key: text(payload, "key"), name: text(payload, "name"),
        category: enumValue(payload, "category", AMENITY_CATEGORIES),
        description: optionalText(payload, "description"), featured: booleanValue(payload, "featured"),
        publicVisible: booleanValue(payload, "publicVisible"), active: booleanValue(payload, "active"), actorEmailHash,
      });
    case "amenity.archive":
      return ctx.runMutation(internal.pms.catalog.archiveAmenity, { id: idValue<"amenities">(payload, "id"), actorEmailHash });
    case "guest.list":
      return ctx.runQuery(internal.pms.guests.list, {});
    case "guest.upsert":
      return ctx.runMutation(internal.pms.guests.upsert, {
        id: optionalId<"guests">(payload, "id"), fullName: text(payload, "fullName"), email: optionalText(payload, "email"),
        phone: optionalText(payload, "phone"), nationality: optionalText(payload, "nationality"),
        preferredLocale: optionalWelcomeLocale(payload.preferredLocale), notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "guest.archive":
      return ctx.runMutation(internal.pms.guests.archive, { id: idValue<"guests">(payload, "id"), actorEmailHash });
    case "reservation.list":
      return ctx.runQuery(internal.pms.reservations.list, {
        propertyId: optionalId<"properties">(payload, "propertyId"), startDate: optionalText(payload, "startDate"),
        endDate: optionalText(payload, "endDate"),
      });
    case "reservation.upsert":
      return ctx.runMutation(internal.pms.reservations.upsert, {
        id: optionalId<"reservations">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"),
        unitId: optionalId<"units">(payload, "unitId"), guestId: idValue<"guests">(payload, "guestId"),
        externalReference: optionalText(payload, "externalReference"),
        status: enumValue(payload, "status", RESERVATION_STATUSES),
        source: enumValue(payload, "source", RESERVATION_SOURCES),
        checkIn: text(payload, "checkIn"), checkOut: text(payload, "checkOut"),
        adults: numberValue(payload, "adults"), children: numberValue(payload, "children"),
        nightlyRate: numberValue(payload, "nightlyRate"),
        extraFees: numberValue(payload, "extraFees"), discountAmount: numberValue(payload, "discountAmount"),
        welcomeLocale: optionalWelcomeLocale(payload.welcomeLocale), notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "reservation.archive":
      return ctx.runMutation(internal.pms.reservations.archive, { id: idValue<"reservations">(payload, "id"), actorEmailHash });
    case "calendar.get":
      return ctx.runQuery(internal.pms.availability.calendar, {
        propertyId: optionalId<"properties">(payload, "propertyId"), startDate: text(payload, "startDate"), endDate: text(payload, "endDate"),
      });
    case "block.upsert":
      return ctx.runMutation(internal.pms.availability.upsertBlock, {
        id: optionalId<"availabilityBlocks">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"), unitId: optionalId<"units">(payload, "unitId"),
        title: text(payload, "title"), reason: enumValue(payload, "reason", BLOCK_REASONS),
        startDate: text(payload, "startDate"), endDate: text(payload, "endDate"),
        notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "block.archive":
      return ctx.runMutation(internal.pms.availability.archiveBlock, { id: idValue<"availabilityBlocks">(payload, "id"), actorEmailHash });
    case "finance.list":
      return ctx.runQuery(internal.pms.finance.list, {
        propertyId: optionalId<"properties">(payload, "propertyId"), startDate: optionalText(payload, "startDate"),
        endDate: optionalText(payload, "endDate"),
      });
    case "transaction.upsert":
      return ctx.runMutation(internal.pms.finance.upsert, {
        id: optionalId<"transactions">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"),
        reservationId: optionalId<"reservations">(payload, "reservationId"), kind: enumValue(payload, "kind", TRANSACTION_KINDS),
        category: text(payload, "category"), amount: numberValue(payload, "amount") ?? 0,
        method: enumValue(payload, "method", TRANSACTION_METHODS),
        status: enumValue(payload, "status", TRANSACTION_STATUSES), occurredOn: text(payload, "occurredOn"),
        reference: optionalText(payload, "reference"), notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "transaction.archive":
      return ctx.runMutation(internal.pms.finance.archive, { id: idValue<"transactions">(payload, "id"), actorEmailHash });
    case "task.list":
      return ctx.runQuery(internal.pms.tasks.list, { propertyId: optionalId<"properties">(payload, "propertyId") });
    case "task.upsert":
      return ctx.runMutation(internal.pms.tasks.upsert, {
        id: optionalId<"tasks">(payload, "id"), propertyId: idValue<"properties">(payload, "propertyId"), unitId: optionalId<"units">(payload, "unitId"),
        reservationId: optionalId<"reservations">(payload, "reservationId"), title: text(payload, "title"),
        category: enumValue(payload, "category", TASK_CATEGORIES),
        priority: enumValue(payload, "priority", TASK_PRIORITIES), status: enumValue(payload, "status", TASK_STATUSES),
        dueOn: optionalText(payload, "dueOn"), assignee: optionalText(payload, "assignee"),
        notes: optionalText(payload, "notes"), actorEmailHash,
      });
    case "task.archive":
      return ctx.runMutation(internal.pms.tasks.archive, { id: idValue<"tasks">(payload, "id"), actorEmailHash });
    case "seed.initial-property":
      return ctx.runMutation(internal.pms.seed.initialProperty, { actorEmailHash });
    default:
      throw new Error("Unknown PMS action.");
  }
}
