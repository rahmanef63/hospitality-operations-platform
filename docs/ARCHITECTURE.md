# Architecture

## Runtime

Kamyna Living is currently a static-first Next.js application deployed as a standalone Node service. It intentionally has no active database or authentication surface.

## Data flow

```text
shared/content/config/*
        ↓
StaticContentRepository
        ↓
cache-aware repository functions
        ↓
App Router pages
        ↓
vertical slices receiving typed props
```

JSX components never reach into individual content files. This keeps presentation independent from the future storage provider.

## Brand hierarchy

- **Kamyna Living**: collection and portfolio identity.
- **Ruma Kamyna**: first property identity.
- **return to stillness**: shared brand idea.

Core identity files do not contain addresses or location labels. Property location data can later live in property records and appear only where context requires it.

## Slice boundaries

- `site-shell`: global navigation and footer.
- `home`: collection homepage sections.
- `property`: reusable property storytelling route.
- `brand-assets`: downloadable production identity files.

Cross-slice imports must use each slice barrel. Shared dependencies come from `shared/*` or `components/ui/*`.

## Deployment

The Dockerfile uses a dependency, builder, and non-root runtime stage. `/api/health` is used by the container health check and deployment verification.
