import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { CollectionSectionProps } from "../types";

export function CollectionSection({ content, properties }: CollectionSectionProps) {
  const property = properties[0];
  const primaryImage = content.images[0];
  const secondaryImage = content.images[1];
  if (!property || !primaryImage || !secondaryImage) return null;

  return (
    <section id="stays" className="section-pad bg-ivory">
      <div className="page-shell">
        <div className="max-w-4xl">
          <h2 className="text-balance font-serif text-6xl leading-[0.9] tracking-[-0.035em] sm:text-8xl">
            {content.title}
          </h2>
          <p className="text-pretty mt-7 max-w-2xl text-base leading-8 text-ink-soft">{content.description}</p>
        </div>

        <article className="relative mt-14 pb-0 lg:pb-28">
          <figure>
            <div className="image-frame aspect-[16/10] lg:aspect-[16/9]">
              <Image
                src={primaryImage.src}
                alt={primaryImage.alt}
                fill
                sizes="(min-width: 1024px) 90vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="image-caption mt-3 lg:w-1/2">{primaryImage.caption}</figcaption>
          </figure>

          <div className="relative z-10 mt-6 bg-charcoal p-7 text-ivory sm:p-10 lg:absolute lg:bottom-0 lg:left-[5%] lg:mt-0 lg:w-[54%] lg:p-12">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <p className="text-sm text-warm-sand">{property.status}</p>
              <span className="font-serif text-4xl text-ivory/50">01</span>
            </div>
            <div className="mt-10">
              <BrandLockup kind="property" compact inverse />
              <h3 className="text-balance mt-8 font-serif text-5xl leading-[0.92] tracking-[-0.025em] sm:text-6xl">
                {property.heroStatement}
              </h3>
              <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/68 sm:text-base">{property.shortDescription}</p>
              <Link href={`/stays/${property.slug}`} className="editorial-link mt-9 text-ivory">
                Discover the stay
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <figure className="mt-6 lg:absolute lg:bottom-0 lg:right-[4%] lg:z-20 lg:mt-0 lg:w-[27%]">
            <div className="image-frame aspect-[4/5] border-[0.6rem] border-ivory lg:border-[0.8rem]">
              <Image
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        </article>
      </div>
    </section>
  );
}
