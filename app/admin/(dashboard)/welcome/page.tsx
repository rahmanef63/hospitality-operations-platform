import { AdminDashboard } from "@/features/admin";
import { SITE_URL } from "@/shared/config/site";
import { requireAdminSession } from "@/shared/admin";
import { getWelcomeAdminOverview } from "@/shared/convex";
import { DEFAULT_WELCOME_CONTENT, WELCOME_LOCALES, type WelcomeAdminOverview } from "@/shared/welcome";
import { updateWelcomeAction } from "./actions";


function fallbackOverview(): WelcomeAdminOverview {
  return {
    configs: Object.fromEntries(
      WELCOME_LOCALES.map((locale) => [locale, { locale, draft: DEFAULT_WELCOME_CONTENT[locale], version: 0 }]),
    ) as WelcomeAdminOverview["configs"],
    events: [],
  };
}

export const instant = false;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; locale?: string }>;
}) {
  const session = await requireAdminSession();
  const params = await searchParams;
  let backendError = false;
  let overview: WelcomeAdminOverview;
  try {
    overview = await getWelcomeAdminOverview();
  } catch {
    overview = fallbackOverview();
    backendError = true;
  }
  return (
    <AdminDashboard
      sessionEmail={session.email}
      overview={overview}
      endpointUrl={`${SITE_URL}/api/welcome`}
      previewUrl={`${SITE_URL}/welcome`}
      backendError={backendError}
      status={params.status}
      error={params.error}
      selectedLocale={params.locale}
      formAction={updateWelcomeAction}
    />
  );
}
