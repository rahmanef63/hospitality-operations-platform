import { BotanicalMark } from "@/shared/brand";
import type { HomeContent } from "@/shared/content";

export function IntroductionSection({ content }: { content: HomeContent["introduction"] }) {
  return (
    <section id="about" className="section-pad bg-paper">
      <div className="page-shell grid gap-14 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
        <div>
          <p className="eyebrow text-earth-ink">{content.eyebrow}</p>
          <BotanicalMark className="mt-12 size-20 text-taupe" />
        </div>
        <div>
          <h2 className="text-balance max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
            {content.title}
          </h2>
          <div className="mt-12 grid gap-8 border-t border-charcoal/15 pt-10 text-sm leading-8 text-ink-soft sm:grid-cols-2 sm:text-base">
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
