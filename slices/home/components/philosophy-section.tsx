import Image from "next/image";
import type { HomeContent } from "@/shared/content";

export function PhilosophySection({ content }: { content: HomeContent["philosophy"] }) {
  return (
    <section id="philosophy" className="scroll-parallax-section relative isolate overflow-hidden bg-warm-sand">
      <Image src={content.image.src} alt={content.image.alt} fill sizes="100vw" className="scroll-parallax-bg -z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ivory/52" />

      <div className="page-shell content-inset section-pad">
        <p className="kicker text-umber">{content.eyebrow}</p>
        <h2 className="scroll-reveal text-balance mt-7 max-w-4xl font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
          {content.title}
        </h2>

        <div className="scroll-reveal mt-16 grid gap-12 border-t border-charcoal/20 pt-9 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div className="space-y-7 text-base leading-8 text-ink-soft">
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <blockquote className="text-balance self-end font-serif text-4xl leading-[1.04] italic text-charcoal sm:text-5xl lg:text-6xl">
            “{content.quote}”
          </blockquote>
        </div>
        <p className="image-caption mt-12 text-charcoal/70">{content.image.caption}</p>
      </div>
    </section>
  );
}
