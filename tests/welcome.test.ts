import { describe, expect, it } from "vitest";
import {
  DEFAULT_WELCOME_CONTENT,
  WELCOME_GUEST_TOKEN,
  normalizeGuestName,
  parseWelcomeLocale,
  renderWelcomeContent,
  validateWelcomeContent,
} from "@/shared/welcome";

describe("guest welcome content", () => {
  it("normalizes guest names without allowing markup or control characters", () => {
    expect(normalizeGuestName("  <b>Rahman</b>\n ")).toBe("Rahman");
    expect(normalizeGuestName("Siti ‘Aisyah’")).toBe("Siti ‘Aisyah’");
    expect(normalizeGuestName("   ")).toBeUndefined();
  });

  it("falls back to Indonesian for unsupported locale values", () => {
    expect(parseWelcomeLocale("en")).toBe("en");
    expect(parseWelcomeLocale("fr")).toBe("id");
    expect(parseWelcomeLocale(undefined)).toBe("id");
  });

  it("personalizes the headline and keeps a generic no-name fallback", () => {
    const named = renderWelcomeContent(DEFAULT_WELCOME_CONTENT.en, "en", "Maya");
    const generic = renderWelcomeContent(DEFAULT_WELCOME_CONTENT.id, "id");
    expect(named.headline).toBe("Welcome, Maya.");
    expect(named.headline).not.toContain(WELCOME_GUEST_TOKEN);
    expect(generic.headline).toBe("Selamat datang di Ruma Kamyna.");
  });

  it("validates required fields and bounded content", () => {
    expect(validateWelcomeContent({ headline: " ", body: "Body", signature: "Signature" }).ok).toBe(false);
    expect(validateWelcomeContent({
      headline: "Welcome",
      body: "A calm arrival.",
      signature: "Ruma Kamyna",
    })).toEqual({
      ok: true,
      value: { headline: "Welcome", body: "A calm arrival.", signature: "Ruma Kamyna" },
    });
  });
});
