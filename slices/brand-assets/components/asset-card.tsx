import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrandAsset } from "../types";

export function AssetCard({ asset, index }: { asset: BrandAsset; index: number }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-paper">
      <div
        className={cn(
          "surface-grain flex min-h-72 items-center justify-center border-b border-charcoal/10 p-8 sm:min-h-96 sm:p-12",
          asset.darkPreview ? "bg-charcoal" : "bg-ivory",
        )}
      >
        <Image
          src={asset.href}
          alt={`${asset.name} preview`}
          width={asset.width}
          height={asset.height}
          className="max-h-64 w-full object-contain"
          priority={index < 2}
        />
      </div>
      <div className="grid gap-7 p-7 sm:grid-cols-[1fr_auto] sm:items-end sm:p-9">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-earth-ink">
            Asset {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-none sm:text-4xl">{asset.name}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-soft">{asset.description}</p>
        </div>
        <Link
          href={asset.href}
          download
          className="inline-flex w-fit items-center gap-2 rounded-full border border-charcoal/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-charcoal hover:text-ivory"
        >
          <Download className="size-4" aria-hidden="true" /> SVG
        </Link>
      </div>
    </article>
  );
}
