import "server-only";
import { getPublicAnnouncements } from "@/shared/convex";
import type { PropertyGeo } from "@/shared/content/types";
import type { WelcomeLocale } from "@/shared/welcome";
import { defaultAnnouncementSettings, defaultRulesForProperty } from "./config";
import { getLofiTrack } from "./music";
import { calculatePrayerMoments } from "./prayer";
import { dateKeyInTimezone } from "./time";
import type { AnnouncementProgram } from "./types";

export async function getAnnouncementProgram(input: {
  propertySlug: string;
  locale: WelcomeLocale;
  timezone: string;
  coordinates?: PropertyGeo;
  now?: Date;
}): Promise<AnnouncementProgram> {
  const now = input.now ?? new Date();
  let source: AnnouncementProgram["source"] = "fallback";
  let settings = defaultAnnouncementSettings(input.propertySlug);
  let rules = defaultRulesForProperty(input.propertySlug, input.locale);
  try {
    const stored = await getPublicAnnouncements(input.propertySlug, input.locale);
    if (stored.configured) {
      source = "convex";
      settings = stored.settings;
      rules = stored.rules;
    }
  } catch {
    // Reviewed local greetings keep the guest page useful while Convex is unavailable.
  }
  const prayerMoments = settings.prayerEnabled && input.coordinates
    ? calculatePrayerMoments({
        ...input.coordinates,
        timezone: input.timezone,
        method: settings.prayerMethod,
        madhab: settings.madhab,
        date: now,
      })
    : [];
  return {
    settings,
    rules,
    musicTrack: getLofiTrack(settings.musicTrackKey),
    timezone: input.timezone,
    dateKey: dateKeyInTimezone(input.timezone, now),
    prayerMoments,
    coordinatesAvailable: Boolean(input.coordinates),
    generatedAt: now.getTime(),
    source,
  };
}
