import { BellRing, Clock3, Music2, Plus, Trash2 } from "lucide-react";
import type { AnnouncementAdminOverview, PrayerMoment } from "@/shared/announcements";
import type { AdminFormAction } from "../types";
import { AnnouncementRuleForm } from "./announcement-rule-form";
import { AnnouncementSettingsForm } from "./announcement-settings-form";
import { GuestExperienceSettingsForm } from "./guest-experience-settings-form";

export function AnnouncementManager({ overview, propertySlug, timezone, coordinatesAvailable, prayerPreview, settingsAction, experienceAction, ruleAction, archiveAction, seedAction }: {
  overview: AnnouncementAdminOverview;
  propertySlug: string;
  timezone: string;
  coordinatesAvailable: boolean;
  prayerPreview: PrayerMoment[];
  settingsAction: AdminFormAction;
  experienceAction: AdminFormAction;
  ruleAction: AdminFormAction;
  archiveAction: AdminFormAction;
  seedAction: AdminFormAction;
}) {
  const active = overview.rules.filter((rule) => rule.enabled).length;
  const spoken = overview.rules.filter((rule) => rule.enabled && rule.speak).length;
  return (
    <section id="announcements" className="scroll-mt-24 space-y-6">
      <header className="rounded-[.55rem] border border-charcoal/12 bg-charcoal p-6 text-ivory sm:p-8"><p className="kicker text-warm-sand">Time-aware welcome</p><h2 className="mt-3 max-w-4xl font-serif text-4xl leading-[.92] tracking-[-.035em] sm:text-5xl">Greeting, prayer-time, dan audio yang mengikuti properti.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-ivory/68">Aturan berlaku per properti dan bahasa. Pesan dapat tampil sepanjang rentang waktu atau sebentar pada jam tetap dan waktu salat.</p></header>
      <div className="grid gap-px overflow-hidden rounded-[.5rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3"><article className="bg-white p-5"><BellRing className="size-5 text-olive" /><p className="mt-4 font-serif text-3xl">{active}</p><p className="mt-1 text-xs text-ink-soft">Aturan aktif</p></article><article className="bg-white p-5"><Clock3 className="size-5 text-olive" /><p className="mt-4 font-serif text-3xl">{spoken}</p><p className="mt-1 text-xs text-ink-soft">Voice-enabled</p></article><article className="bg-white p-5"><Music2 className="size-5 text-olive" /><p className="mt-4 font-serif text-3xl">{overview.settings.musicEnabled ? "Ready" : "Off"}</p><p className="mt-1 text-xs text-ink-soft">{overview.settings.musicTrackKey.replaceAll("-", " ")} · CC0 lo-fi</p></article></div>
      <AnnouncementSettingsForm settings={overview.settings} propertySlug={propertySlug} timezone={timezone} coordinatesAvailable={coordinatesAvailable} prayerPreview={prayerPreview} action={settingsAction} />
      <GuestExperienceSettingsForm settings={overview.settings} propertySlug={propertySlug} action={experienceAction} />
      <details className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white" open={!overview.rules.length}><summary className="flex min-h-16 cursor-pointer items-center gap-3 px-5 text-sm font-semibold sm:px-7"><Plus className="size-4 text-olive" />Tambah announcement baru</summary><div className="border-t border-charcoal/10 p-5 sm:p-7"><AnnouncementRuleForm propertySlug={propertySlug} action={ruleAction} /></div></details>
      {!overview.rules.length ? <form action={seedAction} className="rounded-[.45rem] border border-dashed border-charcoal/20 bg-white p-6"><input type="hidden" name="propertySlug" value={propertySlug} /><p className="font-semibold">Belum ada aturan tersimpan.</p><p className="mt-2 text-xs leading-6 text-ink-soft">Pasang greeting pagi, siang, sore, dan malam yang sudah direview untuk Bahasa Indonesia dan English.</p><button type="submit" className="cta-outline mt-4">Pasang default greeting</button></form> : null}
      <div className="space-y-3">{overview.rules.map((rule) => <details key={rule.id} className="overflow-hidden rounded-[.5rem] border border-charcoal/12 bg-white"><summary className="grid min-h-16 cursor-pointer gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><span><span className="font-semibold">{rule.name}</span><span className="mt-1 block text-xs text-ink-soft">{rule.locale} · {rule.kind.replaceAll("_", " ")} · priority {rule.priority}</span></span><span className={`justify-self-start rounded-full px-2.5 py-1 text-[.6rem] font-bold sm:justify-self-end ${rule.enabled ? "bg-[#dfe9df] text-[#31533b]" : "bg-charcoal/8 text-ink-soft"}`}>{rule.enabled ? "ACTIVE" : "PAUSED"}</span></summary><div className="border-t border-charcoal/10 p-5 sm:p-6"><AnnouncementRuleForm propertySlug={propertySlug} action={ruleAction} rule={rule} /><form action={archiveAction} className="mt-5 border-t border-charcoal/10 pt-5"><input type="hidden" name="propertySlug" value={propertySlug} /><input type="hidden" name="ruleId" value={rule.id} /><button type="submit" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#843f35]"><Trash2 className="size-4" />Arsipkan rule</button></form></div></details>)}</div>
    </section>
  );
}
