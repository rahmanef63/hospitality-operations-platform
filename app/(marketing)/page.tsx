import type { Metadata } from "next";
import { HomePage } from "@/features/home";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN, SITE_URL } from "@/shared/config/site";
import { getSiteContent } from "@/shared/content";
import { socialImages } from "@/shared/media";
import { buildHomeSchema, JsonLd } from "@/shared/seo";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_SLOGAN}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/", languages: { en: "/", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: socialImages.kamynaLiving, width: 1200, height: 630, alt: `${SITE_NAME} visual world` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    images: [socialImages.kamynaLiving],
  },
};

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd data={buildHomeSchema(content.properties)} />
      <HomePage content={content.home} properties={content.properties} />
    </>
  );
}
