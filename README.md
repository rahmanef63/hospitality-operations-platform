# Kamyna Living

Multi-property hospitality website and homestay-management system for the Kamyna collection. **Ruma Kamyna** in Megamendung, Puncak Bogor is the first active property; the brand identity remains location-neutral for future properties.

## Runtime

- Next.js 16 App Router, React 19, Tailwind CSS 4, strict TypeScript.
- Draft/publish public CMS backed by Convex, with tagged Next.js server caches and dynamic owner-verified property facts.
- Convex Cloud for properties, units, amenities, guests, reservations, availability, finance, tasks, 20-language welcome publishing, property-scoped announcement schedules, encrypted BYOK AI metadata, login throttling, and audit history.
- Signed server-only single-admin session using an HttpOnly cookie.
- Docker standalone frontend on Dokploy; managed Convex Cloud backend.
- Installable PWA with bounded app-owned cache cleanup, public auto-update, offline fallback, configurable TV slideshow, bundled CC0 lo-fi music, and fullscreen controls.
- Location-aware SEO, canonical/hreflang links, image sitemap, structured data, social cards, and Google verification.

## Routes

| Route | Purpose |
|---|---|
| `/` | Kamyna Living collection homepage |
| `/stays/ruma-kamyna` | Dynamic Ruma Kamyna property detail |
| `/brand-assets` | Production identity downloads |
| `/guides/*` | Noindex local-guide scaffolds |
| `/welcome` | Personalized private guest welcome page |
| `/presentation` | Dedicated fullscreen TV slideshow with reservation-aware guest context |
| `/api/welcome` | GET/POST welcome endpoint |
| `/api/concierge` | Verified-information guest concierge endpoint |
| `/admin/login` | Admin sign-in |
| `/admin` | Portfolio operations dashboard |
| `/admin/calendar` | Availability and blocked inventory |
| `/admin/reservations` | Reservation lifecycle |
| `/admin/guests` | Guest records |
| `/admin/properties` | Multi-property CRUD |
| `/admin/units` | Unit and room inventory CRUD |
| `/admin/amenities` | Facility CRUD and public visibility |
| `/admin/finance` | Payments, refunds, and expenses |
| `/admin/tasks` | Housekeeping and operations tasks |
| `/admin/welcome` | Reservation-linked 20-language welcome, announcement, prayer-time, and audio workflow |
| `/admin/ai` | Encrypted BYOK provider settings and draft translation |
| `/admin/cms` | Public CMS overview, draft/publish and secondary CMS navigation |
| `/admin/cms/site` | Header, navigation, footer, and concierge chrome |
| `/admin/cms/home` | Homepage composition, copy, SEO, CTAs, and media |
| `/admin/cms/properties` | Property editorial pages, section order/visibility, SEO, and media |
| `/admin/cms/guides` | Local guide CRUD and indexability |
| `/admin/cms/brand-assets` | Brand-assets page copy, visibility, and reviewed media |
| `/offline` | Public offline fallback cached by the PWA |
| `/sw.js` | Versioned service worker with app-owned cache cleanup |
| `/api/health` | Deployment health probe |

## Local development

```bash
npm install --include=dev --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Public runtime values:

```env
NEXT_PUBLIC_SITE_URL=https://kamynaliving.com
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
```

Server-only credentials:

```env
KAMYNA_ADMIN_EMAIL=
KAMYNA_ADMIN_PASSWORD=
KAMYNA_ADMIN_SESSION_SECRET=
KAMYNA_CONVEX_ADMIN_SECRET=
KAMYNA_GUEST_LINK_SECRET=
KAMYNA_AI_ENCRYPTION_KEY=
```

`CONVEX_DEPLOY_KEY` is deployment-only and must never enter browser code or Docker build arguments.

## PWA and TV presentation

- The manifest uses a stable app identity, fullscreen-to-standalone fallback, phone/TV-safe orientation, 1024 px launcher assets, screenshots, and shortcuts.
- Private welcome links expose **TV mode** from the admin, which opens the dedicated `/presentation` route. The full-viewport `/welcome` page supports time-aware visual and opt-in voice announcements. The presentation supports fullscreen, remote/keyboard navigation, wake lock, an icon-only opt-in ambient-music control, safe-area layout, and reduced-motion fallback.
- The service worker never caches admin, API, or tokenized private welcome responses. It caches only public shell/media assets and `/offline`.
- A waiting worker auto-activates on public routes, removes obsolete `kamyna-pwa-*` caches and Kamyna-owned public client state, then reloads once. Admin routes require an explicit restart to avoid losing form work and preserve the signed HttpOnly session.
- Browser and TV operating-system install support varies. Compatible browsers receive a native Install action; unsupported browsers receive manual Add to Home screen guidance.

See `docs/PWA-TV.md` for the complete lifecycle and verification contract. Audio provenance and display controls are documented in `docs/AUDIO-LICENSES.md` and `docs/GUEST-EXPERIENCE-CONTROLS.md`.

## Navigation and concierge

- Public desktop keeps the editorial header navigation and adds only a floating concierge launcher at the lower-right.
- Public mobile replaces the burger menu with a safe-area bottom dock for Stays, Philosophy, About, Enquire, and Chat.
- Admin desktop uses a persistent grouped sidebar; admin mobile uses a safe-area dock plus a bounded “Lainnya” sheet for secondary modules.
- Kamyna Concierge is deterministic rather than generative: it answers only from verified property facts, never invents price or availability, does not retain conversations, and hands unresolved questions to the verified host contact.

## Data authority

- `shared/content/config/`: reviewed fallback snapshot used before CMS initialization or during backend interruption.
- `shared/cms/` + `convex/cms.ts`: atomic public draft/publish snapshot, validation, audit history, and publication cache invalidation.
- `shared/pms/`: operational enums, public types, date/form helpers, and verified seed facts.
- `shared/concierge/`: sanitized intent matching and verified concierge replies.
- `convex/pms/`: multi-property CRUD, availability rules, reporting, and public property reads.
- `shared/media/`: editorial image metadata and responsive variants.
- `shared/admin/`: server-only credentials and signed session helpers.
- `shared/welcome/`: 20-language templates, opaque guest tokens, reservation-linked welcome resolution.
- `shared/announcements/`: validated scheduling, greeting resolution, verified-coordinate prayer calculation, and audio settings contracts.
- `shared/ai/`: BYOK encryption, fixed provider adapters, and PII-free template translation.
- `shared/convex/`: server bridge to Convex public and protected surfaces. Published CMS content is cached for days and invalidated on Publish; public PMS facts are cached for hours and invalidated on operational writes.

Ruma Kamyna is initialized with 3 bedrooms, swimming pool, gym, jacuzzi, and mountain view. Bathrooms, capacity, rates, policies, and historical operations remain empty until real values are provided. Generated imagery keeps its visible concept disclosure.

## Quality gates

```bash
npm run verify
npm audit --omit=dev --audit-level=high
```

The repository enforces strict TypeScript, zero-warning ESLint, in-memory Convex CRUD tests, a 280-line source-file cap, complete slice metadata, committed generated bindings, stack pins, and secret-boundary tests.

## Deployment

Use the `/sc-all` hybrid topology: deploy the Convex Cloud backend first through `sc-convex-cloud`, seed verified property facts idempotently, then deploy the exact Git revision to Dokploy without replacing existing environment values.

See `docs/CMS.md`, `docs/PMS.md`, `docs/ADMIN-UX-PLAN.md`, `docs/GUEST-WELCOME-ADMIN.md`, and `docs/ARCHITECTURE.md`.
