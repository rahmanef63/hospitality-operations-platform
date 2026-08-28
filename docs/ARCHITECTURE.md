# Architecture

## Runtime

Kamyna Living is a Next.js 16 standalone application on Dokploy with a managed Convex Cloud backend. Marketing content stays static-first, while verified property facts and all operational records are dynamic.

```text
shared/content/config/*        shared/pms/*                 convex/pms/*
        ↓                           ↓                            ↓
StaticContentRepository      typed domain boundary      Convex Cloud tables/functions
        ↓                           ↓                            ↓
marketing storytelling       public facts + forms       PMS, reporting, audit, conflicts
        └──────────────────── Next.js App Router ────────────────────┘
```

## Brand and property hierarchy

- **Kamyna Living**: collection and portfolio identity.
- **Ruma Kamyna**: first property in Megamendung, Puncak Bogor.
- **return to stillness**: shared brand idea.

Core identity assets remain location-neutral. Every operational record is keyed by `propertyId`, so new properties do not require a schema fork.

## Slice boundaries

- `site-shell`: public desktop header and footer.
- `concierge`: public mobile dock, desktop chat launcher, and verified-information concierge UI.
- `home`: collection homepage.
- `property`: reusable property storytelling plus verified dynamic facts.
- `brand-assets`: production identity downloads.
- `guides`: location-aware drafts kept noindex until verified.
- `welcome`: private guest welcome experience.
- `admin`: authentication and welcome editor.
- `pms`: portfolio dashboard and operational CRUD UI.

## Convex domains

The backend owns two bounded domains:

1. Welcome publishing, login throttling, and welcome audit history.
2. Multi-property operations: properties, units, amenities, guests, reservations, availability blocks, transactions, tasks, and PMS audit events.

Only `welcome.getPublished` and `pms.public.getProperty` are public read-only functions. All admin functions are `internalQuery` or `internalMutation`, reached through protected Convex HTTP actions after authorization. Browser components never receive deploy credentials or admin secrets.

## Write path

```text
HTML admin form
  → authenticated Next.js Server Action
  → allowlisted payload conversion
  → HTTPS bearer-authorized Convex HTTP action
  → validated internal mutation
  → soft archive / write + audit event
```

Every Server Action verifies the signed admin cookie again. Convex independently verifies the inter-service secret. Admin and guest-welcome routes are excluded from the sitemap and marked noindex.

## Inventory and availability

Properties can be sold as whole villas or divided into optional units. A property bedroom count is a public fact, not an assumption that rooms are separately bookable. Property-level reservations and blocks conflict with every unit; unit-level records conflict with that unit and any property-level record. Overlap checks run inside the mutation.

## Public facts and SEO

The Ruma Kamyna route combines static editorial storytelling with active, published facts from Convex. A reviewed fallback keeps the same confirmed facts available if the backend is temporarily unavailable. JSON-LD adds room and amenity features while continuing to omit unknown rates, capacity, bathrooms, ratings, and policies.

## Navigation and responsive behavior

Marketing pages preserve full-bleed mobile composition and reduced-motion-safe scroll timelines. Desktop retains the editorial header; mobile uses a five-item safe-area dock and reserves matching footer space. The concierge is mounted only in the marketing layout, uses a mobile bottom sheet or desktop lower-right panel, posts sanitized questions to `/api/concierge`, and returns deterministic replies derived from the public PMS projection plus verified contact/location configuration. Conversations are not stored.

The management UI uses the same typography and palette but prioritizes dense, keyboard-accessible forms, 44px controls, horizontal safety, and stable server-rendered interactions. Desktop uses a persistent grouped sidebar. Mobile uses a primary dock plus a bounded “Lainnya” sheet for secondary modules, site access, and logout.
