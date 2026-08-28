"use client";

import { useMemo, useState } from "react";
import { Check, Eye, Save } from "lucide-react";
import { useFormStatus } from "react-dom";
import {
  WELCOME_LIMITS,
  renderWelcomeContent,
  type WelcomeConfigState,
} from "@/shared/welcome";
import type { AdminFormAction } from "../types";

function SubmitButton({ intent, disabled }: { intent: "save" | "publish"; disabled: boolean }) {
  const { pending } = useFormStatus();
  const publish = intent === "publish";
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={pending || disabled}
      className={publish ? "cta-solid flex-1" : "cta-outline flex-1"}
    >
      {publish ? <Check className="size-4" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Saving…" : publish ? "Publish" : "Save draft"}
    </button>
  );
}

export function WelcomeEditor({
  config,
  formAction,
  previewUrl,
  disabled = false,
}: {
  config: WelcomeConfigState;
  formAction: AdminFormAction;
  previewUrl: string;
  disabled?: boolean;
}) {
  const [headline, setHeadline] = useState(config.draft.headline);
  const [body, setBody] = useState(config.draft.body);
  const [signature, setSignature] = useState(config.draft.signature);
  const preview = useMemo(
    () => renderWelcomeContent({ headline, body, signature }, config.locale, config.locale === "id" ? "Tamu" : "Guest"),
    [body, config.locale, headline, signature],
  );
  const localeLabel = config.locale === "id" ? "Bahasa Indonesia" : "English";
  return (
    <article className="border border-charcoal/15 bg-paper">
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-charcoal/12 p-6 sm:p-8">
        <div>
          <p className="kicker text-umber">{localeLabel}</p>
          <h2 className="mt-3 font-serif text-4xl leading-none">Welcome copy</h2>
        </div>
        <div className="text-right text-xs leading-6 text-ink-soft">
          <p>Version {config.version}</p>
          <p>{config.publishedAt ? "Published" : "Draft only"}</p>
        </div>
      </header>

      <form action={formAction} className="grid xl:grid-cols-[1.02fr_.98fr]">
        <input type="hidden" name="locale" value={config.locale} />
        <fieldset className="space-y-6 p-6 sm:p-8">
          <legend className="sr-only">Edit {localeLabel} welcome content</legend>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-xs font-semibold tracking-[.12em] uppercase">
              Headline <span className="font-normal text-ink-soft">{headline.length}/{WELCOME_LIMITS.headline}</span>
            </span>
            <input
              name="headline"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              maxLength={WELCOME_LIMITS.headline}
              required
              disabled={disabled}
              className="mt-3 min-h-14 w-full border border-charcoal/18 bg-ivory/45 px-4 text-base outline-none focus:border-olive focus:ring-2 focus:ring-olive/20"
            />
            <span className="mt-2 block text-xs leading-5 text-ink-soft">Use {"{{guest}}"} to insert the guest name.</span>
          </label>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-xs font-semibold tracking-[.12em] uppercase">
              Message <span className="font-normal text-ink-soft">{body.length}/{WELCOME_LIMITS.body}</span>
            </span>
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={WELCOME_LIMITS.body}
              required
              disabled={disabled}
              rows={7}
              className="mt-3 w-full resize-y border border-charcoal/18 bg-ivory/45 px-4 py-4 text-base leading-7 outline-none focus:border-olive focus:ring-2 focus:ring-olive/20"
            />
          </label>
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-xs font-semibold tracking-[.12em] uppercase">
              Signature <span className="font-normal text-ink-soft">{signature.length}/{WELCOME_LIMITS.signature}</span>
            </span>
            <input
              name="signature"
              value={signature}
              onChange={(event) => setSignature(event.target.value)}
              maxLength={WELCOME_LIMITS.signature}
              required
              disabled={disabled}
              className="mt-3 min-h-14 w-full border border-charcoal/18 bg-ivory/45 px-4 text-base outline-none focus:border-olive focus:ring-2 focus:ring-olive/20"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton intent="save" disabled={disabled} />
            <SubmitButton intent="publish" disabled={disabled} />
          </div>
        </fieldset>

        <aside className="flex min-h-[30rem] flex-col justify-between bg-charcoal p-7 text-ivory sm:p-10">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="kicker text-warm-sand">Live preview</p>
              <Eye className="size-4 text-ivory/55" aria-hidden="true" />
            </div>
            <p className="mt-16 font-serif text-5xl leading-[.92] tracking-[-.03em]">{preview.headline}</p>
            <p className="mt-8 max-w-md text-sm leading-8 text-ivory/75">{preview.body}</p>
          </div>
          <div>
            <p className="font-serif text-xl italic text-warm-sand">{preview.signature}</p>
            <a
              href={`${previewUrl}?locale=${config.locale}&name=${config.locale === "id" ? "Tamu" : "Guest"}`}
              target="_blank"
              rel="noreferrer"
              className="editorial-link mt-8 text-ivory"
            >
              Open guest view
            </a>
          </div>
        </aside>
      </form>
    </article>
  );
}
