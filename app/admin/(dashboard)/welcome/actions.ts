"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import { upsertWelcome } from "@/shared/convex";
import { isWelcomeLocale, validateWelcomeContent } from "@/shared/welcome";

export async function updateWelcomeAction(formData: FormData) {
  const session = await requireAdminSession();
  const localeValue = formData.get("locale");
  const intent = formData.get("intent") === "publish" ? "publish" : "save";
  if (!isWelcomeLocale(localeValue)) redirect("/admin/welcome?error=locale");
  const parsed = validateWelcomeContent({
    headline: String(formData.get("headline") ?? ""),
    body: String(formData.get("body") ?? ""),
    signature: String(formData.get("signature") ?? ""),
  });
  if (!parsed.ok) redirect(`/admin/welcome?error=validation&locale=${localeValue}`);
  try {
    await upsertWelcome({
      locale: localeValue,
      content: parsed.value,
      publish: intent === "publish",
      actorEmailHash: hashAdminIdentity(session.email),
    });
  } catch {
    redirect(`/admin/welcome?error=service&locale=${localeValue}`);
  }
  revalidatePath("/admin/welcome");
  revalidatePath("/welcome");
  redirect(`/admin/welcome?status=${intent === "publish" ? "published" : "saved"}&locale=${localeValue}`);
}
