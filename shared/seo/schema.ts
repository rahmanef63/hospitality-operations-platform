import type { PropertyContent } from "@/shared/content";
import {
  CONTENT_UPDATED_AT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_URL,
} from "@/shared/config/site";
import { media, socialImages } from "@/shared/media";

const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const brandId = `${SITE_URL}/#brand`;
const dateModified = CONTENT_UPDATED_AT.toISOString();

function imageObject(image: { src: string; width: number; height: number; alt: string }) {
  return {
    "@type": "ImageObject",
    url: absolute(image.src),
    contentUrl: absolute(image.src),
    width: image.width,
    height: image.height,
    caption: image.alt,
    representativeOfPage: true,
  };
}

export function buildGlobalSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absolute("/icons/icon-512.png"),
        image: absolute(socialImages.kamynaLiving),
        description: SITE_DESCRIPTION,
        slogan: SITE_SLOGAN,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        dateModified,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Brand",
        "@id": brandId,
        name: SITE_NAME,
        url: SITE_URL,
        slogan: SITE_SLOGAN,
        logo: absolute("/brand/kamyna-living-wordmark.svg"),
      },
    ],
  };
}

export function buildHomeSchema(properties: PropertyContent[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#home`,
        url: SITE_URL,
        name: `${SITE_NAME} — ${SITE_SLOGAN}`,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        dateModified,
        isPartOf: { "@id": websiteId },
        about: { "@id": brandId },
        primaryImageOfPage: imageObject(media.livingCourtyard),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#stays`,
        name: "Kamyna Living stays",
        numberOfItems: properties.length,
        itemListElement: properties.map((property, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: property.name,
          url: `${SITE_URL}/stays/${property.slug}`,
        })),
      },
    ],
  };
}

export function buildPropertySchema(property: PropertyContent) {
  const url = `${SITE_URL}/stays/${property.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: `${property.name} — ${SITE_NAME}`,
        description: property.shortDescription,
        inLanguage: "en",
        dateModified,
        isPartOf: { "@id": websiteId },
        primaryImageOfPage: imageObject(property.heroImage),
        about: { "@id": `${url}/#stay` },
      },
      {
        "@type": "Accommodation",
        "@id": `${url}/#stay`,
        name: property.name,
        url,
        description: property.shortDescription,
        slogan: property.tagline,
        mainEntityOfPage: { "@id": `${url}/#webpage` },
        image: [property.heroImage, ...property.gallery.map((item) => item.image)].map(imageObject),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Stays", item: `${SITE_URL}/#stays` },
          { "@type": "ListItem", position: 3, name: property.name, item: url },
        ],
      },
    ],
  };
}

export function buildBrandAssetsSchema() {
  const url = `${SITE_URL}/brand-assets`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}/#webpage`,
    url,
    name: `Brand assets — ${SITE_NAME}`,
    description: "Official, location-neutral identity files for Kamyna Living and Ruma Kamyna.",
    inLanguage: "en",
    dateModified,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: imageObject(media.brandSerenity),
    about: { "@id": brandId },
  };
}
