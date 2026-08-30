"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import { defaultCmsDocument } from "@/shared/cms";
import { ensureCmsDocument, publishCms } from "@/shared/convex/cms";

function cmsUrl(path: string, status?: string, error?: string) {
  const url = new URL(path, "https://kamyna.internal");
  if (status) url.searchParams.set("status", status);
  if (error) url.searchParams.set("error", error);
  return `${url.pathname}${url.search}`;
}
function invalidatePublishedCms() {
  for (const tag of ["cms:published", "site-content", "properties", "area-guides"]) updateTag(tag);
  revalidatePath("/", "layout"); revalidatePath("/sitemap.xml");
}
export async function initializeCmsAction() {
  const session = await requireAdminSession();
  try { await ensureCmsDocument(defaultCmsDocument(), hashAdminIdentity(session.email)); }
  catch { redirect(cmsUrl("/admin/cms", undefined, "service")); }
  revalidatePath("/admin/cms", "layout");
  redirect(cmsUrl("/admin/cms", "initialized"));
}
export async function publishCmsAction() {
  const session = await requireAdminSession();
  try { await publishCms(hashAdminIdentity(session.email)); }
  catch { redirect(cmsUrl("/admin/cms", undefined, "service")); }
  invalidatePublishedCms(); revalidatePath("/admin/cms", "layout");
  redirect(cmsUrl("/admin/cms", "published"));
}
