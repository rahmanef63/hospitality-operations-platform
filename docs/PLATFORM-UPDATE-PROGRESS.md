# Platform update implementation progress

This document is the single source of truth for the Hospitality Operations Platform update-center backlog. Keep it provider-neutral: managed-provider identifiers belong only in the private updater control plane or tenant repositories.

## Target contract

A platform release must be safe for an AI-agent-operated tenant repository:

1. The canonical upstream remains provider-neutral and publishes a tested SemVer tag.
2. The private updater control plane prepares a tenant update PR without modifying protected overlays.
3. The tenant admin can see the installed version and a prepared update from `/admin/settings`.
4. **Update now** dispatches a tenant-owned workflow; no updater credential is sent to the browser.
5. The workflow revalidates the exact PR head, runs the full suite, deploys Convex first, non-force fast-forwards the exact verified head with a real Git push, then waits for the exact Vercel revision.
6. Public PWA clients activate the new frontend through the existing bounded cache/state cleanup lifecycle.
7. Major-version changes remain manual unless the release carries an explicit migration contract.

## Backlog

| Area | Status | Acceptance |
|---|---|---|
| Documentation consistency | Implemented | README, AGENTS, architecture, distribution docs and AI-agent onboarding agree on private control-plane routing and tenant-owned apply flow. |
| AI-agent onboarding | Implemented | Agents deterministically distinguish upstream vs tenant mode, protected overlays, release/update ownership, deployment order and recovery. |
| Admin platform settings | Implemented and bootstrapped | Managed tenant includes `/admin/settings`; prepared versions can be surfaced once its server-side GitHub credential is configured. |
| Tenant apply workflow | Implemented through `v0.1.10`; linked-project proof in `v0.1.11` | Exact PR/check/base revalidation, full verify, Convex-first deploy, a non-force exact Git push, and health-revision verification are encoded in the tenant workflow. |
| Health revision contract | Implemented | `/api/health` reports platform version and exact build revision. |
| Superseded update cleanup | Implemented | Newer tested platform PRs close older update PRs; resolved blocked-update issues do not remain actionable. |
| Environment contract updateability | Implemented | `.env.example` remains upstream-owned while real `.env*` runtime values remain untracked. |
| Real-tenant pre-release gate | Implemented | Release candidate is merged into a temporary managed-tenant clone; full verify must pass and protected-overlay hash must remain unchanged before release. |
| Tenant deployment actor | Implemented in `v0.1.7` | Private control plane resolves a real tenant GitHub user; update commits use its GitHub noreply identity. |
| Vercel native build portability | Verified | Container standalone and Vercel native Next output both build; Node 22 is pinned. |
| Vercel exact-SHA production build | Verified | Managed tenant exact SHA built and promoted successfully on tenant-owned Vercel without canonical-domain cutover. |
| Vercel persistent Git integration | Linked validation target verified | A tenant-owned Vercel project now has a persistent GitHub link, production branch `main`, Node 22, and an exact current-revision health check. `v0.1.11` is the no-recovery auto-deploy proof. |
| Vercel deployment-author policy | Verified | Update commits use the tenant deployment actor and Vercel accepts exact-SHA production builds from that actor. |
| Exact application strategy | Verified at Git layer; deployment proof pending `v0.1.11` | GitHub rebase merge was unsuitable for the history-preserving update PR. The tenant workflow now performs a real non-force Git push of the exact verified head; linked-provider auto-deployment is verified by exact health rather than assumed from Git state. |
| Tenant repository variables | Configured for pre-cutover proof | The health target points to the tenant-owned linked Vercel validation alias and deployment mode remains `git`; the canonical domain is intentionally unchanged. |
| Vercel custom domain | Pending cutover | Canonical domain remains on current production runtime until full tenant secrets/backend migration and smoke tests pass. |
| Vercel runtime secrets | Pending | Public URLs are present; admin/update server-only credentials must be migrated/rotated before canonical cutover. |
| Convex management access | Partially blocked | Existing production deploy key is valid and securely installed as the tenant GitHub Actions secret, but Composio Convex Management API still returns `401 MissingAccessToken`, so ownership/project management remains blocked there. |
| Production one-click proof | Pipeline proven; linked auto-deploy proof pending `v0.1.11` | `v0.1.9` proved Convex-first apply and exact frontend health but needed an external exact-SHA recovery deployment. `v0.1.10` proved the real Git push but the then-current validation project was not persistently Git-linked. A linked tenant-owned Vercel project is now initialized at the exact installed revision; `v0.1.11` must complete without any recovery deployment. Admin-button dispatch still requires a tenant server-side GitHub credential. |

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

## Release state

Current released upstream baseline: `v0.1.10`.

Current managed-tenant installed baseline: `v0.1.10`.

Current release candidate: `v0.1.11` — proof release for automatic production deployment through the persistently Git-linked tenant Vercel project.

`v0.1.11` is not complete until upstream full verification, real-tenant temporary merge/full verify, hosted CI, private updater success, tenant PR CI/Vercel preview, and an end-to-end Apply run reaches exact linked-Vercel health without any manual or API recovery deployment.
