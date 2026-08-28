import { describe, expect, it } from "vitest";
import {
  RUMA_KAMYNA_AMENITY_SEEDS,
  RUMA_KAMYNA_PROPERTY_SEED,
  addDays,
  formBoolean,
  monthBounds,
  optionalFormNumber,
} from "@/shared/pms";

describe("PMS verified configuration and form boundaries", () => {
  it("contains only owner-confirmed Ruma Kamyna property facts", () => {
    expect(RUMA_KAMYNA_PROPERTY_SEED).toMatchObject({
      name: "Ruma Kamyna",
      slug: "ruma-kamyna",
      propertyType: "villa",
      bedroomCount: 3,
      locationLabel: "Megamendung, Puncak Bogor",
    });
    expect(RUMA_KAMYNA_PROPERTY_SEED).not.toHaveProperty("bathroomCount");
    expect(RUMA_KAMYNA_PROPERTY_SEED).not.toHaveProperty("maxGuests");
    expect(RUMA_KAMYNA_PROPERTY_SEED).not.toHaveProperty("baseNightlyRate");
    expect(RUMA_KAMYNA_AMENITY_SEEDS.map((item) => item.key)).toEqual([
      "swimming-pool", "gym", "jacuzzi", "mountain-view",
    ]);
  });

  it("parses optional numeric and checkbox form values without inventing defaults", () => {
    const form = new FormData();
    form.set("count", "3");
    form.set("active", "on");
    expect(optionalFormNumber(form, "count")).toBe(3);
    expect(optionalFormNumber(form, "missing")).toBeUndefined();
    expect(formBoolean(form, "active")).toBe(true);
    expect(formBoolean(form, "missing")).toBe(false);
  });

  it("calculates calendar dates deterministically", () => {
    expect(addDays("2026-08-28", 7)).toBe("2026-09-04");
    expect(monthBounds("2026-12-15")).toEqual({ start: "2026-12-01", end: "2027-01-01" });
  });
});
