# Kamyna Living

Multi-property hospitality website for the Kamyna collection, with **Ruma Kamyna** in Megamendung, Puncak Bogor as the first verified property. Core identity assets remain location-neutral.

## Runtime

- Next.js 16 App Router, React 19, Tailwind CSS 4, strict TypeScript.
- Static content repository for the public marketing and property pages.
- Convex Cloud for localized guest-welcome publishing, login throttling, and admin audit events.
- Signed server-only admin session using an HttpOnly cookie.
- Docker standalone frontend on Dokploy; managed Convex Cloud backend.
- Location-aware SEO, canonical/hreflang links, image sitemap, structured data, social cards, and Google verification.

## Routes

| Route | Purpose |
|---|---|
| `/` | Kamyna Living collection homepage |
| `/stays/ruma-kamyna` | Ruma Kamyna property detail |
| `/brand-assets` | Production identity downloads |
| `/guides/*` | Noindex local-guide scaffolds |
| `/welcome` | Personalized, private guest welcome page |
| `/api/welcome` | GET/POST JSON welcome endpoint |
| `/admin/login` | Admin sign-in |
| `/admin` | Draft, preview, publish, and activity dashboard |
| `/api/health` | Deployment health probe |

## Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Required public runtime variables:

```env
NEXT_PUBLIC_SITE_URL=https://kamynaliving.com
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
```

Admin credentials and inter-service authorization are server-only:

```env
KAMYNA_ADMIN_EMAIL=
KAMYNA_ADMIN_PASSWORD=
KAMYNA_ADMIN_SESSION_SECRET=
KAMYNA_CONVEX_ADMIN_SECRET=
```

`CONVEX_DEPLOY_KEY` is used only by deployment tooling. It must never be placed in browser code or Docker build arguments.

## Quality gates

```bash
npm run audit
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run verify` runs all gates. The repository enforces a 280-line source-file cap, complete slice metadata, committed Convex bindings, stack pins, internal navigation rules, and location-neutral core identity assets.

## Content authority

- `shared/content/config/`: public static marketing, property, and draft-guide content.
- `shared/media/`: all editorial image metadata and responsive variants.
- `convex/`: welcome drafts/publication, admin rate limiting, and audit events.
- `shared/welcome/`: framework-independent validation, defaults, and personalization.
- `shared/admin/`: server-only credentials and signed session helpers.

Generated property imagery remains explicitly labeled as a visual concept. Unverified room, capacity, facility, pricing, and policy facts remain listed in `docs/RUMA-KAMYNA-CONTENT-TODO.md`.

## Deployment

Use the `/sc-all` hybrid topology: Convex Cloud backend plus Dokploy frontend. The backend is deployed through `sc-convex-cloud`; the frontend deployment must preserve every existing Dokploy environment value and copy only public/build-time values into Docker build arguments.

See `docs/GUEST-WELCOME-ADMIN.md` and `docs/ARCHITECTURE.md` for the security and publishing model.
