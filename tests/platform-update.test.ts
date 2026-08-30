import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { platformRepositoryMode } from "../shared/platform/config";
import { compareSemver, updateVersionFromRef } from "../shared/platform/version";

describe("tenant platform update center", () => {
  it("recognizes prepared update branches and SemVer order", () => {
    expect(updateVersionFromRef("platform/update-v1.4.2", "platform/update-")).toBe("1.4.2");
    expect(updateVersionFromRef("feature/foo", "platform/update-")).toBeUndefined();
    expect(compareSemver("1.4.2", "1.4.1")).toBeGreaterThan(0);
  });

  it("widens tenant identifiers before repository-mode detection", () => {
    expect(platformRepositoryMode("default-tenant")).toBe("upstream");
    expect(platformRepositoryMode("provider-owned-tenant")).toBe("tenant");
  });

  it("keeps update credentials server-only", () => {
    const source = fs.readFileSync("shared/platform/github.ts", "utf8");
    expect(source).toContain('import "server-only"');
    expect(source).toContain("HOSPITALITY_UPDATE_GITHUB_TOKEN");
    expect(source).not.toContain("NEXT_PUBLIC_HOSPITALITY_UPDATE_GITHUB_TOKEN");
  });

  it("deploys Convex before exact merge and verifies frontend revision", () => {
    const workflow = fs.readFileSync(".github/workflows/apply-platform-update.yml", "utf8");
    const verify = workflow.indexOf("npm run verify");
    const convex = workflow.indexOf("npx convex deploy");
    const merge = workflow.indexOf("pulls/$PR_NUMBER/merge");
    const health = workflow.indexOf("/api/health?revision=$MERGE_SHA");
    expect(verify).toBeGreaterThan(-1);
    expect(convex).toBeGreaterThan(verify);
    expect(merge).toBeGreaterThan(convex);
    expect(health).toBeGreaterThan(merge);
    expect(workflow).toContain("CONVEX_DEPLOY_KEY");
    expect(workflow).toContain("npm ci --include=dev --legacy-peer-deps");
    expect(workflow).toContain("Major platform updates require an explicit migration workflow");
    expect(workflow).toContain('head_sha="$(cat "$RUNNER_TEMP/head-sha")"');
    expect(workflow).not.toContain('commits/${{ steps.resolve.outputs.head_sha }}/check-runs');
  });

  it("exposes a no-store exact build health contract", () => {
    const health = fs.readFileSync("app/api/health/route.ts", "utf8");
    const config = fs.readFileSync("next.config.mjs", "utf8");
    expect(health).toContain("buildVersion");
    expect(health).toContain('"Cache-Control": "no-store, max-age=0"');
    expect(config).toContain("VERCEL_GIT_COMMIT_SHA");
    expect(config).toContain('process.env.VERCEL ? {} : { output: "standalone" }');
  });

  it("keeps runtime env files untracked while allowing the upstream env contract to evolve", () => {
    const ignore = fs.readFileSync(".gitignore", "utf8");
    const distribution = JSON.parse(fs.readFileSync(".platform/distribution.json", "utf8"));
    expect(ignore).toContain(".env.*");
    expect(ignore).toContain("!.env.example");
    expect(distribution.tenantProtectedPrefixes).not.toContain(".env");
  });

  it("documents deterministic AI-agent and private-control-plane boundaries", () => {
    const onboarding = fs.readFileSync("docs/AI-AGENT-ONBOARDING.md", "utf8");
    const distribution = fs.readFileSync("docs/PLATFORM-DISTRIBUTION.md", "utf8");
    expect(onboarding).toContain(".platform/tenant.json exists?");
    expect(onboarding).toContain("deploy Convex");
    expect(distribution).toContain("Managed-provider routing is **not stored in the product repository**");
    expect(distribution).not.toContain("add the tenant to the upstream registry");
    expect(fs.existsSync(".platform/tenants.json")).toBe(false);
  });
});
