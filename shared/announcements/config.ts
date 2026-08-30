import { defaultPresentationSlides } from "./experience";
import type { AnnouncementRule, AnnouncementSettings, PrayerMethod } from "./types";

export const DEFAULT_PRAYER_METHOD: PrayerMethod = "singapore";

export const PRAYER_METHOD_OPTIONS = [
  { value: "singapore", label: "Singapore · Malaysia & Indonesia" },
  { value: "muslim_world_league", label: "Muslim World League" },
  { value: "egyptian", label: "Egyptian General Authority" },
  { value: "karachi", label: "University of Islamic Sciences, Karachi" },
  { value: "umm_al_qura", label: "Umm al-Qura, Makkah" },
  { value: "dubai", label: "Dubai" },
  { value: "moonsighting_committee", label: "Moonsighting Committee" },
  { value: "north_america", label: "North America · ISNA" },
  { value: "kuwait", label: "Kuwait" },
  { value: "qatar", label: "Qatar" },
  { value: "tehran", label: "Tehran" },
  { value: "turkey", label: "Turkey · approximation" },
] as const;

export function defaultAnnouncementSettings(propertySlug = "ruma-kamyna"): AnnouncementSettings {
  return {
    propertySlug,
    prayerEnabled: false,
    prayerMethod: DEFAULT_PRAYER_METHOD,
    madhab: "shafi",
    announcementVolume: 0.82,
    musicEnabled: true,
    musicVolume: 0.18,
    musicTrackKey: "still-morning",
    welcomeShowBrand: true,
    welcomeShowLanguage: true,
    welcomeShowAnnouncement: true,
    welcomeShowBody: true,
    welcomeShowStay: true,
    welcomeShowContact: true,
    welcomeShowSignature: true,
    welcomeShowPrivateNote: true,
    presentationShowBrand: true,
    presentationShowLanguage: true,
    presentationShowAnnouncement: true,
    presentationShowCounter: true,
    presentationShowInstall: true,
    presentationSlides: defaultPresentationSlides(),
  };
}

const rule = (
  id: string,
  locale: "id" | "en",
  name: string,
  message: string,
  startTime: string,
  endTime: string,
): AnnouncementRule => ({
  id,
  propertySlug: "ruma-kamyna",
  locale,
  name,
  kind: "time_window",
  message,
  enabled: true,
  speak: true,
  startTime,
  endTime,
  offsetMinutes: 0,
  displayMinutes: 10,
  priority: 10,
  createdAt: 0,
  updatedAt: 0,
});

export const DEFAULT_ANNOUNCEMENT_RULES: AnnouncementRule[] = [
  rule("default-id-pagi", "id", "Selamat pagi", "Selamat pagi, {{tamu}}.", "04:00", "11:00"),
  rule("default-id-siang", "id", "Selamat siang", "Selamat siang, {{tamu}}.", "11:00", "15:00"),
  rule("default-id-sore", "id", "Selamat sore", "Selamat sore, {{tamu}}.", "15:00", "18:00"),
  rule("default-id-malam", "id", "Selamat malam", "Selamat malam, {{tamu}}.", "18:00", "04:00"),
  rule("default-en-morning", "en", "Good morning", "Good morning, {{guest}}.", "04:00", "12:00"),
  rule("default-en-afternoon", "en", "Good afternoon", "Good afternoon, {{guest}}.", "12:00", "18:00"),
  rule("default-en-evening", "en", "Good evening", "Good evening, {{guest}}.", "18:00", "22:00"),
  rule("default-en-night", "en", "Good night", "Good evening, {{guest}}.", "22:00", "04:00"),
];

export function defaultRulesForProperty(propertySlug: string, locale?: string) {
  return DEFAULT_ANNOUNCEMENT_RULES
    .filter((item) => !locale || item.locale === locale)
    .map((item) => ({ ...item, propertySlug }));
}
