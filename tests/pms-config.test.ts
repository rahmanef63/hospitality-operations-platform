import { describe, expect, it } from "vitest";
import { HAS_INITIAL_PROPERTY_SEED, INITIAL_AMENITY_SEEDS, INITIAL_PROPERTY_SEED, addDays, formBoolean, monthBounds, optionalFormNumber } from "@/shared/pms";
describe("PMS generic configuration and form boundaries", () => {
  it("ships without provider property facts in upstream source", () => {
    expect(HAS_INITIAL_PROPERTY_SEED).toBe(false);
    expect(INITIAL_PROPERTY_SEED).toBeNull();
    expect(INITIAL_AMENITY_SEEDS).toEqual([]);
  });
  it("parses optional numeric and checkbox values without inventing defaults", () => { const form=new FormData();form.set("count","3");form.set("active","on");expect(optionalFormNumber(form,"count")).toBe(3);expect(optionalFormNumber(form,"missing")).toBeUndefined();expect(formBoolean(form,"active")).toBe(true);expect(formBoolean(form,"missing")).toBe(false); });
  it("calculates calendar dates deterministically", () => { expect(addDays("2026-08-28",7)).toBe("2026-09-04");expect(monthBounds("2026-12-15")).toEqual({start:"2026-12-01",end:"2027-01-01"}); });
});
