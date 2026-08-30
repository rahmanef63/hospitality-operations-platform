# Hospitality Operations PMS

## Purpose

The operations system supports multiple independent hospitality properties. Every operational record is keyed by `propertyId`; the upstream platform does not ship any real provider property, amenity, guest, reservation, rate, payment, or task data.

## Admin routes

| Route | Responsibility |
|---|---|
| `/admin` | Portfolio operations dashboard |
| `/admin/calendar` | Availability and inventory blocks |
| `/admin/reservations` | Reservation lifecycle and derived totals |
| `/admin/guests` | Private guest directory |
| `/admin/properties` | Multi-property configuration and public facts |
| `/admin/units` | Whole-property or separately bookable inventory |
| `/admin/amenities` | Property facilities and public visibility |
| `/admin/finance` | Payments, refunds, expenses, and balances |
| `/admin/tasks` | Housekeeping, maintenance, inspections, and guest requests |
| `/admin/welcome` | Localized guest-experience publishing and announcements |

All routes share the signed admin session and remain `noindex`.

## Convex data model

- `properties`: identity, location, currency, optional verified facts, operational/publication state.
- `units`: optional bookable inventory under a property.
- `amenities`: facilities with active, featured, and public-visible flags.
- `guests`: private contact and service notes.
- `reservations`: source, lifecycle status, dates, optional counts and derived amounts.
- `availabilityBlocks`: owner use, maintenance, closure, or other blocked inventory.
- `transactions`: payments, refunds, and expenses.
- `tasks`: operational work linked to property, unit, or reservation.
- audit tables: bounded administrative and operational audit history.

Deletes use soft archives. List queries exclude archived documents while preserving referential history.

## Reservation and availability invariants

- Check-in/check-out use `YYYY-MM-DD`, with check-out later than check-in.
- Blocking ranges use half-open intervals so same-day checkout/check-in is possible.
- Active reservation states and active blocks cannot overlap the same inventory.
- Property-level records conflict with all units in that property; unit-level records conflict with the same unit and property-level records.
- Pricing, capacity, bathroom counts, fees, and other optional facts remain absent until entered by the provider.
- Server-side mutations recompute authoritative totals and currency from linked property/unit configuration.

## Security boundary

Browser components do not call protected Convex mutations directly. Server actions verify the signed admin session, protected Convex HTTP actions independently authorize the server-to-server credential, and public projections exclude guest, finance, task, and internal-note data.

## Public synchronization

The public property page combines provider-authored CMS content with active published operational facts. Tenant repositories may provide a reviewed fallback only inside the protected tenant overlay; the generic upstream fallback is empty.
