import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { GuidePageProps } from "../types";

export function GuidePage({ guide, property }: GuidePageProps) {
  return (
    <main id="main-content" className="bg-paper">
      <section className="section-pad-compact">
        <div className="page-shell grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-stretch lg:gap-8">
          <div className="content-inset scroll-reveal flex flex-col justify-between border-y border-charcoal/16 py-8 lg:py-10 lg:pr-12">
            <Link prefetch={false} href={`/stays/${property.slug}`} className="editorial-link w-fit text-charcoal/72">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Ruma Kamyna
            </Link>
            <div className="mt-20">
              <p className="kicker text-umber">{guide.eyebrow}</p>
              <h1 className="text-balance mt-6 font-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl">
                {guide.title}
              </h1>
              <p className="text-pretty mt-7 max-w-xl text-base leading-8 text-ink-soft">{guide.introduction}</p>
              <p className="mt-8 border-l border-olive pl-5 text-sm leading-7 text-charcoal/72">{guide.statusLabel}</p>
            </div>
          </div>

          <figure className="scroll-media">
            <div className="image-frame min-h-[30rem] h-full lg:min-h-[46rem]">
              <Image
                src={property.heroImage.src}
                alt={property.heroImage.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="content-inset image-caption mt-3">{property.visualNote}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="page-shell content-inset grid gap-14 lg:grid-cols-[.6fr_1.4fr] lg:gap-24">
          <div className="scroll-reveal lg:sticky lg:top-28 lg:self-start">
            <p className="kicker text-umber">Megamendung notes</p>
            <p className="text-balance mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              Useful only when it is verified.
            </p>
          </div>
          <div className="border-y border-charcoal/18">
            {guide.sections.map((section) => (
              <article key={section.title} className="scroll-list-item border-b border-charcoal/18 py-10 last:border-b-0 sm:py-12">
                <h2 className="font-serif text-4xl leading-none sm:text-5xl">{section.title}</h2>
                <div className="mt-6 space-y-5 text-base leading-8 text-ink-soft">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            ))}
          </div>
          <div className="lg:col-start-2">
            <Link prefetch={false} href={`/stays/${property.slug}`} className="cta-solid">
              View Ruma Kamyna in Megamendung
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
