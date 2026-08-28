import Image from "next/image";
import type { PropertyContent } from "@/shared/content";

export function PropertyPillars({ property }: { property: PropertyContent }) {
  const leadImage = property.pillars[0]?.image;
  if (!leadImage) return null;

  return (
    <section className="section-pad bg-charcoal text-ivory">
      <div className="page-shell grid gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
        <div>
          <h2 className="text-balance font-serif text-6xl leading-[0.9] tracking-[-0.035em] sm:text-8xl">
            Considered in every direction.
          </h2>
          <figure className="mt-12">
            <div className="image-frame aspect-[4/5]">
              <Image
                src={leadImage.src}
                alt={leadImage.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="image-caption mt-3 text-ivory/58">{leadImage.caption}</figcaption>
          </figure>
        </div>

        <div className="self-end border-y border-ivory/16">
          {property.pillars.map((pillar, index) => (
            <article key={pillar.title} className="grid gap-6 border-b border-ivory/16 py-9 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:py-12">
              <span className="font-serif text-4xl text-warm-sand/55">0{index + 1}</span>
              <div>
                <h3 className="font-serif text-4xl leading-none sm:text-5xl">{pillar.title}</h3>
                <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/62 sm:text-base">{pillar.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
