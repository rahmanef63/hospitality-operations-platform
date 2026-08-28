# Kamyna Living agent rules

## Non-negotiable

- Keep core brand assets and collection identity copy location-neutral. Property pages and route SEO may use only owner-verified facts.
- Never place credentials, deploy keys, session secrets, or Convex admin secrets in `NEXT_PUBLIC_*`, browser components, logs, command arguments, Docker build arguments, or git history.
- Do not invent property photography, amenities, room counts, capacity, addresses, coordinates, prices, travel times, policies, or availability.
- Do not use compatibility placeholders, re-export-only legacy files, or duplicate sources of truth.
- Do not deep-import another slice. Import only through its `index.ts` barrel.

## Architecture

- Next.js 16 + React 19 + Tailwind 4 frontend on Dokploy.
- Convex Cloud is active only for guest welcome content, admin rate limiting, and audit history.
- Consumer vertical slices live at `slices/<slug>/`; every slice owns `slice.json`, `slice.manifest.json`, `types.ts`, and `index.ts`.
- Static public copy remains in `shared/content/config/` and is consumed through the repository boundary.
- Welcome validation and defaults live in `shared/welcome/`; server authentication lives in `shared/admin/`; Next-to-Convex access lives in `shared/convex/`.
- Commit `convex/_generated/`. Regenerate it whenever Convex functions or schema change.

## Security

- Public Convex functions must be read-only and intentionally exposed. Admin reads and mutations must remain internal.
- Protected Convex HTTP actions must authorize inside the handler before calling internal functions.
- Every admin mutation also requires the signed Next.js session.
- Admin cookies stay HttpOnly, Secure in production, SameSite=Lax, path `/`, and bounded in lifetime.
- Login failure counters must remain atomic and distributed in Convex; never replace them with process memory.
- Sanitize guest names and validate all welcome content before storage and rendering.

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
