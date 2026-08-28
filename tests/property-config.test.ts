import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const configKeys = [
  "RUMA_KAMYNA_STREET_ADDRESS",
  "RUMA_KAMYNA_WHATSAPP_NUMBER",
  "RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL",
  "RUMA_KAMYNA_LATITUDE",
  "RUMA_KAMYNA_LONGITUDE",
] as const;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadConfig(values: Partial<Record<(typeof configKeys)[number], string>>) {
  vi.resetModules();
  for (const key of configKeys) vi.stubEnv(key, values[key] ?? "");
  return import("@/shared/config/ruma-kamyna");
}

describe("verified Ruma Kamyna public configuration", () => {
  it("omits every unverified optional value", async () => {
    const { RUMA_KAMYNA_CONTACT, RUMA_KAMYNA_LOCATION } = await loadConfig({});
    expect(RUMA_KAMYNA_LOCATION.streetAddress).toBeUndefined();
    expect(RUMA_KAMYNA_LOCATION.mapEmbedUrl).toBeUndefined();
    expect(RUMA_KAMYNA_LOCATION.geo).toBeUndefined();
    expect(RUMA_KAMYNA_CONTACT.whatsappNumber).toBeUndefined();
    expect(RUMA_KAMYNA_CONTACT.whatsappHref).toBeUndefined();
  });

  it("normalizes owner-verified WhatsApp, map, address, and coordinates", async () => {
    const { RUMA_KAMYNA_CONTACT, RUMA_KAMYNA_LOCATION } = await loadConfig({
      RUMA_KAMYNA_STREET_ADDRESS: "Verified street address",
      RUMA_KAMYNA_WHATSAPP_NUMBER: "+62 812-3456-7890",
      RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL: "https://www.google.com/maps/embed?pb=verified",
      RUMA_KAMYNA_LATITUDE: "-6.7",
      RUMA_KAMYNA_LONGITUDE: "106.9",
    });
    expect(RUMA_KAMYNA_CONTACT.whatsappHref).toBe("https://wa.me/6281234567890");
    expect(RUMA_KAMYNA_LOCATION.mapEmbedUrl).toBe("https://www.google.com/maps/embed?pb=verified");
    expect(RUMA_KAMYNA_LOCATION.streetAddress).toBe("Verified street address");
    expect(RUMA_KAMYNA_LOCATION.geo).toEqual({ latitude: -6.7, longitude: 106.9 });
  });

  it("rejects non-Google maps and incomplete coordinates", async () => {
    const { RUMA_KAMYNA_LOCATION } = await loadConfig({
      RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL: "https://example.com/maps/embed?pb=unverified",
      RUMA_KAMYNA_LATITUDE: "-6.7",
    });
    expect(RUMA_KAMYNA_LOCATION.mapEmbedUrl).toBeUndefined();
    expect(RUMA_KAMYNA_LOCATION.geo).toBeUndefined();
  });

  it("documents every build-time public property field", () => {
    const envExample = readFileSync(path.resolve(process.cwd(), ".env.example"), "utf8");
    const dockerfile = readFileSync(path.resolve(process.cwd(), "Dockerfile"), "utf8");
    for (const key of configKeys) {
      expect(envExample).toContain(`${key}=`);
      expect(dockerfile).toContain(`ARG ${key}`);
    }
  });
});
