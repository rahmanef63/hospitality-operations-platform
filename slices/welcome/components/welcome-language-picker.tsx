"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { WELCOME_LOCALE_OPTIONS, getWelcomeLocaleMeta, type WelcomeLocale } from "@/shared/welcome";

export function WelcomeLanguagePicker({ locale, token, guestName, propertySlug }: {
  locale: WelcomeLocale;
  token?: string;
  guestName?: string;
  propertySlug?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const meta = getWelcomeLocaleMeta(locale);

  function change(nextLocale: string) {
    const params = new URLSearchParams({ locale: nextLocale });
    if (token) params.set("token", token);
    else if (guestName) params.set("name", guestName);
    if (!token && propertySlug) params.set("property", propertySlug);
    startTransition(() => router.replace(`/welcome?${params}`));
  }

  return (
    <label className="block min-w-40">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => change(event.target.value)}
        disabled={pending}
        aria-label={meta.label === "Arabic" ? "اللغة" : "Language"}
        className="min-h-11 w-full border border-ivory/25 bg-charcoal px-3 text-xs font-semibold text-ivory outline-none focus:border-warm-sand"
      >
        {WELCOME_LOCALE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="bg-charcoal text-ivory">
            {option.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
