import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import { brandAssets } from "../config/assets";
import { AssetCard } from "./asset-card";
import { PaletteGrid } from "./palette-grid";
import { UsageRules } from "./usage-rules";

export function BrandAssetsPage() {
  return (
    <main id="main-content" className="section-pad bg-ivory">
      <div className="page-shell">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-charcoal/75 transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to the collection
        </Link>

        <div className="mt-16 grid gap-12 border-b border-charcoal/15 pb-14 lg:grid-cols-[.55fr_1.45fr] lg:items-end">
          <BrandLockup compact />
          <div>
            <p className="eyebrow text-earth-ink">Production asset library</p>
            <h1 className="text-balance mt-6 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
              One file at a time.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-ink-soft">
              Each identity asset below is supplied as its own scalable file. Core marks remain location-neutral so the system can grow across future properties.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8">
          {brandAssets.map((asset, index) => <AssetCard key={asset.href} asset={asset} index={index} />)}
        </div>

        <PaletteGrid />
        <UsageRules />
      </div>
    </main>
  );
}
