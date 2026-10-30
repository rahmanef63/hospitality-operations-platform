# Platform update implementation progress

This document is the single source of truth for the Hospitality Operations Platform update-center backlog. Keep it provider-neutral: managed-provider identifiers belong only in the private updater control plane or tenant repositories.

## Target contract

A platform release must be safe for an AI-agent-operated tenant repository:

1. The canonical upstream remains provider-neutral and publishes a tested SemVer tag.
2. The private updater control plane prepares a tenant update PR without modifying protected overlays.
3. The tenant admin can see the installed version and a prepared update from `/admin/settings`.
4. **Update now** queues an exact tested update in tenant Convex; the tenant Actions worker dispatches the apply workflow with GitHub's short-lived repository token, so no updater credential is required in the browser or Vercel runtime.
5. The workflow revalidates the exact PR head, runs the full suite, deploys Convex first, non-force fast-forwards the exact verified head with a real Git push, then waits for the exact Vercel revision.
6. Public PWA clients activate the new frontend through the existing bounded cache/state cleanup lifecycle.
7. Major-version changes remain manual unless the release carries an explicit migration contract.

## Backlog

| Area | Status | Acceptance |
|---|---|---|
| Documentation consistency | Implemented | README, AGENTS, architecture, distribution docs and AI-agent onboarding agree on private control-plane routing and tenant-owned apply flow. |
| AI-agent onboarding | Implemented | Agents deterministically distinguish upstream vs tenant mode, protected overlays, release/update ownership, deployment order and recovery. |
| Admin platform settings | Verified end-to-end through `v0.1.14` | Preferred mode mirrors private-repo PR/check state through a tenant-owned scheduled Actions worker into Convex. The production admin form path was proven with `v0.1.13` and repeated for cleanup PR `#13` / `0.1.14`: the rendered **Update now** action queued the exact request before a worker dispatched Apply. No private GitHub credential is required in Vercel. |
| Tenant apply workflow | Verified through `v0.1.14` | Exact PR/check/base revalidation, full verify, Convex-first deploy, a non-force exact Git push, provider auto-deploy, and exact canonical health-revision verification completed successfully from the queued admin-button path without recovery deployment. |
| Health revision contract | Implemented | `/api/health` reports platform version and exact build revision. |
| Superseded update cleanup | Implemented | Newer tested platform PRs close older update PRs; resolved blocked-update issues do not remain actionable. |
| Environment contract updateability | Implemented | `.env.example` remains upstream-owned while real `.env*` runtime values remain untracked. |
| Unused surface hygiene | Verified in `v0.1.14` | Unreachable source, dead helpers/exports, stale direct dependencies, and slice-manifest dependency drift are removed in upstream and the managed tenant. TypeScript `noUnusedLocals` / `noUnusedParameters` plus manifest dependency detection now prevent the same drift from returning. |
| Real-tenant pre-release gate | Implemented | Release candidate is merged into a temporary managed-tenant clone; full verify must pass and protected-overlay hash must remain unchanged before release. |
| Tenant deployment actor | Implemented in `v0.1.7` | Private control plane resolves a real tenant GitHub user; update commits use its GitHub noreply identity. |
| Vercel native build portability | Verified | Container standalone and Vercel native Next output both build; Node 22 is pinned. |
| Vercel exact-SHA production build | Verified | Managed tenant exact SHA built and promoted successfully on tenant-owned Vercel without canonical-domain cutover. |
| Vercel persistent Git integration | Verified end-to-end | A tenant-owned Vercel project has a persistent GitHub link, production branch `main`, Node 22, and automatically created the exact `v0.1.11` production deployment from the tenant workflow push. |
| Vercel deployment-author policy | Verified | Update commits use the tenant deployment actor and Vercel accepts exact-SHA production builds from that actor. |
| Exact application strategy | Verified end-to-end | GitHub rebase merge was unsuitable for the history-preserving update PR. The tenant workflow performs a real non-force Git push of the exact verified head; linked-provider auto-deployment and final promotion are accepted only after exact health verification. |
| Tenant repository variables | Configured for canonical production | Deployment mode remains `git`. After the verified domain cutover, `HOSPITALITY_SITE_URL` was moved from the validation alias to `https://example.com`, so future Apply workflows verify the exact revision on the canonical production hostname. |
| Vercel custom domain | Verified in production | `example.com` and `www.example.com` are attached to the sole active Vercel target. The apex certificate was pre-generated with Vercel DNS-01 while traffic still used the VPS; both apex and `www` certificates are auto-renewing, strict hostname validation passes, Vercel reports `misconfigured=false`, and the temporary ACME TXT was removed after cutover. |
| Vercel runtime secrets | Verified public-config-only in production | Admin credentials/session signing, guest-link crypto, BYOK AI encryption, and update-worker auth terminate in Convex. The linked Vercel project intentionally remains public-config-only; the legacy private values were transferred directly VPS → tenant Convex without printing their values, and authenticated `v0.1.12` / `v0.1.13` Vercel smoke passed. |
| Vercel project consolidation | Verified and cleaned | `<hosting-project>` is the sole active canonical-domain project. The two previously paused non-target projects were revalidated as custom-domain-free and permanently removed; lookups now return `404 Project not found`. |
| Canonical-domain cutover | Verified in production | After the first attempt was safely rolled back, the apex certificate was pre-generated and strict-tested on both recommended Vercel edge IPs before DNS moved. <dns-provider> authoritative DNS now uses the exact Vercel rank-1 apex A pair and `www` CNAME; Cloudflare and Google resolvers agree, canonical exact-health/authenticated CMS/PMS/PWA smoke passes, and `www` redirects 308 to apex. |
| Legacy VPS/Dokploy retirement | Intentionally retained as rollback | Canonical production traffic is now on Vercel. The legacy VPS no longer owns authoritative routing, but direct SNI/TLS + `/api/health` against `<legacy-vps-ip>` still pass, so it is deliberately kept intact as an immediate DNS rollback target until a later retirement window. |
| Dynamic catch-all routing | Deferred until cloud cutover | Design and implement tenant-aware dynamic catch-all endpoints only after Vercel/Convex ownership, env contracts, and canonical routing are stable. |
| Convex management access | Partially blocked | Existing production deploy key is valid and securely installed as the tenant GitHub Actions secret, but Convex Management API still returns `401 MissingAccessToken`, so ownership/project management remains blocked there. |
| Convex private-runtime ownership | Verified in production | Generic admin auth/session verification, guest-link encryption, BYOK AI secret crypto/provider execution, and update-worker auth are Convex-owned. Next/Vercel sees opaque sessions/results only. `v0.1.12`, queue-triggered `v0.1.13`, and cleanup `v0.1.14` Apply all deployed production Convex successfully. |
| Production one-click proof | Verified end-to-end through `v0.1.14` | The rendered `/admin/settings` form path first proved queue isolation with `v0.1.13` and repeated it for PR `#13` / `0.1.14`: no new Apply existed before queue consumption, then Apply `<run-id>` completed full verify → Convex deploy → exact non-force Git push → linked Vercel canonical exact-health verification. |

