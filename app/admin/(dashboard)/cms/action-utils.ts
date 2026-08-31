import "server-only";
import { updateTag } from "next/cache";
import { requireAdminSession } from "@/shared/admin";
import { mutateCmsDraft } from "@/shared/cms/admin";
import type { CmsDocument } from "@/shared/cms";

export const checked = (form: FormData, name: string) => form.get(name) === "on";
export const value = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
export const lines = (form: FormData, name: string) => value(form, name).split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
export const pipeLinks = (form: FormData, name: string) => lines(form, name).map((line) => { const [label, ...href] = line.split("|"); return { label: label?.trim() ?? "", href: href.join("|").trim() }; }).filter((item) => item.label && item.href);
export async function mutateFromAdmin(mutator: (draft: CmsDocument) => void) {
  const session = await requireAdminSession();
  const result = await mutateCmsDraft(session.actorEmailHash, mutator);
  updateTag("cms:admin");
  return result;
}
