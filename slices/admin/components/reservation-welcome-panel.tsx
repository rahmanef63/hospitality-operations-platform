"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";
import { WELCOME_LOCALE_META, type ReservationWelcomeLink } from "@/shared/welcome";

function whatsappHref(phone: string | undefined, link: ReservationWelcomeLink) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!/^\d{8,15}$/.test(digits)) return undefined;
  const message = `Halo ${link.guestName}, berikut sambutan privat untuk masa inap Anda di ${link.propertyName}: ${link.url}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function ReservationWelcomePanel({ links, linkError }: {
  links: ReservationWelcomeLink[];
  linkError: boolean;
}) {
  const [copied, setCopied] = useState<string>();

  async function copy(link: ReservationWelcomeLink) {
    await navigator.clipboard.writeText(link.url);
    setCopied(link.reservationId);
    window.setTimeout(() => setCopied(undefined), 1800);
  }

  return (
    <section className="overflow-hidden rounded-[.6rem] border border-charcoal/14 bg-white">
      <header className="flex flex-col gap-3 border-b border-charcoal/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div><p className="kicker text-umber">Reservation integration</p><h2 className="mt-2 font-serif text-3xl">Sambutan yang siap dibagikan</h2></div>
        <p className="max-w-lg text-xs leading-6 text-ink-soft">Link terenkripsi mengambil nama, bahasa, properti, unit, dan periode langsung dari reservasi. Mengubah profil tamu atau reservasi akan memperbarui pengalaman berikutnya.</p>
      </header>
      {linkError ? <p className="border-b border-[#843f35]/15 bg-[#f4e0db] p-5 text-sm text-[#6f2d25]">Guest link secret belum tersedia pada runtime ini. Editor bahasa tetap dapat digunakan, tetapi link reservasi tidak dibuat.</p> : null}
      {links.length ? (
        <div className="divide-y divide-charcoal/10">
          {links.map((link) => {
            const locale = WELCOME_LOCALE_META[link.locale];
            const whatsapp = whatsappHref(link.guestPhone, link);
            return (
              <article key={link.reservationId} className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1fr_auto] xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{link.guestName}</p><span className="rounded-full bg-olive/10 px-2.5 py-1 text-[.62rem] font-bold text-olive">{locale.nativeLabel}</span></div>
                  <p className="mt-2 text-xs leading-6 text-ink-soft">{link.reference} · {link.propertyName}{link.unitName ? ` · ${link.unitName}` : ""} · {link.checkIn} → {link.checkOut}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/reservations#reservation-${link.reservationId}`} className="inline-flex min-h-11 items-center rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold hover:border-olive">Reservasi</Link>
                  <button type="button" onClick={() => copy(link)} className="inline-flex min-h-11 items-center gap-2 rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold hover:border-olive">{copied === link.reservationId ? <Check className="size-4 text-olive" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}{copied === link.reservationId ? "Tersalin" : "Salin link"}</button>
                  {whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold hover:border-olive"><MessageCircle className="size-4" aria-hidden="true" />WhatsApp</a> : null}
                  <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[.35rem] bg-charcoal px-3 text-xs font-semibold text-ivory"><ExternalLink className="size-4" aria-hidden="true" />Buka</a>
                </div>
              </article>
            );
          })}
        </div>
      ) : <p className="p-7 text-sm leading-7 text-ink-soft">Belum ada reservasi aktif atau terbaru yang memiliki link sambutan. Link muncul otomatis setelah reservasi nyata disimpan.</p>}
    </section>
  );
}
