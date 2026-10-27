# Hospitality Operations Platform agent rules

## Start here

- Read `docs/AI-AGENT-ONBOARDING.md` before repository-wide work. Determine upstream vs tenant mode by the presence of `.platform/tenant.json`.
- In upstream mode, release/source metadata must remain provider-neutral and managed tenant routing must remain outside this repository.
- In tenant mode, prefer CMS/PMS/runtime configuration and keep provider source overrides inside protected tenant prefixes.

## Non-negotiable

- Keep core brand assets and collection identity copy location-neutral. Property pages and route SEO may use only owner-verified facts.
- Never place credentials, deploy keys, session secrets, or Convex admin secrets in `NEXT_PUBLIC_*`, browser components, logs, command arguments, Docker build arguments, or git history.
- Do not invent property photography, amenities, room counts, capacity, addresses, coordinates, prices, travel times, policies, or availability.
- Do not use compatibility placeholders, re-export-only legacy files, or duplicate sources of truth.
- The canonical product source is `rahmanef63/hospitality-operations-platform`; tenant repositories are independently owned deployment repositories, not alternate product sources of truth.
- Platform updates must be versioned and delivered as tested tenant pull requests. Never push platform updates directly to a tenant default branch.
- Tenant-owned paths declared in `.platform/distribution.json` are immutable from automated upstream sync. Core-code drift outside those paths must block one-click updates instead of being overwritten.
- Managed update commits must resolve `TENANT_DEPLOYMENT_ACTOR` to a real tenant GitHub user. Preserve that author by non-force fast-forwarding the tenant default branch to the exact verified update head; hosting deployment policy must never depend on an upstream developer seat.
- Do not deep-import another slice. Import only through its `index.ts` barrel.

## Architecture

- Next.js 16 + React 19 + Tailwind 4 frontend, deployable to Vercel or a compatible container runtime.
- Convex Cloud is the managed backend for CMS, welcome publishing, and multi-property operations.
- Consumer vertical slices live at `slices/<slug>/`; every slice owns `slice.json`, `slice.manifest.json`, `types.ts`, and `index.ts`.
- Static public copy remains in `shared/content/config/` and is consumed through the repository boundary.
- Welcome validation lives in `shared/welcome/`; PMS types and verified seeds live in `shared/pms/`; concierge knowledge lives in `shared/concierge/`; server authentication lives in `shared/admin/`; Next-to-Convex access lives in `shared/convex/`.
- Commit `convex/_generated/`. Regenerate it whenever Convex functions or schema change.

## Security

- Public Convex functions must be read-only and intentionally exposed. Admin reads and mutations must remain internal.
- Protected Convex HTTP actions must authorize inside the handler before calling internal functions.
- Every admin mutation also requires the signed Next.js session.
- Admin cookies stay HttpOnly, Secure in production, SameSite=Lax, path `/`, and bounded in lifetime.
- Login failure counters must remain atomic and distributed in Convex; never replace them with process memory.
- Sanitize guest names and validate all welcome content before storage and rendering.
- Keep PMS writes behind signed Server Actions and internal Convex functions. Preserve overlap checks, soft archives, and audit events.
- Never seed example guests, reservations, payments, expenses, tasks, revenue, rates, capacity, or policies.

## Homestay management

- Model properties, units, amenities, guests, reservations, availability blocks, transactions, and operational tasks as separate indexed tables.
- All PMS writes remain internal Convex mutations invoked through the authenticated `/admin/pms` HTTP action and a verified Next.js admin session.
- Use archive semantics for operational records; never hard-delete records from the UI.
- Check reservation and availability date ranges for overlap before writes.
- Store money as whole currency units, paired with an explicit ISO currency code. Never infer pricing from listings or competitors.
- Public property facts must come from active, published PMS records and fall back only to owner-verified static values. Never expose internal notes, financial fields, guest data, or operational tasks publicly.
- The upstream platform must not contain provider property facts or provider-specific seeds. Initial property data belongs only in protected tenant overlays or runtime administration.

## Concierge and navigation

- The public concierge may answer only from owner-verified property facts and configured official contact/location values. Unknown pricing, availability, capacity, policies, and travel facts must be explicitly handed off rather than inferred.
- Do not describe the deterministic concierge as a live human or external AI model. Do not persist public chat messages unless the owner explicitly requests a reviewed storage policy.
- Keep the public desktop header navigation unchanged; expose chat there only through the floating lower-right launcher.
- Public and admin mobile docks must respect all safe-area insets, keep controls at least 44px, avoid horizontal scrolling, and reserve page-bottom space so content is never obscured.
- Admin desktop keeps a persistent sidebar with visible module grouping and active-route state.

## Modularity and UI

- Keep source files at or below 280 lines; aim for 200 or fewer.
- Mobile-first, keyboard-accessible, semantic, and reduced-motion safe.
- Preserve the quiet editorial palette and typography without applying marketing scroll effects to operational forms.
- Use `next/link` for internal navigation and `next/image` for non-critical editorial media.
- Keep route metadata, canonical URLs, structured data, sitemap image discovery, Google verification, and guide noindex behavior intact.

## Verification

Before commit or deployment run:

```bash
bun run audit
bun run typecheck
bun run lint
bun run test
bun run build
```

For tenant platform updates, the tenant-owned apply workflow must revalidate the exact prepared PR, deploy Convex first, atomically merge that exact PR head, then wait for `/api/health` to report the exact frontend build revision. Never claim one-click completion when deployment credentials, Vercel promotion, or Convex access are unresolved.
