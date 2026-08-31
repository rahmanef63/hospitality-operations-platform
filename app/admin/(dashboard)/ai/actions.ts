"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/shared/admin";
import { isAiProvider, validateAiModel, validateApiKey } from "@/shared/ai";
import { getPmsCatalog, getWelcomeAdminOverview, recordAiEvent, testAiSettings, translateWithAi, upsertAiSettings, upsertWelcome } from "@/shared/convex";
import { DEFAULT_WELCOME_CONTENT, defaultWelcomeContent, isWelcomeLocale, type WelcomeLocale } from "@/shared/welcome";

function checked(form: FormData, name: string) {
  return ["on", "true", "1"].includes(String(form.get(name) ?? ""));
}

function fail(code: string): never {
  redirect(`/admin/ai?error=${encodeURIComponent(code)}`);
}

export async function saveAiSettingsAction(formData: FormData) {
  const session = await requireAdminSession();
  const providerValue = formData.get("provider");
  if (!isAiProvider(providerValue)) fail("provider");
  let model: string;
  try { model = validateAiModel(formData.get("model")); } catch { fail("model"); }
  const apiKeyValue = String(formData.get("apiKey") ?? "").trim();
  const clearKey = checked(formData, "clearKey");
  let apiKey: string | undefined;
  if (apiKeyValue) {
    try { apiKey = validateApiKey(apiKeyValue); } catch { fail("key"); }
  }
  try {
    await upsertAiSettings({
      provider: providerValue,
      model,
      enabled: checked(formData, "enabled"),
      apiKey,
      clearKey,
    });
    await recordAiEvent({ action: "save", provider: providerValue, actorEmailHash: session.actorEmailHash });
  } catch { fail("service"); }
  revalidatePath("/admin/ai");
  redirect("/admin/ai?status=saved");
}

export async function testAiSettingsAction() {
  const session = await requireAdminSession();
  try {
    const result = await testAiSettings();
    await recordAiEvent({ action: "test", provider: result.provider, targetCount: 1, actorEmailHash: session.actorEmailHash });
  } catch { fail("test"); }
  redirect("/admin/ai?status=tested");
}

export async function translateWelcomeAction(formData: FormData) {
  const session = await requireAdminSession();
  const sourceValue = formData.get("sourceLocale");
  const propertySlugValue = String(formData.get("propertySlug") ?? "").trim().toLowerCase();
  if (!isWelcomeLocale(sourceValue)) fail("locale");
  const targets = [...new Set(formData.getAll("targetLocales").filter(isWelcomeLocale))]
    .filter((locale): locale is WelcomeLocale => locale !== sourceValue);
  if (!targets.length || targets.length > 19) fail("targets");
  try {
    const catalog = await getPmsCatalog();
    const property = catalog.properties.find((item) => item.slug === propertySlugValue);
    if (!property) fail("property");
    const overview = await getWelcomeAdminOverview(property.slug);
    const sourceConfig = overview.configs[sourceValue];
    const source = sourceConfig?.version
      ? sourceConfig.draft
      : property.slug === "primary-property"
        ? DEFAULT_WELCOME_CONTENT[sourceValue]
        : defaultWelcomeContent(sourceValue, property.name);
    const aiResult = await translateWithAi({ sourceLocale: sourceValue, source, targetLocales: targets });
    const translations = aiResult.translations;
    const actorEmailHash = session.actorEmailHash;
    await Promise.all(translations.map((translation) => upsertWelcome({
      propertySlug: property.slug,
      locale: translation.locale,
      content: translation.content,
      publish: false,
      auditAction: "translate",
      actorEmailHash,
    })));
    await recordAiEvent({ action: "translate", provider: aiResult.provider, targetCount: translations.length, actorEmailHash });
  } catch { fail("translate"); }
  revalidatePath("/admin/welcome");
  redirect(`/admin/welcome?status=translated&locale=${encodeURIComponent(targets[0]!)}&property=${encodeURIComponent(propertySlugValue)}`);
}
