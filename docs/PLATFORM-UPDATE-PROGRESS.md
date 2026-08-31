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
| Admin platform settings | Implemented in `v0.1.12` candidate; live queue proof pending | Preferred mode mirrors private-repo PR/check state through a tenant-owned scheduled Actions worker into Convex. **Update now** queues the exact PR/version in Convex and requires no private GitHub credential in Vercel. Tenant-owned GitHub App / fine-grained-token direct dispatch remains optional fallback. |
| Tenant apply workflow | Verified through `v0.1.11` | Exact PR/check/base revalidation, full verify, Convex-first deploy, a non-force exact Git push, provider auto-deploy, and exact health-revision verification completed successfully without recovery deployment. |
| Health revision contract | Implemented | `/api/health` reports platform version and exact build revision. |
| Superseded update cleanup | Implemented | Newer tested platform PRs close older update PRs; resolved blocked-update issues do not remain actionable. |
| Environment contract updateability | Implemented | `.env.example` remains upstream-owned while real `.env*` runtime values remain untracked. |
| Real-tenant pre-release gate | Implemented | Release candidate is merged into a temporary managed-tenant clone; full verify must pass and protected-overlay hash must remain unchanged before release. |
| Tenant deployment actor | Implemented in `v0.1.7` | Private control plane resolves a real tenant GitHub user; update commits use its GitHub noreply identity. |
| Vercel native build portability | Verified | Container standalone and Vercel native Next output both build; Node 22 is pinned. |
| Vercel exact-SHA production build | Verified | Managed tenant exact SHA built and promoted successfully on tenant-owned Vercel without canonical-domain cutover. |
| Vercel persistent Git integration | Verified end-to-end | A tenant-owned Vercel project has a persistent GitHub link, production branch `main`, Node 22, and automatically created the exact `v0.1.11` production deployment from the tenant workflow push. |
| Vercel deployment-author policy | Verified | Update commits use the tenant deployment actor and Vercel accepts exact-SHA production builds from that actor. |
| Exact application strategy | Verified end-to-end | GitHub rebase merge was unsuitable for the history-preserving update PR. The tenant workflow performs a real non-force Git push of the exact verified head; linked-provider auto-deployment and final promotion are accepted only after exact health verification. |
| Tenant repository variables | Configured for pre-cutover proof | The health target points to the tenant-owned linked Vercel validation alias and deployment mode remains `git`; the canonical domain is intentionally unchanged. |
| Vercel custom domain | Pending cutover | Canonical domain remains on current production runtime until full tenant secrets/backend migration and smoke tests pass. |
| Vercel runtime secrets | Private app secrets intentionally eliminated in `v0.1.12` candidate | Admin credentials/session signing, guest-link crypto, BYOK AI encryption, and update-worker auth now terminate in Convex. The linked Vercel project can intentionally remain public-config-only; the six legacy private values were transferred directly VPS → tenant Convex without printing their values. Candidate install + authenticated Vercel smoke remain required before cutover. |
| Vercel project consolidation | Pending before cutover | The persistently Git-linked validation project is the proven deployment target; the earlier unlinked validation project must be retired or renamed only after private env migration and final smoke tests. |
| Canonical-domain cutover | Pending | Attach the canonical domain only after the linked project has complete server-only env, authenticated admin smoke, CMS/PMS smoke, PWA checks, and rollback readiness. |
| Legacy VPS/Dokploy retirement | Pending after cutover | Keep the current runtime as rollback until the canonical domain has been stable on the tenant-owned Vercel project; then remove obsolete deployment dependencies/documentation. |
| Dynamic catch-all routing | Deferred until cloud cutover | Design and implement tenant-aware dynamic catch-all endpoints only after Vercel/Convex ownership, env contracts, and canonical routing are stable. |
| Convex management access | Partially blocked | Existing production deploy key is valid and securely installed as the tenant GitHub Actions secret, but Composio Convex Management API still returns `401 MissingAccessToken`, so ownership/project management remains blocked there. |
| Convex private-runtime ownership | Implemented in `v0.1.12` candidate | Generic admin auth/session verification, guest-link encryption, BYOK AI secret crypto/provider execution, and update-worker auth are Convex-owned. Next/Vercel sees opaque sessions/results only. Tenant production Convex already has the required generic secret names plus the new worker token. |
| Production one-click proof | Core workflow verified; queue/button proof pending on next release | `v0.1.11` proved Convex-first → exact non-force Git push → linked Vercel → exact health. `v0.1.12` candidate removes the Vercel credential blocker by adding Convex queue + tenant Actions worker. Bootstrap `v0.1.12` must be installed once, then the next compatible release will prove the actual `/admin/settings` button → Convex queue → worker dispatch path. |

## Verification log

