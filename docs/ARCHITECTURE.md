# Architecture

## Runtime

Kamyna Living is a Next.js 16 standalone application on Dokploy with a managed Convex Cloud backend. The public marketing site remains static-first; only the guest-welcome and admin operational surfaces use Convex.

```text
shared/content/config/*              convex/*
        ↓                               ↓
StaticContentRepository       Convex Cloud functions/tables
        ↓                               ↓
marketing/property pages       server-only admin + welcome adapter
        └────────────── Next.js App Router ──────────────┘
```

This split preserves the reliable static public site while allowing one narrowly scoped operational feature to be edited without a code deployment.

## Brand hierarchy

- **Kamyna Living**: collection and portfolio identity.
- **Ruma Kamyna**: first property identity.
- **return to stillness**: shared brand idea.

Core identity assets remain location-neutral. Verified location and contact facts live only in the Ruma Kamyna property configuration.

## Slice boundaries

- `site-shell`: public navigation and footer.
- `home`: collection homepage sections.
- `property`: reusable property storytelling route.
- `brand-assets`: downloadable production identity files.
- `guides`: location-aware drafts that remain noindex until verified.
- `welcome`: private guest-facing welcome experience.
- `admin`: authenticated guest-experience editor and activity view.

Cross-slice imports use each slice barrel. Shared authentication, Convex adapters, and welcome-domain validation live under `shared/*`.

## Convex Cloud boundary

The active backend owns:

- localized welcome drafts and published messages;
- atomic login-failure windows and lockouts;
- bounded admin publishing history.

Public clients can call only `welcome.getPublished`. Admin functions are declared `internalQuery` or `internalMutation` and are invoked by Convex HTTP actions after an Authorization-header check against a server-only deployment secret. Next.js never sends the deploy key or admin password to Convex or the browser.

Generated bindings in `convex/_generated/` are committed. Docker builds receive only `NEXT_PUBLIC_CONVEX_URL`; `CONVEX_DEPLOY_KEY` stays outside the image.

## Admin session boundary

Admin credentials are read only by Next.js server code. Credentials are compared using fixed-length SHA-256 digests and timing-safe equality. A successful login produces a signed 12-hour HttpOnly cookie. Mutating Server Actions require that session and Convex independently authorizes the downstream HTTP action.

## Media and search

Image metadata, dimensions, captions, responsive variants, and alt text have one source of truth in `shared/media/`. Generated property visuals keep their visible concept disclosure until verified photography is supplied.

Search surfaces remain route-owned: canonical metadata, Google verification, image sitemap, robots rules, social cards, and the linked Organization/WebSite/Brand/LodgingBusiness graph. Admin and guest-welcome routes are deliberately excluded from the sitemap and marked noindex.

## Responsive composition and motion

Marketing pages remain full-bleed on mobile with restrained native CSS scroll timelines and reduced-motion fallbacks. Admin and welcome slices use the same brand tokens but avoid decorative motion that could interfere with editing, authentication, or guest readability.