## Verification log

Detailed provider-specific run logs (deployment IDs, workflow run IDs, DNS records, tenant commit SHAs) are kept in the private tenant/control-plane records, not in this public repository. Summary:

- 2026-08-30: Upstream releases through `v0.1.7` remain provider-neutral and pass release-contract gates; `v0.1.6` bootstrapped Update Center into a managed tenant after full upstream and real-tenant verification.
- 2026-08-31: Real-tenant pre-release gates for `v0.1.11`?`v0.1.14` confirmed zero tenant core drift, zero upstream protected-path changes, and byte-identical protected overlays; merged tenant simulations passed the full test suite, production build, and dependency audit.
- 2026-08-31: Tenant Apply workflows completed full verify ? Convex deploy ? exact non-force Git push ? linked hosting exact-revision verification for `v0.1.12`, `v0.1.13`, and `v0.1.14`.
- 2026-08-31: The rendered `/admin/settings` **Update now** action was proven to queue (not directly dispatch) updates; the tenant queue worker consumed requests and created Apply runs.
- 2026-08-31: Production deploy credentials were transferred into the tenant CI secret store without printing values. The hosting runtime remains public-config-only; private runtime secrets terminate in Convex.
- 2026-08-31: Hosting project consolidation left one active canonical project; unused projects were verified custom-domain-free before removal.
- 2026-08-31: Canonical-domain cutover completed after one safe rollback: the apex certificate was pre-issued via DNS-01, DNS moved to the hosting provider records, public resolvers converged, strict TLS + exact-health + authenticated smoke passed, and `www` redirects 308 to apex. The legacy VPS is retained only as a rollback origin.
- 2026-08-31: Post-cutover cleanup removed unused code, exports, and direct dependencies; slice dependency manifests are now audited. Stale merged branches and worktrees were removed after verification.

## Release state

Current released upstream baseline: `v0.1.14`.

Current managed-tenant installed baseline: `v0.1.14`.

Current release candidate: none. `v0.1.14` is released and installed on the managed tenant.

The full admin-originated update and canonical Vercel paths remain verified through cleanup release `v0.1.14`. Infrastructure cleanup leaves one Vercel project, two tenant Git branches (`main` plus unique archival history), one upstream worktree, and the legacy VPS intentionally retained only as a verified rollback origin. Two local upstream branches with unique unmerged history remain deliberately retained rather than misclassified as unused.
