import type { PropertyContent } from "@/shared/content";

export function PropertyPillars({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad bg-charcoal text-ivory">
      <div className="page-shell">
        <p className="eyebrow text-warm-sand">The Ruma approach</p>
        <h2 className="text-balance mt-6 max-w-4xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] sm:text-8xl">
          Thoughtful in every direction.
        </h2>
        <div className="mt-16 grid border-y border-ivory/15 md:grid-cols-3">
          {property.pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`py-10 md:px-8 md:py-14 ${index > 0 ? "border-t border-ivory/15 md:border-l md:border-t-0" : ""}`}
            >
              <span className="font-serif text-4xl text-warm-sand/60">0{index + 1}</span>
              <h3 className="mt-12 font-serif text-4xl leading-none">{pillar.title}</h3>
              <p className="mt-6 text-sm leading-7 text-ivory/60">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
