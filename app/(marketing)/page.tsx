import type { Metadata } from "next";
import { HomePage } from "@/features/home";
import {
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/shared/config/site";
import { getSiteContent } from "@/shared/content";
import { socialImages } from "@/shared/media";
import { buildHomeSchema, JsonLd } from "@/shared/seo";

export const metadata: Metadata = {
  title: { absolute: HOME_SEO_TITLE },
  description: HOME_SEO_DESCRIPTION,
  keywords: [
    "Kamyna Living",
    "Ruma Kamyna",
    "private villa Puncak",
    "villa Megamendung",
    "private villa Bogor",
    "villa Jawa Barat",
  ],
  alternates: { canonical: "/", languages: { en: "/", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: socialImages.kamynaLiving,
        width: 1200,
        height: 630,
        alt: "Kamyna Living private villa stays in Puncak, Bogor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
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
