import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const configKeys = [
  "PRIMARY_PROPERTY_STREET_ADDRESS",
  "PRIMARY_PROPERTY_WHATSAPP_NUMBER",
  "PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL",
  "PRIMARY_PROPERTY_LATITUDE",
  "PRIMARY_PROPERTY_LONGITUDE",
] as const;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadConfig(values: Partial<Record<(typeof configKeys)[number], string>>) {
  vi.resetModules();
  for (const key of configKeys) vi.stubEnv(key, values[key] ?? "");
  return import("@/shared/config/primary-property");
}

describe("verified Property public configuration", () => {
  it("omits every unverified optional value", async () => {
    const { PRIMARY_PROPERTY_CONTACT, PRIMARY_PROPERTY_LOCATION } = await loadConfig({});
    expect(PRIMARY_PROPERTY_LOCATION.streetAddress).toBeUndefined();
    expect(PRIMARY_PROPERTY_LOCATION.mapEmbedUrl).toBeUndefined();
    expect(PRIMARY_PROPERTY_LOCATION.geo).toBeUndefined();
    expect(PRIMARY_PROPERTY_CONTACT.whatsappNumber).toBeUndefined();
    expect(PRIMARY_PROPERTY_CONTACT.whatsappHref).toBeUndefined();
  });

  it("normalizes owner-verified WhatsApp, map, address, and coordinates", async () => {
    const { PRIMARY_PROPERTY_CONTACT, PRIMARY_PROPERTY_LOCATION } = await loadConfig({
      PRIMARY_PROPERTY_STREET_ADDRESS: "Verified street address",
      PRIMARY_PROPERTY_WHATSAPP_NUMBER: "+62 812-3456-7890",
      PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL: "https://www.google.com/maps/embed?pb=verified",
      PRIMARY_PROPERTY_LATITUDE: "-6.7",
      PRIMARY_PROPERTY_LONGITUDE: "106.9",
    });
    expect(PRIMARY_PROPERTY_CONTACT.whatsappHref).toBe("https://wa.me/6281234567890");
    expect(PRIMARY_PROPERTY_LOCATION.mapEmbedUrl).toBe("https://www.google.com/maps/embed?pb=verified");
    expect(PRIMARY_PROPERTY_LOCATION.streetAddress).toBe("Verified street address");
    expect(PRIMARY_PROPERTY_LOCATION.geo).toEqual({ latitude: -6.7, longitude: 106.9 });
  });

  it("rejects non-Google maps and incomplete coordinates", async () => {
    const { PRIMARY_PROPERTY_LOCATION } = await loadConfig({
      PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL: "https://example.com/maps/embed?pb=unverified",
      PRIMARY_PROPERTY_LATITUDE: "-6.7",
    });
    expect(PRIMARY_PROPERTY_LOCATION.mapEmbedUrl).toBeUndefined();
    expect(PRIMARY_PROPERTY_LOCATION.geo).toBeUndefined();
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
