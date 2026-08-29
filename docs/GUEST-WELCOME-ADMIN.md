# Reservation-linked guest welcome and BYOK translation

## Active surfaces

| Surface | Purpose | Indexing |
|---|---|---|
| `/api/welcome` | JSON welcome endpoint for a secure reservation token or legacy admin preview. | `noindex` response header |
| `/welcome` | Private reservation-linked guest page with language switching. | `noindex, nofollow` |
| `/admin/welcome` | Property selector, live reservation links, 20-language draft/publish editor. | Authenticated and `noindex` |
| `/admin/ai` | Encrypted BYOK provider configuration, provider test, and draft translation. | Authenticated and `noindex` |

## Language library

The welcome subsystem supports exactly 20 locales:

```text
id, en, ar, ja, zh-CN, ko, es, fr, de, pt,
it, nl, ru, tr, th, vi, hi, ms, fil, la
```

Arabic renders with `dir="rtl"`; every other current locale is LTR. Every language has reviewed fallback copy, a native label, localized guest-page controls, and the `{{guest}}` placeholder. Unsupported locale values fall back to the reservation locale, then Indonesian.

## Reservation integration

1. A guest profile may define `preferredLocale`.
2. A new reservation inherits that value, but the admin can override `welcomeLocale` for one stay.
3. `/admin/welcome` loads actual reservations and generates an opaque encrypted link for each eligible stay.
4. The token contains an encrypted reservation identifier, issue time, and expiry; it is authenticated with AES-256-GCM and expires 30 days after checkout.
5. `/welcome` verifies the token server-side, then reads a bounded context through a protected Convex action: guest name, property slug/name, optional unit, dates, status, and locale.
6. The property slug selects the correct welcome configuration, making the flow reusable for future Kamyna properties.

Raw reservation IDs, financial values, internal notes, guest contacts, and API secrets never appear in a guest token response.

Legacy preview remains available for authenticated editorial review:

```text
/welcome?property=ruma-kamyna&locale=ja&name=Guest
```

Production sharing should use the encrypted link shown beside an actual reservation.

## Draft and publish

- Save Draft updates only the private draft.
- Publish updates the guest-facing version and increments its version.
- Only one selected locale editor is rendered at a time; all 20 publication states remain visible.
- The property selector changes the `propertySlug` used by Convex.
- AI translations always write drafts with a `translate` audit event and never publish automatically.

## BYOK AI boundary

Supported fixed providers are OpenAI, OpenRouter, Anthropic, and Google Gemini. The admin supplies the provider, model, and API key.

```text
Browser form
  → authenticated Next.js Server Action
  → AES-256-GCM encryption using KAMYNA_AI_ENCRYPTION_KEY
  → protected Convex HTTP action
  → encryptedApiKey stored in aiProviderSettings
```

The browser receives only provider/model, enabled state, configured state, and a one-way key fingerprint. The encrypted key is fetched and decrypted only inside a server action when testing or translating.

The translation request contains only:

- source locale;
- headline, body, and signature;
- target locale metadata;
- the literal `{{guest}}` placeholder.

It does not contain guest names, emails, phone numbers, reservation IDs, dates, rates, notes, or other PMS records. Provider output must parse as JSON, contain each requested locale exactly once, pass existing content limits, and preserve `{{guest}}` before any draft is saved.

## Server-only environment

```env
KAMYNA_GUEST_LINK_SECRET=
KAMYNA_AI_ENCRYPTION_KEY=
```

Both values must be strong random secrets of at least 32 characters. They belong only in the Dokploy runtime environment, never in Docker build arguments, client bundles, Git, or Convex documents. Rotating the guest-link secret invalidates previously shared links. Rotating the AI encryption key requires re-entering the BYOK API key.

## TV presentation

Every reservation-linked welcome row includes a TV mode action. It preserves the encrypted token and appends `tv=1`, which starts the slideshow while keeping the guest context server-authoritative. Fullscreen remains an explicit browser gesture. The presentation never adds unverified property facts and keeps the visual-concept disclosure visible.

The same page exposes install guidance for compatible phone, desktop, and TV browsers. Details are documented in `docs/PWA-TV.md`.
