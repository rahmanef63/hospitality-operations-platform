import Image from "next/image";
import { BotanicalMark } from "@/shared/brand";
import type { PropertyContent, PropertyPageUi } from "@/shared/content";

export function PropertyStory({ property, ui }: { property: PropertyContent; ui: PropertyPageUi }) {
  const firstImage = property.storyImages[0];
  const secondImage = property.storyImages[1];
  if (!firstImage || !secondImage) return null;

  return (
    <section className="section-pad bg-paper">
      <div className="page-shell">
        <div className="content-inset scroll-reveal grid gap-10 lg:grid-cols-12 lg:items-end">
          <p className="text-balance font-serif text-5xl leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:col-span-9 lg:text-8xl">
            {ui.storyTitle}
          </p>
          <BotanicalMark className="hidden size-20 justify-self-end text-olive/75 lg:col-span-3 lg:block" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <figure className="scroll-media lg:col-span-7">
            <div className="image-frame aspect-[4/3]">
              <Image
                src={firstImage.src}
                alt={firstImage.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="content-inset image-caption mt-3">{firstImage.caption}</figcaption>
          </figure>

          <div className="flex flex-col justify-between gap-12 lg:col-span-5 lg:pl-8">
            <div className="content-inset scroll-reveal scroll-reveal-right space-y-8 border-t border-charcoal/18 pt-8 text-base leading-8 text-ink-soft">
              {property.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <figure className="scroll-media w-full lg:ml-auto lg:w-[78%]">
              <div className="image-frame aspect-[4/5]">
                <Image
                  src={secondImage.src}
                  alt={secondImage.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
