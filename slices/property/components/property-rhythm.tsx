import { BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyRhythm({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad bg-warm-sand/52">
      <div className="page-shell grid gap-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="kicker text-umber">A day at Ruma</p>
          <h2 className="text-balance mt-7 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            Let the day unfold slowly.
          </h2>
          <BotanicalMark className="mt-10 size-18 text-olive/75" />
        </div>

        <div className="border-y border-charcoal/20">
          {property.rhythm.map((item, index) => (
            <article key={item.moment} className="grid gap-5 border-b border-charcoal/20 py-9 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:py-12">
              <div>
                <span className="text-xs tracking-[0.16em] text-umber">0{index + 1}</span>
                <p className="mt-3 text-sm font-semibold text-charcoal/70">{item.moment}</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl leading-none sm:text-5xl">{item.title}</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
