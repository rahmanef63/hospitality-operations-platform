import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAdminSessionToken,
  getAdminRuntimeConfig,
  secureTextEqual,
  verifyAdminCredentials,
  verifyAdminSessionToken,
} from "@/shared/admin";

const env = {
  HOSPITALITY_ADMIN_EMAIL: "admin@example.com",
  HOSPITALITY_ADMIN_PASSWORD: "a-strong-test-password",
  HOSPITALITY_ADMIN_SESSION_SECRET: "session-secret-that-is-long-enough-for-tests",
  HOSPITALITY_CONVEX_ADMIN_SECRET: "convex-secret-that-is-long-enough-for-tests",
  NEXT_PUBLIC_SITE_URL: "https://example.com",
};

function stubAdminEnv() {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
}

afterEach(() => vi.unstubAllEnvs());

describe("admin authentication", () => {
  it("loads only valid server-side runtime configuration", () => {
    stubAdminEnv();
    expect(getAdminRuntimeConfig()).toMatchObject({
      email: env.HOSPITALITY_ADMIN_EMAIL,
      siteOrigin: env.NEXT_PUBLIC_SITE_URL,
    });
  });

  it("compares credentials without case sensitivity on email", () => {
    stubAdminEnv();
    expect(verifyAdminCredentials("ADMIN@EXAMPLE.COM", env.HOSPITALITY_ADMIN_PASSWORD)).toBe(true);
    expect(verifyAdminCredentials(env.HOSPITALITY_ADMIN_EMAIL, "wrong-password-value")).toBe(false);
    expect(secureTextEqual("same", "same")).toBe(true);
    expect(secureTextEqual("same", "different")).toBe(false);
  });

  it("accepts valid signed sessions and rejects tampering", () => {
    const now = 1_800_000_000_000;
    const token = createAdminSessionToken(env.HOSPITALITY_ADMIN_EMAIL, env.HOSPITALITY_ADMIN_SESSION_SECRET, now);
    expect(verifyAdminSessionToken(token, env.HOSPITALITY_ADMIN_SESSION_SECRET, now + 60_000)?.email)
      .toBe(env.HOSPITALITY_ADMIN_EMAIL);
    expect(verifyAdminSessionToken(`${token}x`, env.HOSPITALITY_ADMIN_SESSION_SECRET, now + 60_000)).toBeNull();
  });

  it("rejects expired sessions", () => {
    const token = createAdminSessionToken(env.HOSPITALITY_ADMIN_EMAIL, env.HOSPITALITY_ADMIN_SESSION_SECRET, 0);
    expect(verifyAdminSessionToken(token, env.HOSPITALITY_ADMIN_SESSION_SECRET, 50_000_000)).toBeNull();
  });
});
