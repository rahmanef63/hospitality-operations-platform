import { cn } from "@/lib/utils";
import type { MediaAsset } from "./types";

type ResponsiveHeroImageProps = {
  asset: MediaAsset;
  className?: string;
};

export function ResponsiveHeroImage({ asset, className }: ResponsiveHeroImageProps) {
  const sources = [...(asset.variants ?? []), { src: asset.src, width: asset.width }];
  const srcSet = sources.map((source) => `${source.src} ${source.width}w`).join(", ");

  return (
    // These files are pre-sized and pre-compressed at source; bypassing the runtime optimizer removes LCP transform latency.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      srcSet={srcSet}
      sizes="100vw"
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      className={cn("absolute inset-0 size-full object-cover", className)}
    />
  );
}
