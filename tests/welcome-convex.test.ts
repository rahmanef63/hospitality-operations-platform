import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { api, internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
import { WELCOME_LOCALES } from "@/shared/welcome";

const modules = import.meta.glob("../convex/**/*.{ts,js}");
const actorEmailHash = "welcome-test-actor-hash-000000000000000000000000";

describe("multilingual Convex welcome and AI settings", () => {
  it("seeds and publishes all 20 welcome languages idempotently", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(internal.welcome.ensureDefaults, { actorEmailHash })).resolves.toEqual({ created: 20 });
    await expect(t.mutation(internal.welcome.ensureDefaults, { actorEmailHash })).resolves.toEqual({ created: 0 });
    const overview = await t.query(internal.welcome.getAdminOverview, { propertySlug: "primary-property" });
    expect(overview.configs).toHaveLength(WELCOME_LOCALES.length);
    expect(overview.configs.map((config) => config.locale).sort()).toEqual([...WELCOME_LOCALES].sort());
    const arabic = await t.query(api.welcome.getPublished, { propertySlug: "primary-property", locale: "ar" });
    expect(arabic?.content.headline).toContain("{{guest}}");
  });

  it("keeps encrypted AI key material out of the admin overview", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(internal.aiSettings.upsert, {
      provider: "openai",
      model: "test-model",
      enabled: true,
      encryptedApiKey: "v1.encrypted.ciphertext.payload",
      keyFingerprint: "abcdef123456",
      clearKey: false,
    });
    const overview = await t.query(internal.aiSettings.getOverview, {});
    const secret = await t.query(internal.aiSettings.getSecret, {});
    expect(overview).toMatchObject({ configured: true, provider: "openai", model: "test-model" });
    expect(overview).not.toHaveProperty("encryptedApiKey");
    expect(secret.encryptedApiKey).toBe("v1.encrypted.ciphertext.payload");
  });
});
