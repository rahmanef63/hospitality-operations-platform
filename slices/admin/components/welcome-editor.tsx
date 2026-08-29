"use client";

import { Check, Eye, History, LoaderCircle, RotateCcw, Save, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  WELCOME_GUEST_TOKEN,
  WELCOME_LIMITS,
  getWelcomeLocaleMeta,
  renderWelcomeContent,
  type WelcomeConfigState,
  type WelcomeContent,
} from "@/shared/welcome";
import type { AdminFormAction } from "../types";

function SubmitButton({ intent, disabled }: { intent: "save" | "publish"; disabled: boolean }) {
  const { pending } = useFormStatus();
  const publish = intent === "publish";
  return (
    <button type="submit" name="intent" value={intent} disabled={pending || disabled} className={publish ? "cta-solid flex-1 disabled:cursor-not-allowed disabled:opacity-50" : "cta-outline flex-1 disabled:cursor-not-allowed disabled:opacity-50"}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : publish ? <Check className="size-4" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Menyimpan…" : publish ? "Publish" : "Simpan draft"}
    </button>
  );
}

function Count({ value, limit }: { value: string; limit: number }) {
  const remaining = limit - value.length;
  return <span className={remaining < 20 ? "font-semibold text-[#843f35]" : "font-normal text-ink-soft"}>{value.length}/{limit}</span>;
}

function sameContent(left: WelcomeContent | undefined, right: WelcomeContent) {
  return Boolean(left && left.headline === right.headline && left.body === right.body && left.signature === right.signature);
}

