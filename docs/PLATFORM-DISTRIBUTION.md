# Hospitality Operations Platform distribution

## Product model

The canonical source of truth is the private upstream repository `rahmanef63/hospitality-operations-platform`. Every hospitality provider receives an independently owned tenant repository and independently owned Vercel/Convex projects.

Do not use private-fork synchronization as the product update mechanism. A fork creates ownership and access coupling that is undesirable when a customer buys or transfers its deployment. Tenant repositories instead retain compatible Git history and a small update contract.

## Versioning

Platform releases use Semantic Versioning and GitHub tags such as `v1.4.0`.

- patch: backwards-compatible fixes
- minor: backwards-compatible features or migrations
- major: contract-breaking changes that require an explicit migration plan
- prerelease tags are delivered only to tenants on a prerelease channel

The package version and `.platform/product.json` version must match before a release can be created.

## Tenant boundary

Each tenant repository commits `.platform/tenant.json` and `.platform/tenant.lock.json`. These, plus `tenant/`, `public/tenant/`, `shared/tenant/`, `convex/tenant/`, `.vercel/`, and `.env*`, are tenant-protected overlays.

Provider secrets belong in Vercel/Convex environment variables. Operational data belongs in the provider's Convex deployment. Marketing copy and layout composition should use CMS/PMS configuration rather than source overrides.

If a tenant modifies platform core files outside protected overlays, the automatic updater blocks the one-click update and opens a review issue rather than silently overwriting code.

## Update lifecycle

1. Upstream version is bumped with `npm run platform:version -- X.Y.Z`.
2. `main` passes the full verification suite.
3. A `vX.Y.Z` tag is pushed.
4. `Platform release` verifies the exact tag and publishes GitHub release notes.
5. `Platform tenant sync` reads `.platform/tenants.json`.
6. A GitHub App obtains a token scoped only to each tenant repository.
7. The updater merges the new upstream tag into an automation branch in that tenant.
8. Protected-overlay and core-drift guards run.
9. The complete tenant tree runs `npm run verify`.
10. A pull request is opened. The provider receives the normal GitHub notification.
11. Clicking Merge applies the update. Vercel then builds the provider repository normally.

This is deliberately pull-request based. Direct writes to tenant `main` are not permitted by the updater.

## Updater GitHub App

Create one dedicated GitHub App, recommended name `Hospitality Platform Updater`, controlled by the upstream operator. Install it on the upstream owner and each managed tenant repository.

Repository permissions:

- Metadata: Read
- Contents: Read and write
- Pull requests: Read and write
- Issues: Read and write

Store only the App ID and private key in the private upstream repository/organization secrets:

- `HOSPITALITY_UPDATER_APP_ID`
- `HOSPITALITY_UPDATER_PRIVATE_KEY`

Tenant repositories do not receive the App private key.

## Tenant registry

Register tenants in `.platform/tenants.json` only after their repository exists and the updater App is installed. Example:

```json
{
  "id": "hospitality-operations-platform",
  "owner": "hospitality-operations-platform",
  "repo": "hospitality-operations-platform",
  "defaultBranch": "main",
  "channel": "stable",
  "enabled": true,
  "reviewers": []
}
```

The registry contains repository routing metadata only; it must never contain customer secrets.

## Provisioning a new provider

Provision the tenant repository from a released upstream tag so the Git histories remain related, then run:

```bash
node scripts/platform/provision-tenant.mjs \
  --id=provider-slug \
  --name='Provider Name' \
  --commit='<release-commit>'
```

Commit the two generated tenant metadata files on top of the release baseline, configure the tenant's Vercel/Convex environments, install the updater App, then add the tenant to the upstream registry.

## Transferability

A customer repository, Vercel project, domain, Convex project, secrets, and business data can be transferred independently. Removing a tenant from the updater registry or uninstalling the GitHub App stops future managed updates without affecting the running customer system.


## Updater credentials




## Private updater control plane

The product repository contains no managed-provider registry. A release publishes the generic tag, then dispatches that tag to a separate private updater control-plane repository. Tenant repository identifiers, reviewer lists, and updater credentials live only in that control plane. The control plane checks out the released platform tag and invokes the generic `scripts/platform/sync-tenant.mjs` implementation.

This separation keeps product source, tags, release archives, and normal product release logs provider-neutral while still allowing managed tenant repositories to receive tested update pull requests. Production should use a dedicated GitHub App installed on managed tenant repositories; a narrowly scoped encrypted token is acceptable only during initial bootstrap.
