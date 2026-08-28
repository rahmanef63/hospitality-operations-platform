import { BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyRhythm({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad bg-warm-sand/52">
      <div className="page-shell grid gap-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-24">
        <div className="content-inset scroll-reveal lg:sticky lg:top-28 lg:self-start">
          <p className="kicker text-umber">A day at Ruma</p>
          <h2 className="text-balance mt-7 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            Let the day unfold slowly.
          </h2>
          <BotanicalMark className="mt-10 size-18 text-olive/75" />
        </div>

        <div className="border-y border-charcoal/20">
          {property.rhythm.map((item) => (
            <article key={item.moment} className="content-inset scroll-list-item border-b border-charcoal/20 py-9 last:border-b-0 sm:py-12">
              <p className="text-sm font-semibold text-umber">{item.moment}</p>
              <h3 className="mt-5 font-serif text-4xl leading-none sm:text-5xl">{item.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
