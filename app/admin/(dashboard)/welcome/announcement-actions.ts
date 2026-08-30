"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashAdminIdentity, requireAdminSession } from "@/shared/admin";
import {
  archiveAnnouncementRule,
  ensureAnnouncementDefaults,
  upsertAnnouncementRule,
  upsertAnnouncementSettings,
  upsertGuestVisibilitySettings,
} from "@/shared/convex";
import { getPropertyBySlug } from "@/shared/content";
import { PRESENTATION_SLIDE_KEYS, validateAnnouncementRule, validateAnnouncementSettings, validateGuestVisibilitySettings } from "@/shared/announcements";

function safePropertySlug(value: FormDataEntryValue | null) {
  const slug = String(value ?? "ruma-kamyna").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug) ? slug : "ruma-kamyna";
}

function adminUrl(propertySlug: string, status?: string, error?: string) {
  const params = new URLSearchParams({ property: propertySlug });
  if (status) params.set("status", status);
  if (error) params.set("error", error);
  return `/admin/welcome?${params}#announcements`;
}

function refreshWelcomeRoutes() {
  revalidatePath("/admin/welcome");
  revalidatePath("/welcome");
  revalidatePath("/presentation");
}

export async function updateAnnouncementSettingsAction(formData: FormData) {
  const session = await requireAdminSession();
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  const property = await getPropertyBySlug(propertySlug);
  const input = {
    prayerEnabled: formData.get("prayerEnabled") === "on",
    prayerMethod: String(formData.get("prayerMethod") ?? ""),
    madhab: String(formData.get("madhab") ?? ""),
    announcementVolume: Number(formData.get("announcementVolume")),
    musicEnabled: formData.get("musicEnabled") === "on",
    musicVolume: Number(formData.get("musicVolume")),
    musicTrackKey: String(formData.get("musicTrackKey") ?? "still-morning"),
  };
  if (input.prayerEnabled && !property?.location.geo) redirect(adminUrl(propertySlug, undefined, "announcement-geo"));
  try {
    const parsed = validateAnnouncementSettings(input, propertySlug);
    await upsertAnnouncementSettings({ ...parsed, actorEmailHash: hashAdminIdentity(session.email) });
  } catch {
    redirect(adminUrl(propertySlug, undefined, "announcement-validation"));
  }
  refreshWelcomeRoutes();
  redirect(adminUrl(propertySlug, "announcement-settings"));
}


export async function updateGuestVisibilityAction(formData: FormData) {
  const session = await requireAdminSession();
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  const input = {
    welcomeShowBrand: formData.get("welcomeShowBrand") === "on",
    welcomeShowLanguage: formData.get("welcomeShowLanguage") === "on",
    welcomeShowAnnouncement: formData.get("welcomeShowAnnouncement") === "on",
    welcomeShowBody: formData.get("welcomeShowBody") === "on",
    welcomeShowStay: formData.get("welcomeShowStay") === "on",
    welcomeShowContact: formData.get("welcomeShowContact") === "on",
    welcomeShowSignature: formData.get("welcomeShowSignature") === "on",
    welcomeShowPrivateNote: formData.get("welcomeShowPrivateNote") === "on",
    presentationShowBrand: formData.get("presentationShowBrand") === "on",
    presentationShowLanguage: formData.get("presentationShowLanguage") === "on",
    presentationShowAnnouncement: formData.get("presentationShowAnnouncement") === "on",
    presentationShowCounter: formData.get("presentationShowCounter") === "on",
    presentationShowInstall: formData.get("presentationShowInstall") === "on",
    presentationSlides: PRESENTATION_SLIDE_KEYS.map((key) => ({
      key,
      enabled: formData.get(`slide_${key}_enabled`) === "on",
      sortOrder: Number(formData.get(`slide_${key}_order`) ?? 10),
      durationSeconds: Number(formData.get(`slide_${key}_duration`) ?? 10),
      mediaKey: String(formData.get(`slide_${key}_media`) ?? "livingCourtyard"),
    })),
  };
  try {
    const parsed = validateGuestVisibilitySettings(input);
    await upsertGuestVisibilitySettings({
      propertySlug,
      ...parsed,
      actorEmailHash: hashAdminIdentity(session.email),
    });
  } catch {
    redirect(adminUrl(propertySlug, undefined, "experience-validation"));
  }
  refreshWelcomeRoutes();
  redirect(adminUrl(propertySlug, "experience-saved"));
}

export async function upsertAnnouncementRuleAction(formData: FormData) {
  const session = await requireAdminSession();
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  const input = {
    name: String(formData.get("name") ?? ""),
    locale: String(formData.get("locale") ?? ""),
    kind: String(formData.get("kind") ?? ""),
    message: String(formData.get("message") ?? ""),
    enabled: formData.get("enabled") === "on",
    speak: formData.get("speak") === "on",
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    fixedTime: String(formData.get("fixedTime") ?? ""),
    prayer: String(formData.get("prayer") ?? ""),
    offsetMinutes: Number(formData.get("offsetMinutes") ?? 0),
    displayMinutes: Number(formData.get("displayMinutes") ?? 10),
    priority: Number(formData.get("priority") ?? 10),
  };
  try {
    const parsed = validateAnnouncementRule(input, propertySlug);
    const ruleId = String(formData.get("ruleId") ?? "").trim() || undefined;
    await upsertAnnouncementRule({ ...parsed, ruleId, actorEmailHash: hashAdminIdentity(session.email) });
  } catch {
    redirect(adminUrl(propertySlug, undefined, "announcement-validation"));
  }
  refreshWelcomeRoutes();
  redirect(adminUrl(propertySlug, "announcement-rule"));
}

export async function archiveAnnouncementRuleAction(formData: FormData) {
  const session = await requireAdminSession();
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  const ruleId = String(formData.get("ruleId") ?? "").trim();
  if (!ruleId) redirect(adminUrl(propertySlug, undefined, "announcement-validation"));
  try {
    await archiveAnnouncementRule({ propertySlug, ruleId, actorEmailHash: hashAdminIdentity(session.email) });
  } catch {
    redirect(adminUrl(propertySlug, undefined, "announcement-service"));
  }
  refreshWelcomeRoutes();
  redirect(adminUrl(propertySlug, "announcement-archived"));
}

export async function ensureAnnouncementDefaultsAction(formData: FormData) {
  const session = await requireAdminSession();
  const propertySlug = safePropertySlug(formData.get("propertySlug"));
  try {
    await ensureAnnouncementDefaults(propertySlug, hashAdminIdentity(session.email));
  } catch {
    redirect(adminUrl(propertySlug, undefined, "announcement-service"));
  }
  refreshWelcomeRoutes();
  redirect(adminUrl(propertySlug, "announcement-seeded"));
}
