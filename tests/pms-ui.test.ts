import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  calendarDays,
  daysBetween,
  monthGridRange,
  normalizeMonth,
  shiftMonth,
} from "@/shared/pms";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("admin UI interaction contracts", () => {
  it("builds a Monday-aligned six-week calendar and normalizes invalid months", () => {
    expect(monthGridRange("2026-08-01")).toEqual({ start: "2026-07-27", end: "2026-09-07" });
    const days = calendarDays("2026-08-01");
    expect(days).toHaveLength(42);
    expect(days[0]).toBe("2026-07-27");
    expect(days.at(-1)).toBe("2026-09-06");
    expect(shiftMonth("2026-12-01", 1)).toBe("2027-01-01");
    expect(normalizeMonth("2026-13", "2026-08-28")).toBe("2026-08-01");
    expect(daysBetween("2026-09-10", "2026-09-12")).toBe(2);
  });

  it("keeps reservation totals and currency server-authoritative", () => {
    const action = read("app/admin/(dashboard)/actions.ts");
    const mutation = read("convex/pms/reservations.ts");
    const reservationFields = action.slice(action.indexOf('"reservation.upsert"'), action.indexOf('"reservation.archive"'));
    expect(reservationFields).not.toContain("accommodationAmount");
    expect(reservationFields).not.toContain("totalAmount");
    expect(reservationFields).not.toContain('"currency"');
    expect(mutation).toContain("unit?.baseNightlyRate ?? property.baseNightlyRate");
    expect(mutation).toContain("accommodationAmount + extraFees - discountAmount");
    expect(mutation).toContain("cleanCurrency(property.currency)");
    const finance = read("convex/pms/finance.ts");
    expect(finance).toContain("reservation?.currency ?? property.currency");
    expect(finance).not.toContain("cleanCurrency(args.currency)");
  });

  it("ships connected reservation, calendar, finance, and searchable admin surfaces", () => {
    const reservation = read("slices/pms/components/reservation-form.tsx");
    const reservations = read("slices/pms/components/reservation-manager.tsx");
    const calendar = read("slices/pms/components/calendar-manager.tsx");
    const finance = read("slices/pms/components/transaction-form.tsx");
    expect(reservation).toContain("accommodationOptions");
    expect(reservation).toContain("Subtotal akomodasi");
    expect(reservation).toContain("Total reservasi");
    expect(reservations).toContain("<CalendarBoard");
    expect(calendar).toContain("<CalendarBoard");
    expect(finance).toContain("outstandingAmount");
    expect(finance).toContain("transactionCategoryOptions");
  });

  it("uses accessible tag selection, list search, sticky actions, and protected welcome editing", () => {
    const select = read("slices/pms/components/tag-select.tsx");
    const search = read("slices/pms/components/collection-search.tsx");
    const actions = read("slices/pms/components/form-actions.tsx");
    const welcome = read("slices/admin/components/welcome-editor.tsx");
    expect(select).toContain('role="listbox"');
    expect(select).toContain('role="option"');
    expect(select).toContain('event.key === "Escape"');
    expect(search).toContain('event.key === "/"');
    expect(actions).toContain("env(safe-area-inset-bottom)");
    expect(welcome).toContain("beforeunload");
    expect(welcome).toContain("WELCOME_GUEST_TOKEN");
    expect(welcome).toContain("Perubahan belum disimpan");
  });

  it("documents every admin feature and the verification plan", () => {
    const plan = read("docs/ADMIN-UX-PLAN.md");
    for (const feature of ["Dashboard", "Reservations", "Availability calendar", "Guests", "Properties", "Units", "Amenities", "Finance", "Tasks", "Welcome", "Navigation"]) {
      expect(plan).toContain(`| ${feature} |`);
    }
    expect(plan).toContain("Server-authoritative calculations");
    expect(plan).toContain("Authenticated desktop and mobile browser audits");
  });
});
