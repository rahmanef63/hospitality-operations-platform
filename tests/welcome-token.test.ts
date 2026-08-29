import { describe, expect, it } from "vitest";
import { createGuestWelcomeToken, verifyGuestWelcomeToken } from "@/shared/welcome/token";

const secret = "guest-link-secret-that-is-long-enough-for-tests";

describe("opaque guest welcome tokens", () => {
  it("encrypts the reservation ID and verifies an unexpired token", () => {
    const now = 1_800_000_000_000;
    const token = createGuestWelcomeToken("reservation-secret-id", secret, now + 86_400_000, now);
    expect(token).not.toContain("reservation-secret-id");
    expect(verifyGuestWelcomeToken(token, secret, now + 1_000)).toMatchObject({
      version: 1,
      reservationId: "reservation-secret-id",
      expiresAt: now + 86_400_000,
    });
  });

  it("rejects tampering, the wrong secret, and expiry", () => {
    const now = 1_800_000_000_000;
    const token = createGuestWelcomeToken("reservation-id", secret, now + 1_000, now);
    expect(verifyGuestWelcomeToken(`${token}x`, secret, now)).toBeNull();
    expect(verifyGuestWelcomeToken(token, `${secret}-wrong`, now)).toBeNull();
    expect(verifyGuestWelcomeToken(token, secret, now + 1_001)).toBeNull();
  });
});
