import NextImage from "next/image";
import { Eye, Image as ImageIcon, MonitorPlay, Smartphone } from "lucide-react";
import {
  PRESENTATION_MEDIA_OPTIONS,
  PRESENTATION_SLIDE_LABELS,
  type AnnouncementSettings,
} from "@/shared/announcements";
import type { AdminFormAction } from "../types";

const welcomeFields = [
  ["welcomeShowBrand", "Brand header"],
  ["welcomeShowLanguage", "Language switcher"],
  ["welcomeShowAnnouncement", "Time-aware greeting"],
  ["welcomeShowBody", "Welcome body copy"],
  ["welcomeShowStay", "Reservation details"],
  ["welcomeShowContact", "Contact host button"],
  ["welcomeShowSignature", "Brand signature"],
  ["welcomeShowPrivateNote", "Private-page note"],
] as const;
const presentationFields = [
  ["presentationShowBrand", "Brand top bar"],
  ["presentationShowLanguage", "Language switcher"],
  ["presentationShowAnnouncement", "Current greeting on arrival slide"],
  ["presentationShowCounter", "Slide counter"],
  ["presentationShowInstall", "Install PWA button"],
] as const;

function ToggleGrid({ fields, settings }: { fields: readonly (readonly [keyof AnnouncementSettings, string])[]; settings: AnnouncementSettings }) {
  return <div className="mt-4 grid gap-2 sm:grid-cols-2">{fields.map(([name, label]) => <label key={name} className="flex min-h-12 items-center gap-3 rounded-[.35rem] border border-charcoal/12 bg-[#f8f8f5] px-3 text-xs font-semibold"><input type="checkbox" name={name} defaultChecked={Boolean(settings[name])} />{label}</label>)}</div>;
}

export function GuestExperienceSettingsForm({ settings, propertySlug, action }: {
  settings: AnnouncementSettings;
  propertySlug: string;
  action: AdminFormAction;
}) {
  return (
    <form action={action} className="rounded-[.55rem] border border-charcoal/12 bg-white p-5 sm:p-7">
      <input type="hidden" name="propertySlug" value={propertySlug} />
      <div className="flex items-start gap-3"><Eye className="mt-1 size-5 text-olive" aria-hidden="true" /><div><p className="kicker text-umber">Guest-visible composition</p><h3 className="mt-2 font-serif text-3xl">Tentukan apa yang dilihat tamu.</h3><p className="mt-3 max-w-2xl text-xs leading-6 text-ink-soft">Pengaturan berlaku per properti. Headline utama dan disclosure visual concept tetap dipertahankan untuk menjaga konteks dan akurasi.</p></div></div>
      <div className="mt-7 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[.45rem] border border-charcoal/12 p-5"><div className="flex items-center gap-2"><Smartphone className="size-4 text-olive" aria-hidden="true" /><p className="font-semibold">Standard welcome</p></div><ToggleGrid fields={welcomeFields} settings={settings} /></section>
        <section className="rounded-[.45rem] border border-charcoal/12 p-5"><div className="flex items-center gap-2"><MonitorPlay className="size-4 text-olive" aria-hidden="true" /><p className="font-semibold">Presentation chrome</p></div><ToggleGrid fields={presentationFields} settings={settings} /></section>
      </div>

      <section className="mt-6 overflow-hidden rounded-[.45rem] border border-charcoal/12">
        <header className="flex items-start gap-3 border-b border-charcoal/10 bg-[#f8f8f5] p-5"><ImageIcon className="mt-0.5 size-4 text-olive" aria-hidden="true" /><div><p className="font-semibold">Slide composition</p><p className="mt-1 text-xs leading-6 text-ink-soft">Aktifkan, urutkan, pilih visual, dan tentukan durasi 5–60 detik.</p></div></header>
        <div className="divide-y divide-charcoal/10">
          {settings.presentationSlides.map((slide) => {
            const media = PRESENTATION_MEDIA_OPTIONS.find((item) => item.key === slide.mediaKey) ?? PRESENTATION_MEDIA_OPTIONS[0]!;
            return (
              <article key={slide.key} className="grid gap-4 p-5 lg:grid-cols-[8rem_1fr] lg:items-center">
                <NextImage src={media.src} alt="" width={192} height={108} className="aspect-video w-full object-cover" />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.25fr_1fr_.65fr_.65fr] xl:items-end">
                  <label className="flex min-h-12 items-center gap-3 rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold"><input type="checkbox" name={`slide_${slide.key}_enabled`} defaultChecked={slide.enabled} />{PRESENTATION_SLIDE_LABELS[slide.key]}</label>
                  <label className="grid gap-2 text-xs font-semibold"><span>Visual</span><select name={`slide_${slide.key}_media`} defaultValue={slide.mediaKey} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3">{PRESENTATION_MEDIA_OPTIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
                  <label className="grid gap-2 text-xs font-semibold"><span>Urutan</span><input type="number" min="1" max="100" name={`slide_${slide.key}_order`} defaultValue={slide.sortOrder} className="min-h-12 rounded-[.35rem] border border-charcoal/16 px-3" /></label>
                  <label className="grid gap-2 text-xs font-semibold"><span>Detik</span><input type="number" min="5" max="60" name={`slide_${slide.key}_duration`} defaultValue={slide.durationSeconds} className="min-h-12 rounded-[.35rem] border border-charcoal/16 px-3" /></label>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <button type="submit" className="cta-solid mt-6">Simpan tampilan tamu</button>
    </form>
  );
}
