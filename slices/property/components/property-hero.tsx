import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { PropertyContent, PropertyPageUi } from "@/shared/content";
import { ResponsiveHeroImage } from "@/shared/media";

export function PropertyHero({ property, ui }: { property: PropertyContent; ui: PropertyPageUi }) {
  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-charcoal text-ivory">
      <ResponsiveHeroImage asset={property.heroImage} />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />

      <div className="page-shell content-inset relative z-10 flex min-h-[calc(100dvh-4.5rem)] flex-col justify-between py-8 sm:py-10 lg:py-12">
        <Link prefetch={false} href="/" className="w-fit editorial-link text-ivory/82">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {ui.backLabel}
        </Link>

        <div className="hero-copy-intro grid items-end gap-12 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <p className="kicker text-warm-sand">{property.collectionLabel}</p>
            <h1 className="text-balance mt-6 max-w-4xl font-serif text-[clamp(3.75rem,8.5vw,8rem)] leading-[0.83] tracking-[-0.045em]">
              {property.heroStatement}
            </h1>
            <p className="text-pretty mt-8 max-w-xl text-base leading-8 text-ivory/78">{property.shortDescription}</p>
            <a href={property.primaryAction.href} className="cta-solid cta-solid-light mt-9">
              {property.primaryAction.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:text-right">
            <BrandLockup kind="property" compact inverse />
            <p className="text-sm text-ivory/68">{property.status}</p>
            <p className="image-caption max-w-xs text-ivory/72">{property.visualNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
