import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { BrandAssetsUi } from "@/shared/content";
import { media, ResponsiveHeroImage } from "@/shared/media";
import { brandAssets } from "../config/assets";
import { AssetCard } from "./asset-card";
import { PaletteGrid } from "./palette-grid";
import { UsageRules } from "./usage-rules";

export function BrandAssetsPage({ ui }: { ui: BrandAssetsUi }) {
  const heroImage = media[ui.heroMediaKey as keyof typeof media] ?? media.brandSerenity;
  const copyByHref = new Map(ui.assets.map((asset) => [asset.href, asset]));
  const visibleAssets = brandAssets.flatMap((asset) => {
    const copy = copyByHref.get(asset.href);
    return copy?.visible === false ? [] : [{ ...asset, name: copy?.name ?? asset.name, description: copy?.description ?? asset.description }];
  });
  return (
    <main id="main-content" className="bg-ivory">
      <section className="section-pad-compact bg-paper">
        <div className="page-shell grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:items-stretch lg:gap-6">
          <div className="content-inset scroll-reveal flex flex-col justify-between border-y border-charcoal/16 py-8 lg:py-10 lg:pr-12">
            <div>
              <Link prefetch={false} href="/" className="editorial-link text-charcoal/72"><ArrowLeft className="size-4" aria-hidden="true" />{ui.backLabel}</Link>
              <div className="mt-16 lg:mt-24"><BrandLockup compact /></div>
            </div>
            <div className="mt-20">
              <p className="kicker text-umber">{ui.heroEyebrow}</p>
              <h1 className="text-balance mt-6 font-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl">{ui.heroTitle}</h1>
              <p className="mt-7 max-w-xl text-sm leading-7 text-ink-soft sm:text-base sm:leading-8">{ui.heroDescription}</p>
            </div>
          </div>
          <figure className="scroll-media">
            <div className="image-frame min-h-[30rem] h-full lg:min-h-[46rem]"><ResponsiveHeroImage asset={heroImage} /></div>
            <figcaption className="content-inset image-caption mt-3">{heroImage.caption}</figcaption>
          </figure>
        </div>
      </section>
      <section className="section-pad bg-ivory">
        <div className="page-shell">
          <div className="content-inset scroll-reveal grid gap-8 pb-14 lg:grid-cols-[.55fr_1.45fr] lg:items-end">
            <p className="text-sm font-semibold text-umber">{ui.identityEyebrow}</p>
            <h2 className="text-balance font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">{ui.identityTitle}</h2>
          </div>
          <div className="border-b border-charcoal/16">{visibleAssets.map((asset, index) => <AssetCard key={asset.href} asset={asset} index={index} eyebrow={ui.assetEyebrow} downloadLabel={ui.downloadLabel} />)}</div>
          {ui.paletteVisible ? <PaletteGrid eyebrow={ui.paletteEyebrow} title={ui.paletteTitle} /> : null}
          {ui.usageVisible ? <UsageRules eyebrow={ui.usageEyebrow} title={ui.usageTitle} rules={ui.usageRules} /> : null}
        </div>
      </section>
    </main>
  );
}
