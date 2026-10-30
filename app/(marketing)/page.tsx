import type { Metadata } from "next";
import { HomePage } from "@/features/home";
import {
  SITE_NAME,
  SITE_URL,
} from "@/shared/config/site";
import { getSiteContent } from "@/shared/content";
import { socialImages } from "@/shared/media";
import { buildHomeSchema, JsonLd } from "@/shared/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = content.publicUi.home;
  return {
    title: { absolute: seo.seoTitle }, description: seo.seoDescription,
    keywords: ["hospitality operations", "property management", "guest experience", "private accommodation"],
    alternates: { canonical: "/", languages: { en: "/", "x-default": "/" } },
    openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, title: seo.seoTitle, description: seo.seoDescription, url: SITE_URL,
      images: [{ url: socialImages.site, width: 1200, height: 630, alt: `${SITE_NAME} hospitality platform` }] },
    twitter: { card: "summary_large_image", title: seo.seoTitle, description: seo.seoDescription, images: [socialImages.site] },
  };
}

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd data={buildHomeSchema(content.properties)} />
      <HomePage content={content.home} properties={content.properties} ui={content.publicUi.home} />
    </>
  );
}
