"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import { upsertWelcome } from "@/shared/convex";
import { isWelcomeLocale, validateWelcomeContent } from "@/shared/welcome";

function safePropertySlug(value: FormDataEntryValue | null) {
  const slug = String(value ?? "ruma-kamyna").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug) ? slug : "ruma-kamyna";
}

export async function updateWelcomeAction(formData: FormData) {
  const session = await requireAdminSession();
  const localeValue = formData.get("locale");
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  const intent = formData.get("intent") === "publish" ? "publish" : "save";
  const suffix = `locale=${encodeURIComponent(String(localeValue ?? "id"))}&property=${encodeURIComponent(propertySlug)}`;
  if (!isWelcomeLocale(localeValue)) redirect(`/admin/welcome?error=locale&${suffix}`);
  const parsed = validateWelcomeContent({
    headline: String(formData.get("headline") ?? ""),
    body: String(formData.get("body") ?? ""),
    signature: String(formData.get("signature") ?? ""),
  });
  if (!parsed.ok) redirect(`/admin/welcome?error=validation&${suffix}`);
  try {
    await upsertWelcome({
      propertySlug,
      locale: localeValue,
      content: parsed.value,
      publish: intent === "publish",
      actorEmailHash: hashAdminIdentity(session.email),
    });
  } catch {
    redirect(`/admin/welcome?error=service&${suffix}`);
  }
  revalidatePath("/admin/welcome");
  revalidatePath("/welcome");
  redirect(`/admin/welcome?status=${intent === "publish" ? "published" : "saved"}&${suffix}`);
}
