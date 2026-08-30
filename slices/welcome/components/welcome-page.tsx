"use client";

import { ArrowUpRight, CalendarDays, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { BotanicalMark } from "@/shared/brand";
import { getWelcomeLocaleMeta } from "@/shared/welcome";
import type { WelcomePageProps } from "../types";
import { useAnnouncementExperience } from "../hooks/use-announcement-experience";
import { WelcomeLanguagePicker } from "./welcome-language-picker";

function formatStayDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export function WelcomePage({ locale, content, propertyName, propertySlug, context, token, contactHref, contactLabel, announcements }: WelcomePageProps) {
  const meta = getWelcomeLocaleMeta(locale);
  const settings = announcements.settings;
  const audio = useAnnouncementExperience({
    program: announcements,
    guestName: content.guestName,
    propertyName,
    locale,
    voiceLocale: meta.htmlLang,
    enabled: settings.welcomeShowAnnouncement,
  });
  const headline = audio.active?.message ?? content.headline;
  const showHeader = settings.welcomeShowBrand || settings.welcomeShowLanguage || settings.welcomeShowAnnouncement;
  const showFooter = settings.welcomeShowSignature || settings.welcomeShowPrivateNote;
  return (
    <main id="main-content" lang={meta.htmlLang} dir={meta.direction} className="welcome-screen-root relative min-h-[100svh] min-h-[100dvh] w-full overflow-x-hidden bg-charcoal text-ivory">
      <div className="absolute -right-24 -top-24 size-[32rem] text-warm-sand/8 sm:size-[44rem]" aria-hidden="true"><BotanicalMark className="size-full" /></div>
      <div className="welcome-screen-shell relative flex min-h-[100svh] min-h-[100dvh] w-full flex-col justify-between px-4 py-8 sm:px-10 sm:py-10 lg:px-[6vw] lg:py-14">
        {showHeader ? <header className="flex flex-wrap items-start justify-between gap-5">
          {settings.welcomeShowBrand ? <div><p className="kicker text-warm-sand">{propertyName}</p><p className="mt-2 text-xs tracking-[.12em] text-ivory/55 uppercase">return to stillness.</p></div> : <span />}
          <div className="flex items-center gap-2">
            {settings.welcomeShowAnnouncement ? <button type="button" onClick={audio.toggleMuted} disabled={!audio.supported} aria-label={audio.muted ? "Unmute guest announcements" : "Mute guest announcements"} aria-pressed={!audio.muted} title={audio.muted ? "Unmute guest announcements" : "Mute guest announcements"} className="flex size-11 shrink-0 items-center justify-center border border-ivory/25 text-ivory transition hover:border-warm-sand hover:text-warm-sand disabled:cursor-not-allowed disabled:opacity-40">{audio.muted ? <VolumeX className="size-4.5" aria-hidden="true" /> : <Volume2 className="size-4.5" aria-hidden="true" />}</button> : null}
            {settings.welcomeShowLanguage ? <WelcomeLanguagePicker locale={locale} token={token} guestName={content.guestName} propertySlug={propertySlug} /> : null}
          </div>
        </header> : null}

        <section className="welcome-screen-content w-full max-w-6xl py-16 sm:py-24 lg:py-20">
          <p className="kicker text-warm-sand">{audio.active ? audio.active.kind.replaceAll("_", " ") : meta.noteLabel}</p>
          <h1 aria-live="polite" className="welcome-screen-heading mt-8 max-w-[11ch] text-balance font-serif text-[clamp(4.3rem,11vw,10.5rem)] leading-[.82] tracking-[-.055em]">{headline}</h1>
          {settings.welcomeShowBody ? <p className="welcome-screen-copy mt-10 max-w-2xl whitespace-pre-line text-pretty text-base leading-8 text-ivory/75 sm:text-lg sm:leading-9">{content.body}</p> : null}
          {context && settings.welcomeShowStay ? <aside className="mt-10 grid max-w-2xl gap-4 border-y border-ivory/15 py-6 text-sm sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-semibold text-ivory">{context.propertyName}{context.unitName ? ` · ${context.unitName}` : ""}</p><p className="mt-2 text-xs leading-6 text-ivory/58">{context.reference} · {context.status.replaceAll("_", " ")}</p></div><p className="flex items-center gap-2 text-xs font-semibold text-warm-sand"><CalendarDays className="size-4" aria-hidden="true" />{formatStayDate(context.checkIn, meta.htmlLang)} → {formatStayDate(context.checkOut, meta.htmlLang)}</p></aside> : null}
          {settings.welcomeShowContact ? <a href={contactHref} className="cta-solid cta-solid-light mt-10"><MessageCircle className="size-4" aria-hidden="true" />{contactLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></a> : null}
        </section>

        {showFooter ? <footer className="welcome-screen-footer flex w-full flex-wrap items-end justify-between gap-6 border-t border-ivory/15 pt-7">{settings.welcomeShowSignature ? <p className="font-serif text-2xl italic text-warm-sand">{content.signature}</p> : <span />}{settings.welcomeShowPrivateNote ? <p className="text-xs leading-6 text-ivory/65">{meta.privateLabel}</p> : null}</footer> : null}
      </div>
    </main>
  );
}
