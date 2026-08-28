"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import { pmsAdminRequest } from "@/shared/convex";
import { formBoolean, formText, optionalFormNumber, optionalFormText } from "@/shared/pms";

const operations = {
  "seed.ruma-kamyna": [],
  "property.upsert": [
    "id", "slug", "name", "propertyType", "status", "publicationStatus", "locationLabel",
    "addressLine", "locality", "region", "postalCode", "countryCode", "timezone", "currency",
    "bedroomCount", "bathroomCount", "maxGuests", "baseNightlyRate", "publicSummary", "publicPath",
    "internalNotes",
  ],
  "property.archive": ["id"],
  "unit.upsert": [
    "id", "propertyId", "code", "name", "unitType", "status", "bookable", "bedroomCount",
    "bathroomCount", "maxGuests", "baseNightlyRate", "notes",
  ],
  "unit.archive": ["id"],
  "amenity.upsert": [
    "id", "propertyId", "key", "name", "category", "description", "featured", "publicVisible", "active",
  ],
  "amenity.archive": ["id"],
  "guest.upsert": ["id", "fullName", "email", "phone", "nationality", "notes"],
  "guest.archive": ["id"],
  "reservation.upsert": [
    "id", "propertyId", "unitId", "guestId", "externalReference", "status", "source", "checkIn",
    "checkOut", "adults", "children", "nightlyRate", "accommodationAmount", "extraFees",
    "discountAmount", "totalAmount", "currency", "notes",
  ],
  "reservation.archive": ["id"],
  "block.upsert": ["id", "propertyId", "unitId", "title", "reason", "startDate", "endDate", "notes"],
  "block.archive": ["id"],
  "transaction.upsert": [
    "id", "propertyId", "reservationId", "kind", "category", "amount", "currency", "method", "status",
    "occurredOn", "reference", "notes",
  ],
  "transaction.archive": ["id"],
  "task.upsert": [
    "id", "propertyId", "unitId", "reservationId", "title", "category", "priority", "status", "dueOn",
    "assignee", "notes",
  ],
  "task.archive": ["id"],
} as const;

const numberFields = new Set([
  "bedroomCount", "bathroomCount", "maxGuests", "baseNightlyRate", "adults", "children", "nightlyRate",
  "accommodationAmount", "extraFees", "discountAmount", "totalAmount", "amount",
]);
const booleanFields = new Set(["bookable", "featured", "publicVisible", "active"]);
type Operation = keyof typeof operations;

function isOperation(value: string): value is Operation {
  return Object.hasOwn(operations, value);
}

function safeReturnTo(value: string) {
  return /^\/admin(?:\/[^?]*)?$/.test(value) ? value : "/admin";
}

function payloadFromForm(formData: FormData, operation: Operation) {
  const payload: Record<string, unknown> = {};
  for (const field of operations[operation]) {
    if (numberFields.has(field)) {
      const value = optionalFormNumber(formData, field);
      if (value !== undefined) payload[field] = value;
    } else if (booleanFields.has(field)) {
      payload[field] = formBoolean(formData, field);
    } else {
      const value = optionalFormText(formData, field);
      if (value !== undefined) payload[field] = value;
    }
  }
  return payload;
}

export async function pmsAction(formData: FormData) {
  const session = await requireAdminSession();
  const operationValue = formText(formData, "operation") || formText(formData, "defaultOperation");
  const returnTo = safeReturnTo(formText(formData, "returnTo"));
  if (!isOperation(operationValue)) redirect(`${returnTo}?error=operation`);
  try {
    await pmsAdminRequest(operationValue, {
      ...payloadFromForm(formData, operationValue),
      actorEmailHash: hashAdminIdentity(session.email),
    });
  } catch {
    redirect(`${returnTo}?error=operation`);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/stays/ruma-kamyna");
  redirect(`${returnTo}?status=saved`);
}
