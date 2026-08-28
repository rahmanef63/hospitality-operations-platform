import Image from "next/image";
import type { GalleryItem, PropertyContent } from "@/shared/content";

function GalleryFigure({ item, className, sizes }: { item: GalleryItem; className: string; sizes: string }) {
  return (
    <figure className={className}>
      <div className="image-frame h-full min-h-[20rem]">
        <Image src={item.image.src} alt={item.image.alt} fill sizes={sizes} className="object-cover" />
        <span className="absolute bottom-4 left-4 z-10 bg-paper/92 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-charcoal backdrop-blur-sm">
          {item.label}
        </span>
      </div>
    </figure>
  );
}

export function PropertyGallery({ property }: { property: PropertyContent }) {
  const first = property.gallery[0];
  const second = property.gallery[1];
  const third = property.gallery[2];
  const fourth = property.gallery[3];
  if (!first || !second || !third || !fourth) return null;

  return (
    <section className="section-pad bg-ivory">
      <div className="page-shell">
        <h2 className="text-balance max-w-5xl font-serif text-6xl leading-[0.9] tracking-[-0.035em] sm:text-8xl">
          A home made of quiet details.
        </h2>
        <p className="mt-7 max-w-2xl text-base leading-8 text-ink-soft">
          Light, material, proportion, and everyday objects work together without asking to become the centre of attention.
        </p>

        <div className="mt-14 grid gap-3 lg:grid-cols-12 lg:grid-rows-[22rem_22rem_auto]">
          <GalleryFigure item={first} className="lg:col-span-7 lg:row-span-2" sizes="(min-width: 1024px) 58vw, 100vw" />
          <GalleryFigure item={second} className="lg:col-span-5" sizes="(min-width: 1024px) 40vw, 100vw" />
          <GalleryFigure item={third} className="lg:col-span-5" sizes="(min-width: 1024px) 40vw, 100vw" />
          <GalleryFigure item={fourth} className="min-h-[18rem] lg:col-span-12 lg:mt-5 lg:h-[26rem]" sizes="100vw" />
        </div>
        <p className="image-caption mt-4">{property.visualNote}</p>
      </div>
    </section>
  );
}
