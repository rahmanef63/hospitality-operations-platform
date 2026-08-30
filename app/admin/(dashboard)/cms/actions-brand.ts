"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checked, lines, mutateFromAdmin, value } from "./action-utils";

export async function saveCmsBrandAssetsAction(form: FormData) {
  try { await mutateFromAdmin((draft)=>{
    const ui=draft.site.publicUi.brandAssets; ui.visible=checked(form,"visible"); ui.paletteVisible=checked(form,"paletteVisible"); ui.usageVisible=checked(form,"usageVisible");
    for(const key of ["seoTitle","seoDescription","backLabel","heroEyebrow","heroTitle","heroDescription","heroMediaKey","identityEyebrow","identityTitle","assetEyebrow","downloadLabel","paletteEyebrow","paletteTitle","usageEyebrow","usageTitle"] as const) ui[key]=value(form,key);
    ui.usageRules=lines(form,"usageRules"); ui.assets=ui.assets.map((asset,index)=>({...asset,name:value(form,`assetName${index}`),description:value(form,`assetDescription${index}`),visible:checked(form,`assetVisible${index}`)}));
  }); } catch { redirect("/admin/cms/brand-assets?error=validation"); }
  revalidatePath("/admin/cms/brand-assets"); redirect("/admin/cms/brand-assets?status=saved");
}
