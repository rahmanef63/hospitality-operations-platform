import type { AreaGuideContent, PropertyContent } from "@/shared/content";
import {
  CONTENT_UPDATED_AT,
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
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
const officialProfileUrls = [
  "https://www.google.com/maps/place/RUMA+KAMYNA/data=!4m2!3m1!1s0x0:0x970747a93434dce9",
] as const;

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
        sameAs: officialProfileUrls,
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
        name: HOME_SEO_TITLE,
        description: HOME_SEO_DESCRIPTION,
        inLanguage: "en",
        dateModified,
        isPartOf: { "@id": websiteId },
        about: { "@id": brandId },
        publisher: { "@id": organizationId },
        primaryImageOfPage: imageObject(media.livingCourtyard),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#stays`,
        name: "Kamyna Living private villa stays",
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
  const address = {
    "@type": "PostalAddress",
    ...(property.location.streetAddress ? { streetAddress: property.location.streetAddress } : {}),
    addressLocality: property.location.addressLocality,
    addressRegion: property.location.addressRegion,
    postalCode: property.location.postalCode,
    addressCountry: property.location.addressCountry,
  };
  const optionalLodgingFields = {
    ...(property.location.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.location.geo.latitude,
            longitude: property.location.geo.longitude,
          },
        }
      : {}),
    ...(property.location.mapEmbedUrl ? { hasMap: property.location.mapEmbedUrl } : {}),
    ...(property.contact.whatsappNumber ? { telephone: `+${property.contact.whatsappNumber}` } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: property.seo.title,
        description: property.seo.description,
        inLanguage: "en",
        dateModified,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        primaryImageOfPage: imageObject(property.heroImage),
        about: { "@id": `${url}/#lodging-business` },
      },
      {
        "@type": "LodgingBusiness",
        "@id": `${url}/#lodging-business`,
        name: property.name,
        url,
        description: property.shortDescription,
        slogan: property.tagline,
        email: property.contact.email,
        address,
        sameAs: officialProfileUrls,
        parentOrganization: { "@id": organizationId },
        brand: { "@id": brandId },
        mainEntityOfPage: { "@id": `${url}/#webpage` },
        image: [property.heroImage, ...property.gallery.map((item) => item.image)].map(imageObject),
        ...optionalLodgingFields,
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

export function buildAreaGuideSchema(guide: AreaGuideContent, property: PropertyContent) {
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const propertyUrl = `${SITE_URL}/stays/${property.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: guide.seoTitle,
        description: guide.seoDescription,
        inLanguage: "en",
        dateModified,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        about: { "@id": `${propertyUrl}/#lodging-business` },
        primaryImageOfPage: imageObject(property.heroImage),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: property.name, item: propertyUrl },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
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
    name: `Brand assets | ${SITE_NAME}`,
    description: "Official, location-neutral identity files for Kamyna Living and Ruma Kamyna.",
    inLanguage: "en",
    dateModified,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: imageObject(media.brandSerenity),
    about: { "@id": brandId },
  };
}
