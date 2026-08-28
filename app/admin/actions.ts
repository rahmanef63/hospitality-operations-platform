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
  if (!isWelcomeLocale(localeValue)) redirect("/admin?error=locale");
  const parsed = validateWelcomeContent({
    headline: String(formData.get("headline") ?? ""),
    body: String(formData.get("body") ?? ""),
    signature: String(formData.get("signature") ?? ""),
  });
  if (!parsed.ok) redirect(`/admin?error=validation&locale=${localeValue}`);
  try {
    await upsertWelcome({
      locale: localeValue,
      content: parsed.value,
      publish: intent === "publish",
      actorEmailHash: hashAdminIdentity(session.email),
    });
  } catch {
    redirect(`/admin?error=service&locale=${localeValue}`);
  }
  revalidatePath("/admin");
  revalidatePath("/welcome");
  redirect(`/admin?status=${intent === "publish" ? "published" : "saved"}&locale=${localeValue}`);
}
