"use client";

import { useState } from "react";
import { Music2, Radio, ShieldAlert } from "lucide-react";
import {
  LOFI_TRACKS,
  PRAYER_METHOD_OPTIONS,
  getLofiTrack,
  type AnnouncementSettings,
  type LofiTrackKey,
  type PrayerMoment,
} from "@/shared/announcements";
import type { AdminFormAction } from "../types";

function formatPrayer(at: number, timezone: string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(at));
}

export function AnnouncementSettingsForm({ settings, propertySlug, timezone, coordinatesAvailable, prayerPreview, action }: {
  settings: AnnouncementSettings;
  propertySlug: string;
  timezone: string;
  coordinatesAvailable: boolean;
  prayerPreview: PrayerMoment[];
  action: AdminFormAction;
}) {
  const [trackKey, setTrackKey] = useState<LofiTrackKey>(settings.musicTrackKey);
  const selectedTrack = getLofiTrack(trackKey);
  return (
    <form action={action} className="grid gap-6 rounded-[.55rem] border border-charcoal/12 bg-white p-5 sm:p-7">
      <input type="hidden" name="propertySlug" value={propertySlug} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="kicker text-umber">Audio & prayer schedule</p><h3 className="mt-2 font-serif text-3xl">Atur bagaimana villa menyapa.</h3></div>
        <span className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-[.62rem] font-bold ${coordinatesAvailable ? "bg-[#dfe9df] text-[#31533b]" : "bg-[#f4e0db] text-[#6f2d25]"}`}>
          <ShieldAlert className="size-3.5" aria-hidden="true" />
          {coordinatesAvailable ? "Koordinat terverifikasi tersedia" : "Koordinat belum tersedia"}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[.45rem] border border-charcoal/12 bg-[#f8f8f5] p-5">
          <div className="flex items-center gap-3"><Radio className="size-5 text-olive" aria-hidden="true" /><div><p className="font-semibold">Announcement voice</p><p className="mt-1 text-xs text-ink-soft">Browser voice selalu dimulai mute dan baru berbunyi setelah tap.</p></div></div>
          <label className="mt-5 grid gap-2 text-xs font-semibold"><span>Volume · 0–1</span><input type="number" step="0.05" min="0" max="1" name="announcementVolume" defaultValue={settings.announcementVolume} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label>
        </section>

        <section className="rounded-[.45rem] border border-charcoal/12 bg-[#f8f8f5] p-5">
          <div className="flex items-center gap-3"><Music2 className="size-5 text-olive" aria-hidden="true" /><div><p className="font-semibold">Presentation lo-fi music</p><p className="mt-1 text-xs text-ink-soft">Tiga loop original tanpa sample pihak ketiga, dirilis CC0 1.0.</p></div></div>
          <label className="mt-5 flex min-h-11 items-center gap-3 text-xs font-semibold"><input type="checkbox" name="musicEnabled" defaultChecked={settings.musicEnabled} />Tampilkan tombol musik di presentation</label>
          <label className="mt-3 grid gap-2 text-xs font-semibold"><span>Track</span><select name="musicTrackKey" value={trackKey} onChange={(event) => setTrackKey(event.target.value as LofiTrackKey)} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3">{LOFI_TRACKS.map((track) => <option key={track.key} value={track.key}>{track.title} · {track.artist}</option>)}</select></label>
          <label className="mt-3 grid gap-2 text-xs font-semibold"><span>Volume maksimum · 0–0.5</span><input type="number" step="0.01" min="0" max="0.5" name="musicVolume" defaultValue={settings.musicVolume} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label>
          <div className="mt-4 rounded-[.35rem] border border-charcoal/10 bg-white p-3">
            <audio key={selectedTrack.key} controls preload="none" src={selectedTrack.src} className="h-10 w-full" aria-label={`Preview ${selectedTrack.title}`} />
            <p className="mt-2 text-[.68rem] leading-5 text-ink-soft">{selectedTrack.provenance} <a href={selectedTrack.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{selectedTrack.license}</a></p>
          </div>
        </section>
      </div>

      <section className="rounded-[.45rem] border border-charcoal/12 p-5">
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" name="prayerEnabled" defaultChecked={settings.prayerEnabled} disabled={!coordinatesAvailable} />Aktifkan aturan berdasarkan waktu salat</label>
        <p className="mt-2 text-xs leading-6 text-ink-soft">Perhitungan memakai zona waktu <code>{timezone}</code>, koordinat properti yang sudah diverifikasi, serta metode yang dipilih eksplisit. Cocokkan dengan jadwal masjid setempat sebelum mengaktifkan announcement.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-semibold"><span>Metode perhitungan</span><select name="prayerMethod" defaultValue={settings.prayerMethod} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3">{PRAYER_METHOD_OPTIONS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-semibold"><span>Mazhab untuk Asar</span><select name="madhab" defaultValue={settings.madhab} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3"><option value="shafi">Shafi</option><option value="hanafi">Hanafi</option></select></label>
        </div>
        {prayerPreview.length ? <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[.35rem] bg-charcoal/10 sm:grid-cols-5">{prayerPreview.map((item) => <div key={item.prayer} className="bg-white p-3"><p className="text-[.62rem] font-bold tracking-[.08em] text-ink-soft uppercase">{item.label}</p><p className="mt-1 font-mono text-sm">{formatPrayer(item.at, timezone)}</p></div>)}</div> : null}
      </section>
      <button type="submit" className="cta-solid justify-self-start">Simpan audio & prayer settings</button>
    </form>
  );
}
