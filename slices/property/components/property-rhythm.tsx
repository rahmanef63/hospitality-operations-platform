import { BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyRhythm({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad surface-grain bg-warm-sand/45">
      <div className="page-shell grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-earth-ink">A day at Ruma</p>
          <h2 className="text-balance mt-6 font-serif text-6xl leading-[0.92] tracking-[-0.04em] sm:text-8xl">
            Let the day unfold slowly.
          </h2>
          <BotanicalMark className="mt-12 size-20 text-taupe" />
        </div>
        <div className="divide-y divide-charcoal/15 border-y border-charcoal/15">
          {property.rhythm.map((item, index) => (
            <article key={item.moment} className="grid gap-5 py-10 sm:grid-cols-[8rem_1fr] sm:py-14">
              <div>
                <span className="text-xs tracking-[0.2em] text-earth-ink">0{index + 1}</span>
                <p className="eyebrow mt-3 text-charcoal/75">{item.moment}</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl leading-none sm:text-5xl">{item.title}</h3>
                <p className="mt-6 max-w-xl text-sm leading-7 text-ink-soft">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
