import { ArrowUpRight } from "lucide-react";
import { BotanicalMark } from "@/shared/brand";
import type { HomeContent } from "@/shared/content";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <section id="contact" className="section-pad bg-paper">
      <div className="page-shell relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-ivory px-7 py-14 sm:px-12 sm:py-20 lg:px-20">
        <BotanicalMark className="absolute -right-8 -top-8 size-56 rotate-12 text-taupe/12" />
        <div className="relative max-w-4xl">
          <p className="eyebrow text-earth-ink">{content.eyebrow}</p>
          <h2 className="text-balance mt-6 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
            {content.title}
          </h2>
          <p className="mt-9 max-w-2xl text-base leading-8 text-ink-soft">{content.description}</p>
          <a
            href={content.action.href}
            className="group mt-10 inline-flex items-center gap-4 rounded-full bg-charcoal px-7 py-4 text-xs font-semibold uppercase tracking-[0.17em] text-ivory transition-colors hover:bg-muted-brown"
          >
            {content.action.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
