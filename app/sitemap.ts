import type { MetadataRoute } from "next";
import { listProperties } from "@/shared/content";
import { SITE_URL } from "@/shared/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await listProperties();
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/brand-assets`, changeFrequency: "yearly", priority: 0.3 },
    ...properties.map((property) => ({
      url: `${SITE_URL}/stays/${property.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
