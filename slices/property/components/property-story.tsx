import { BotanicalMark } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyStory({ property }: { property: PropertyContent }) {
  return (
    <section className="section-pad bg-paper">
      <div className="page-shell grid gap-14 lg:grid-cols-[.55fr_1.45fr] lg:gap-24">
        <div>
          <p className="eyebrow text-earth-ink">The story</p>
          <BotanicalMark className="mt-12 size-20 text-taupe" />
        </div>
        <div>
          <p className="font-serif text-5xl leading-[1.02] tracking-[-0.03em] sm:text-7xl">
            Somewhere between arriving and leaving, time begins to feel different.
          </p>
          <div className="mt-14 grid gap-8 border-t border-charcoal/15 pt-10 text-base leading-8 text-ink-soft md:grid-cols-2">
            {property.story.map((paragraph, index) => (
              <p key={paragraph} className={index === property.story.length - 1 ? "md:col-span-2 md:max-w-2xl" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
