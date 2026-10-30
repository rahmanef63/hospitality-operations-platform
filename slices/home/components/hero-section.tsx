import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ResponsiveHeroImage } from "@/shared/media";
import type { HeroSectionProps } from "../types";

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-charcoal text-ivory">
      <ResponsiveHeroImage asset={content.image} className="object-center" />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />

      <div className="page-shell content-inset relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-end pb-12 pt-24 sm:pb-16 lg:pb-20">
        <div className="hero-copy-intro max-w-4xl">
          <p className="kicker text-warm-sand">{content.eyebrow}</p>
          <h1 className="text-balance mt-6 max-w-4xl font-serif text-[clamp(3.75rem,9vw,8.2rem)] leading-[0.82] tracking-[-0.045em]">
            {content.title}
          </h1>
          <p className="text-pretty mt-8 max-w-xl text-base leading-7 text-ivory/82 sm:text-lg sm:leading-8">
            {content.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link prefetch={false} href={content.primaryAction.href} className="cta-solid cta-solid-light">
              {content.primaryAction.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link prefetch={false} href={content.secondaryAction.href} className="cta-outline border-ivory/70 text-ivory hover:border-ivory">
              {content.secondaryAction.label}
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <p className="image-caption absolute bottom-5 right-5 z-10 hidden max-w-xs text-right text-ivory/70 md:block">
        {content.image.caption}
      </p>
    </section>
  );
}
