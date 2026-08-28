import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PropertyPage } from "@/features/property";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { getPropertyBySlug, listAreaGuides, listProperties } from "@/shared/content";
import { getPublicPropertyFacts } from "@/shared/convex";
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
    title: { absolute: property.seo.title },
    description: property.seo.description,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    keywords: property.seo.keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: property.seo.title,
      description: property.seo.description,
      url: `${SITE_URL}${url}`,
      images: [
        {
          url: property.socialImage,
          width: 1200,
          height: 630,
          alt: `${property.name}, private villa in Megamendung, Puncak Bogor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.seo.title,
      description: property.seo.description,
      images: [property.socialImage],
    },
  };
}

export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connection();
  const [property, guides, facts] = await Promise.all([
    getPropertyBySlug(slug),
    listAreaGuides(),
    getPublicPropertyFacts(slug),
  ]);
  if (!property || !facts) notFound();
  const relatedGuides = guides.filter((guide) => guide.relatedPropertySlug === property.slug);
  return (
    <>
      <JsonLd data={buildPropertySchema(property, facts)} />
      <PropertyPage property={property} guides={relatedGuides} facts={facts} />
    </>
  );
}