- 2026-08-30: Upstream releases through `v0.1.7` remain provider-neutral and pass release-contract gates.
- 2026-08-30: `v0.1.6` bootstrapped Update Center into the managed tenant after full upstream and real-tenant verification.
- 2026-08-30: Tenant exact SHA built on Vercel with Node 22/native Next output; `/api/health` reported the exact SHA. Canonical domain was not moved.
- 2026-08-30: Private control plane now carries a `deploymentActor` login and passes it to the generic updater. `v0.1.7` tenant PR commit author/committer both resolved to the tenant GitHub owner.
- 2026-08-30: `v0.1.7` tenant PR passed CI and Vercel preview. GitHub rebase-merge API returned `Base branch was modified` despite a clean unchanged base; it was not forced.
- 2026-08-30: A non-force Git ref update advanced tenant `main` from the verified base SHA to the exact PR head. GitHub automatically marked the PR merged, author remained tenant-owned, and the Git-connected Vercel project automatically started a production deployment from that exact SHA.
- 2026-08-30: Candidate `v0.1.8` codifies that proven non-force fast-forward algorithm after Convex deploy and exact base/head revalidation.
- 2026-08-30: `v0.1.7` exact tenant main SHA reached Vercel `READY / PROMOTED` automatically after the fast-forward; author remained the tenant deployment user.
- 2026-08-30: Exact `v0.1.8` candidate passed full upstream and real-tenant verification: 24 test files / 95 tests in both trees, production builds passed, tenant author was preserved, and protected-overlay hash was unchanged.
- 2026-08-30: Convex Composio token details and deploy-key listing still fail with `401 MissingAccessToken`; production one-click backend proof remains blocked on a valid Convex management/deploy credential.
- 2026-08-31: Managed tenant `v0.1.8` was applied by exact non-force fast-forward; Vercel exact-SHA deployment reached `READY / PROMOTED`, and `/api/health` reported platform `0.1.8` with the exact tenant SHA.
- 2026-08-31: Existing production `CONVEX_DEPLOY_KEY` was transferred container-to-GitHub Actions without printing its value; the key resolves `casa-de-zian / kamyna / production`.
- 2026-08-31: Convex dry-run exposed that `convex/tsconfig.json` did not resolve the protected tenant alias. Candidate `v0.1.9` adds the alias and a permanent `typecheck:convex` gate.
- 2026-08-31: `v0.1.9` released successfully; private updater produced a clean tenant PR with CI and Vercel preview green.
- 2026-08-31: The tenant Apply workflow completed successfully: full verify, real Convex production deployment, exact non-force fast-forward, and exact `/api/health` revision verification all passed.
- 2026-08-31: The REST Git-ref fast-forward did not itself trigger a Vercel production deployment, so the `v0.1.9` proof used one exact-SHA recovery deployment.
- 2026-08-31: `v0.1.10` replaced REST ref mutation with a real non-force Git push. Convex deploy and Git promotion succeeded, but exact-health verification timed out because the active validation Vercel project had no persistent Git link; no false success was recorded.
- 2026-08-31: A separate tenant-owned Vercel validation project was created with a persistent GitHub link to the tenant repository, production branch `main`, Node 22, and public Convex/site configuration. Its initial exact `v0.1.10` deployment reached `READY / PROMOTED` and `/api/health` matched the tenant SHA.

- 2026-08-31: `v0.1.11` released successfully and the private updater created a clean managed-tenant PR; tenant CI and Vercel preview passed.
- 2026-08-31: The `v0.1.11` Apply workflow completed successfully without external recovery: full tenant verify passed, Convex production deployed, the exact verified PR head was pushed non-force to the default branch, the persistently Git-linked Vercel project automatically created a production deployment from that push, and the configured health alias reported the exact tenant SHA.
- 2026-08-31: The prior incomplete-promotion issue was closed as superseded by the successful `v0.1.11` proof. Canonical-domain cutover was intentionally not performed.
- 2026-08-31: The linked tenant Vercel project and source VPS runtime were re-audited. Git linkage and exact `v0.1.11` production SHA remain correct; only the two public URL variables exist on Vercel, while the legacy runtime contains the expected admin/property source keys. No private value was printed or written during the audit.
- 2026-08-31: Upstream admin update authentication gained a preferred tenant-owned GitHub App path: RS256 app JWT → repository installation discovery → short-lived installation token, with the existing fine-grained token path retained as fallback. Full `npm run verify` passed (24 test files / 96 tests plus production build). Tenant credential configuration and admin-button proof remain pending.
- 2026-08-31: Cross-connector transfer of private VPS values into Vercel remained blocked before write, so the platform was refactored instead of bypassing that boundary. Six generic private app secrets were transferred directly from the legacy VPS runtime into tenant production Convex without printing values.
- 2026-08-31: Candidate `v0.1.12` moves admin credential/session verification, guest-token cryptography, and BYOK AI key encryption/decryption/provider requests into Convex; the Next/Vercel code path has regression coverage proving it no longer references those private runtime secrets. The previous production cookie-name mismatch was also removed by one cookie SSOT.
- 2026-08-31: Candidate `v0.1.12` adds tenant-owned queue mode for Update Center: a five-minute GitHub Actions worker uses short-lived `GITHUB_TOKEN`, mirrors non-secret PR/check status to Convex, leases exact admin requests, and dispatches the existing verified apply workflow. A random worker token is configured only in tenant Convex + tenant GitHub Actions; the tenant Convex site origin is configured as a public repository variable.
- 2026-08-31: Exact `v0.1.12` working tree passed full `npm run verify`: all structural/provider-neutral audits, Next + Convex typecheck, lint, 24 test files / 95 tests, and the production build. Release/real-tenant/hosted-CI gates still remain before tag.

## Release state

Current released upstream baseline: `v0.1.11`.

Current managed-tenant installed baseline: `v0.1.11`.

Current release candidate: `v0.1.12`. Local full verification is green; real-tenant protected-overlay verification, hosted CI, tag/release, updater PR, bootstrap apply, and live Vercel/Convex smoke remain pending.

The Convex-first → exact Git push → linked Vercel auto-deploy → exact-health workflow is verified. The active candidate removes private app secrets from Vercel and introduces tenant-owned queued admin dispatch; next gates are candidate release/bootstrap installation, live auth/CMS/PMS/guest smoke, then a second compatible release to prove the actual admin-button worker path before canonical cutover.
