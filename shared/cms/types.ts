import type { AreaGuideContent, SiteContent } from "../content/types";

export type CmsDocument = { schemaVersion: 1; site: SiteContent; guides: AreaGuideContent[] };
export type CmsAuditEvent = { action: "seed" | "save" | "publish"; actorEmailHash: string; version: number; createdAt: number };
export type CmsAdminOverview = {
  configured: boolean;
  draft: CmsDocument;
  published?: CmsDocument;
  version: number;
  updatedAt?: number;
  publishedAt?: number;
  events: CmsAuditEvent[];
};
