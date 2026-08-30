import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandAssetsPage } from "@/features/brand-assets";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { getSiteContent } from "@/shared/content";
import { socialImages } from "@/shared/media";
import { buildBrandAssetsSchema, JsonLd } from "@/shared/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { publicUi } = await getSiteContent(); const ui = publicUi.brandAssets;
  return { title: ui.seoTitle, description: ui.seoDescription, robots: ui.visible ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: "/brand-assets", languages: { en: "/brand-assets", "x-default": "/brand-assets" } },
    openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, title: `${ui.seoTitle} | ${SITE_NAME}`, description: ui.seoDescription, url: `${SITE_URL}/brand-assets`, images: [{ url: socialImages.brandAssets, width: 1200, height: 630, alt: `${SITE_NAME} material palette` }] },
    twitter: { card: "summary_large_image", title: `${ui.seoTitle} | ${SITE_NAME}`, description: ui.seoDescription, images: [socialImages.brandAssets] } };
}
export default async function Page() {
  const { publicUi } = await getSiteContent(); if (!publicUi.brandAssets.visible) notFound();
  return <><JsonLd data={buildBrandAssetsSchema()} /><BrandAssetsPage ui={publicUi.brandAssets} /></>;
}
