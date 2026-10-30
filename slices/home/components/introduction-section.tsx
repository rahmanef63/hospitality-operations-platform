import Image from "next/image";
import { BotanicalMark } from "@/shared/brand";
import type { HomeContent } from "@/shared/content";

export function IntroductionSection({ content }: { content: HomeContent["introduction"] }) {
  return (
    <section id="about" className="section-pad bg-paper">
      <div className="page-shell grid gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
        <h2 className="content-inset scroll-reveal text-balance font-serif text-6xl leading-[0.9] tracking-[-0.035em] sm:text-7xl lg:col-span-8 lg:text-8xl">
          {content.title}
        </h2>
        <BotanicalMark className="hidden size-20 self-end justify-self-end text-olive/75 lg:col-span-4 lg:block" />

        <div className="content-inset scroll-reveal scroll-reveal-left grid gap-8 border-t border-charcoal/18 pt-8 text-base leading-8 text-ink-soft sm:grid-cols-2 lg:col-span-7 lg:pr-12">
          {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <figure className="scroll-media lg:col-span-5 lg:-mt-24">
          <div className="image-frame aspect-[4/5]">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="content-inset image-caption mt-3">{content.image.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
