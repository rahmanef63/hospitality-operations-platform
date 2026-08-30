import Link from "next/link";
import { BotanicalMark, BrandLockup } from "@/shared/brand";

export const metadata = {
  title: "Offline | Hospitality Operations Platform",
  robots: { index: false, follow: false, noarchive: true },
};

export default function OfflinePage() {
  return (
    <main id="main-content" data-hospitality-offline className="relative flex min-h-dvh items-center overflow-hidden bg-charcoal px-5 py-12 text-ivory sm:px-10">
      <BotanicalMark className="absolute -right-28 -top-28 size-[36rem] text-warm-sand/8" />
      <section className="relative mx-auto w-full max-w-3xl border-y border-ivory/15 py-12 sm:py-16">
        <BrandLockup compact inverse />
        <p className="kicker mt-16 text-warm-sand">Connection paused</p>
        <h1 className="mt-5 text-balance font-serif text-6xl leading-[.88] tracking-[-.04em] sm:text-8xl">The quiet remains.</h1>
        <p className="mt-7 max-w-xl text-sm leading-8 text-ivory/70 sm:text-base">Hospitality Operations Platform is temporarily offline. Reconnect to refresh reservations, private welcome details, and the latest property information.</p>
        <Link href="/" className="cta-solid cta-solid-light mt-9">Try again</Link>
      </section>
    </main>
  );
}
