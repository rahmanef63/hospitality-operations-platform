import "server-only";
import { api } from "@/convex/_generated/api";
import type {
  AnnouncementAdminOverview,
  AnnouncementRule,
  AnnouncementSettings,
  GuestVisibilitySettings,
} from "@/shared/announcements";
import type { WelcomeLocale } from "@/shared/welcome";
import { adminFetch, getConvexClient } from "./core";

type AudioSettingsInput = Pick<AnnouncementSettings,
  "propertySlug" | "prayerEnabled" | "prayerMethod" | "madhab" |
  "announcementVolume" | "musicEnabled" | "musicVolume" | "musicTrackKey"
>;

export async function getPublicAnnouncements(propertySlug: string, locale: WelcomeLocale) {
  return getConvexClient().query(api.announcements.getPublic, { propertySlug, locale });
}

export async function getAnnouncementAdminOverview(propertySlug: string): Promise<AnnouncementAdminOverview> {
  return adminFetch<AnnouncementAdminOverview>("/admin/announcement-overview", { propertySlug });
}

export async function upsertAnnouncementSettings(input: AudioSettingsInput & { actorEmailHash: string }) {
  return adminFetch<AnnouncementSettings>("/admin/announcement-settings-upsert", input);
}

export async function upsertGuestVisibilitySettings(input: GuestVisibilitySettings & {
  propertySlug: string;
  actorEmailHash: string;
}) {
  return adminFetch<AnnouncementSettings>("/admin/announcement-experience-upsert", input);
}

export async function upsertAnnouncementRule(input: Omit<AnnouncementRule, "id" | "createdAt" | "updatedAt"> & {
  ruleId?: string;
  actorEmailHash: string;
}) {
  return adminFetch<AnnouncementRule>("/admin/announcement-rule-upsert", input);
}

export async function archiveAnnouncementRule(input: {
  propertySlug: string;
  ruleId: string;
  actorEmailHash: string;
}) {
  return adminFetch<{ archived: boolean }>("/admin/announcement-rule-archive", input);
}

export async function ensureAnnouncementDefaults(propertySlug: string, actorEmailHash: string) {
  return adminFetch<{ settingsCreated: boolean; rulesCreated: number }>("/admin/ensure-announcement-defaults", {
    propertySlug,
    actorEmailHash,
  });
}
