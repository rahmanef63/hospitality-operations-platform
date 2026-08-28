import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { BotanicalMark } from "@/shared/brand";
import type { WelcomePageProps } from "../types";

export function WelcomePage({ locale, content, contactHref, contactLabel }: WelcomePageProps) {
  const nextLocale = locale === "id" ? "en" : "id";
  const nextLabel = locale === "id" ? "English" : "Bahasa Indonesia";
  const nameParam = content.guestName ? `&name=${encodeURIComponent(content.guestName)}` : "";
  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-charcoal text-ivory">
      <div className="absolute -right-24 -top-24 size-[32rem] text-warm-sand/8 sm:size-[44rem]" aria-hidden="true">
        <BotanicalMark className="size-full" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-[96rem] flex-col justify-between px-4 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-14">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="kicker text-warm-sand">Ruma Kamyna</p>
            <p className="mt-2 text-xs tracking-[.12em] text-ivory/55 uppercase">return to stillness.</p>
          </div>
          <Link
            href={`/welcome?locale=${nextLocale}${nameParam}`}
            className="inline-flex min-h-11 items-center border border-ivory/25 px-4 text-xs font-semibold tracking-[.12em] uppercase hover:bg-ivory hover:text-charcoal"
          >
            {nextLabel}
          </Link>
        </header>

        <section className="max-w-5xl py-20 sm:py-28">
          <p className="kicker text-warm-sand">A note for your stay</p>
          <h1 className="mt-8 text-balance font-serif text-7xl leading-[.83] tracking-[-.05em] sm:text-8xl lg:text-[9rem]">
            {content.headline}
          </h1>
          <p className="mt-10 max-w-2xl text-pretty text-base leading-8 text-ivory/75 sm:text-lg sm:leading-9">
            {content.body}
          </p>
          <a href={contactHref} className="cta-solid cta-solid-light mt-10">
            <MessageCircle className="size-4" aria-hidden="true" />
            {contactLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </section>

        <footer className="flex flex-wrap items-end justify-between gap-6 border-t border-ivory/15 pt-7">
          <p className="font-serif text-2xl italic text-warm-sand">{content.signature}</p>
          <p className="text-xs leading-6 text-ivory/65">Private guest page · not indexed</p>
        </footer>
      </div>
    </main>
  );
}
