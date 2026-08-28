# Kamyna Homestay Management System

## Purpose

The operations system is designed for the whole Kamyna Living portfolio. Ruma Kamyna in Megamendung is the first active property, but every operational record is keyed by `propertyId` so another villa, homestay, guesthouse, apartment, or multi-unit property can be added without changing the schema.

The owner-confirmed Ruma Kamyna facts are seeded idempotently:

- 3 bedrooms;
- swimming pool;
- gym;
- jacuzzi;
- mountain view.

No bathroom count, guest capacity, rate, deposit, minimum stay, check-in time, cancellation policy, or historic booking data is seeded.

## Admin routes

| Route | Responsibility |
|---|---|
| `/admin` | Portfolio dashboard, arrivals, departures, tasks, financial summary, activity |
| `/admin/calendar` | Date-range availability, reservations, and owner/maintenance blocks |
| `/admin/reservations` | Reservation lifecycle and stay totals |
| `/admin/guests` | Private guest directory |
| `/admin/properties` | Multi-property configuration and public facts |
| `/admin/units` | Whole-property or separately bookable inventory |
| `/admin/amenities` | Property facilities and public visibility |
| `/admin/finance` | Payments, refunds, expenses, and reservation balances |
| `/admin/tasks` | Housekeeping, maintenance, inspection, and guest requests |
| `/admin/welcome` | Localized private welcome-message publishing |

All routes share the existing signed admin session and remain `noindex`. Desktop exposes them in a persistent grouped sidebar; mobile exposes primary modules in a safe-area dock and the remaining modules in a bounded “Lainnya” sheet.

## Convex data model

- `properties`: property identity, location, currency, optional facts, operational/publication state.
- `units`: optional bookable inventory under a property. Bedroom count does not imply separate room inventory.
- `amenities`: facilities with active, featured, and public-visible flags.
- `guests`: private contact and service notes.
- `reservations`: source, lifecycle status, dates, optional counts and amounts.
- `availabilityBlocks`: owner use, maintenance, closure, or other blocked inventory.
- `transactions`: payments, refunds, and expenses.
- `tasks`: operational work linked to property, unit, or reservation.
- `pmsAuditEvents`: bounded operational audit trail without raw admin email.

Deletes are soft archives. List queries exclude archived documents, preserving referential history.

## Reservation and availability invariants

- Check-in and check-out use `YYYY-MM-DD` and check-out must be later than check-in.
- A stay is limited to 1–366 nights.
- `tentative`, `confirmed`, and `checked_in` reservations block inventory.
- A property-level reservation or block conflicts with every unit in that property.
- A unit-level reservation or block conflicts with the same unit and any property-level record.
- Reservation and availability mutations reject overlapping dates inside the transaction.
- Rates, totals, guest counts, and financial values are optional. Empty values remain absent rather than becoming estimates.

## Security boundary

Browser components never call Convex mutations directly. Every write follows:

```text
admin form
  → signed Next.js Server Action
  → protected Convex HTTP action
  → internal Convex query/mutation
  → audit event
```

The Convex admin secret is server-only, the deploy key is deployment-only, and neither belongs in Docker build arguments or browser bundles.

## Public concierge integration

`/api/concierge` reads the same public property projection as the stay page. It may surface bedrooms, active public amenities, verified address, official Maps, and host contact. It must not expose internal notes, finance, guests, reservations, tasks, or unverified operational fields, and it stores no conversation history.

## Public property facts

The property page reads only active, published facts and amenities through the public read-only `pms.public.getProperty` query. If Convex is temporarily unavailable, the page uses a reviewed Ruma Kamyna fallback containing the same five owner-confirmed facts. Public JSON-LD adds `numberOfRooms` and `amenityFeature`, but omits pricing, capacity, bathrooms, ratings, availability, and policies until confirmed.
