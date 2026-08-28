# Guest welcome and admin operations

## Active surfaces

| Surface | Purpose | Indexing |
|---|---|---|
| `/api/welcome` | Guest welcome JSON endpoint. Accepts GET query parameters or POST JSON. | API and `noindex` response header |
| `/welcome` | Private guest-facing welcome page with optional personalization. | `noindex, nofollow` |
| `/admin/login` | Admin credential entry. | `noindex, nofollow` |
| `/admin` | Draft, preview, publish, and activity dashboard. | Authenticated and `noindex, nofollow` |

## Public endpoint contract

GET:

```text
/api/welcome?locale=id&name=Rahman
```

POST:

```json
{
  "locale": "en",
  "name": "Rahman"
}
```

`locale` accepts `id` or `en`; unsupported values fall back to Indonesian. `name` is optional, normalized, stripped of markup, and capped at 80 characters. The response always uses `Cache-Control: no-store`. When Convex Cloud is temporarily unavailable, the endpoint serves the reviewed static welcome copy and identifies the source as `fallback`.

## Data model

Convex Cloud owns three bounded tables:

- `welcomeConfigs`: one document per property and locale, with separate draft and published fields.
- `adminLoginAttempts`: distributed login throttling by HMAC request fingerprint.
- `adminAuditEvents`: recent seed, save, and publish events without storing raw admin email.

Only `welcome.getPublished` is part of the public Convex API. Admin reads and mutations are internal functions reached through authenticated Convex HTTP actions. The shared static property/content repository remains authoritative for the marketing website and property facts.

## Authentication

The single-admin login uses server-only environment values:

```env
KAMYNA_ADMIN_EMAIL=
KAMYNA_ADMIN_PASSWORD=
KAMYNA_ADMIN_SESSION_SECRET=
KAMYNA_CONVEX_ADMIN_SECRET=
```

The password is never included in browser JavaScript or Docker build arguments. Successful login creates a signed, 12-hour, HttpOnly, Secure, SameSite=Lax cookie. Login failures are recorded atomically in Convex Cloud; five failures within fifteen minutes lock the request fingerprint for fifteen minutes.

Next.js calls protected Convex HTTP actions with `KAMYNA_CONVEX_ADMIN_SECRET` in an HTTPS Authorization header. The static secret is not sent as a query or mutation argument. Convex stores the same secret as a deployment environment variable.

## Publishing flow

1. Sign in at `/admin/login`.
2. Edit Indonesian or English copy. Use `{{guest}}` where the optional guest name should appear.
3. **Save draft** updates only the private draft.
4. **Publish** copies the validated draft into public fields and increments its version.
5. `/api/welcome` and `/welcome` read only the published fields.

Room counts, capacity, facilities, prices, policies, and all other property facts remain outside this feature and continue to follow `RUMA-KAMYNA-CONTENT-TODO.md`.

## Deployment

The production topology is hybrid:

```text
Browser / guest
      ↓
Next.js on Dokploy
      ├── static marketing repository
      └── server-only Convex client / protected HTTP actions
                         ↓
                 Convex Cloud
```

Convex source and generated bindings are committed under `convex/`. Deploy the backend with the trusted `sc-convex-cloud` backend-only path, then deploy the Dokploy frontend with all existing environment values preserved. `CONVEX_DEPLOY_KEY` is deployment-only and must never be copied into Docker build arguments.
