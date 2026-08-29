# Kamyna Living

Multi-property hospitality website and homestay-management system for the Kamyna collection. **Ruma Kamyna** in Megamendung, Puncak Bogor is the first active property; the brand identity remains location-neutral for future properties.

## Runtime

- Next.js 16 App Router, React 19, Tailwind CSS 4, strict TypeScript.
- Static-first marketing content with dynamic owner-verified property facts.
- Convex Cloud for properties, units, amenities, guests, reservations, availability, finance, tasks, 20-language welcome publishing, encrypted BYOK AI metadata, login throttling, and audit history.
- Signed server-only single-admin session using an HttpOnly cookie.
- Docker standalone frontend on Dokploy; managed Convex Cloud backend.
- Location-aware SEO, canonical/hreflang links, image sitemap, structured data, social cards, and Google verification.

## Routes

| Route | Purpose |
|---|---|
| `/` | Kamyna Living collection homepage |
| `/stays/ruma-kamyna` | Dynamic Ruma Kamyna property detail |
| `/brand-assets` | Production identity downloads |
| `/guides/*` | Noindex local-guide scaffolds |
| `/welcome` | Personalized private guest welcome page |
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
| `/admin/welcome` | Reservation-linked 20-language welcome workflow |
| `/admin/ai` | Encrypted BYOK provider settings and draft translation |
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

## Navigation and concierge

- Public desktop keeps the editorial header navigation and adds only a floating concierge launcher at the lower-right.
- Public mobile replaces the burger menu with a safe-area bottom dock for Stays, Philosophy, About, Enquire, and Chat.
- Admin desktop uses a persistent grouped sidebar; admin mobile uses a safe-area dock plus a bounded “Lainnya” sheet for secondary modules.
- Kamyna Concierge is deterministic rather than generative: it answers only from verified property facts, never invents price or availability, does not retain conversations, and hands unresolved questions to the verified host contact.

## Data authority

- `shared/content/config/`: stable marketing copy and draft guides.
- `shared/pms/`: operational enums, public types, date/form helpers, and verified seed facts.
- `shared/concierge/`: sanitized intent matching and verified concierge replies.
- `convex/pms/`: multi-property CRUD, availability rules, reporting, and public property reads.
- `shared/media/`: editorial image metadata and responsive variants.
- `shared/admin/`: server-only credentials and signed session helpers.
- `shared/welcome/`: 20-language templates, opaque guest tokens, reservation-linked welcome resolution.
- `shared/ai/`: BYOK encryption, fixed provider adapters, and PII-free template translation.
- `shared/convex/`: server bridge to Convex public and protected surfaces.

Ruma Kamyna is initialized with 3 bedrooms, swimming pool, gym, jacuzzi, and mountain view. Bathrooms, capacity, rates, policies, and historical operations remain empty until real values are provided. Generated imagery keeps its visible concept disclosure.

## Quality gates

```bash
npm run verify
npm audit --omit=dev --audit-level=high
```

The repository enforces strict TypeScript, zero-warning ESLint, in-memory Convex CRUD tests, a 280-line source-file cap, complete slice metadata, committed generated bindings, stack pins, and secret-boundary tests.

## Deployment

Use the `/sc-all` hybrid topology: deploy the Convex Cloud backend first through `sc-convex-cloud`, seed verified property facts idempotently, then deploy the exact Git revision to Dokploy without replacing existing environment values.

See `docs/PMS.md`, `docs/ADMIN-UX-PLAN.md`, `docs/GUEST-WELCOME-ADMIN.md`, and `docs/ARCHITECTURE.md`.
