import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup, BotanicalMark } from "@/shared/brand";
import type { CollectionSectionProps } from "../types";

export function CollectionSection({ content, properties }: CollectionSectionProps) {
  const property = properties[0];
  if (!property) return null;
  return (
    <section id="stays" className="section-pad bg-ivory">
      <div className="page-shell">
        <div className="grid gap-8 border-b border-charcoal/15 pb-10 md:grid-cols-[.7fr_1.3fr] md:items-end">
          <p className="eyebrow text-earth-ink">{content.eyebrow}</p>
          <div>
            <h2 className="text-balance font-serif text-5xl leading-none tracking-[-0.03em] sm:text-7xl">{content.title}</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">{content.description}</p>
          </div>
        </div>

        <article className="mt-12 grid overflow-hidden rounded-[2rem] border border-charcoal/10 bg-paper lg:grid-cols-[1.08fr_.92fr]">
          <div className="surface-grain relative min-h-[32rem] overflow-hidden bg-warm-sand p-8 sm:p-12 lg:min-h-[44rem]">
            <div className="absolute inset-x-[10%] bottom-[-22%] h-[78%] rounded-t-[50%] border border-charcoal/20 bg-taupe/30" />
            <div className="absolute inset-x-[20%] bottom-[-10%] h-[58%] rounded-t-[50%] border border-charcoal/15 bg-ivory/65" />
            <BotanicalMark className="absolute left-10 top-10 size-24 -rotate-12 text-earth-ink/25" />
            <div className="absolute inset-x-8 top-[31%] flex justify-center sm:inset-x-12">
              <BrandLockup kind="property" />
            </div>
            <span className="absolute bottom-8 left-8 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-charcoal/75 sm:bottom-12 sm:left-12">
              Collection 01
            </span>
          </div>

          <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
            <div>
              <div className="flex items-center justify-between gap-6">
                <p className="eyebrow text-earth-ink">{property.status}</p>
                <span className="font-serif text-4xl text-charcoal/60">01</span>
              </div>
              <h3 className="mt-12 font-serif text-5xl leading-none sm:text-7xl">{property.name}</h3>
              <p className="mt-8 max-w-xl text-base leading-8 text-ink-soft">{property.shortDescription}</p>
            </div>
            <div className="mt-16 border-t border-charcoal/15 pt-8">
              <Link
                href={`/stays/${property.slug}`}
                className="group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Discover the stay
                <span className="flex size-10 items-center justify-center rounded-full border border-charcoal/20 transition-colors group-hover:bg-charcoal group-hover:text-ivory">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
