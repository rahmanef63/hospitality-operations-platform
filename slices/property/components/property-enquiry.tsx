import { ArrowUpRight } from "lucide-react";
import { BrandLockup, BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyEnquiry({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad bg-paper">
      <div className="page-shell relative overflow-hidden rounded-[2rem] bg-ivory px-7 py-14 text-center sm:px-12 sm:py-20 lg:px-20">
        <BotanicalMark className="absolute -left-10 -top-10 size-56 -rotate-12 text-taupe/10" />
        <div className="relative mx-auto max-w-4xl">
          <BrandLockup kind="property" compact />
          <p className="eyebrow mt-12 text-earth-ink">Stay awhile</p>
          <h2 className="text-balance mt-6 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            Your time remains yours.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-ink-soft">
            Tell us what you are planning and how you would like the stay to feel. We will take care of the next steps.
          </p>
          <a
            href={property.primaryAction.href}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-charcoal px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-muted-brown"
          >
            {property.primaryAction.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
