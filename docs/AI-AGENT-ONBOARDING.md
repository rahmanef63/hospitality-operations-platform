# AI agent onboarding

This repository is designed to be operated by AI coding agents without confusing the canonical product with a provider deployment. Determine the repository role **before changing code**.

## 1. Determine repository mode

```text
.platform/tenant.json exists?
├─ no  → UPSTREAM MODE
└─ yes → TENANT MODE
```

Also read `.platform/product.json`, `.platform/distribution.json`, `AGENTS.md`, and this document before making repository-wide changes.

### Upstream mode

The checkout is the canonical Hospitality Operations Platform product source.

- Never add a provider name, property fact, logo, address, contact detail, rate, policy, reservation, guest, or provider deployment identifier to product source or release metadata.
- Product changes belong in generic `app/`, `slices/`, `shared/`, `convex/`, tests, scripts, and documentation.
- Keep the default `tenant/` implementation generic and empty of real business facts.
- Do not add managed tenant routing to this repository. Tenant routing belongs only in the private updater control plane.
- A product release requires a SemVer bump, full verification, a matching `vX.Y.Z` tag, and provider-neutral release notes.

### Tenant mode

The checkout is an independently owned provider deployment.

- `.platform/tenant.json` defines tenant identity and update channel.
- `.platform/tenant.lock.json` records the installed upstream tag/commit.
- Prefer runtime administration: CMS for public editorial composition, PMS for operational facts, Convex for business state, and environment variables for deployment configuration.
- Provider-owned source customization belongs only in prefixes listed under `tenantProtectedPrefixes` in `.platform/distribution.json`.
- Do not edit product core merely to change branding/content. Core drift outside protected overlays deliberately blocks automated updates.
- Never copy/paste upstream commits into tenant `main`. Receive platform changes through `platform/update-vX.Y.Z` PRs.

## 2. Source-of-truth map

| Concern | Source of truth |
|---|---|
| Product code and schemas | Canonical upstream release |
| Provider identity/static fallback | Protected `tenant/` and `public/tenant/` overlays |
| Public authored content | Tenant CMS draft/published snapshot |
| Property/unit/amenity truth | Tenant PMS/Convex |
| Reservations/guests/finance/tasks | Tenant Convex only |
| Private app runtime secrets | Tenant Convex environment; Vercel normally holds public configuration only |
| Deployment/workflow secrets | Tenant GitHub Actions secrets; runtime `.env*` stays untracked |
| Installed platform version | Tenant package version plus `.platform/tenant.lock.json` |
| Environment variable names/examples | Upstream `.env.example` (values remain tenant secrets) |
| Managed tenant routing | Private updater control plane, never upstream |

## 3. Safe change decision tree

```text
Need to change something?
├─ provider copy/media/navigation → CMS first; protected tenant overlay only for reviewed fallback
├─ property facts/operations      → PMS/Convex
├─ private app secret             → Convex environment
├─ deployment/workflow secret     → tenant GitHub Actions
├─ public domain/config           → deployment environment
├─ generic reusable behavior      → upstream product PR
└─ emergency tenant-only core fix → document the intentional drift; expect automated updates to block
```

If a change could be expressed through an existing CMS/PMS/config surface, do not hardcode it in JSX or generic Convex seed data.

## 4. Platform release flow

Upstream agents must use this sequence:

1. Implement generic changes on a branch.
2. Run `npm run verify`, dependency audit, `git diff --check`, and tenant-boundary audits.
3. Update the progress/release documentation when the change affects platform contracts.
4. Merge through reviewed CI.
5. Bump `.platform/product.json`, `package.json`, and lockfile together with `npm run platform:version -- X.Y.Z`.
6. Push the matching `vX.Y.Z` tag only after `main` is exact and clean.
7. The release workflow publishes generic notes and dispatches the private updater control plane.
8. Never write directly to a tenant default branch from the upstream release job.

Patch/minor releases must remain backward-compatible with the currently deployed tenant frontend while Convex is updated first. Major releases require an explicit migration plan and are not eligible for blind one-click application.

