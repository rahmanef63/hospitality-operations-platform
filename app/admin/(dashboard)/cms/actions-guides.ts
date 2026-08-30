"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checked, mutateFromAdmin, value } from "./action-utils";

function sections(raw: string) { return raw.split(/\n---+\n/).map((block)=>{const [title,...paragraphs]=block.split(/\r?\n/).map((x)=>x.trim()).filter(Boolean);return {title:title??"",paragraphs};}).filter((item)=>item.title&&item.paragraphs.length); }
export async function saveCmsGuideAction(form: FormData) {
  const original=value(form,"originalSlug"); const slug=value(form,"slug").toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-|-$/g,"");
  try { await mutateFromAdmin((draft)=>{
    const next={slug,title:value(form,"title"),seoTitle:value(form,"seoTitle"),seoDescription:value(form,"seoDescription"),eyebrow:value(form,"eyebrow"),summary:value(form,"summary"),introduction:value(form,"introduction"),statusLabel:value(form,"statusLabel"),sections:sections(value(form,"sections")),relatedPropertySlug:value(form,"relatedPropertySlug"),indexable:checked(form,"indexable")};
    const index=draft.guides.findIndex((item)=>item.slug===(original||slug)); if(index>=0) draft.guides[index]=next; else draft.guides.push(next);
  }); } catch { redirect(`/admin/cms/guides?guide=${encodeURIComponent(original||slug)}&error=validation`); }
  revalidatePath("/admin/cms/guides"); redirect(`/admin/cms/guides?guide=${encodeURIComponent(slug)}&status=saved`);
}
export async function archiveCmsGuideAction(form: FormData) {
  const slug=value(form,"slug"); try { await mutateFromAdmin((draft)=>{draft.guides=draft.guides.filter((item)=>item.slug!==slug);}); } catch { redirect(`/admin/cms/guides?error=service`); }
  revalidatePath("/admin/cms/guides"); redirect("/admin/cms/guides?status=archived");
}
