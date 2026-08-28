import type { Metadata } from "next";
import { BrandAssetsPage } from "@/features/brand-assets";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { socialImages } from "@/shared/media";
import { buildBrandAssetsSchema, JsonLd } from "@/shared/seo";

const description = "Official, location-neutral identity files for Kamyna Living and Ruma Kamyna.";

export const metadata: Metadata = {
  title: "Brand assets",
  description,
  alternates: { canonical: "/brand-assets", languages: { en: "/brand-assets", "x-default": "/brand-assets" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `Brand assets — ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/brand-assets`,
    images: [{ url: socialImages.brandAssets, width: 1200, height: 630, alt: `${SITE_NAME} material palette` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Brand assets — ${SITE_NAME}`,
    description,
    images: [socialImages.brandAssets],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildBrandAssetsSchema()} />
      <BrandAssetsPage />
    </>
  );
}
