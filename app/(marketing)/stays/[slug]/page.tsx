import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyPage } from "@/features/property";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { getPropertyBySlug, listProperties } from "@/shared/content";
import { buildPropertySchema, JsonLd } from "@/shared/seo";

export async function generateStaticParams() {
  const properties = await listProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  const url = `/stays/${property.slug}`;
  return {
    title: property.name,
    description: property.shortDescription,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    keywords: [property.name, "private stay", "design-led retreat", "quiet hospitality"],
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: `${property.name} — ${SITE_NAME}`,
      description: property.shortDescription,
      url: `${SITE_URL}${url}`,
      images: [{ url: property.socialImage, width: 1200, height: 630, alt: `${property.name} visual concept` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.name} — ${SITE_NAME}`,
      description: property.shortDescription,
      images: [property.socialImage],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  return (
    <>
      <JsonLd data={buildPropertySchema(property)} />
      <PropertyPage property={property} />
    </>
  );
}
