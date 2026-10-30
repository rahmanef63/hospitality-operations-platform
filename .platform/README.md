# Platform distribution contract

`rahmanef63/hospitality-operations-platform` is the canonical provider-neutral source repository. Customer deployments are independent GitHub repositories, not operationally coupled forks.

The product repository contains **no managed tenant registry**. Managed routing exists only in the private updater control plane. A normal clone/fork is unmanaged until explicitly enrolled.

Each enrolled tenant repository keeps compatible upstream Git history and commits:

- `.platform/tenant.json` — non-secret tenant identity and update channel;
- `.platform/tenant.lock.json` — exact upstream tag/commit currently installed.

Tenant-owned source belongs only under prefixes declared in `distribution.json`. Runtime secrets stay in tenant deployment secret stores; business/content state stays in that tenant's Convex/CMS/PMS.

An upstream release prepares a tested `platform/update-vX.Y.Z` PR authored as the tenant `deploymentActor` GitHub user resolved by the private control plane. Application is tenant-owned: `/admin/settings` dispatches the tenant apply workflow, which revalidates the PR, deploys Convex, non-force fast-forwards the default branch to the exact verified SHA so that author and upstream ancestry survive hosting policy, and waits for the exact frontend health revision. Unsafe updates stop instead of overwriting tenant work.

Read `docs/AI-AGENT-ONBOARDING.md` and `docs/PLATFORM-DISTRIBUTION.md` before modifying release/update mechanics.
