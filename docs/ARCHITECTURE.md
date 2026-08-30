# Architecture

## Runtime

Hospitality Operations Platform is a Next.js 16 application backed by Convex Cloud. It combines public CMS delivery with multi-property operations while keeping provider identity, property facts, secrets, and deployment ownership outside the upstream core.

```text
tenant/*                     shared/*                    convex/*
provider identity/config → generic domain boundary → managed backend functions
         \                       |                         /
          └────────────── Next.js App Router ────────────┘
```

## Product and tenant boundary

- **Hospitality Operations Platform**: versioned upstream product source.
- **Tenant repository**: independently owned provider repository receiving tested upstream release PRs.
- **Provider deployment**: independently owned Vercel/Convex projects, domains, data, and secrets.
- `tenant/**` and `public/tenant/**` are protected overlays and are never overwritten by the automated updater.
- The upstream default tenant is deliberately empty of real property records and business facts.

## Slice boundaries

- `site-shell`: public navigation, PWA lifecycle, footer.
- `home`: collection homepage.
- `property`: reusable property storytelling plus verified operational facts.
- `brand-assets`: provider-managed identity downloads.
- `guides`: provider-managed local editorial content.
- `welcome`: private guest welcome and presentation experience.
- `admin`: authentication, AI/BYOK, and welcome administration.
- `pms`: portfolio dashboard and operational CRUD UI.
- `cms`: draft/publish public content management.

## Data authority

Operational truth lives in Convex: properties, units, amenities, guests, reservations, availability blocks, transactions, tasks, audit events, welcome publishing, announcements, and CMS snapshots. Browser components never receive backend deployment credentials or admin secrets.

Public editorial content uses an atomic draft/publish CMS snapshot. Public property facts use a separate read-only projection so marketing edits cannot silently change operational truth.

## Write path

```text
authenticated admin form
  → signed Next.js server action
  → protected Convex HTTP action
  → internal Convex query/mutation
  → audit event
```

## Tenant distribution

Upstream uses Semantic Version releases. Managed tenant repositories receive update branches and pull requests only after protected-overlay checks, core-drift checks, merge checks, and the full tenant verification suite pass. Unsafe updates create a blocked-update issue rather than overwriting provider changes.

See `docs/PLATFORM-DISTRIBUTION.md` for the full release contract.
