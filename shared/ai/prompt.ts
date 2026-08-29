import { WELCOME_GUEST_TOKEN, WELCOME_LOCALE_META, type WelcomeContent, type WelcomeLocale } from "@/shared/welcome";

export function translationSchema(targetLocales: WelcomeLocale[]) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["translations"],
    properties: {
      translations: {
        type: "array",
        minItems: targetLocales.length,
        maxItems: targetLocales.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["locale", "headline", "body", "signature"],
          properties: {
            locale: { type: "string", enum: targetLocales },
            headline: { type: "string", minLength: 1, maxLength: 120 },
            body: { type: "string", minLength: 1, maxLength: 900 },
            signature: { type: "string", minLength: 1, maxLength: 180 },
          },
        },
      },
    },
  } as const;
}

export function translationPrompt(input: {
  sourceLocale: WelcomeLocale;
  source: WelcomeContent;
  targetLocales: WelcomeLocale[];
}) {
  const system = [
    "You translate a boutique hospitality welcome template.",
    `Preserve the placeholder ${WELCOME_GUEST_TOKEN} exactly, including braces, wherever it appears.`,
    "Do not add, infer, or change property facts, prices, facilities, dates, policies, addresses, claims, or links.",
    "Keep the tone warm, quiet, concise, and natural in each target language.",
    "Return only valid JSON matching the provided schema. Do not use Markdown or commentary.",
  ].join(" ");
  const targets = input.targetLocales.map((locale) => ({
    locale,
    language: WELCOME_LOCALE_META[locale].label,
    nativeLabel: WELCOME_LOCALE_META[locale].nativeLabel,
    direction: WELCOME_LOCALE_META[locale].direction,
  }));
  const user = JSON.stringify({
    task: "translate_welcome_template",
    sourceLocale: input.sourceLocale,
    source: input.source,
    targets,
  });
  return { system, user, schema: translationSchema(input.targetLocales) };
}