## 5. Tenant update flow

A managed tenant update is intentionally two-stage:

```text
upstream release
  → private updater prepares tested tenant PR
  → tenant Actions worker mirrors tested PR/check state into Convex
  → tenant admin sees prepared version in /admin/settings
  → Update now queues exact PR/version in Convex
  → tenant worker dispatches tenant-owned apply workflow with short-lived GITHUB_TOKEN
  → verify exact PR head
  → deploy Convex
  → non-force fast-forward default branch to that exact verified PR head
  → Vercel promotes the exact advanced revision
  → /api/health confirms exact build revision
```

The browser never receives GitHub, Convex, or Vercel credentials. Next/Vercel does not need a private GitHub credential in preferred queue mode; authenticated admin actions use an opaque Convex-signed cookie and the tenant worker consumes tenant-owned repository secrets.

If a newer update supersedes an older open platform PR, the updater should close the older PR. If core drift, protected-path changes, or merge conflicts are detected, automation must stop and create a review signal rather than overwriting tenant work.

### Existing-tenant bootstrap

A tenant that predates the Update Center cannot use `/admin/settings` to install the very release that introduces `/admin/settings`. Apply that first compatible release once through the same verified Convex-first workflow/controlled merge path. Future releases then use the tenant admin button normally.

## 6. Deployment contract

Tenant repositories own their deployment credentials and data.

Required GitHub repository secrets for coordinated updates:

- `CONVEX_DEPLOY_KEY` — production deploy key for that tenant only.
- `HOSPITALITY_UPDATE_WORKFLOW_TOKEN` — random worker token shared only with the same tenant Convex deployment.

Required repository variables:

- `HOSPITALITY_SITE_URL` — canonical production origin used for exact health verification.
- `HOSPITALITY_VERCEL_MODE` — `git` when Vercel auto-deploys tenant `main`, or `hook` when a deployment hook is used.
- `HOSPITALITY_CONVEX_SITE_URL` — tenant `*.convex.site` origin used by the Actions worker.
- `deploymentActor` — private updater control-plane GitHub login for a real tenant deployment user; the updater exports it as `TENANT_DEPLOYMENT_ACTOR` while preparing the PR.

Required Convex runtime secrets:

- admin email/password/session signing secret;
- guest-link signing/encryption secret;
- BYOK AI encryption secret;
- the matching `HOSPITALITY_UPDATE_WORKFLOW_TOKEN`.

Conditional GitHub secret:

- `VERCEL_DEPLOY_HOOK_URL` — required only for `HOSPITALITY_VERCEL_MODE=hook`.

Optional direct Next dispatch can use a tenant-owned GitHub App or fine-grained token, but preferred queue mode requires neither in Vercel. Never prefix credentials with `NEXT_PUBLIC_`.

## 7. Failure and recovery rules

- **PR checks fail:** do not dispatch apply; fix/rebuild the update branch.
- **Core drift detected:** move legitimate provider changes into protected overlays or consciously maintain a divergent tenant.
- **Convex deploy fails:** do not merge the PR.
- **Exact PR head changed after validation:** abort; never merge an unverified SHA.
- **Vercel build fails after merge:** previous production deployment should remain active; investigate before retry. Backend changes in patch/minor releases must be backward-compatible.
- **Health revision does not match merge SHA:** treat promotion as incomplete even if Vercel reports a successful build.
- **Major release:** stop one-click flow and follow the release-specific migration document.

## 8. Required verification

For code changes:

```bash
npm run verify
npm audit --omit=dev --audit-level=high
git diff --check
```

For platform/update changes also verify:

- upstream contains no provider-specific literals or managed tenant registry;
- tenant protected overlays are untouched by generated update PRs;
- update PR CI is green and mergeable;
- Convex deploy occurs before merge/frontend promotion;
- `/api/health` reports the exact promoted build revision;
- PWA public clients activate the new build with bounded app-owned cleanup.

See `docs/PLATFORM-DISTRIBUTION.md` for the distribution protocol and `docs/PLATFORM-UPDATE-PROGRESS.md` for the current implementation state.
