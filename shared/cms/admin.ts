import "server-only";
import { defaultCmsDocument, validateCmsDocument, type CmsDocument } from "@/shared/cms";
import { ensureCmsDocument, getCmsAdminOverview, saveCmsDraft } from "@/shared/convex/cms";

export async function loadCmsOverview() {
  try { return await getCmsAdminOverview(); }
  catch { return { configured: false, draft: defaultCmsDocument(), version: 0, events: [] }; }
}

async function cmsDraft(actorEmailHash: string): Promise<CmsDocument> {
  const overview = await getCmsAdminOverview();
  if (overview.configured) return overview.draft;
  const initial = defaultCmsDocument();
  await ensureCmsDocument(initial, actorEmailHash);
  return initial;
}
export async function mutateCmsDraft(actorEmailHash: string, mutate: (draft: CmsDocument) => void) {
  const draft = structuredClone(await cmsDraft(actorEmailHash));
  mutate(draft);
  return saveCmsDraft(validateCmsDocument(draft), actorEmailHash);
}
