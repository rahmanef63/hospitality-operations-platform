"use client";

import { Bot, Check, Languages } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { WELCOME_LOCALE_OPTIONS, type WelcomeLocale } from "@/shared/welcome";
import type { AdminFormAction } from "../types";

function TranslateButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={disabled || pending} className="cta-solid w-full sm:w-auto"><Bot className="size-4" aria-hidden="true" />{pending ? "Menerjemahkan…" : "Buat draft terjemahan"}</button>;
}

export function AiTranslationPanel({ action, configured, properties }: { action: AdminFormAction; configured: boolean; properties: Array<{ slug: string; name: string }> }) {
  const [source, setSource] = useState<WelcomeLocale>("id");
  const [targets, setTargets] = useState<Set<WelcomeLocale>>(new Set());
  const options = useMemo(() => WELCOME_LOCALE_OPTIONS.filter((locale) => locale.code !== source), [source]);

  function changeSource(next: WelcomeLocale) {
    setSource(next);
    setTargets((current) => new Set([...current].filter((locale) => locale !== next)));
  }

  function toggle(locale: WelcomeLocale) {
    setTargets((current) => {
      const next = new Set(current);
      if (next.has(locale)) next.delete(locale); else next.add(locale);
      return next;
    });
  }

  return (
    <form action={action} className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
      <header className="border-b border-charcoal/10 p-5 sm:p-7"><div className="flex items-center gap-3"><Languages className="size-5 text-olive" aria-hidden="true" /><div><p className="kicker text-umber">Auto translation</p><h2 className="mt-2 font-serif text-3xl">Terjemahkan template, bukan data tamu</h2></div></div><p className="mt-4 max-w-3xl text-sm leading-7 text-ink-soft">Hanya headline, body, signature, kode bahasa, dan placeholder <code>{"{{guest}}"}</code> yang dikirim ke provider. Nama, kontak, tanggal, reservasi, harga, dan catatan internal tidak pernah dikirim. Hasil selalu disimpan sebagai draft.</p></header>
      <div className="space-y-6 p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block"><span className="text-xs font-semibold tracking-[.08em] uppercase">Properti</span><select name="propertySlug" defaultValue={properties[0]?.slug ?? "ruma-kamyna"} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 bg-white px-3 text-sm outline-none focus:border-olive">{(properties.length ? properties : [{ slug: "ruma-kamyna", name: "Ruma Kamyna" }]).map((property) => <option key={property.slug} value={property.slug}>{property.name}</option>)}</select></label>
          <label className="block"><span className="text-xs font-semibold tracking-[.08em] uppercase">Bahasa sumber</span><select name="sourceLocale" value={source} onChange={(event) => changeSource(event.target.value as WelcomeLocale)} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 bg-white px-3 text-sm outline-none focus:border-olive">{WELCOME_LOCALE_OPTIONS.map((locale) => <option key={locale.code} value={locale.code}>{locale.nativeLabel} · {locale.label}</option>)}</select></label>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-semibold tracking-[.08em] uppercase">Bahasa tujuan</p><div className="flex gap-2"><button type="button" onClick={() => setTargets(new Set(options.map((locale) => locale.code)))} className="min-h-11 rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold">Pilih semua</button><button type="button" onClick={() => setTargets(new Set())} className="min-h-11 rounded-[.35rem] border border-charcoal/12 px-3 text-xs font-semibold">Kosongkan</button></div></div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {options.map((locale) => {
              const selected = targets.has(locale.code);
              return <label key={locale.code} className={`relative flex min-h-16 cursor-pointer items-center gap-3 rounded-[.4rem] border p-3 ${selected ? "border-olive bg-olive/[.07]" : "border-charcoal/10 bg-[#f8f8f5]"}`}><input type="checkbox" name="targetLocales" value={locale.code} checked={selected} onChange={() => toggle(locale.code)} className="sr-only" /><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${selected ? "border-olive bg-olive text-white" : "border-charcoal/18"}`}>{selected ? <Check className="size-3.5" aria-hidden="true" /> : null}</span><span><strong className="block text-xs">{locale.nativeLabel}</strong><span className="mt-1 block text-[.65rem] text-ink-soft">{locale.label}</span></span></label>;
            })}
          </div>
        </div>
        {!configured ? <p className="rounded-[.4rem] bg-[#f1e4cb] p-4 text-sm text-[#6f4d18]">Simpan dan aktifkan API key BYOK sebelum menjalankan terjemahan.</p> : null}
        <div className="flex flex-col gap-3 border-t border-charcoal/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-ink-soft">{targets.size} bahasa dipilih · hasil tidak dipublikasikan otomatis</p><TranslateButton disabled={!configured || targets.size === 0} /></div>
      </div>
    </form>
  );
}
