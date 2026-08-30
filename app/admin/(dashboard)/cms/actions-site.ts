"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checked, lines, mutateFromAdmin, pipeLinks, value } from "./action-utils";

export async function saveCmsSiteAction(form: FormData) {
  try {
    await mutateFromAdmin((draft) => {
      const nav = pipeLinks(form, "navigation"); const footerLinks = pipeLinks(form, "footerLinks");
      if (nav.length) draft.site.navigation = nav; if (footerLinks.length) draft.site.footer.links = footerLinks;
      draft.site.footer.statement = value(form, "footerStatement"); draft.site.footer.legal = value(form, "footerLegal"); draft.site.footer.tagline = value(form, "footerTagline");
      const shell = draft.site.publicUi.shell; shell.showHeader = checked(form, "showHeader"); shell.showFooter = checked(form, "showFooter");
      const concierge = shell.concierge; concierge.enabled = checked(form, "conciergeEnabled"); concierge.desktopButtonLabel = value(form, "desktopButtonLabel"); concierge.mobileButtonLabel = value(form, "mobileButtonLabel"); concierge.eyebrow = value(form, "conciergeEyebrow"); concierge.title = value(form, "conciergeTitle"); concierge.openingMessage = value(form, "openingMessage"); concierge.suggestions = lines(form, "suggestions"); concierge.unavailableMessage = value(form, "unavailableMessage"); concierge.inputPlaceholder = value(form, "inputPlaceholder"); concierge.privacyNote = value(form, "privacyNote");
    });
  } catch { redirect("/admin/cms/site?error=validation"); }
  revalidatePath("/admin/cms/site"); redirect("/admin/cms/site?status=saved");
}
