import Image from "next/image";
import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import type { WelcomePresentationSlide, WelcomeSlideProps } from "../types";

function formatStayDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function SlideImage({ slide, priority }: { slide: WelcomePresentationSlide; priority: boolean }) {
  return (
    <Image
      src={slide.src}
      alt={slide.alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover"
    />
  );
}

export function WelcomeSlide({ slide, index, active, localeMeta, content, propertyName, context, contactHref, contactLabel }: WelcomeSlideProps) {
  return (
    <article className="welcome-tv-slide" data-active={active || undefined} aria-hidden={!active} inert={active ? undefined : true} data-slide={slide.id}>
      <SlideImage slide={slide} priority={index === 0} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,23,20,.86)_0%,rgba(24,23,20,.58)_48%,rgba(24,23,20,.16)_78%),linear-gradient(0deg,rgba(24,23,20,.64)_0%,transparent_58%)]" />
      <div className="welcome-tv-slide-inner relative z-10 flex min-h-dvh flex-col justify-center text-ivory">
        {slide.id === "arrival" ? <div className="max-w-6xl"><p className="kicker text-warm-sand">{localeMeta.noteLabel}</p><h2 className="welcome-tv-heading mt-7 text-balance font-serif leading-[.82] tracking-[-.055em]">{content.headline}</h2><p className="welcome-tv-copy mt-8 max-w-3xl whitespace-pre-line text-pretty text-ivory/78">{content.body}</p></div> : null}
        {slide.id === "stay" ? <div className="max-w-5xl"><p className="kicker text-warm-sand">{propertyName}</p><h2 className="welcome-tv-subheading mt-6 text-balance font-serif leading-[.88] tracking-[-.045em]">{context ? context.guestName : localeMeta.genericHeadline}</h2>{context ? <div className="mt-10 grid max-w-4xl gap-6 border-y border-ivory/18 py-7 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-lg font-semibold">{context.propertyName}{context.unitName ? ` · ${context.unitName}` : ""}</p><p className="mt-2 text-sm text-ivory/62">{context.reference} · {context.status.replaceAll("_", " ")}</p></div><p className="flex items-center gap-3 text-sm font-semibold text-warm-sand"><CalendarDays className="size-5" aria-hidden="true" />{formatStayDate(context.checkIn, localeMeta.htmlLang)} → {formatStayDate(context.checkOut, localeMeta.htmlLang)}</p></div> : <p className="welcome-tv-copy mt-8 max-w-2xl text-ivory/76">{content.body}</p>}</div> : null}
        {slide.id === "stillness" ? <div className="max-w-5xl"><p className="kicker text-warm-sand">Hospitality Operations Platform</p><h2 className="welcome-tv-heading mt-7 text-balance font-serif leading-[.82] tracking-[-.055em]">return to stillness.</h2><p className="welcome-tv-copy mt-8 max-w-2xl text-ivory/74">{content.signature}</p></div> : null}
        {slide.id === "contact" ? <div className="max-w-5xl"><p className="kicker text-warm-sand">{propertyName}</p><h2 className="welcome-tv-subheading mt-6 text-balance font-serif leading-[.88] tracking-[-.045em]">{contactLabel}</h2><p className="welcome-tv-copy mt-8 max-w-2xl text-ivory/74">{localeMeta.privateLabel}</p><a href={contactHref} className="cta-solid cta-solid-light mt-10"><MessageCircle className="size-4" aria-hidden="true" />{contactLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></a></div> : null}
      </div>
      <p className="absolute bottom-[max(6.4rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-20 max-w-xs text-right text-[.58rem] font-semibold tracking-[.08em] text-ivory/50 uppercase">{slide.caption}</p>
    </article>
  );
}
