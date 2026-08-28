import type { HomeContent } from "@/shared/content";

export function RitualsSection({ content }: { content: HomeContent["rituals"] }) {
  return (
    <section className="section-pad bg-charcoal text-ivory">
      <div className="page-shell">
        <p className="eyebrow text-warm-sand">{content.eyebrow}</p>
        <h2 className="text-balance mt-6 max-w-5xl font-serif text-5xl leading-none tracking-[-0.035em] sm:text-7xl lg:text-8xl">
          {content.title}
        </h2>
        <div className="mt-16 grid border-y border-ivory/15 md:grid-cols-3">
          {content.items.map((item, index) => (
            <article
              key={item.number}
              className={`py-10 md:px-8 md:py-14 ${index > 0 ? "border-t border-ivory/15 md:border-l md:border-t-0" : ""}`}
            >
              <span className="text-xs tracking-[0.22em] text-warm-sand/75">{item.number}</span>
              <h3 className="mt-14 font-serif text-5xl">{item.title}</h3>
              <p className="mt-6 max-w-sm text-sm leading-7 text-ivory/60">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
