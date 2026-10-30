import { PlatformSettingsPage } from "@/features/admin";
import { getPlatformUpdateStatus } from "@/shared/platform";
import { requestPlatformUpdateAction } from "./actions";

export const instant = false;

type SearchParams = Promise<{ status?: string; error?: string }>;

export default async function PlatformSettingsRoute({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const update = await getPlatformUpdateStatus();
  return <PlatformSettingsPage update={update} action={requestPlatformUpdateAction} notice={params.status} error={params.error} />;
}
