import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLockup, BotanicalMark } from "@/shared/brand";
import type { HeroSectionProps } from "../types";

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-charcoal/10 bg-ivory">
      <div className="page-shell grid min-h-[calc(100svh-5rem)] items-center gap-14 py-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-20 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <p className="eyebrow text-earth-ink">{content.eyebrow}</p>
          <h1 className="text-balance mt-6 font-serif text-[clamp(4.4rem,10vw,9.8rem)] leading-[0.78] tracking-[-0.055em]">
            Homes for <span className="italic text-earth-ink">slower</span> living.
          </h1>
          <p className="mt-9 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">{content.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-full bg-charcoal px-7 text-xs uppercase tracking-[0.16em] text-ivory shadow-none hover:bg-muted-brown"
            >
              <Link href={content.primaryAction.href}>
                {content.primaryAction.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Link
              href={content.secondaryAction.href}
              className="inline-flex items-center gap-3 px-2 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/75 transition-colors hover:text-charcoal"
            >
              {content.secondaryAction.label}
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-12 max-w-lg border-t border-charcoal/15 pt-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-charcoal/75">
            {content.note}
          </p>
        </div>

        <div className="surface-grain soft-shadow relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-[2rem] bg-taupe text-charcoal lg:justify-self-end">
          <div className="absolute inset-x-[8%] bottom-[-18%] h-[83%] rounded-t-[50%] border border-charcoal/20 bg-warm-sand/60" />
          <div className="absolute inset-x-[17%] bottom-[-9%] h-[66%] rounded-t-[50%] border border-charcoal/15 bg-ivory/70 backdrop-blur-sm" />
          <BotanicalMark className="absolute right-8 top-8 size-28 rotate-12 text-charcoal/18" />
          <div className="absolute inset-x-6 top-[29%] flex justify-center sm:inset-x-10">
            <BrandLockup kind="property" className="scale-[0.86] sm:scale-100" />
          </div>
          <div className="absolute inset-x-8 bottom-8 flex items-end justify-between border-t border-charcoal/15 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal/75 sm:inset-x-10">
            <span>Collection 01</span>
            <span>Private stay</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -left-24 top-24 size-80 rounded-full border border-taupe/20" aria-hidden="true" />
    </section>
  );
}
