import "server-only";
import { api } from "@/convex/_generated/api";
import { defaultCmsDocument, parseCmsJson, type CmsAdminOverview, type CmsDocument } from "@/shared/cms";
import { adminFetch, getConvexClient } from "./core";

export async function getPublicCmsDocument(): Promise<CmsDocument | null> {
  const row = await getConvexClient().query(api.cms.getPublished, {});
  return row?.json ? parseCmsJson(row.json) : null;
}
export async function getCmsAdminOverview(): Promise<CmsAdminOverview> {
  const row = await adminFetch<{ configured: boolean; draftJson?: string; publishedJson?: string; version: number; updatedAt?: number; publishedAt?: number; events: CmsAdminOverview["events"] }>("/admin/cms-overview", {});
  const fallback = defaultCmsDocument();
  return { ...row, draft: row.draftJson ? parseCmsJson(row.draftJson) : fallback, published: row.publishedJson ? parseCmsJson(row.publishedJson) : undefined };
}
export async function ensureCmsDocument(document: CmsDocument, actorEmailHash: string) {
  return adminFetch<{ created: boolean; version: number }>("/admin/cms-ensure", { json: JSON.stringify(document), actorEmailHash });
}
export async function saveCmsDraft(document: CmsDocument, actorEmailHash: string) {
  return adminFetch<{ version: number; updatedAt: number }>("/admin/cms-save", { json: JSON.stringify(document), actorEmailHash });
}
export async function publishCms(actorEmailHash: string) {
  return adminFetch<{ version: number; publishedAt: number }>("/admin/cms-publish", { actorEmailHash });
}
