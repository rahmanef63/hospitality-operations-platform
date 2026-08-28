# Kamyna Living agent rules

## Non-negotiable

- Keep core brand assets and collection copy location-neutral.
- Do not add Convex, auth, CMS, forms, or a booking backend until explicitly requested.
- Never place secrets in `NEXT_PUBLIC_*`, source files, logs, or git history.
- Do not use compatibility placeholders, re-export-only legacy files, or duplicate SSOTs.
- Do not deep-import another slice. Import only through its `index.ts` barrel.

## Architecture

- Next.js 16 + React 19 + Tailwind 4.
- Consumer vertical slices live at `slices/<slug>/`.
- Every slice owns `slice.json`, `slice.manifest.json`, `types.ts`, and `index.ts`.
- Shared brand primitives live in `shared/brand/`.
- Shared content types and repository adapters live in `shared/content/`.
- Static copy belongs in `shared/content/config/`, never inside JSX.
- Portable components receive URLs and copy through props.

## Modularity

- Keep source files at or below 280 lines; aim for 200 lines or less.
- Extract meaningful components, config, utilities, and types instead of creating forwarding files.
- Delete obsolete files and update all imports when refactoring.

## UI and accessibility

- Mobile-first, keyboard-accessible, reduced-motion safe, and semantic.
- Use `next/link` for internal navigation and `next/image` for non-critical raster/SVG elements. A pre-generated responsive `<img srcset>` is allowed only for a measured LCP hero and must remain typed through `shared/media/`.
- Do not invent property photography, amenities, addresses, or booking availability.
- Preserve the quiet editorial system: ivory, warm sand, taupe, muted brown, olive, charcoal.
- Preserve route-level metadata, canonical URLs, structured data, sitemap image discovery, and exact Google verification coverage when adding pages.

## Verification

Before commit or deployment run:

```bash
npm run audit
npm run typecheck
npm run lint
npm run test
npm run build
```

A task is not complete until the live domain, HTTPS, health endpoint, responsive layout, and exact deployed revision are independently verified.
