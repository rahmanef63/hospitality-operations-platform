import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AreaGuideContent, PropertyPageUi } from "@/shared/content";

export function PropertyGuides({ guides, ui }: { guides: AreaGuideContent[]; ui: PropertyPageUi }) {
  const [featured, ...secondary] = guides;
  if (!featured) return null;

  return (
    <section className="section-pad bg-paper">
      <div className="page-shell">
        <div className="content-inset scroll-reveal max-w-4xl">
          <p className="kicker text-umber">{ui.guidesEyebrow}</p>
          <h2 className="text-balance mt-7 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            {ui.guidesTitle}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-ink-soft">
            {ui.guidesDescription}
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1.08fr_.92fr]">
          <Link
            prefetch={false}
            href={`/guides/${featured.slug}`}
            className="scroll-reveal scroll-reveal-left group flex min-h-[28rem] flex-col justify-between bg-warm-sand/55 p-8 sm:p-12"
          >
            <p className="kicker text-umber">{featured.eyebrow}</p>
            <div>
              <h3 className="text-balance font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">{featured.title}</h3>
              <p className="mt-6 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">{featured.summary}</p>
              <span className="editorial-link mt-9">
                {ui.guideReadLabel}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          <div className="border-y border-charcoal/18">
            {secondary.map((guide) => (
              <Link
                prefetch={false}
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="scroll-list-item group flex min-h-56 flex-col justify-between border-b border-charcoal/18 p-8 last:border-b-0 sm:p-10"
              >
                <p className="kicker text-umber">{guide.eyebrow}</p>
                <div className="mt-12 flex items-end justify-between gap-8">
                  <div>
                    <h3 className="font-serif text-4xl leading-none">{guide.title}</h3>
                    <p className="mt-5 max-w-lg text-sm leading-7 text-ink-soft">{guide.summary}</p>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
