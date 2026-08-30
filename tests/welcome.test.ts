import { describe, expect, it } from "vitest";
import {
  DEFAULT_WELCOME_CONTENT,
  defaultWelcomeContent,
  WELCOME_GUEST_TOKEN,
  WELCOME_LOCALES,
  WELCOME_LOCALE_META,
  normalizeGuestName,
  parseWelcomeLocale,
  renderWelcomeContent,
  validateWelcomeContent,
} from "@/shared/welcome";

describe("guest welcome content", () => {
  it("ships exactly 20 supported languages including requested scripts", () => {
    expect(WELCOME_LOCALES).toHaveLength(20);
    expect(WELCOME_LOCALES).toEqual(expect.arrayContaining(["id", "en", "ar", "ja", "zh-CN", "ko", "la"]));
    expect(WELCOME_LOCALE_META.ar.direction).toBe("rtl");
    expect(WELCOME_LOCALE_META.ja.nativeLabel).toBe("日本語");
    expect(WELCOME_LOCALE_META["zh-CN"].nativeLabel).toBe("简体中文");
  });

  it("normalizes guest names without allowing markup or control characters", () => {
    expect(normalizeGuestName("  <b>Rahman</b>\n ")).toBe("Rahman");
    expect(normalizeGuestName("Siti ‘Aisyah’")).toBe("Siti ‘Aisyah’");
    expect(normalizeGuestName("   ")).toBeUndefined();
  });

  it("accepts supported locales and falls back to Indonesian for unknown values", () => {
    expect(parseWelcomeLocale("fr")).toBe("fr");
    expect(parseWelcomeLocale("ar")).toBe("ar");
    expect(parseWelcomeLocale("unknown")).toBe("id");
    expect(parseWelcomeLocale(undefined, "en")).toBe("en");
  });

  it("personalizes every default and preserves a localized generic fallback", () => {
    for (const locale of WELCOME_LOCALES) {
      const content = DEFAULT_WELCOME_CONTENT[locale];
      expect(validateWelcomeContent(content).ok).toBe(true);
      expect(content.headline).toContain(WELCOME_GUEST_TOKEN);
      expect(renderWelcomeContent(content, locale, "Maya").headline).toContain("Maya");
      expect(renderWelcomeContent(content, locale).headline).toBe(WELCOME_LOCALE_META[locale].genericHeadline);
    }
  });

  it("can derive neutral defaults for future properties without changing language structure", () => {
    const content = defaultWelcomeContent("en", "Ruma Sejuk");
    expect(content.signature).toContain("Ruma Sejuk");
    expect(content.headline).toContain(WELCOME_GUEST_TOKEN);
    expect(content.body).not.toContain("Property");
  });

  it("validates required fields and bounded content", () => {
    expect(validateWelcomeContent({ headline: " ", body: "Body", signature: "Signature" }).ok).toBe(false);
    expect(validateWelcomeContent({ headline: "Welcome", body: "A calm arrival.", signature: "Property" })).toEqual({
      ok: true,
      value: { headline: "Welcome", body: "A calm arrival.", signature: "Property" },
    });
  });
});
