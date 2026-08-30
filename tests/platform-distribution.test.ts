import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { compareVersions, isProtected, tagForVersion } from "../scripts/platform/lib.mjs";

const product = JSON.parse(fs.readFileSync(".platform/product.json", "utf8"));
const distribution = JSON.parse(fs.readFileSync(".platform/distribution.json", "utf8"));
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

describe("platform distribution", () => {
  it("pins one canonical upstream identity and semantic version", () => {
    expect(product.id).toBe("hospitality-operations-platform");
    expect(`${product.upstream.owner}/${product.upstream.repo}`).toBe("rahmanef63/hospitality-operations-platform");
    expect(packageJson.name).toBe(product.id);
    expect(packageJson.version).toBe(product.version);
    expect(tagForVersion(product.version, product)).toBe(`v${product.version}`);
  });

  it("compares release versions safely", () => {
    expect(compareVersions("1.2.1", "1.2.0")).toBeGreaterThan(0);
    expect(compareVersions("2.0.0", "1.99.99")).toBeGreaterThan(0);
    expect(compareVersions("1.2.0-beta.1", "1.2.0")).toBeLessThan(0);
    expect(compareVersions("1.2.0", "1.2.0")).toBe(0);
  });

  it("protects tenant-owned overlays and runtime configuration", () => {
    const prefixes = distribution.tenantProtectedPrefixes as string[];
    expect(isProtected(".platform/tenant.json", prefixes)).toBe(true);
    expect(isProtected("tenant/branding.json", prefixes)).toBe(true);
    expect(isProtected("public/tenant/logo.svg", prefixes)).toBe(true);
    expect(isProtected(".env.production", prefixes)).toBe(true);
    expect(isProtected("slices/pms/components/pms-shell.tsx", prefixes)).toBe(false);
  });

  it("uses PR branches rather than tenant main for updates", () => {
    const sync = fs.readFileSync("scripts/platform/sync-tenant.mjs", "utf8");
    expect(distribution.strategy).toBe("external-control-plane-pr");
    expect(distribution.updater.branchPrefix).toBe("platform/update-");
    expect(sync).toContain("gh\", [\"pr\", \"create");
    expect(sync).not.toContain("push\", \"origin\", `HEAD:refs/heads/${baseBranch}`");
    const release = fs.readFileSync(".github/workflows/platform-release.yml", "utf8");
    expect(release).toContain("hospitality-platform-updater/dispatches");
    expect(release).not.toContain("HOSPITALITY_MANAGED_TENANTS");
  });
  it("configures updater Git identity before attempting the tenant merge", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync("scripts/platform/sync-tenant.mjs", "utf8");
    const identity = source.indexOf('run("git", ["config", "user.name", "Hospitality Platform Updater"]');
    const merge = source.indexOf('spawnSync("git", ["merge", "--no-ff", "--no-commit", requestedTag]');
    expect(identity).toBeGreaterThan(-1);
    expect(merge).toBeGreaterThan(identity);
  });

});
