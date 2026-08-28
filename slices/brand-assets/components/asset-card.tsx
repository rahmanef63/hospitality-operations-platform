import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrandAsset } from "../types";

export function AssetCard({ asset, index }: { asset: BrandAsset; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <article className="grid border-t border-charcoal/16 lg:grid-cols-12">
      <div
        className={cn(
          "flex flex-col justify-between py-10 lg:col-span-5 lg:min-h-[34rem] lg:py-14",
          reversed ? "lg:order-2 lg:pl-14" : "lg:pr-14",
        )}
      >
        <p className="kicker text-umber">Asset {String(index + 1).padStart(2, "0")} · SVG</p>
        <div className="mt-16 lg:mt-24">
          <h2 className="text-balance font-serif text-5xl leading-[0.94] tracking-[-0.03em] sm:text-6xl">
            {asset.name}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ink-soft sm:text-base sm:leading-8">
            {asset.description}
          </p>
          <Link href={asset.href} download className="editorial-link mt-9">
            Download source
            <Download className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "surface-grain flex min-h-[25rem] items-center justify-center p-8 sm:p-12 lg:col-span-7 lg:min-h-[34rem] lg:p-16",
          asset.darkPreview ? "bg-charcoal text-ivory" : "bg-warm-sand/42 text-charcoal",
          reversed && "lg:order-1",
        )}
      >
        <Image
          src={asset.href}
          alt={`${asset.name} preview`}
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="max-h-72 w-full object-contain lg:max-h-96"
          unoptimized
        />
      </div>
    </article>
  );
}
