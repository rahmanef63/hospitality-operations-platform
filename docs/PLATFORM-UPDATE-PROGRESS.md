# Platform update implementation progress

This document is the single source of truth for the Hospitality Operations Platform update-center backlog. Keep it provider-neutral: managed-provider identifiers belong only in the private updater control plane or tenant repositories.

## Target contract

A platform release must be safe for an AI-agent-operated tenant repository:

1. The canonical upstream remains provider-neutral and publishes a tested SemVer tag.
2. The private updater control plane prepares a tenant update PR without modifying protected overlays.
3. The tenant admin can see the installed version and a prepared update from `/admin/settings`.
4. **Update now** dispatches a tenant-owned workflow; no updater credential is sent to the browser.
5. The workflow revalidates the exact PR head, runs the full suite, deploys Convex first, atomically merges that exact PR, then waits for the exact Vercel revision.
6. Public PWA clients activate the new frontend through the existing bounded cache/state cleanup lifecycle.
7. Major-version changes remain manual unless the release carries an explicit migration contract.

## Backlog

| Area | Status | Acceptance |
|---|---|---|
| Documentation consistency | Implemented | README, AGENTS, architecture, distribution docs and AI-agent onboarding agree on private control-plane routing and tenant-owned apply flow. |
| AI-agent onboarding | Implemented | Agents deterministically distinguish upstream vs tenant mode, protected overlays, release/update ownership, deployment order and recovery. |
| Admin platform settings | Implemented and bootstrapped | Managed tenants at `v0.1.6+` include `/admin/settings` with installed/prepared version and safe Update now state. |
| Tenant apply workflow | Implemented | Exact PR/check revalidation, full verify, Convex-first deploy, exact rebase merge and health-revision verification are encoded in the tenant workflow. |
| Health revision contract | Implemented | `/api/health` reports platform version and exact build revision. |
| Superseded update cleanup | Implemented | Newer tested platform PRs close older update PRs; resolved blocked-update issues do not remain actionable. |
| Environment contract updateability | Implemented | `.env.example` remains upstream-owned while real `.env*` runtime values remain untracked. |
| Real-tenant pre-release gate | Implemented | Release candidate is merged into a temporary managed-tenant clone; full verify must pass and protected-overlay hash must remain unchanged before release. |
| Tenant deployment actor | Candidate `v0.1.7` | Updater resolves a real tenant GitHub user and authors update commits with its GitHub noreply identity; apply rebase preserves that author for hosting policies. |
| Vercel native build portability | Verified | Container standalone and Vercel native Next output both build; Node 22 is pinned. |
| Vercel exact-SHA production build | Verified | A managed tenant exact main SHA built and promoted successfully on a tenant-owned Vercel project without canonical-domain cutover. |
| Vercel persistent Git integration | Verified | A separate tenant-owned project is linked to the private tenant repo and branch pushes automatically create deployments. |
| Vercel deployment-author policy | Verified / candidate fix | Non-tenant authors are blocked; a tenant owner author is accepted and reaches READY. `v0.1.7` generalizes this as `deploymentActor`. |
| Vercel custom domain | Pending cutover | Canonical domain remains on the current production runtime until full tenant secrets/backend migration and smoke tests pass. |
| Vercel runtime secrets | Pending | Public URLs are present; admin/update server-only credentials must be migrated/rotated before canonical cutover. |
| Convex control-plane access | Blocked externally | Connected account metadata is ACTIVE but Convex Management API still returns `401 MissingAccessToken`; no tenant deploy key can be provisioned through that connection yet. |
| Production one-click proof | Pending external credentials | Code path is implemented; proof requires a usable tenant Convex deploy credential plus server-side GitHub update dispatch credential and final Vercel/domain configuration. |

## Verification log

- 2026-08-30: Upstream releases through `v0.1.6` remain provider-neutral and pass release-contract gates.
- 2026-08-30: `v0.1.6` passed full upstream verification and a full temporary merge/verify against the real managed tenant; 24 test files / 95 tests passed and protected-overlay hash was unchanged.
- 2026-08-30: Private updater produced a clean CI-green `v0.1.6` tenant PR, closed the superseded older PR, and the tenant bootstrap merge installed Update Center on tenant `main`.
- 2026-08-30: Tenant `main` exact SHA built on Vercel with Node 22 and native Next output; `/api/health` returned the exact SHA and `platformVersion: 0.1.6`. Canonical domain was not moved.
- 2026-08-30: A Git-connected tenant Vercel project was created separately. Branch pushes triggered Vercel automatically. Commits by a user outside the tenant Vercel team were blocked; the same probe authored by the tenant GitHub owner reached READY.
- 2026-08-30: Candidate `v0.1.7` adds the generic tenant `deploymentActor` author contract and switches exact apply merge to rebase so hosting author identity survives promotion.
- 2026-08-30: Exact `v0.1.7` candidate passed full real-tenant simulation: update commit author resolved to the tenant GitHub deployment user, 24 test files / 95 tests passed, production build passed, and protected-overlay hash remained unchanged.
- 2026-08-30: Convex Composio token details and deploy-key listing both still fail with `401 MissingAccessToken`; production one-click backend proof remains blocked on a valid Convex management/deploy credential.

## Release state

Current released upstream baseline: `v0.1.6`.

Current release candidate: `v0.1.7` — tenant deployment-actor authorship and rebase promotion contract.

`v0.1.7` is not released until upstream full verification, real-tenant temporary merge/full verify, hosted CI, private updater success, tenant PR CI, and Vercel preview author verification pass.
