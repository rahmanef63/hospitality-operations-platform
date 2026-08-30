import type { WelcomeLocale } from "../welcome/types";

export const ANNOUNCEMENT_KINDS = ["time_window", "fixed_time", "prayer"] as const;
export const PRAYER_NAMES = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export const PRAYER_METHODS = [
  "singapore", "muslim_world_league", "egyptian", "karachi", "umm_al_qura", "dubai",
  "moonsighting_committee", "north_america", "kuwait", "qatar", "tehran", "turkey",
] as const;
export const MADHABS = ["shafi", "hanafi"] as const;
export const LOFI_TRACK_KEYS = ["still-morning", "mountain-air", "night-courtyard"] as const;
export const PRESENTATION_SLIDE_KEYS = ["arrival", "stay", "stillness", "contact"] as const;
export const PRESENTATION_MEDIA_KEYS = [
  "livingCourtyard", "bedroomRetreat", "poolCourtyard", "welcomeDetails",
  "livingDining", "spaBath", "diningTable", "materialPalette",
] as const;

export type AnnouncementKind = (typeof ANNOUNCEMENT_KINDS)[number];
export type PrayerName = (typeof PRAYER_NAMES)[number];
export type PrayerMethod = (typeof PRAYER_METHODS)[number];
export type MadhabName = (typeof MADHABS)[number];
export type LofiTrackKey = (typeof LOFI_TRACK_KEYS)[number];
export type PresentationSlideKey = (typeof PRESENTATION_SLIDE_KEYS)[number];
export type PresentationMediaKey = (typeof PRESENTATION_MEDIA_KEYS)[number];

export type PresentationSlideSetting = {
  key: PresentationSlideKey;
  enabled: boolean;
  sortOrder: number;
  durationSeconds: number;
  mediaKey: PresentationMediaKey;
};

export type GuestVisibilitySettings = {
  welcomeShowBrand: boolean;
  welcomeShowLanguage: boolean;
  welcomeShowAnnouncement: boolean;
  welcomeShowBody: boolean;
  welcomeShowStay: boolean;
  welcomeShowContact: boolean;
  welcomeShowSignature: boolean;
  welcomeShowPrivateNote: boolean;
  presentationShowBrand: boolean;
  presentationShowLanguage: boolean;
  presentationShowAnnouncement: boolean;
  presentationShowCounter: boolean;
  presentationShowInstall: boolean;
  presentationSlides: PresentationSlideSetting[];
};

export type AnnouncementSettings = GuestVisibilitySettings & {
  propertySlug: string;
  prayerEnabled: boolean;
  prayerMethod: PrayerMethod;
  madhab: MadhabName;
  announcementVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  musicTrackKey: LofiTrackKey;
  createdAt?: number;
  updatedAt?: number;
};

export type LofiTrack = {
  key: LofiTrackKey;
  title: string;
  artist: string;
  src: string;
  durationSeconds: number;
  license: "CC0 1.0 Universal";
  licenseUrl: string;
  provenance: string;
};

export type AnnouncementRule = {
  id: string;
  propertySlug: string;
  name: string;
  locale: WelcomeLocale;
  kind: AnnouncementKind;
  message: string;
  enabled: boolean;
  speak: boolean;
  startTime?: string;
  endTime?: string;
  fixedTime?: string;
  prayer?: PrayerName;
  offsetMinutes: number;
  displayMinutes: number;
  priority: number;
  createdAt: number;
  updatedAt: number;
};

export type AnnouncementAuditEvent = {
  id: string;
  resource: "settings" | "experience" | "rule";
  resourceId: string;
  action: "create" | "update" | "archive" | "seed";
  summary: string;
  actorEmailHash: string;
  createdAt: number;
};

export type AnnouncementAdminOverview = {
  settings: AnnouncementSettings;
  rules: AnnouncementRule[];
  events: AnnouncementAuditEvent[];
};

export type PrayerMoment = { prayer: PrayerName; at: number; label: string };

export type AnnouncementProgram = {
  settings: AnnouncementSettings;
  rules: AnnouncementRule[];
  musicTrack: LofiTrack;
  timezone: string;
  dateKey: string;
  prayerMoments: PrayerMoment[];
  coordinatesAvailable: boolean;
  generatedAt: number;
  source: "convex" | "fallback";
};

export type ActiveAnnouncement = {
  key: string;
  ruleId: string;
  kind: AnnouncementKind;
  message: string;
  speak: boolean;
  prayer?: PrayerName;
};
