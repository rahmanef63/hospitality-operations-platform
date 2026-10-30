import { describe, expect, it } from "vitest";
import {
  calculatePrayerMoments,
  defaultAnnouncementSettings,
  getLofiTrack,
  renderAnnouncementMessage,
  resolveActiveAnnouncement,
  validateAnnouncementRule,
  validateAnnouncementSettings,
  validateGuestVisibilitySettings,
  type AnnouncementProgram,
  type AnnouncementRule,
} from "@/shared/announcements";

function rule(overrides: Partial<AnnouncementRule> = {}): AnnouncementRule {
  return {
    id: "rule-1",
    propertySlug: "test-property",
    name: "Morning",
    locale: "id",
    kind: "time_window",
    message: "Selamat pagi, {{tamu}}.",
    enabled: true,
    speak: true,
    startTime: "04:00",
    endTime: "11:00",
    offsetMinutes: 0,
    displayMinutes: 10,
    priority: 10,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function program(rules: AnnouncementRule[], prayerMoments: AnnouncementProgram["prayerMoments"] = []): AnnouncementProgram {
  return {
    settings: defaultAnnouncementSettings("test-property"),
    rules,
    musicTrack: getLofiTrack("still-morning"),
    timezone: "UTC",
    dateKey: "2026-08-29",
    prayerMoments,
    coordinatesAvailable: Boolean(prayerMoments.length),
    generatedAt: Date.UTC(2026, 7, 29, 8),
    source: "fallback",
  };
}

describe("time-aware guest announcements", () => {
  it("resolves localized daytime and overnight windows with guest-token aliases", () => {
    const morning = resolveActiveAnnouncement(program([rule()]), {
      now: new Date("2026-08-29T08:00:00Z"),
      guestName: "Maya",
      propertyName: "Ruma Test",
      locale: "id",
    });
    expect(morning?.message).toBe("Selamat pagi, Maya.");

    const nightRule = rule({ id: "night", name: "Night", startTime: "18:00", endTime: "04:00", message: "Selamat malam, {{guest}}." });
    expect(resolveActiveAnnouncement(program([nightRule]), {
      now: new Date("2026-08-29T23:15:00Z"), guestName: "Maya", propertyName: "Ruma Test", locale: "id",
    })?.message).toBe("Selamat malam, Maya.");
    expect(resolveActiveAnnouncement(program([nightRule]), {
      now: new Date("2026-08-29T12:00:00Z"), guestName: "Maya", propertyName: "Ruma Test", locale: "id",
    })).toBeUndefined();
  });

  it("prioritizes rules and activates fixed-time and prayer windows without guessing times", () => {
    const fixed = rule({ id: "fixed", name: "Tea", kind: "fixed_time", fixedTime: "15:00", startTime: undefined, endTime: undefined, displayMinutes: 8, priority: 20, message: "Tea time at {{property}}." });
    expect(resolveActiveAnnouncement(program([rule(), fixed]), {
      now: new Date("2026-08-29T15:05:00Z"), propertyName: "Ruma Test", locale: "en",
    })?.ruleId).toBe("fixed");

    const prayerAt = Date.parse("2026-08-29T11:00:00Z");
    const prayer = rule({ id: "prayer", name: "Maghrib", kind: "prayer", prayer: "maghrib", startTime: undefined, endTime: undefined, offsetMinutes: 2, displayMinutes: 10, priority: 100, message: "Waktu {{prayer}}, {{tamu}}." });
    expect(resolveActiveAnnouncement(program([prayer], [{ prayer: "maghrib", at: prayerAt, label: "Maghrib" }]), {
      now: new Date(prayerAt + 5 * 60_000), guestName: "Maya", propertyName: "Ruma Test", locale: "id",
    })?.message).toBe("Waktu Maghrib, Maya.");
  });

  it("validates bounded settings, schedules, and only approved message tokens", () => {
    expect(validateAnnouncementSettings({
      prayerEnabled: true, prayerMethod: "singapore", madhab: "shafi",
      announcementVolume: 0.8, musicEnabled: true, musicVolume: 0.12, musicTrackKey: "mountain-air",
    }, "ruma-test")).toMatchObject({ prayerMethod: "singapore", madhab: "shafi" });
    expect(() => validateAnnouncementRule({
      name: "Morning", locale: "id", kind: "time_window", message: "Halo {{secret}}",
      enabled: true, speak: true, startTime: "04:00", endTime: "11:00",
      offsetMinutes: 0, displayMinutes: 10, priority: 10,
    }, "ruma-test")).toThrow(/token/i);
    expect(renderAnnouncementMessage("Halo {{tamu}} di {{property}}", {
      guestName: "Rina", propertyName: "Ruma Test", locale: "id",
    })).toBe("Halo Rina di Ruma Test");
  });


  it("validates guest-visible composition and requires at least one enabled slide", () => {
    const defaults = defaultAnnouncementSettings("ruma-test");
    expect(validateGuestVisibilitySettings(defaults).presentationSlides).toHaveLength(4);
    expect(() => validateGuestVisibilitySettings({
      ...defaults,
      presentationSlides: defaults.presentationSlides.map((slide) => ({ ...slide, enabled: false })),
    })).toThrow(/minimal satu slide/i);
    expect(getLofiTrack("night-courtyard")).toMatchObject({
      src: "/audio/night-courtyard.mp3",
      license: "CC0 1.0 Universal",
    });
  });

  it("calculates five ordered prayer moments only from explicit coordinates, timezone, method, and madhab", () => {
    const moments = calculatePrayerMoments({
      latitude: -6.2,
      longitude: 106.8,
      timezone: "Asia/Jakarta",
      method: "singapore",
      madhab: "shafi",
      date: new Date("2026-08-29T03:00:00Z"),
    });
    expect(moments.map((item) => item.prayer)).toEqual(["fajr", "dhuhr", "asr", "maghrib", "isha"]);
    expect(moments.every((item, index) => index === 0 || item.at > moments[index - 1]!.at)).toBe(true);
  });
});
