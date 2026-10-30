import { afterEach, describe, expect, it, vi } from "vitest";
import { createAdminSessionToken, getAdminRuntimeConfig, verifyAdminSessionToken } from "@/shared/admin";

const env = { NEXT_PUBLIC_SITE_URL: "https://example.com" };
afterEach(() => vi.unstubAllEnvs());

describe("admin authentication", () => {
  it("loads only public site runtime configuration in Next", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", env.NEXT_PUBLIC_SITE_URL);
    expect(getAdminRuntimeConfig()).toEqual({ siteOrigin: env.NEXT_PUBLIC_SITE_URL });
  });

  it("accepts valid backend-signed sessions and rejects tampering", async () => {
    const now = 1_800_000_000_000;
    const secret = "session-secret-that-is-long-enough-for-tests";
    const token = await createAdminSessionToken("admin@example.com", "actor-hash", secret, now);
    expect((await verifyAdminSessionToken(token, secret, now + 60_000))?.email).toBe("admin@example.com");
    expect(await verifyAdminSessionToken(`${token}x`, secret, now + 60_000)).toBeNull();
  });

  it("rejects expired sessions", async () => {
    const secret = "session-secret-that-is-long-enough-for-tests";
    const token = await createAdminSessionToken("admin@example.com", "actor-hash", secret, 0);
    expect(await verifyAdminSessionToken(token, secret, 50_000_000)).toBeNull();
  });
});
