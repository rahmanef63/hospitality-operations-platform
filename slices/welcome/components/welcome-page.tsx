import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import { BotanicalMark } from "@/shared/brand";
import { getWelcomeLocaleMeta } from "@/shared/welcome";
import type { WelcomePageProps } from "../types";
import { WelcomeLanguagePicker } from "./welcome-language-picker";

function formatStayDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export function WelcomePage({ locale, content, propertyName, propertySlug, context, token, contactHref, contactLabel }: WelcomePageProps) {
  const meta = getWelcomeLocaleMeta(locale);
  return (
    <main id="main-content" lang={meta.htmlLang} dir={meta.direction} className="relative min-h-screen overflow-hidden bg-charcoal text-ivory">
      <div className="absolute -right-24 -top-24 size-[32rem] text-warm-sand/8 sm:size-[44rem]" aria-hidden="true"><BotanicalMark className="size-full" /></div>
      <div className="relative mx-auto flex min-h-screen max-w-[96rem] flex-col justify-between px-4 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-14">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div><p className="kicker text-warm-sand">{propertyName}</p><p className="mt-2 text-xs tracking-[.12em] text-ivory/55 uppercase">return to stillness.</p></div>
          <WelcomeLanguagePicker locale={locale} token={token} guestName={content.guestName} propertySlug={propertySlug} />
        </header>

        <section className="max-w-5xl py-20 sm:py-28">
          <p className="kicker text-warm-sand">{meta.noteLabel}</p>
          <h1 className="mt-8 text-balance font-serif text-7xl leading-[.83] tracking-[-.05em] sm:text-8xl lg:text-[9rem]">{content.headline}</h1>
          <p className="mt-10 max-w-2xl whitespace-pre-line text-pretty text-base leading-8 text-ivory/75 sm:text-lg sm:leading-9">{content.body}</p>
          {context ? (
            <aside className="mt-10 grid max-w-2xl gap-4 border-y border-ivory/15 py-6 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-semibold text-ivory">{context.propertyName}{context.unitName ? ` · ${context.unitName}` : ""}</p>
                <p className="mt-2 text-xs leading-6 text-ivory/58">{context.reference} · {context.status.replaceAll("_", " ")}</p>
              </div>
              <p className="flex items-center gap-2 text-xs font-semibold text-warm-sand"><CalendarDays className="size-4" aria-hidden="true" />{formatStayDate(context.checkIn, meta.htmlLang)} → {formatStayDate(context.checkOut, meta.htmlLang)}</p>
            </aside>
          ) : null}
          <a href={contactHref} className="cta-solid cta-solid-light mt-10"><MessageCircle className="size-4" aria-hidden="true" />{contactLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </section>

        <footer className="flex flex-wrap items-end justify-between gap-6 border-t border-ivory/15 pt-7"><p className="font-serif text-2xl italic text-warm-sand">{content.signature}</p><p className="text-xs leading-6 text-ivory/65">{meta.privateLabel}</p></footer>
      </div>
    </main>
  );
}
