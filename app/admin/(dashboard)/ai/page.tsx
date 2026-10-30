import { AiSettingsPage } from "@/features/admin";
import { getAiSettings, getPmsCatalog } from "@/shared/convex";
import type { AiSettingsSummary } from "@/shared/ai";
import { saveAiSettingsAction, testAiSettingsAction, translateWelcomeAction } from "./actions";

const fallback: AiSettingsSummary = { exists: false, configured: false, enabled: false };
export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const params = await searchParams;
  let settings = fallback;
  let properties: Array<{ slug: string; name: string }> = [];
  try {
    const [loadedSettings, catalog] = await Promise.all([getAiSettings(), getPmsCatalog()]);
    settings = loadedSettings;
    properties = catalog.properties.map(({ slug, name }) => ({ slug, name }));
  } catch { /* Empty state keeps key material out of error output. */ }
  return <AiSettingsPage settings={settings} properties={properties} status={params.status} error={params.error} saveAction={saveAiSettingsAction} testAction={testAiSettingsAction} translateAction={translateWelcomeAction} />;
}
