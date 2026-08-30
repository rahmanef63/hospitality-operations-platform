import { isWelcomeLocale } from "../welcome/config";
import { isLofiTrackKey } from "./music";
import {
  ANNOUNCEMENT_KINDS,
  MADHABS,
  PRESENTATION_MEDIA_KEYS,
  PRESENTATION_SLIDE_KEYS,
  PRAYER_METHODS,
  PRAYER_NAMES,
  type AnnouncementRule,
  type AnnouncementSettings,
  type GuestVisibilitySettings,
  type PresentationSlideSetting,
} from "./types";

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const ALLOWED_TOKENS = new Set(["guest", "tamu", "property", "prayer"]);
const inList = <T extends string>(value: unknown, list: readonly T[]): value is T =>
  typeof value === "string" && (list as readonly string[]).includes(value);

function text(value: unknown, label: string, min: number, max: number) {
  const normalized = String(value ?? "").normalize("NFKC").replace(/<[^>]*>/g, "").trim();
  if (normalized.length < min || normalized.length > max) throw new Error(`${label} tidak valid.`);
  return normalized;
}

function number(value: unknown, label: string, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new Error(`${label} tidak valid.`);
  return parsed;
}

function optionalTime(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized && TIME_PATTERN.test(normalized) ? normalized : undefined;
}

function validateTokens(message: string) {
  for (const match of message.matchAll(/{{\s*([^}]+)\s*}}/g)) {
    const token = match[1];
    if (!token || !ALLOWED_TOKENS.has(token)) throw new Error(`Token {{${token ?? ""}}} tidak didukung.`);
  }
}

export function validateAnnouncementSettings(
  input: Record<string, unknown>,
  propertySlug: string,
): Pick<AnnouncementSettings, "propertySlug" | "prayerEnabled" | "prayerMethod" | "madhab" | "announcementVolume" | "musicEnabled" | "musicVolume" | "musicTrackKey"> {
  if (!inList(input.prayerMethod, PRAYER_METHODS)) throw new Error("Metode waktu salat tidak valid.");
  if (!inList(input.madhab, MADHABS)) throw new Error("Mazhab tidak valid.");
  if (!isLofiTrackKey(input.musicTrackKey)) throw new Error("Pilihan musik lo-fi tidak valid.");
  return {
    propertySlug,
    prayerEnabled: input.prayerEnabled === true,
    prayerMethod: input.prayerMethod,
    madhab: input.madhab,
    announcementVolume: number(input.announcementVolume, "Volume announcement", 0, 1),
    musicEnabled: input.musicEnabled === true,
    musicVolume: number(input.musicVolume, "Volume musik", 0, 0.5),
    musicTrackKey: input.musicTrackKey,
  };
}

function parseSlides(value: unknown): PresentationSlideSetting[] {
  if (!Array.isArray(value) || value.length !== PRESENTATION_SLIDE_KEYS.length) {
    throw new Error("Komposisi slide tidak lengkap.");
  }
  const slides = value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Slide tidak valid.");
    const row = item as Record<string, unknown>;
    if (!inList(row.key, PRESENTATION_SLIDE_KEYS)) throw new Error("Jenis slide tidak valid.");
    if (!inList(row.mediaKey, PRESENTATION_MEDIA_KEYS)) throw new Error("Media slide tidak valid.");
    return {
      key: row.key,
      enabled: row.enabled === true,
      sortOrder: Math.round(number(row.sortOrder, "Urutan slide", 1, 100)),
      durationSeconds: Math.round(number(row.durationSeconds, "Durasi slide", 5, 60)),
      mediaKey: row.mediaKey,
    };
  });
  if (new Set(slides.map((slide) => slide.key)).size !== PRESENTATION_SLIDE_KEYS.length) {
    throw new Error("Jenis slide harus unik.");
  }
  if (!slides.some((slide) => slide.enabled)) throw new Error("Minimal satu slide harus aktif.");
  return slides;
}

export function validateGuestVisibilitySettings(input: Record<string, unknown>): GuestVisibilitySettings {
  return {
    welcomeShowBrand: input.welcomeShowBrand === true,
    welcomeShowLanguage: input.welcomeShowLanguage === true,
    welcomeShowAnnouncement: input.welcomeShowAnnouncement === true,
    welcomeShowBody: input.welcomeShowBody === true,
    welcomeShowStay: input.welcomeShowStay === true,
    welcomeShowContact: input.welcomeShowContact === true,
    welcomeShowSignature: input.welcomeShowSignature === true,
    welcomeShowPrivateNote: input.welcomeShowPrivateNote === true,
    presentationShowBrand: input.presentationShowBrand === true,
    presentationShowLanguage: input.presentationShowLanguage === true,
    presentationShowAnnouncement: input.presentationShowAnnouncement === true,
    presentationShowCounter: input.presentationShowCounter === true,
    presentationShowInstall: input.presentationShowInstall === true,
    presentationSlides: parseSlides(input.presentationSlides),
  };
}

export function validateAnnouncementRule(input: Record<string, unknown>, propertySlug: string): Omit<AnnouncementRule, "id" | "createdAt" | "updatedAt"> {
  if (!isWelcomeLocale(input.locale)) throw new Error("Bahasa announcement tidak valid.");
  if (!inList(input.kind, ANNOUNCEMENT_KINDS)) throw new Error("Jenis announcement tidak valid.");
  const message = text(input.message, "Pesan", 2, 220);
  validateTokens(message);
  const startTime = optionalTime(input.startTime);
  const endTime = optionalTime(input.endTime);
  const fixedTime = optionalTime(input.fixedTime);
  const prayer = inList(input.prayer, PRAYER_NAMES) ? input.prayer : undefined;
  if (input.kind === "time_window" && (!startTime || !endTime)) throw new Error("Jam mulai dan selesai wajib diisi.");
  if (input.kind === "fixed_time" && !fixedTime) throw new Error("Jam tetap wajib diisi.");
  if (input.kind === "prayer" && !prayer) throw new Error("Waktu salat wajib dipilih.");
  return {
    propertySlug,
    name: text(input.name, "Nama", 2, 80),
    locale: input.locale,
    kind: input.kind,
    message,
    enabled: input.enabled === true,
    speak: input.speak === true,
    startTime: input.kind === "time_window" ? startTime : undefined,
    endTime: input.kind === "time_window" ? endTime : undefined,
    fixedTime: input.kind === "fixed_time" ? fixedTime : undefined,
    prayer: input.kind === "prayer" ? prayer : undefined,
    offsetMinutes: Math.round(number(input.offsetMinutes, "Offset", -60, 60)),
    displayMinutes: Math.round(number(input.displayMinutes, "Durasi tampil", 1, 60)),
    priority: Math.round(number(input.priority, "Prioritas", 0, 100)),
  };
}
