import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandLockup, BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyHero({ property }: { property: PropertyContent }) {
  return (
    <section className="relative overflow-hidden border-b border-charcoal/10 bg-ivory">
      <div className="page-shell py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-charcoal/75 transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to the collection
        </Link>
      </div>
      <div className="page-shell grid min-h-[calc(100svh-10rem)] items-center gap-14 pb-16 lg:grid-cols-[.92fr_1.08fr] lg:gap-24 lg:pb-24">
        <div>
          <p className="eyebrow text-earth-ink">{property.collectionLabel}</p>
          <h1 className="text-balance mt-7 font-serif text-[clamp(4rem,9vw,8.5rem)] leading-[0.83] tracking-[-0.05em]">
            {property.heroStatement}
          </h1>
          <p className="mt-9 max-w-xl text-base leading-8 text-ink-soft">{property.shortDescription}</p>
          <a
            href={property.primaryAction.href}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-charcoal px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-muted-brown"
          >
            {property.primaryAction.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>

        <div className="surface-grain soft-shadow relative mx-auto aspect-[4/5] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-warm-sand">
          <div className="absolute inset-x-[7%] bottom-[-18%] h-[88%] rounded-t-[50%] border border-charcoal/20 bg-taupe/55" />
          <div className="absolute inset-x-[18%] bottom-[-8%] h-[69%] rounded-t-[50%] border border-charcoal/15 bg-ivory/75" />
          <BotanicalMark className="absolute right-8 top-8 size-32 rotate-12 text-earth-ink/20" />
          <div className="absolute inset-x-8 top-[30%] flex justify-center">
            <BrandLockup kind="property" />
          </div>
          <div className="absolute inset-x-8 bottom-8 flex items-center justify-between border-t border-charcoal/15 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal/75 sm:inset-x-12 sm:bottom-12">
            <span>{property.status}</span>
            <span>Kamyna 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}
