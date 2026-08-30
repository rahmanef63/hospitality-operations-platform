"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PropertySectionId } from "@/shared/content";
import { mediaByKey } from "@/shared/media";
import { checked, lines, mutateFromAdmin, value } from "./action-utils";

const IDS: PropertySectionId[] = ["hero","story","facts","gallery","pillars","rhythm","guides","enquiry"];
export async function saveCmsPropertyAction(form: FormData) {
  const slug=value(form,"slug");
  try { await mutateFromAdmin((draft) => {
    const property=draft.site.properties.find((item)=>item.slug===slug); const ui=draft.site.publicUi.properties[slug]; if(!property||!ui) throw new Error("Property missing");
    ui.sections={order:[...IDS].sort((a,b)=>Number(form.get(`order.${a}`)??0)-Number(form.get(`order.${b}`)??0)),hidden:IDS.filter((id)=>!checked(form,`visible.${id}`))};
    for (const key of ["backLabel","storyTitle","factsEyebrow","factsTitle","bookableUnitsLabel","galleryTitle","galleryDescription","pillarsTitle","rhythmEyebrow","rhythmTitle","guidesEyebrow","guidesTitle","guidesDescription","guideReadLabel","enquiryTitle","enquiryDescription","whatsappLabel"] as const) ui[key]=value(form,key);
    property.collectionLabel=value(form,"collectionLabel"); property.tagline=value(form,"tagline"); property.status=value(form,"statusText"); property.shortDescription=value(form,"shortDescription"); property.heroStatement=value(form,"heroStatement"); property.visualNote=value(form,"visualNote"); property.seo={title:value(form,"seoTitle"),description:value(form,"seoDescription"),keywords:lines(form,"seoKeywords")}; property.heroImage=mediaByKey(value(form,"heroMedia")); property.story=lines(form,"storyParagraphs"); property.storyImages=[mediaByKey(value(form,"storyMedia1")),mediaByKey(value(form,"storyMedia2"))]; property.enquiryImage=mediaByKey(value(form,"enquiryMedia")); property.primaryAction={label:value(form,"primaryActionLabel"),href:value(form,"primaryActionHref"),external:true};
    property.gallery=property.gallery.map((item,index)=>({label:value(form,`galleryLabel${index}`),image:mediaByKey(value(form,`galleryMedia${index}`))}));
    property.pillars=property.pillars.map((item,index)=>({title:value(form,`pillarTitle${index}`),description:value(form,`pillarDescription${index}`),image:mediaByKey(value(form,`pillarMedia${index}`))}));
    property.rhythm=property.rhythm.map((item,index)=>({moment:value(form,`rhythmMoment${index}`),title:value(form,`rhythmTitle${index}`),description:value(form,`rhythmDescription${index}`)}));
  }); } catch { redirect(`/admin/cms/properties?property=${encodeURIComponent(slug)}&error=validation`); }
  revalidatePath("/admin/cms/properties"); redirect(`/admin/cms/properties?property=${encodeURIComponent(slug)}&status=saved`);
}
