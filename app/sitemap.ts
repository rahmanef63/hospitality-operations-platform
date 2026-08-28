import type { MetadataRoute } from "next";
import { CONTENT_UPDATED_AT, SITE_URL } from "@/shared/config/site";
import { listAreaGuides, listProperties } from "@/shared/content";
import { media, socialImages } from "@/shared/media";

const absolute = (path: string) => `${SITE_URL}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, guides] = await Promise.all([listProperties(), listAreaGuides()]);
  return [
    {
      url: SITE_URL,
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 1,
      images: [absolute(media.livingCourtyard.src), absolute(media.brandSerenity.src)],
    },
    {
      url: `${SITE_URL}/brand-assets`,
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: "yearly",
      priority: 0.4,
      images: [absolute(media.brandSerenity.src), absolute(socialImages.brandAssets)],
    },
    ...properties.map((property) => ({
      url: `${SITE_URL}/stays/${property.slug}`,
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [
        absolute(property.heroImage.src),
        ...property.gallery.map((item) => absolute(item.image.src)),
      ],
    })),
    ...guides.filter((guide) => guide.indexable).map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];
}
