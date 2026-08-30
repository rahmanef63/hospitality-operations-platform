"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import { fingerprintApiKey, encryptApiKey } from "@/shared/ai/crypto";
import { isAiProvider, validateAiModel, validateApiKey } from "@/shared/ai";
import { getAiEncryptionSecret, loadAiRuntimeSettings } from "@/shared/ai/runtime";
import { translateWelcomeContent } from "@/shared/ai/translate";
import { getPmsCatalog, getWelcomeAdminOverview, recordAiEvent, upsertAiSettings, upsertWelcome } from "@/shared/convex";
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
  let encryptedApiKey: string | undefined;
  let keyFingerprint: string | undefined;
  if (apiKeyValue) {
    try {
      const apiKey = validateApiKey(apiKeyValue);
      encryptedApiKey = encryptApiKey(apiKey, getAiEncryptionSecret());
      keyFingerprint = fingerprintApiKey(apiKey);
    } catch { fail("key"); }
  }
  try {
    await upsertAiSettings({
      provider: providerValue,
      model,
      enabled: checked(formData, "enabled"),
      encryptedApiKey,
      keyFingerprint,
      clearKey,
    });
    await recordAiEvent({ action: "save", provider: providerValue, actorEmailHash: hashAdminIdentity(session.email) });
  } catch { fail("service"); }
  revalidatePath("/admin/ai");
  redirect("/admin/ai?status=saved");
}

export async function testAiSettingsAction() {
  const session = await requireAdminSession();
  try {
    const settings = await loadAiRuntimeSettings();
    await translateWelcomeContent({
      ...settings,
      sourceLocale: "en",
      source: DEFAULT_WELCOME_CONTENT.en,
      targetLocales: ["id"],
    });
    await recordAiEvent({ action: "test", provider: settings.provider, targetCount: 1, actorEmailHash: hashAdminIdentity(session.email) });
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
    const [settings, catalog] = await Promise.all([loadAiRuntimeSettings(), getPmsCatalog()]);
    const property = catalog.properties.find((item) => item.slug === propertySlugValue);
    if (!property) fail("property");
    const overview = await getWelcomeAdminOverview(property.slug);
    const sourceConfig = overview.configs[sourceValue];
    const source = sourceConfig?.version
      ? sourceConfig.draft
      : property.slug === "primary-property"
        ? DEFAULT_WELCOME_CONTENT[sourceValue]
        : defaultWelcomeContent(sourceValue, property.name);
    const translations = await translateWelcomeContent({
      ...settings,
      sourceLocale: sourceValue,
      source,
      targetLocales: targets,
    });
    const actorEmailHash = hashAdminIdentity(session.email);
    await Promise.all(translations.map((translation) => upsertWelcome({
      propertySlug: property.slug,
      locale: translation.locale,
      content: translation.content,
      publish: false,
      auditAction: "translate",
      actorEmailHash,
    })));
    await recordAiEvent({ action: "translate", provider: settings.provider, targetCount: translations.length, actorEmailHash });
  } catch { fail("translate"); }
  revalidatePath("/admin/welcome");
  redirect(`/admin/welcome?status=translated&locale=${encodeURIComponent(targets[0]!)}&property=${encodeURIComponent(propertySlugValue)}`);
}
