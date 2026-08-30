# Hospitality Operations Platform distribution

## Product model

The canonical source of truth is the private upstream repository `rahmanef63/hospitality-operations-platform`. Every provider deployment is an independently owned tenant repository with independently owned Vercel/Convex projects, domains, credentials, and business data.

Do not use private-fork synchronization as the operational update mechanism. Tenant repositories retain compatible Git history but are enrolled explicitly into a private updater control plane so customer ownership and transfer remain independent of the product repository.

## Versioning

Platform releases use Semantic Versioning and matching GitHub tags such as `v1.4.0`.

- **patch** — backward-compatible fixes;
- **minor** — backward-compatible features/migrations;
- **major** — contract-breaking changes requiring an explicit migration plan;
- prerelease tags are delivered only to tenants enrolled in a prerelease channel.

`package.json`, `package-lock.json`, and `.platform/product.json` must carry the same version. Run `npm run platform:release:check -- vX.Y.Z` before tagging.

Patch/minor backend changes must remain compatible with the previous tenant frontend because coordinated application deploys Convex before merging/promoting the frontend. Major releases are not eligible for blind one-click application.

## Product/tenant boundary

Each tenant repository commits:

- `.platform/tenant.json` — non-secret tenant identity/update channel;
- `.platform/tenant.lock.json` — exact installed upstream tag/commit.

Tenant-protected **tracked** prefixes are declared only in `.platform/distribution.json`; they include tenant metadata, `.vercel/`, `tenant/`, `public/tenant/`, `shared/tenant/`, `convex/tenant/`, tenant-owned launcher assets, and reviewed PWA screenshots. Runtime `.env*` files are excluded from Git by `.gitignore`; `.env.example` is intentionally upstream-owned because it is the non-secret environment contract and must evolve with platform releases.

Provider secrets belong in Vercel/GitHub/Convex secret stores. Business data belongs in the provider Convex deployment. Public copy/composition should normally use CMS; property and operational facts should use PMS rather than source overrides.

If a tenant modifies product core outside protected overlays, automatic updates stop rather than overwriting the change.

## Private updater control plane

Managed-provider routing is **not stored in the product repository**. The product release workflow dispatches the generic release tag to the separate private `hospitality-platform-updater` control plane.

The private control plane owns only routing/automation metadata such as tenant repository identifiers, update channels, reviewer lists, and updater credentials. It must not contain provider runtime secrets such as Convex deployment keys or Vercel deployment credentials.

Preparation flow:

1. Upstream `main` is verified and versioned.
2. A matching `vX.Y.Z` tag is pushed.
3. `Platform release` verifies the exact tag and publishes provider-neutral release notes.
4. The release workflow dispatches the tag to the private updater control plane.
5. The control plane selects enabled tenants on compatible channels.
6. For each tenant it checks the installed lock, protected-path changes, and core drift.
7. It merges the upstream tag into `platform/update-vX.Y.Z` **without writing tenant `main`**.
8. The complete merged tenant tree runs `npm run verify`.
9. A clean update PR is opened/replaced; an unsafe update produces a blocked-review signal instead.
10. Older open platform-update PRs should be closed when a newer tested release supersedes them.

The GitHub App/private updater key is held only by the operator control plane. Tenant repositories never receive that private key.

## Tenant-owned apply flow

Prepared PRs are not automatically merged by the upstream operator. Application belongs to the tenant.

Preferred path:

```text
/admin/settings
  → tenant server reads prepared PR/check state
  → Update now dispatches .github/workflows/apply-platform-update.yml
  → workflow revalidates exact PR head and CI
  → npm run verify on the exact tenant tree
  → npx convex deploy using tenant CONVEX_DEPLOY_KEY
  → atomic merge constrained to the verified PR head SHA
  → Vercel main-branch deployment (or tenant deploy hook)
  → poll canonical /api/health until buildVersion == merge SHA
```

The runtime admin page uses a **tenant-scoped server-only** GitHub automation token. It can read the tenant PR/check state and dispatch the tenant-owned workflow; it is never serialized to browser code. The apply workflow itself uses GitHub's short-lived repository token for the exact merge and tenant repository secrets for deployment.

