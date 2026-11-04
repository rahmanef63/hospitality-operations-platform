import { describe, expect, it } from "vitest";
import { addDays, monthBounds, todayInTimeZone } from "@/shared/pms/dates";

describe("PMS date helpers", () => {
  it("resolves today in the requested time zone, not UTC", () => {
    const instant = new Date("2026-01-31T18:30:00Z");
    expect(todayInTimeZone("Asia/Jakarta", instant)).toBe("2026-02-01");
    expect(todayInTimeZone("UTC", instant)).toBe("2026-01-31");
  });

  it("adds days across month, year, and leap boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("returns half-open month bounds including December rollover", () => {
    expect(monthBounds("2026-02-14")).toEqual({ start: "2026-02-01", end: "2026-03-01" });
    expect(monthBounds("2026-12-05")).toEqual({ start: "2026-12-01", end: "2027-01-01" });
  });
});
