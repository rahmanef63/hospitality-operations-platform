"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { HomeSectionId } from "@/shared/content";
import { mediaByKey } from "@/shared/media";
import { checked, lines, mutateFromAdmin, value } from "./action-utils";

const IDS: HomeSectionId[] = ["hero", "introduction", "collection", "rituals", "philosophy", "contact"];
function composition(form: FormData) {
  const order = [...IDS].sort((a,b) => Number(form.get(`order.${a}`) ?? 0) - Number(form.get(`order.${b}`) ?? 0));
  return { order, hidden: IDS.filter((id) => !checked(form, `visible.${id}`)) };
}
export async function saveCmsHomeAction(form: FormData) {
  try { await mutateFromAdmin((draft) => {
    const home = draft.site.home; const ui = draft.site.publicUi.home; ui.sections = composition(form); ui.seoTitle = value(form,"seoTitle"); ui.seoDescription = value(form,"seoDescription"); ui.collectionLinkLabel = value(form,"collectionLinkLabel");
    home.hero = { ...home.hero, eyebrow:value(form,"heroEyebrow"), title:value(form,"heroTitle"), description:value(form,"heroDescription"), primaryAction:{label:value(form,"heroPrimaryLabel"),href:value(form,"heroPrimaryHref")}, secondaryAction:{label:value(form,"heroSecondaryLabel"),href:value(form,"heroSecondaryHref")}, image:mediaByKey(value(form,"heroMedia")) };
    home.introduction = { ...home.introduction, title:value(form,"introTitle"), paragraphs:lines(form,"introParagraphs"), image:mediaByKey(value(form,"introMedia")) };
    home.collection = { ...home.collection, title:value(form,"collectionTitle"), description:value(form,"collectionDescription"), images:[mediaByKey(value(form,"collectionMedia1")),mediaByKey(value(form,"collectionMedia2"))] };
    home.rituals.title=value(form,"ritualsTitle"); home.rituals.items=home.rituals.items.map((item,index)=>({ ...item, title:value(form,`ritualTitle${index}`), description:value(form,`ritualDescription${index}`), image:mediaByKey(value(form,`ritualMedia${index}`)) }));
    home.philosophy = { ...home.philosophy, eyebrow:value(form,"philosophyEyebrow"), title:value(form,"philosophyTitle"), paragraphs:lines(form,"philosophyParagraphs"), quote:value(form,"philosophyQuote"), image:mediaByKey(value(form,"philosophyMedia")) };
    home.contact = { ...home.contact, title:value(form,"contactTitle"), description:value(form,"contactDescription"), action:{label:value(form,"contactActionLabel"),href:value(form,"contactActionHref"),external:true}, image:mediaByKey(value(form,"contactMedia")), locationLabel:value(form,"locationLabel"), mapTitle:value(form,"mapTitle"), mapPendingText:value(form,"mapPendingText"), whatsappLabel:value(form,"whatsappLabel"), whatsappPendingText:value(form,"whatsappPendingText") };
  }); } catch { redirect("/admin/cms/home?error=validation"); }
  revalidatePath("/admin/cms/home"); redirect("/admin/cms/home?status=saved");
}
