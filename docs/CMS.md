# Kamyna Public CMS

## Scope

`/admin/cms` controls authored public frontend content for the Kamyna portfolio. The existing Homestay OS sidebar/dock remains the primary navigation; entering CMS adds a secondary desktop sidebar and a second mobile dock above the primary one.

The CMS controls:

- public header/navigation, footer and concierge chrome;
- homepage SEO, section visibility/order, copy, CTAs and reviewed media;
- property editorial SEO, hero/story/gallery/pillars/rhythm/guides/enquiry copy, reviewed media, and top-level section visibility/order;
- local guide CRUD, sections, related property and indexability;
- brand-assets page visibility, copy, reviewed hero media, asset descriptions, palette/usage-section visibility;
- property-scoped `/welcome` and `/presentation` composition remains in `/admin/welcome`, where it is already connected to reservations, announcements, prayer scheduling and lo-fi settings.

Operational truth is intentionally not duplicated into CMS. Bedrooms, amenities, reservation data, rates, availability, addresses and contacts continue to come from PMS/configured verified data. Core brand marks, dimensions and palette values remain locked; the CMS edits their public presentation, not the identity source files.

## Draft and publish

The database stores one atomic JSON document in `cmsSnapshots` with separate draft and published values. Every editor writes only the draft. **Publish draft** promotes the entire validated draft as one version, records an audit event, and invalidates the `cms:published` Next cache tag. A guest can therefore never see half of a multi-section admin edit.

If CMS is unconfigured or Convex is temporarily unavailable, the reviewed code snapshot in `shared/content/config/` is the fallback. Initializing CMS copies that exact snapshot into both draft and published state without changing public output.

## Caching

Published CMS reads use Next.js `use cache`, `cacheLife("days")`, and route-specific tags. Publishing invalidates the public tags immediately. Draft saves do not touch the public cache.

Owner-verified property facts use a separate hours-level cache tagged `public-property-facts`; PMS writes invalidate that tag. Browser pages therefore do not perform a Convex content request on every render.

Static media, brand files and PWA audio also use browser/service-worker caches. The service worker never caches `/admin/*`, `/api/*`, or tokenized private welcome/presentation HTML.

## Safety

CMS payloads are size-bounded and validated before they are sent to Convex. Navigation/CTA URLs reject unsafe schemes; public media choices are limited to reviewed local assets. The CMS never contains guest PII, payment data, internal notes, admin credentials, or BYOK secrets.