export function WelcomeEditor({ config, propertySlug, propertyName, formAction, previewUrl, disabled = false }: {
  config: WelcomeConfigState;
  propertySlug: string;
  propertyName: string;
  formAction: AdminFormAction;
  previewUrl: string;
  disabled?: boolean;
}) {
  const [headline, setHeadline] = useState(config.draft.headline);
  const [body, setBody] = useState(config.draft.body);
  const [signature, setSignature] = useState(config.draft.signature);
  const meta = getWelcomeLocaleMeta(config.locale);
  const [sampleName, setSampleName] = useState(meta.sampleName);
  const headlineRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const draft = useMemo(() => ({ headline, body, signature }), [body, headline, signature]);
  const dirty = !sameContent(config.draft, draft);
  const publishable = dirty || !sameContent(config.published, draft);
  const preview = useMemo(() => renderWelcomeContent(draft, config.locale, sampleName, propertyName), [config.locale, draft, propertyName, sampleName]);
  const localeLabel = meta.nativeLabel;

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty || submittingRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function setContent(content: WelcomeContent) {
    setHeadline(content.headline);
    setBody(content.body);
    setSignature(content.signature);
  }

  function insertGuestToken() {
    const input = headlineRef.current;
    const start = input?.selectionStart ?? headline.length;
    const end = input?.selectionEnd ?? start;
    const next = `${headline.slice(0, start)}${WELCOME_GUEST_TOKEN}${headline.slice(end)}`.slice(0, WELCOME_LIMITS.headline);
    setHeadline(next);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + WELCOME_GUEST_TOKEN.length, start + WELCOME_GUEST_TOKEN.length);
    });
  }

  return (
    <article id={`welcome-${config.locale}`} className="scroll-mt-24 overflow-hidden rounded-[.65rem] border border-charcoal/14 bg-paper shadow-[0_18px_55px_-42px_rgba(45,43,39,.6)]">
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-charcoal/10 p-5 sm:p-7">
        <div><p className="kicker text-umber">{localeLabel}</p><h2 className="mt-2 font-serif text-4xl leading-none">Welcome copy</h2></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[.64rem] font-bold ${dirty ? "border-[#a3721f]/25 bg-[#f1e4cb] text-[#825912]" : "border-[#43704f]/25 bg-[#dfe9df] text-[#31533b]"}`}>{dirty ? "Perubahan belum disimpan" : "Draft tersimpan"}</span>
          <span className="inline-flex min-h-8 items-center rounded-full border border-charcoal/12 bg-charcoal/[.045] px-3 text-[.64rem] font-bold text-ink-soft">v{config.version} · {config.publishedAt ? "Published" : "Draft only"}</span>
        </div>
      </header>

      <form action={formAction} onSubmit={() => { submittingRef.current = true; }} className="grid xl:grid-cols-[1.02fr_.98fr]" dir={meta.direction}>
        <input type="hidden" name="locale" value={config.locale} />
        <input type="hidden" name="propertySlug" value={propertySlug} />
        <fieldset className="min-w-0 space-y-6 p-5 sm:p-7">
          <legend className="sr-only">Edit {localeLabel} welcome content</legend>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-[.68rem] font-bold tracking-[.1em] uppercase">Headline <Count value={headline} limit={WELCOME_LIMITS.headline} /></span>
            <input ref={headlineRef} name="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={WELCOME_LIMITS.headline} required disabled={disabled} className="mt-2 min-h-13 w-full rounded-[.35rem] border border-charcoal/16 bg-white px-4 text-base outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" />
            <button type="button" onClick={insertGuestToken} className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/12 bg-white px-3 text-xs font-semibold hover:border-olive"><UserRound className="size-3.5 text-olive" aria-hidden="true" />Sisipkan {WELCOME_GUEST_TOKEN}</button>
          </label>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-[.68rem] font-bold tracking-[.1em] uppercase">Pesan <Count value={body} limit={WELCOME_LIMITS.body} /></span>
            <textarea name="body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={WELCOME_LIMITS.body} required disabled={disabled} rows={8} className="mt-2 w-full resize-y rounded-[.35rem] border border-charcoal/16 bg-white px-4 py-4 text-base leading-7 outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" />
          </label>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-[.68rem] font-bold tracking-[.1em] uppercase">Signature <Count value={signature} limit={WELCOME_LIMITS.signature} /></span>
            <input name="signature" value={signature} onChange={(event) => setSignature(event.target.value)} maxLength={WELCOME_LIMITS.signature} required disabled={disabled} className="mt-2 min-h-13 w-full rounded-[.35rem] border border-charcoal/16 bg-white px-4 text-base outline-none focus:border-olive focus:ring-2 focus:ring-olive/20" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setContent(config.draft)} disabled={!dirty} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/12 bg-white px-4 text-xs font-semibold disabled:opacity-40"><RotateCcw className="size-3.5" aria-hidden="true" />Reset draft</button>
            {config.published ? <button type="button" onClick={() => setContent(config.published!)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/12 bg-white px-4 text-xs font-semibold"><History className="size-3.5" aria-hidden="true" />Pulihkan published</button> : null}
          </div>
          <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 -mx-5 flex flex-col gap-3 border-t border-charcoal/10 bg-paper/96 px-5 py-4 shadow-[0_-12px_30px_rgba(45,43,39,.08)] backdrop-blur-xl sm:-mx-7 sm:flex-row sm:px-7 lg:bottom-0">
            <SubmitButton intent="save" disabled={disabled || !dirty} /><SubmitButton intent="publish" disabled={disabled || !publishable} />
          </div>
        </fieldset>

        <aside dir={meta.direction} className="flex min-h-[32rem] flex-col justify-between bg-charcoal p-6 text-ivory sm:p-9">
          <div>
            <div className="flex items-center justify-between gap-4"><p className="kicker text-warm-sand">Live preview</p><Eye className="size-4 text-ivory/55" aria-hidden="true" /></div>
            <label className="mt-6 block"><span className="text-[.62rem] font-bold tracking-[.1em] text-ivory/55 uppercase">Nama contoh</span><input value={sampleName} onChange={(event) => setSampleName(event.target.value)} maxLength={WELCOME_LIMITS.guestName} className="mt-2 min-h-11 w-full rounded-[.3rem] border border-ivory/16 bg-ivory/8 px-3 text-sm text-ivory outline-none focus:border-warm-sand" /></label>
            <p className="mt-12 font-serif text-5xl leading-[.92] tracking-[-.03em]">{preview.headline}</p>
            <p className="mt-7 max-w-md whitespace-pre-line text-sm leading-8 text-ivory/75">{preview.body}</p>
          </div>
          <div><p className="font-serif text-xl italic text-warm-sand">{preview.signature}</p><a href={`${previewUrl}?locale=${config.locale}&name=${encodeURIComponent(sampleName)}&property=${encodeURIComponent(propertySlug)}`} target="_blank" rel="noreferrer" className="editorial-link mt-7 text-ivory">Buka guest view</a></div>
        </aside>
      </form>
    </article>
  );
}
