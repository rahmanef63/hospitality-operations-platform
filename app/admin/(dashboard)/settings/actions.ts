"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/shared/admin";
import { dispatchPlatformUpdate, getPlatformUpdateStatus } from "@/shared/platform";

function fail(code: string): never { redirect(`/admin/settings?error=${encodeURIComponent(code)}`); }

export async function requestPlatformUpdateAction(formData: FormData) {
  await requireAdminSession();
  const requestedPr = Number(formData.get("prNumber"));
  const requestedVersion = String(formData.get("expectedVersion") ?? "").trim();
  if (!Number.isSafeInteger(requestedPr) || requestedPr < 1 || !requestedVersion) fail("invalid-request");
  const current = await getPlatformUpdateStatus();
  if (!current.canApply || !current.pullRequest || !current.latestVersion || !current.defaultBranch) fail("not-ready");
  if (current.pullRequest.number !== requestedPr || current.latestVersion !== requestedVersion) fail("stale-request");
  try { await dispatchPlatformUpdate(requestedPr, requestedVersion, current.defaultBranch); }
  catch { fail("dispatch-failed"); }
  redirect("/admin/settings?status=requested");
}
