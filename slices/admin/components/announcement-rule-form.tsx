"use client";

import { useState } from "react";
import { BellRing, Clock3, Languages, MoonStar } from "lucide-react";
import { PRAYER_NAMES, type AnnouncementKind, type AnnouncementRule } from "@/shared/announcements/types";
import { WELCOME_LOCALE_OPTIONS } from "@/shared/welcome";
import type { AdminFormAction } from "../types";

const kindOptions: Array<{ value: AnnouncementKind; label: string; icon: typeof Clock3 }> = [
  { value: "time_window", label: "Rentang waktu", icon: Clock3 },
  { value: "fixed_time", label: "Jam tetap", icon: BellRing },
  { value: "prayer", label: "Waktu salat", icon: MoonStar },
];

export function AnnouncementRuleForm({ propertySlug, action, rule }: {
  propertySlug: string;
  action: AdminFormAction;
  rule?: AnnouncementRule;
}) {
  const [kind, setKind] = useState<AnnouncementKind>(rule?.kind ?? "time_window");
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="propertySlug" value={propertySlug} />
      {rule ? <input type="hidden" name="ruleId" value={rule.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-semibold"><span>Nama internal</span><input name="name" defaultValue={rule?.name ?? ""} required maxLength={80} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" /></label>
        <label className="grid gap-2 text-xs font-semibold"><span className="flex items-center gap-2"><Languages className="size-4" />Bahasa</span><select name="locale" defaultValue={rule?.locale ?? "id"} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20">{WELCOME_LOCALE_OPTIONS.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel} · {item.label}</option>)}</select></label>
      </div>
      <fieldset className="grid gap-2"><legend className="text-xs font-semibold">Jenis aturan</legend><div className="grid gap-2 sm:grid-cols-3">{kindOptions.map(({ value, label, icon: Icon }) => <label key={value} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-[.35rem] border px-3 text-xs font-semibold ${kind === value ? "border-olive bg-olive/8 text-olive" : "border-charcoal/14 bg-white"}`}><input type="radio" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} className="sr-only" /><Icon className="size-4" aria-hidden="true" />{label}</label>)}</div></fieldset>
      <label className="grid gap-2 text-xs font-semibold"><span>Pesan announcement</span><textarea name="message" defaultValue={rule?.message ?? "Selamat pagi, {{tamu}}."} required maxLength={220} rows={3} className="rounded-[.35rem] border border-charcoal/16 bg-white px-3 py-3 text-sm leading-7 outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" /><span className="font-normal text-ink-soft">Token: <code>{"{{tamu}}"}</code> atau <code>{"{{guest}}"}</code>, <code>{"{{property}}"}</code>, <code>{"{{prayer}}"}</code>.</span></label>
      {kind === "time_window" ? <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold"><span>Mulai</span><input type="time" name="startTime" defaultValue={rule?.startTime ?? "04:00"} required className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label><label className="grid gap-2 text-xs font-semibold"><span>Selesai</span><input type="time" name="endTime" defaultValue={rule?.endTime ?? "11:00"} required className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label></div> : null}
      {kind === "fixed_time" ? <label className="grid gap-2 text-xs font-semibold"><span>Jam announcement</span><input type="time" name="fixedTime" defaultValue={rule?.fixedTime ?? "12:00"} required className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label> : null}
      {kind === "prayer" ? <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold"><span>Waktu salat</span><select name="prayer" defaultValue={rule?.prayer ?? "maghrib"} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3">{PRAYER_NAMES.map((name) => <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>)}</select></label><label className="grid gap-2 text-xs font-semibold"><span>Offset menit</span><input type="number" name="offsetMinutes" defaultValue={rule?.offsetMinutes ?? 0} min={-60} max={60} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label></div> : <input type="hidden" name="offsetMinutes" value={0} />}
      <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold"><span>Durasi aktif · menit</span><input type="number" name="displayMinutes" defaultValue={rule?.displayMinutes ?? 10} min={1} max={60} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label><label className="grid gap-2 text-xs font-semibold"><span>Prioritas</span><input type="number" name="priority" defaultValue={rule?.priority ?? 10} min={0} max={100} className="min-h-12 rounded-[.35rem] border border-charcoal/16 bg-white px-3" /></label></div>
      <div className="grid gap-2 sm:grid-cols-2"><label className="flex min-h-12 items-center gap-3 rounded-[.35rem] border border-charcoal/14 bg-white px-3 text-xs font-semibold"><input type="checkbox" name="enabled" defaultChecked={rule?.enabled ?? true} />Aktif dan tampil</label><label className="flex min-h-12 items-center gap-3 rounded-[.35rem] border border-charcoal/14 bg-white px-3 text-xs font-semibold"><input type="checkbox" name="speak" defaultChecked={rule?.speak ?? true} />Bacakan saat unmuted</label></div>
      <button type="submit" className="cta-solid justify-self-start">{rule ? "Simpan perubahan" : "Tambah announcement"}</button>
    </form>
  );
}
