import { areaGuides } from "../content/config/guides";
import { siteContent } from "../content/config/site-content";
import type { CmsDocument } from "./types";

export function defaultCmsDocument(): CmsDocument {
  return structuredClone({ schemaVersion: 1, site: siteContent, guides: areaGuides });
}