## Tenant automation configuration

### Server runtime

Configure on the tenant application server/Vercel project:

```env
HOSPITALITY_UPDATE_GITHUB_TOKEN=
HOSPITALITY_GITHUB_REPOSITORY=owner/repository
```

`HOSPITALITY_GITHUB_REPOSITORY` can be omitted on Vercel when `VERCEL_GIT_REPO_OWNER` and `VERCEL_GIT_REPO_SLUG` are present.

The fine-grained token should be limited to the tenant repository and only the permissions required to read PR/check/action state and dispatch workflows. Never expose it through `NEXT_PUBLIC_*`.

### Tenant GitHub repository

Secret:

```text
CONVEX_DEPLOY_KEY
```

Variables:

```text
HOSPITALITY_SITE_URL=https://provider.example
HOSPITALITY_VERCEL_MODE=git
```

Use `HOSPITALITY_VERCEL_MODE=git` when Vercel is linked to the repository and automatically deploys the tenant default branch. If the tenant intentionally uses a deploy hook, set mode `hook` and add secret `VERCEL_DEPLOY_HOOK_URL`.

The apply workflow fails its preflight before deploying/merging when required deployment configuration is missing.

## Provisioning a provider

1. Create an independently owned private tenant repository from a **released upstream tag**, preserving compatible Git history.
2. Run:

```bash
node scripts/platform/provision-tenant.mjs \
  --id=provider-slug \
  --name='Provider Name' \
  --commit='<release-commit>'
```

3. Commit the generated tenant metadata.
4. Put provider identity/fallback media only in protected tenant overlays; prefer CMS/PMS for normal operation.
5. Create/transfer provider-owned Convex and Vercel projects.
6. Configure runtime/admin secrets and the deployment contract above.
7. Install/enroll the tenant repository in the private updater control plane.
8. Run full tenant CI and a non-production deployment before DNS cutover.
9. Attach the canonical domain only after exact revision, auth, Convex, admin, PWA, and health verification pass.

## Bootstrap for tenants created before Update Center

A tenant provisioned before `/admin/settings` exists needs one controlled bootstrap update. Prepare the normal tested platform PR, configure tenant deployment secrets/variables, deploy Convex, merge the exact verified PR, and verify the exact frontend revision. Do not pretend the old tenant UI can dispatch a workflow it does not contain. After that release is installed, future compatible updates use the normal admin one-click path.

## Update status and one-click semantics

“One-click update” means the administrator makes one explicit decision in `/admin/settings`; it does **not** mean skipping validation.

An update is eligible only when:

- it is a newer compatible SemVer release;
- the prepared PR targets the tenant default branch;
- the branch follows the platform updater prefix;
- CI/check runs are complete and successful;
- no protected tenant overlay was overwritten;
- no unresolved core drift/merge conflict exists;
- tenant deployment preflight is configured;
- a major-version migration is not being attempted blindly.

The workflow must revalidate these conditions immediately before deployment/merge because status can change after the admin page was rendered.

## Failure handling

- **Preparation failure:** no tenant branch is merged; create/update a blocked-review signal.
- **Convex deploy failure:** stop before merge.
- **PR head mismatch:** stop; never merge a SHA different from the one verified/deployed.
- **Vercel build failure:** do not claim the update live. The previously promoted Vercel deployment should remain active.
- **Health mismatch:** treat deployment as incomplete even when infrastructure reports success.
- **Major release:** require explicit migration instructions and manual authorization path.

Automatic destructive rollback is intentionally avoided because schema/data migrations may be irreversible. Prefer backward-compatible expand/migrate/contract releases.

## Transferability

A tenant repository, Vercel project, domain, Convex project, credentials, and business data can be transferred independently. Removing the tenant from the private updater registry or uninstalling the updater App stops future managed update preparation without taking down the running customer system.

See `docs/AI-AGENT-ONBOARDING.md` for deterministic agent behavior and `docs/PLATFORM-UPDATE-PROGRESS.md` for current implementation/verification state.
