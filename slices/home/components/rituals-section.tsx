import Image from "next/image";
import type { EditorialItem, HomeContent } from "@/shared/content";

function RitualTile({ item, large = false }: { item: EditorialItem; large?: boolean }) {
  return (
    <article className={`group relative overflow-hidden bg-charcoal text-ivory ${large ? "min-h-[38rem] lg:row-span-2" : "min-h-[21rem]"}`}>
      <Image
        src={item.image.src}
        alt={item.image.alt}
        fill
        sizes={large ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 38vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
        <span className="text-xs tracking-[0.18em] text-warm-sand">{item.number}</span>
        <h3 className={`mt-4 font-serif leading-none ${large ? "text-6xl sm:text-7xl" : "text-5xl"}`}>{item.title}</h3>
        <p className="mt-5 max-w-md text-sm leading-7 text-ivory/72">{item.description}</p>
      </div>
    </article>
  );
}

export function RitualsSection({ content }: { content: HomeContent["rituals"] }) {
  const first = content.items[0];
  const second = content.items[1];
  const third = content.items[2];
  if (!first || !second || !third) return null;

  return (
    <section className="section-pad bg-paper">
      <div className="page-shell">
        <h2 className="text-balance max-w-5xl font-serif text-6xl leading-[0.9] tracking-[-0.035em] sm:text-8xl">
          {content.title}
        </h2>
        <div className="mt-14 grid gap-3 lg:grid-cols-[1.15fr_.85fr] lg:grid-rows-2">
          <RitualTile item={first} large />
          <RitualTile item={second} />
          <RitualTile item={third} />
        </div>
      </div>
    </section>
  );
}
