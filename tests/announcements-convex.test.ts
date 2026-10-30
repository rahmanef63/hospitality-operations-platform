import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { api, internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
import type { Id } from "@/convex/_generated/dataModel";

const modules = import.meta.glob("../convex/**/*.{ts,js}");
const actorEmailHash = "announcement-test-actor-hash-000000000000000000000";

describe("Convex announcement CRUD", () => {
  it("seeds reviewed greetings idempotently and publishes only active locale rules", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(internal.announcements.ensureDefaults, {
      propertySlug: "primary-property", actorEmailHash,
    })).resolves.toEqual({ settingsCreated: true, rulesCreated: 8 });
    await expect(t.mutation(internal.announcements.ensureDefaults, {
      propertySlug: "primary-property", actorEmailHash,
    })).resolves.toEqual({ settingsCreated: false, rulesCreated: 0 });

    const publicId = await t.query(api.announcements.getPublic, { propertySlug: "primary-property", locale: "id" });
    const publicArabic = await t.query(api.announcements.getPublic, { propertySlug: "primary-property", locale: "ar" });
    expect(publicId.configured).toBe(true);
    expect(publicId.settings).toMatchObject({ prayerEnabled: false, prayerMethod: "singapore", musicEnabled: true });
    expect(publicId.rules).toHaveLength(4);
    expect(publicArabic.rules).toHaveLength(0);
  });

  it("creates, updates, and archives a prayer-time rule with audited settings", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.announcements.upsertSettings, {
      propertySlug: "primary-property", prayerEnabled: true, prayerMethod: "singapore",
      madhab: "shafi", announcementVolume: 0.8, musicEnabled: true, musicVolume: 0.12,
      musicTrackKey: "mountain-air", actorEmailHash,
    });

    await t.mutation(internal.announcements.upsertExperience, {
      propertySlug: "primary-property",
      welcomeShowBrand: true,
      welcomeShowLanguage: false,
      welcomeShowAnnouncement: true,
      welcomeShowBody: false,
      welcomeShowStay: true,
      welcomeShowContact: true,
      welcomeShowSignature: true,
      welcomeShowPrivateNote: false,
      presentationShowBrand: true,
      presentationShowLanguage: false,
      presentationShowAnnouncement: true,
      presentationShowCounter: false,
      presentationShowInstall: true,
      presentationSlides: [
        { key: "arrival", enabled: true, sortOrder: 20, durationSeconds: 12, mediaKey: "poolCourtyard" },
        { key: "stay", enabled: true, sortOrder: 10, durationSeconds: 9, mediaKey: "bedroomRetreat" },
        { key: "stillness", enabled: false, sortOrder: 30, durationSeconds: 10, mediaKey: "livingCourtyard" },
        { key: "contact", enabled: true, sortOrder: 40, durationSeconds: 15, mediaKey: "welcomeDetails" },
      ],
      actorEmailHash,
    });

    const created = await t.mutation(internal.announcements.upsertRule, {
      propertySlug: "primary-property", name: "Maghrib greeting", locale: "id", kind: "prayer",
      message: "Waktu {{prayer}}, {{tamu}}.", enabled: true, speak: true, prayer: "maghrib",
      offsetMinutes: 0, displayMinutes: 10, priority: 100, actorEmailHash,
    });
    expect(created).toMatchObject({ kind: "prayer", prayer: "maghrib", enabled: true });
    const updated = await t.mutation(internal.announcements.upsertRule, {
      ruleId: created.id as Id<"announcementRules">, propertySlug: "primary-property", name: "Maghrib reminder", locale: "id", kind: "prayer",
      message: "Waktu {{prayer}}, {{tamu}}.", enabled: true, speak: false, prayer: "maghrib",
      offsetMinutes: 2, displayMinutes: 8, priority: 90, actorEmailHash,
    });
    expect(updated).toMatchObject({ name: "Maghrib reminder", speak: false, offsetMinutes: 2 });
    await t.mutation(internal.announcements.archiveRule, {
      ruleId: created.id as Id<"announcementRules">, propertySlug: "primary-property", actorEmailHash,
    });
    const overview = await t.query(internal.announcements.getAdminOverview, { propertySlug: "primary-property" });
    expect(overview.rules).toHaveLength(0);
    expect(overview.settings).toMatchObject({
      musicTrackKey: "mountain-air",
      welcomeShowLanguage: false,
      welcomeShowBody: false,
      presentationShowCounter: false,
    });
    expect(overview.settings.presentationSlides.find((slide) => slide.key === "stay")).toMatchObject({ sortOrder: 10, durationSeconds: 9 });
    expect(overview.events.map((event) => event.action)).toEqual(expect.arrayContaining(["create", "update", "archive"]));
  });
});
