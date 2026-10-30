import { v } from "convex/values";

export const announcementKindValidator = v.union(
  v.literal("time_window"), v.literal("fixed_time"), v.literal("prayer"),
);
export const prayerNameValidator = v.union(
  v.literal("fajr"), v.literal("dhuhr"), v.literal("asr"), v.literal("maghrib"), v.literal("isha"),
);
export const prayerMethodValidator = v.union(
  v.literal("singapore"), v.literal("muslim_world_league"), v.literal("egyptian"),
  v.literal("karachi"), v.literal("umm_al_qura"), v.literal("dubai"),
  v.literal("moonsighting_committee"), v.literal("north_america"), v.literal("kuwait"),
  v.literal("qatar"), v.literal("tehran"), v.literal("turkey"),
);
export const madhabValidator = v.union(v.literal("shafi"), v.literal("hanafi"));
export const lofiTrackKeyValidator = v.union(
  v.literal("still-morning"), v.literal("mountain-air"), v.literal("night-courtyard"),
);
export const presentationSlideKeyValidator = v.union(
  v.literal("arrival"), v.literal("stay"), v.literal("stillness"), v.literal("contact"),
);
export const presentationMediaKeyValidator = v.union(
  v.literal("livingCourtyard"), v.literal("bedroomRetreat"), v.literal("poolCourtyard"),
  v.literal("welcomeDetails"), v.literal("livingDining"), v.literal("spaBath"),
  v.literal("diningTable"), v.literal("materialPalette"),
);
export const presentationSlideValidator = v.object({
  key: presentationSlideKeyValidator,
  enabled: v.boolean(),
  sortOrder: v.number(),
  durationSeconds: v.number(),
  mediaKey: presentationMediaKeyValidator,
});
