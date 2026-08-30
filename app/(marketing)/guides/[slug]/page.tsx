import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/features/guides";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { getAreaGuideBySlug, getPropertyBySlug, getSiteContent, listAreaGuides } from "@/shared/content";
import { socialImages } from "@/shared/media";
import { buildAreaGuideSchema, JsonLd } from "@/shared/seo";

export async function generateStaticParams() {
  const guides = await listAreaGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getAreaGuideBySlug(slug);
  if (!guide) return {};
  const url = `/guides/${guide.slug}`;
  return {
    title: { absolute: guide.seoTitle },
    description: guide.seoDescription,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    robots: guide.indexable
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: SITE_NAME,
      title: guide.seoTitle,
      description: guide.seoDescription,
      url: `${SITE_URL}${url}`,
      images: [
        {
          url: socialImages.rumaKamyna,
          width: 1200,
          height: 630,
          alt: "Ruma Kamyna in Megamendung, Puncak Bogor",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle,
      description: guide.seoDescription,
      images: [socialImages.rumaKamyna],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getAreaGuideBySlug(slug);
  if (!guide) notFound();
  const [property, site] = await Promise.all([getPropertyBySlug(guide.relatedPropertySlug), getSiteContent()]);
  if (!property) notFound();
  return (
    <>
      <JsonLd data={buildAreaGuideSchema(guide, property)} />
      <GuidePage guide={guide} property={property} ui={site.publicUi.guide} />
    </>
  );
}
