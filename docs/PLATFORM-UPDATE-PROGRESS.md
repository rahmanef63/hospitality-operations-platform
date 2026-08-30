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
| Documentation consistency | Implemented | README, AGENTS, architecture, distribution docs agree on private control-plane routing and tenant-owned apply flow. |
| AI-agent onboarding | Implemented | One deterministic guide tells an agent how to detect upstream vs tenant mode, where changes belong, and how to release/update safely. |
| Admin platform settings | Implemented | `/admin/settings` shows installed/prepared version, PR/check status, update state, and never exposes credentials. |
| Tenant apply workflow | Implemented | Workflow verifies exact PR, deploys Convex before merge, promotes frontend, and verifies exact health build ID. |
| Health revision contract | Implemented | `/api/health` reports the build revision used for exact promotion verification. |
| Superseded update cleanup | Implemented | A newer platform PR closes older open platform-update PRs instead of leaving ambiguous choices. |
| Reference tenant Update Center bootstrap | Pending | Existing reference tenant predates `/admin/settings`; v0.1.4 must be installed once through the controlled Convex-first bootstrap path before future admin one-click updates are available. |
| Reference tenant Vercel Git access | Verified | Vercel can read/build the private tenant repository from an exact Git SHA. |
| Reference tenant Vercel build portability | Fix implemented | Private-repo clone/install/Next compile succeeded; Vercel failed only during adapter finalization because container-only standalone output was forced. Platform now uses native Vercel output and pins Node 22. |
| Reference tenant automatic Vercel promotion | Blocked | Git-source deployment works, but automatic main-branch/custom-domain promotion is not yet proven/configured. |
| Reference tenant Vercel custom domain | Blocked | Only the platform-provided Vercel domain is attached; canonical domain cutover is not complete. |
| Reference tenant Vercel runtime secrets | Blocked | Only public site/Convex URLs are configured; admin/update server credentials are not yet present. |
| Reference tenant Convex control-plane access | Blocked externally | Connected account metadata is active, but Convex Management API currently returns `401 MissingAccessToken`. |
| Production one-click proof | Pending | Requires deployment credentials plus automatic Vercel promotion; do not claim complete before an exact-revision end-to-end run passes. |

## Verification log

- 2026-08-30: Upstream release trees `v0.1.0` through `v0.1.3` verified provider-neutral.
- 2026-08-30: Private updater prepared a clean, CI-green tenant update PR without touching protected overlays.
- 2026-08-30: Vercel Git-source capability test successfully resolved the private tenant repository and exact commit; canonical domain was not changed.
- 2026-08-30: Convex Composio control-plane check still returns `MissingAccessToken`; production migration must remain blocked on this dependency.
- 2026-08-30: Added deterministic AI-agent onboarding, `/admin/settings`, server-only GitHub update status/dispatch, tenant-owned Convex-first apply workflow, exact build health contract, and superseded-PR cleanup; targeted TypeScript/lint/update tests/file-size/release-contract gates pass.
- 2026-08-30: Vercel capability build cloned the private tenant repo and completed Next compile/TypeScript/static generation, then failed in Vercel adapter finalization on `.next/next-server.js.nft.json`; generic fix makes `output: standalone` container-only and pins Node 22 for Vercel stability.

- 2026-08-30: Container-mode and `VERCEL=1` production builds both pass after the portability fix; container retains `.next/standalone` while Vercel mode does not generate standalone output.

- 2026-08-30: Release candidate `v0.1.4` full local gate passed: 24 test files / 93 tests, strict TypeScript, zero-warning lint, production build, repository audits, dependency audit with 0 vulnerabilities, diff check, and provider-neutral literal audit.

## Release state

Current released upstream baseline: `v0.1.3`.

Current release candidate: `v0.1.4` — Update Center, tenant-owned coordinated apply workflow, AI-agent onboarding, updater cleanup, exact health revision, and Vercel/container portability.

`v0.1.4` is not released until full local verification, hosted CI, provider-neutral release audit, and upstream PR review succeed.
