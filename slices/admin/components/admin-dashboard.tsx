import { Cloud, ExternalLink, Globe2, Languages, ShieldCheck } from "lucide-react";
import { ActivityPanel } from "./activity-panel";
import { WelcomeEditor } from "./welcome-editor";
import type { AdminDashboardProps } from "../types";

const statusMessages: Record<string, string> = { saved: "Draft tersimpan di Convex Cloud.", published: "Welcome message sudah dipublikasikan." };
const errorMessages: Record<string, string> = { locale: "Pilihan bahasa tidak valid.", validation: "Periksa panjang dan field yang wajib diisi.", service: "Convex Cloud tidak dapat menyelesaikan permintaan." };

export function AdminDashboard({ overview, endpointUrl, previewUrl, backendError, status, error, selectedLocale, formAction }: AdminDashboardProps) {
  const publishedCount = Object.values(overview.configs).filter((config) => config.publishedAt).length;
  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div><p className="kicker text-umber">Guest welcome</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">Satu suara yang konsisten, dua bahasa.</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">Edit dengan preview nama tamu, simpan sebagai draft, lalu publish hanya ketika copy siap tampil pada pengalaman guest.</p></div>
          <div className="flex flex-wrap gap-2"><a href="#welcome-id" className="cta-outline"><Languages className="size-4" aria-hidden="true" />Indonesia</a><a href="#welcome-en" className="cta-outline">English</a></div>
        </div>
      </header>

      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        {status || error || backendError ? <div className={`rounded-[.4rem] border-l-2 px-5 py-4 text-sm ${error || backendError ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]" : "border-olive bg-[#dfe9df] text-[#31533b]"}`} role="status">{backendError ? "Convex Cloud sementara tidak dapat dijangkau. Editor menampilkan fallback aman dan tombol simpan dinonaktifkan." : error ? errorMessages[error] ?? "Permintaan tidak dapat diselesaikan." : statusMessages[status ?? ""]}{selectedLocale ? ` (${selectedLocale.toUpperCase()})` : ""}</div> : null}

        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 md:grid-cols-3">
          <article className="bg-white p-5 sm:p-6"><Cloud className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Backend</p><p className="mt-2 font-serif text-3xl">Convex Cloud</p><p className="mt-2 text-xs text-ink-soft">{backendError ? "Connection unavailable" : "Connected and editable"}</p></article>
          <article className="bg-white p-5 sm:p-6"><Globe2 className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Published</p><p className="mt-2 font-serif text-3xl">{publishedCount}/2 bahasa</p><p className="mt-2 text-xs text-ink-soft">Draft tetap privat sampai Publish ditekan.</p></article>
          <article className="bg-white p-5 sm:p-6"><ShieldCheck className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Security</p><p className="mt-2 font-serif text-3xl">Server-only</p><p className="mt-2 text-xs text-ink-soft">Signed session dan protected Convex action.</p></article>
        </section>

        <a href={endpointUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 rounded-[.45rem] border border-charcoal/12 bg-white px-5 text-sm font-semibold hover:border-olive"><span className="min-w-0"><span className="block">Public welcome endpoint</span><span className="mt-1 block truncate font-mono text-xs font-normal text-ink-soft">{endpointUrl}</span></span><ExternalLink className="size-4 shrink-0" aria-hidden="true" /></a>

        <section className="space-y-8" aria-label="Welcome message editors">{(["id", "en"] as const).map((locale) => <WelcomeEditor key={locale} config={overview.configs[locale]} formAction={formAction} previewUrl={previewUrl} disabled={backendError} />)}</section>
        <ActivityPanel events={overview.events} />
      </div>
    </div>
  );
}
