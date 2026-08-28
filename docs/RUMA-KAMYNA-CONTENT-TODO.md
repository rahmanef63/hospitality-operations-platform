# Ruma Kamyna verified-content checklist

The following values are intentionally absent or visibly marked as provisional. They must not be inferred from maps, photographs, nearby listings, or competitor properties.

## Public contact and location

| Field | Required source | Code or deployment destination |
|---|---|---|
| Official street address | Property owner or verified Google Business Profile | `RUMA_KAMYNA_STREET_ADDRESS` |
| WhatsApp number | Property owner | `RUMA_KAMYNA_WHATSAPP_NUMBER`, using country-code digits only |
| Official Google Maps embed URL | Verified Google Business Profile share/embed action | `RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL` |
| Latitude | Verified Google Business Profile coordinates | `RUMA_KAMYNA_LATITUDE` |
| Longitude | Verified Google Business Profile coordinates | `RUMA_KAMYNA_LONGITUDE` |

The confirmed address currently published is limited to Kecamatan Megamendung, Kabupaten Bogor, Jawa Barat 16770, Indonesia. The application does not generate a street address, Plus Code, or coordinate.

## Property facts still pending

- Number of bedrooms and bathrooms.
- Maximum guest capacity.
- Confirmed facilities and amenities.
- Price range, taxes, deposits, and minimum stay.
- Check-in and check-out times.
- Booking availability and cancellation policy.
- Vehicle access, parking, arrival landmarks, and route guidance.
- Named local recommendations, distances, and travel times.

## Media still provisional

All files currently referenced from `public/media/kamyna/` are visual concepts. Their visible disclosure remains `Visual concept. Final property details may evolve.` until approved property photography is supplied.

## Area guides

The three routes under `/guides/` are functional scaffolds but remain `noindex`. Change `indexable` to `true` in `shared/content/config/guides.ts` only after each page contains owner-verified route or local information.
