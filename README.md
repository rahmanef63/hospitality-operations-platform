# Kamyna Living

Location-neutral hospitality website for the Kamyna collection, with **Ruma Kamyna** as the first property experience.

## Current scope

- Next.js 16 App Router, React 19, Tailwind CSS 4, strict TypeScript.
- Static content repository; no database, auth, or booking backend is active.
- Multi-property data model ready for a future Convex/CMS adapter.
- Production SVG logos, favicon, Apple touch icon, and PWA icons.
- Docker standalone build for Dokploy.
- Domain target: `kamynaliving.com`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Kamyna Living collection homepage |
| `/stays/ruma-kamyna` | Reusable property detail route |
| `/brand-assets` | Separate production asset downloads |
| `/api/health` | Deployment health probe |

## Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

## Quality gates

```bash
npm run audit
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run verify` runs architecture audits, typecheck, lint, tests, and the production build. The project also enforces a 280-line source-file cap, slice metadata pairs, stack pins, internal navigation rules, and location-neutral core brand copy.

## Content editing

Static content lives in `shared/content/config/`. Components consume typed props through `shared/content/repository.ts`; they do not import individual copy files directly.

To add a property now:

1. Add one `PropertyContent` record to `shared/content/config/properties.ts`.
2. Add any property-specific brand assets under `public/brand/`.
3. Run `npm run verify`.

The route is generated from the property slug automatically.

## Database later

The `ContentRepository` interface is the stable boundary. A future database adapter can implement the same methods and replace `StaticContentRepository` without changing page or slice components. See `docs/DATABASE-READINESS.md`.

## Deployment

Deployment is orchestrated through the trusted `/sc-all` workflow:

```bash
node ~/projects/opensource/si-coder-agent/scripts/deploy.js \
  --project "Kamyna Living" \
  --app "kamyna-living" \
  --domain "kamynaliving.com" \
  --target dokploy
```

Secrets are read from the managed environment and must never be added to the repository or command arguments.
