import { BotanicalMark } from "@/shared/brand";
import type { HomeContent } from "@/shared/content";

export function PhilosophySection({ content }: { content: HomeContent["philosophy"] }) {
  return (
    <section id="philosophy" className="section-pad surface-grain overflow-hidden bg-warm-sand/45">
      <div className="page-shell relative grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <div>
          <p className="eyebrow text-earth-ink">{content.eyebrow}</p>
          <h2 className="text-balance mt-7 max-w-2xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] sm:text-8xl">
            {content.title}
          </h2>
          <BotanicalMark className="mt-12 size-20 text-taupe" />
        </div>
        <div className="flex flex-col justify-between gap-16">
          <div className="space-y-8 border-t border-charcoal/15 pt-9 text-base leading-8 text-ink-soft">
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <blockquote className="border-l border-muted-brown pl-7 font-serif text-3xl leading-tight italic text-charcoal sm:text-4xl">
            “{content.quote}”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
