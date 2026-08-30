# Kamyna Living agent rules

## Non-negotiable

- Keep core brand assets and collection identity copy location-neutral. Property pages and route SEO may use only owner-verified facts.
- Never place credentials, deploy keys, session secrets, or Convex admin secrets in `NEXT_PUBLIC_*`, browser components, logs, command arguments, Docker build arguments, or git history.
- Do not invent property photography, amenities, room counts, capacity, addresses, coordinates, prices, travel times, policies, or availability.
- Do not use compatibility placeholders, re-export-only legacy files, or duplicate sources of truth.
- The canonical product source is `rahmanef63/hospitality-operations-platform`; tenant repositories are independently owned deployment repositories, not alternate product sources of truth.
- Platform updates must be versioned and delivered as tested tenant pull requests. Never push platform updates directly to a tenant default branch.
- Tenant-owned paths declared in `.platform/distribution.json` are immutable from automated upstream sync. Core-code drift outside those paths must block one-click updates instead of being overwritten.
- Do not deep-import another slice. Import only through its `index.ts` barrel.

## Architecture

- Next.js 16 + React 19 + Tailwind 4 frontend on Dokploy.
- Convex Cloud is active for welcome publishing and the multi-property homestay-management system.
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
- Ruma Kamyna seed facts are limited to 3 bedrooms, swimming pool, gym, jacuzzi, mountain view, and previously verified location/contact values.

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
npm run audit
npm run typecheck
npm run lint
npm run test
npm run build
```

For Convex changes, deploy the backend first, verify Cloud health and protected actions, then deploy the exact frontend revision. Completion requires production authentication, endpoint, draft/publish, responsive UI, health, and exact revision verification.
