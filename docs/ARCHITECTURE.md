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


## Media pipeline

Image metadata, alt text, dimensions, captions, and responsive variants have one source of truth in `shared/media/`. Original generated concepts and social cards live under `public/media/kamyna/`; LCP hero surfaces use pre-sized WebP `srcset` variants to avoid runtime transformation latency, while non-critical editorial images remain lazy-loaded through `next/image`.

Generated property visuals are direction-setting concepts, not evidence of a completed property. Every guest-facing concept image is paired with a visible disclosure until verified photography is supplied.

## Search architecture

Search and sharing surfaces are owned by the App Router rather than duplicated in page components:

- root and route-specific metadata, canonical URLs, English plus `x-default` alternates;
- permanent `www` to apex redirect;
- Google verification through `Metadata.verification`;
- `robots.txt`, image-aware `sitemap.xml`, and PWA manifest;
- static social cards;
- linked Organization, WebSite, Brand, CollectionPage, Accommodation, ItemList, ImageObject, and BreadcrumbList structured data.

Schema deliberately avoids addresses, amenities, offers, ratings, and availability until those facts are confirmed.


## Responsive composition and motion

Mobile section shells are intentionally full-bleed. The reusable `content-inset` utility is applied only to copy, controls, and captions that need a readable or safe-area-aware inset; photography, color fields, galleries, and structural borders may reach the viewport edge. Tablet and desktop shells return to the bounded 90rem container.

Motion is progressive enhancement built with native CSS scroll timelines. Key hierarchy blocks reveal through restrained transforms, selected background images use restrained parallax, the mobile ritual sequence forms a true sticky stack, and the header carries a scroll-progress line. No React scroll state, `window.scrollY`, or unbounded scroll listener is used. Every effect collapses to static content under `prefers-reduced-motion`.
