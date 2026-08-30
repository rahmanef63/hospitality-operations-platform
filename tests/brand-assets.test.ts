import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brandAssets } from "@/features/brand-assets/config/assets";

const publicRoot = path.resolve(process.cwd(), "public");

describe("brand asset library", () => {
  it("ships every listed asset as its own file", () => {
    for (const asset of brandAssets) {
      expect(existsSync(path.join(publicRoot, asset.href.replace(/^\//, "")))).toBe(true);
    }
  });

  it("does not duplicate asset paths", () => {
    const paths = brandAssets.map((asset) => asset.href);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
