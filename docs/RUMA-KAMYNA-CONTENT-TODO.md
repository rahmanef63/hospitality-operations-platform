# Ruma Kamyna verified-content checklist

Public facts must come from the owner or another explicitly verified source. They must not be inferred from maps, generated imagery, nearby listings, or competitors.

## Confirmed and active

The following owner-supplied facts are stored in the Convex property-management system and published on the Ruma Kamyna page and verified-information concierge:

- 3 bedrooms;
- swimming pool;
- gym;
- jacuzzi;
- mountain view.

The official street address, WhatsApp number, Google Maps embed URL, latitude, and longitude remain supplied through the verified Dokploy environment configuration and are connected to the public page and `LodgingBusiness` schema. Public surfaces expose only active, published records.

## Property facts still pending

- Number of bathrooms.
- Maximum guest capacity.
- Whether any bedroom is separately bookable as a unit.
- Base rate, seasonal rates, taxes, deposits, extra-person charges, and minimum stay.
- Check-in and check-out times.
- Booking, cancellation, refund, damage, smoking, pet, visitor, and quiet-hours policies.
- Vehicle access, parking, arrival landmarks, and verified route guidance.
- Named local recommendations, distances, and travel times.

These values remain optional in the management system. Leaving a field empty is the correct state until it is confirmed. The concierge must hand these topics to the host rather than invent an answer.

## Operational data starts empty

The system does not create example guests, reservations, payments, expenses, availability blocks, tasks, or revenue. The administrator creates those records only from real operations.

## Media still provisional

All files currently referenced from `public/media/kamyna/` are visual concepts. Their visible disclosure remains `Visual concept. Final property details may evolve.` until approved property photography is supplied.

## Area guides

The three routes under `/guides/` are functional scaffolds but remain `noindex`. Change `indexable` to `true` in `shared/content/config/guides.ts` only after each page contains owner-verified route or local information.
