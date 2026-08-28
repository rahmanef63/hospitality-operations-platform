import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export type ReadCtx = QueryCtx | MutationCtx;

export function cleanText(value: string, label: string, minimum: number, maximum: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new Error(`${label} must be ${minimum}-${maximum} characters.`);
  }
  return normalized;
}

export function optionalText(value: string | undefined, maximum: number): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return undefined;
  if (normalized.length > maximum) throw new Error(`Text must not exceed ${maximum} characters.`);
  return normalized;
}

export function cleanSlug(value: string, label = "Slug"): string {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) throw new Error(`${label} is invalid.`);
  return slug;
}

export function cleanCode(value: string): string {
  const code = value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!/^[A-Z0-9][A-Z0-9-]{0,22}[A-Z0-9]$/.test(code) && !/^[A-Z0-9]$/.test(code)) {
    throw new Error("Unit code is invalid.");
  }
  return code;
}

export function optionalInteger(value: number | undefined, label: string, maximum = 1_000_000_000): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) throw new Error(`${label} is invalid.`);
  return value;
}

export function positiveInteger(value: number, label: string, maximum = 1_000_000_000): number {
  if (!Number.isSafeInteger(value) || value <= 0 || value > maximum) throw new Error(`${label} is invalid.`);
  return value;
}

export function cleanCurrency(value: string): string {
  const currency = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Currency must use a three-letter code.");
  return currency;
}

export function cleanCountryCode(value: string): string {
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) throw new Error("Country code must use two letters.");
  return code;
}

export function cleanIsoDate(value: string, label: string): string {
  const date = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${label} must use YYYY-MM-DD.`);
  }
  return date;
}

export function dateRange(startValue: string, endValue: string, startLabel = "Start date", endLabel = "End date") {
  const start = cleanIsoDate(startValue, startLabel);
  const end = cleanIsoDate(endValue, endLabel);
  if (end <= start) throw new Error(`${endLabel} must be after ${startLabel.toLowerCase()}.`);
  return { start, end };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const milliseconds = Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`);
  const nights = milliseconds / 86_400_000;
  if (!Number.isSafeInteger(nights) || nights < 1 || nights > 366) throw new Error("Stay length must be 1-366 nights.");
  return nights;
}

export function isBlockingReservation(status: string): boolean {
  return status === "tentative" || status === "confirmed" || status === "checked_in";
}

export async function requireProperty(ctx: ReadCtx, id: Id<"properties">) {
  const property = await ctx.db.get(id);
  if (!property || property.archived) throw new Error("Property was not found.");
  return property;
}

export async function requireUnit(ctx: ReadCtx, id: Id<"units">, propertyId?: Id<"properties">) {
  const unit = await ctx.db.get(id);
  if (!unit || unit.archived) throw new Error("Unit was not found.");
  if (propertyId && unit.propertyId !== propertyId) throw new Error("Unit does not belong to the selected property.");
  return unit;
}

export async function requireGuest(ctx: ReadCtx, id: Id<"guests">) {
  const guest = await ctx.db.get(id);
  if (!guest || guest.archived) throw new Error("Guest was not found.");
  return guest;
}

export async function requireReservation(ctx: ReadCtx, id: Id<"reservations">, propertyId?: Id<"properties">) {
  const reservation = await ctx.db.get(id);
  if (!reservation || reservation.archived) throw new Error("Reservation was not found.");
  if (propertyId && reservation.propertyId !== propertyId) {
    throw new Error("Reservation does not belong to the selected property.");
  }
  return reservation;
}

export async function recordPmsAudit(
  ctx: MutationCtx,
  input: {
    propertyId?: Id<"properties">;
    resource: string;
    resourceId: string;
    action: "create" | "update" | "archive" | "seed";
    summary: string;
    actorEmailHash: string;
  },
) {
  await ctx.db.insert("pmsAuditEvents", {
    ...input,
    resource: cleanText(input.resource, "Audit resource", 2, 60),
    resourceId: cleanText(input.resourceId, "Audit resource ID", 2, 120),
    summary: cleanText(input.summary, "Audit summary", 2, 180),
    actorEmailHash: cleanText(input.actorEmailHash, "Actor hash", 16, 128),
    createdAt: Date.now(),
  });
}
