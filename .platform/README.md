# Platform distribution contract

`rahmanef63/hospitality-operations-platform` is the canonical source repository. Customer repositories are independent GitHub repositories, not operationally coupled private forks.

Each tenant repository keeps the same Git history as the upstream release it was provisioned from and commits two local files:

- `.platform/tenant.json` — non-secret tenant identity and update channel.
- `.platform/tenant.lock.json` — the exact upstream tag/commit currently installed.

Tenant-owned code belongs only under the protected prefixes declared in `distribution.json`. Runtime secrets stay in Vercel/Convex environment configuration, and business/content state stays in the tenant's Convex project/CMS.

When an upstream version is released, the central updater opens a tested pull request in every registered tenant repository. A clean PR can be applied with GitHub's Merge button. If tenant code drift or a merge conflict is detected, the updater blocks the automatic PR rather than overwriting customer work.
