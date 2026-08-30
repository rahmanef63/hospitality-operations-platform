import { describe, expect, it } from "vitest";
import { HAS_INITIAL_PROPERTY_SEED, INITIAL_AMENITY_SEEDS, INITIAL_PROPERTY_SEED, addDays, formBoolean, monthBounds, optionalFormNumber } from "@/shared/pms";
describe("PMS tenant configuration and form boundaries", () => {
  it("keeps initial seed configuration internally consistent", () => {
    expect(HAS_INITIAL_PROPERTY_SEED).toBe(INITIAL_PROPERTY_SEED !== null);
    if (!INITIAL_PROPERTY_SEED) { expect(INITIAL_AMENITY_SEEDS).toEqual([]); return; }
    expect(INITIAL_PROPERTY_SEED.slug).toMatch(/^[a-z0-9][a-z0-9-]+$/);
    expect(INITIAL_PROPERTY_SEED.name.trim().length).toBeGreaterThan(1);
    expect(INITIAL_PROPERTY_SEED.countryCode).toHaveLength(2);
    expect(new Set(INITIAL_AMENITY_SEEDS.map((item) => item.key)).size).toBe(INITIAL_AMENITY_SEEDS.length);
  });
  it("parses optional numeric and checkbox values without inventing defaults", () => { const form=new FormData();form.set("count","3");form.set("active","on");expect(optionalFormNumber(form,"count")).toBe(3);expect(optionalFormNumber(form,"missing")).toBeUndefined();expect(formBoolean(form,"active")).toBe(true);expect(formBoolean(form,"missing")).toBe(false); });
  it("calculates calendar dates deterministically", () => { expect(addDays("2026-08-28",7)).toBe("2026-09-04");expect(monthBounds("2026-12-15")).toEqual({start:"2026-12-01",end:"2027-01-01"}); });
});
