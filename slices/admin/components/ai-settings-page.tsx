import { Bot, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { AI_PROVIDER_META, AI_PROVIDERS, type AiSettingsSummary } from "@/shared/ai";
import type { AdminFormAction } from "../types";
import { AiTranslationPanel } from "./ai-translation-panel";

const messages: Record<string, string> = {
  saved: "Konfigurasi BYOK tersimpan.", tested: "Provider berhasil diuji dengan satu terjemahan tanpa data tamu.",
};
const errors: Record<string, string> = {
  provider: "Provider tidak valid.", model: "Model wajib diisi.", key: "Format API key atau encryption key tidak valid.",
  service: "Konfigurasi tidak dapat disimpan.", test: "Tes provider gagal. Periksa API key, model, kuota, dan status enabled.",
  locale: "Bahasa sumber tidak valid.", property: "Properti tidak valid.", targets: "Pilih minimal satu bahasa tujuan.", translate: "Terjemahan gagal atau output provider tidak lolos validasi.",
};

export function AiSettingsPage({ settings, properties, status, error, saveAction, testAction, translateAction }: {
  settings: AiSettingsSummary;
  properties: Array<{ slug: string; name: string }>;
  status?: string;
  error?: string;
  saveAction: AdminFormAction;
  testAction: () => Promise<void>;
  translateAction: AdminFormAction;
}) {
  const provider = settings.provider ?? "openai";
  return (
    <div className="pb-20">
      <header className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14"><div className="mx-auto max-w-[92rem]"><p className="kicker text-umber">BYOK AI</p><h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">AI milik Anda, data tetap milik provider.</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">Simpan satu provider dan model untuk membantu menerjemahkan template sambutan. API key dienkripsi sebelum disimpan dan tidak pernah dikirim ke browser setelah submit.</p></div></header>
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        {status || error ? <div role="status" className={`rounded-[.4rem] border-l-2 p-4 text-sm ${error ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]" : "border-olive bg-[#dfe9df] text-[#31533b]"}`}>{error ? errors[error] ?? "Permintaan gagal." : messages[status ?? ""]}</div> : null}
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><KeyRound className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">API key</p><p className="mt-2 font-serif text-3xl">{settings.configured ? "Tersimpan" : "Belum ada"}</p><p className="mt-2 text-xs text-ink-soft">{settings.keyFingerprint ? `Fingerprint ${settings.keyFingerprint}` : "Tidak pernah ditampilkan kembali"}</p></article>
          <article className="bg-white p-5"><Bot className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Provider</p><p className="mt-2 font-serif text-3xl">{settings.provider ? AI_PROVIDER_META[settings.provider].label : "Belum dipilih"}</p><p className="mt-2 text-xs text-ink-soft">{settings.model ?? "Model belum diisi"}</p></article>
          <article className="bg-white p-5"><ShieldCheck className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Status</p><p className="mt-2 font-serif text-3xl">{settings.enabled ? "Aktif" : "Nonaktif"}</p><p className="mt-2 text-xs text-ink-soft">Server-only · encrypted at rest</p></article>
        </section>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 p-5 sm:p-7"><p className="kicker text-umber">Provider settings</p><h2 className="mt-2 font-serif text-3xl">Konfigurasi BYOK</h2></header>
          <form action={saveAction} className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="text-xs font-semibold tracking-[.08em] uppercase">Provider</span><select name="provider" defaultValue={provider} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 bg-white px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20">{AI_PROVIDERS.map((value) => <option key={value} value={value}>{AI_PROVIDER_META[value].label}</option>)}</select></label>
              <label className="block"><span className="text-xs font-semibold tracking-[.08em] uppercase">Model</span><input name="model" defaultValue={settings.model} required maxLength={160} placeholder={AI_PROVIDER_META[provider].modelHint} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" /></label>
              <label className="block sm:col-span-2"><span className="text-xs font-semibold tracking-[.08em] uppercase">API key</span><input name="apiKey" type="password" autoComplete="new-password" maxLength={600} placeholder={settings.configured ? "Kosongkan untuk mempertahankan key yang tersimpan" : "Masukkan API key provider"} className="mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/18 px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" /><span className="mt-2 block text-xs leading-5 text-ink-soft">Key baru dienkripsi dengan AES-256-GCM sebelum dikirim ke Convex. Browser tidak menerima ciphertext atau plaintext setelah submit.</span></label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2"><label className="flex min-h-14 items-center gap-3 rounded-[.4rem] border border-charcoal/10 bg-[#f8f8f5] px-4"><input name="enabled" type="checkbox" defaultChecked={settings.enabled} className="size-4 accent-[#66705c]" /><span><strong className="block text-sm">Aktifkan provider</strong><span className="mt-1 block text-xs text-ink-soft">Diperlukan untuk test dan terjemahan.</span></span></label><label className="flex min-h-14 items-center gap-3 rounded-[.4rem] border border-charcoal/10 bg-[#f8f8f5] px-4"><input name="clearKey" type="checkbox" className="size-4 accent-[#843f35]" /><span><strong className="block text-sm">Hapus key tersimpan</strong><span className="mt-1 block text-xs text-ink-soft">Menonaktifkan penggunaan provider sampai key baru disimpan.</span></span></label></div>
            <div className="flex flex-col gap-3 border-t border-charcoal/10 pt-5 sm:flex-row"><button type="submit" className="cta-solid flex-1"><CheckCircle2 className="size-4" aria-hidden="true" />Simpan konfigurasi</button></div>
          </form>
          <form action={testAction} className="border-t border-charcoal/10 p-5 sm:p-7"><button type="submit" disabled={!settings.configured || !settings.enabled} className="cta-outline w-full"><Bot className="size-4" aria-hidden="true" />Tes provider dengan template aman</button></form>
        </section>

        <AiTranslationPanel action={translateAction} configured={settings.configured && settings.enabled} properties={properties} />
      </div>
    </div>
  );
}
