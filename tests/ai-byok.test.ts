import { describe, expect, it } from "vitest";
import { AI_PROVIDERS } from "@/shared/ai";
import { decryptApiKey, encryptApiKey, fingerprintApiKey } from "@/shared/ai/crypto";
import { translationPrompt } from "@/shared/ai/prompt";
import { DEFAULT_WELCOME_CONTENT } from "@/shared/welcome";

const secret = "ai-encryption-secret-that-is-long-enough-for-tests";

describe("BYOK AI security and translation boundaries", () => {
  it("supports four fixed providers without arbitrary custom endpoints", () => {
    expect(AI_PROVIDERS).toEqual(["openai", "openrouter", "anthropic", "gemini"]);
  });

  it("encrypts API keys at rest and detects ciphertext tampering", async () => {
    const apiKey = "sk-test-private-provider-key";
    const encrypted = await encryptApiKey(apiKey, secret);
    expect(encrypted).not.toContain(apiKey);
    expect(await decryptApiKey(encrypted, secret)).toBe(apiKey);
    expect(await fingerprintApiKey(apiKey)).toMatch(/^[a-f0-9]{12}$/);
    await expect(decryptApiKey(`${encrypted}x`, secret)).rejects.toThrow();
  });

  it("constructs a template-only prompt with no reservation or guest PII fields", () => {
    const prompt = translationPrompt({
      sourceLocale: "en",
      source: DEFAULT_WELCOME_CONTENT.en,
      targetLocales: ["ar", "ja"],
    });
    expect(prompt.user).toContain("translate_welcome_template");
    expect(prompt.user).toContain("{{guest}}");
    for (const forbidden of ["reservationId", "guestName", "phone", "email", "checkIn", "checkOut", "notes"]) {
      expect(prompt.user).not.toContain(forbidden);
    }
    expect(prompt.schema.properties.translations.minItems).toBe(2);
  });
});
