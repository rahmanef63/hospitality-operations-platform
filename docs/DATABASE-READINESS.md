# Database readiness

## Current state

No database dependency, schema, auth provider, runtime credentials, or compose service is present. All public pages render from typed static configuration.

## Stable boundary

`shared/content/types.ts` defines `ContentRepository`:

- `getSiteContent()`
- `listProperties()`
- `getPropertyBySlug(slug)`
- `listAreaGuides()`
- `getAreaGuideBySlug(slug)`

`StaticContentRepository` is the only active implementation.

## Future adapter

When database-backed editing is requested:

1. Add a `ConvexContentRepository` implementing the same interface.
2. Introduce indexed property and global-content tables.
3. Validate every public function with `v.*` validators.
4. Authorize every mutation inside the handler.
5. Use indexed, bounded reads; never add unbounded collection scans.
6. Add `@convex-dev/auth` only if authenticated editing is required.
7. Keep static content as a tested fallback during migration.
8. Change repository composition in one place; do not change slices.

## Suggested model

- `siteSettings`: collection-level identity, navigation, and contact channels.
- `properties`: one record per stay, keyed by unique slug, with verified location, contact, and SEO fields.
- `areaGuides`: draft or published local content linked to a property slug.
- `propertySections`: ordered modular sections for each property.
- `brandAssets`: asset metadata and usage status.
- `enquiries`: optional later phase, protected against spam and abuse.

Database activation must be a separate deployment phase with backup, rollback, migration, and authorization tests.
