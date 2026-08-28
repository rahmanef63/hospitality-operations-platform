import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { HomeContent } from "@/shared/content";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <section id="contact" className="section-pad bg-ivory">
      <div className="page-shell grid overflow-hidden border border-charcoal/12 lg:grid-cols-[1.2fr_.8fr]">
        <figure className="image-frame min-h-[24rem] lg:min-h-[36rem]">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col justify-between bg-olive p-8 text-ivory sm:p-12 lg:p-14">
          <span className="font-serif text-4xl text-ivory/75">K</span>
          <div className="mt-20 lg:mt-0">
            <h2 className="text-balance font-serif text-6xl leading-[0.88] tracking-[-0.035em] sm:text-7xl">
              {content.title}
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-ivory sm:text-base">{content.description}</p>
            <a href={content.action.href} className="cta-solid cta-solid-light mt-9">
              {content.action.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
