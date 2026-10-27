import Link from "next/link";
import { Bot, Cloud, ExternalLink, Globe2, Languages, ShieldCheck } from "lucide-react";
import { WELCOME_LOCALE_OPTIONS } from "@/shared/welcome";
import { ActivityPanel } from "./activity-panel";
import { ReservationWelcomePanel } from "./reservation-welcome-panel";
import { WelcomeEditor } from "./welcome-editor";
import { AnnouncementManager } from "./announcement-manager";
import type { AdminDashboardProps } from "../types";

const statusMessages: Record<string, string> = {
  saved: "Draft tersimpan di Convex Cloud.",
  published: "Welcome message sudah dipublikasikan.",
  translated: "Terjemahan AI disimpan sebagai draft untuk ditinjau.",
  "announcement-settings": "Pengaturan announcement dan audio tersimpan.",
  "announcement-rule": "Announcement rule tersimpan.",
  "announcement-archived": "Announcement rule diarsipkan.",
  "announcement-seeded": "Greeting default berhasil dipasang.",
  "experience-saved": "Tampilan welcome dan presentation sudah diperbarui.",
};
const errorMessages: Record<string, string> = {
  locale: "Pilihan bahasa tidak valid.",
  validation: "Periksa panjang dan field yang wajib diisi.",
  service: "Convex Cloud tidak dapat menyelesaikan permintaan.",
  ai: "Terjemahan AI tidak dapat diselesaikan. Periksa konfigurasi BYOK.",
  "announcement-geo": "Koordinat properti harus tersedia sebelum prayer schedule diaktifkan.",
  "announcement-validation": "Periksa field announcement, rentang waktu, token, dan volume.",
  "announcement-service": "Announcement tidak dapat diperbarui. Coba kembali.",
  "experience-validation": "Minimal satu slide harus aktif dan semua urutan, durasi, serta media harus valid.",
};

export function AdminDashboard({ overview, links, linkError, properties, selectedProperty, endpointUrl, previewUrl, backendError, status, error, selectedLocale, formAction, announcementOverview, announcementTimezone, announcementCoordinatesAvailable, prayerPreview, announcementSettingsAction, announcementExperienceAction, announcementRuleAction, announcementArchiveAction, announcementSeedAction }: AdminDashboardProps) {
  const publishedCount = Object.values(overview.configs).filter((config) => config.publishedAt).length;
  const selected = overview.configs[selectedLocale];
  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div><p className="kicker text-umber">Guest welcome · {selectedProperty.name}</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">Dua puluh bahasa, terhubung ke setiap reservasi.</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">Profil tamu menentukan bahasa awal, reservasi dapat menimpanya, dan link privat selalu mengambil data masa inap terbaru.</p></div>
          <Link href="/admin/ai" className="cta-solid"><Bot className="size-4" aria-hidden="true" />AI & Translation</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        {status || error || backendError ? <div className={`rounded-[.4rem] border-l-2 px-5 py-4 text-sm ${error || backendError ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]" : "border-olive bg-[#dfe9df] text-[#31533b]"}`} role="status">{backendError ? "Convex Cloud sementara tidak dapat dijangkau. Editor menampilkan fallback aman dan penyimpanan dinonaktifkan." : error ? errorMessages[error] ?? "Permintaan tidak dapat diselesaikan." : statusMessages[status ?? ""]}</div> : null}

        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-2 xl:grid-cols-4">
          <article className="bg-white p-5"><Languages className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Bahasa</p><p className="mt-2 font-serif text-3xl">{publishedCount}/20</p><p className="mt-2 text-xs text-ink-soft">Published templates</p></article>
          <article className="bg-white p-5"><Globe2 className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Guest links</p><p className="mt-2 font-serif text-3xl">{links.length}</p><p className="mt-2 text-xs text-ink-soft">Aktif atau terbaru</p></article>
          <article className="bg-white p-5"><Cloud className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Backend</p><p className="mt-2 font-serif text-3xl">Convex</p><p className="mt-2 text-xs text-ink-soft">{backendError ? "Connection unavailable" : "Connected and editable"}</p></article>
          <article className="bg-white p-5"><ShieldCheck className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Guest access</p><p className="mt-2 font-serif text-3xl">Encrypted</p><p className="mt-2 text-xs text-ink-soft">Opaque expiring tokens</p></article>
        </section>


        <form method="get" className="flex flex-col gap-3 rounded-[.45rem] border border-charcoal/12 bg-white p-4 sm:flex-row sm:items-end">
          <input type="hidden" name="locale" value={selectedLocale} />
          <label className="min-w-0 flex-1"><span className="text-xs font-semibold tracking-[.08em] uppercase">Properti</span><select name="property" defaultValue={selectedProperty.slug} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 bg-white px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20">{(properties.length ? properties : [selectedProperty]).map((property) => <option key={property.slug} value={property.slug}>{property.name}</option>)}</select></label>
          <button type="submit" className="cta-outline">Ganti properti</button>
        </form>

        <ReservationWelcomePanel links={links} linkError={linkError} />

        <AnnouncementManager
          overview={announcementOverview}
          propertySlug={selectedProperty.slug}
          timezone={announcementTimezone}
          coordinatesAvailable={announcementCoordinatesAvailable}
          prayerPreview={prayerPreview}
          settingsAction={announcementSettingsAction}
          experienceAction={announcementExperienceAction}
          ruleAction={announcementRuleAction}
          archiveAction={announcementArchiveAction}
          seedAction={announcementSeedAction}
        />

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 p-5 sm:p-7"><p className="kicker text-umber">Language library</p><h2 className="mt-2 font-serif text-3xl">Pilih template yang akan diedit</h2></header>
          <nav aria-label="Welcome languages" className="grid grid-cols-2 gap-px bg-charcoal/10 p-px sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {WELCOME_LOCALE_OPTIONS.map((locale) => {
              const config = overview.configs[locale.code];
              const active = locale.code === selectedLocale;
              return <Link key={locale.code} href={`/admin/welcome?locale=${encodeURIComponent(locale.code)}&property=${encodeURIComponent(selectedProperty.slug)}#welcome-editor`} aria-current={active ? "page" : undefined} className={`min-h-20 bg-white p-4 text-sm transition hover:bg-[#f8f8f5] ${active ? "ring-2 ring-inset ring-olive" : ""}`}><span className="block font-semibold">{locale.nativeLabel}</span><span className="mt-1 block text-xs text-ink-soft">{locale.label}</span><span className={`mt-3 inline-block size-2 rounded-full ${config.publishedAt ? "bg-[#43704f]" : "bg-[#a3721f]"}`} aria-label={config.publishedAt ? "Published" : "Draft"} /></Link>;
            })}
          </nav>
        </section>

        <section id="welcome-editor" className="scroll-mt-24"><WelcomeEditor config={selected} propertySlug={selectedProperty.slug} propertyName={selectedProperty.name} formAction={formAction} previewUrl={previewUrl} disabled={backendError} /></section>

        <a href={endpointUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 rounded-[.45rem] border border-charcoal/12 bg-white px-5 text-sm font-semibold hover:border-olive"><span className="min-w-0"><span className="block">Public welcome endpoint</span><span className="mt-1 block truncate font-mono text-xs font-normal text-ink-soft">{endpointUrl}</span></span><ExternalLink className="size-4 shrink-0" aria-hidden="true" /></a>
        <ActivityPanel events={overview.events} />
      </div>
    </div>
  );
}
