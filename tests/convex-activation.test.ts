import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/rr.json";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("Convex Cloud activation", () => {
  it("declares Cloud data and signed cookie authentication in the project manifest", () => {
    expect(manifest.convex).toMatchObject({
      mode: "cloud",
      urlEnv: "NEXT_PUBLIC_CONVEX_URL",
      generatedDir: "convex/_generated",
    });
    expect(manifest.auth).toMatchObject({
      provider: "env-cookie",
      session: "signed-http-only-cookie",
    });
  });

  it("commits generated Convex bindings and keeps admin functions internal", () => {
    for (const file of ["api.d.ts", "api.js", "dataModel.d.ts", "server.d.ts", "server.js"]) {
      expect(existsSync(path.join(root, "convex/_generated", file))).toBe(true);
    }
    expect(existsSync(path.join(root, "convex/tsconfig.json"))).toBe(true);
    expect(read("convex/welcome.ts")).toContain("internalMutation");
    expect(read("convex/adminSecurity.ts")).toContain("internalMutation");
    expect(read("convex/http.ts")).toContain("authorizeAdminRequest");
    expect(read("convex/http.ts")).toContain('path: "/admin/pms"');
    expect(read("convex/http.ts")).toContain('path: "/admin/ai-secret"');
    expect(read("convex/http.ts")).toContain('path: "/admin/welcome-reservation-context"');
    expect(read("convex/aiSettings.ts")).toContain("internalQuery");
    expect(read("convex/pms/catalog.ts")).toContain("internalMutation");
    expect(read("convex/pms/public.ts")).toContain("export const getProperty = query");
    expect(read("proxy.ts")).toContain("verifyAdminSessionToken");
  });

  it("never exposes admin credentials as public Docker build arguments", () => {
    const dockerfile = read("Dockerfile");
    expect(dockerfile).toContain("ARG NEXT_PUBLIC_CONVEX_URL");
    expect(dockerfile).not.toContain("ARG KAMYNA_ADMIN_PASSWORD");
    expect(dockerfile).not.toContain("ARG KAMYNA_ADMIN_SESSION_SECRET");
    expect(dockerfile).not.toContain("ARG KAMYNA_CONVEX_ADMIN_SECRET");
    expect(dockerfile).not.toContain("ARG KAMYNA_AI_ENCRYPTION_KEY");
    expect(dockerfile).not.toContain("ARG KAMYNA_GUEST_LINK_SECRET");
  });

  it("keeps the admin UI free from direct secret and deploy-key access", () => {
    const clientSource = read("slices/admin/components/welcome-editor.tsx");
    expect(clientSource).not.toContain("process.env");
    expect(clientSource).not.toContain("CONVEX_DEPLOY_KEY");
    expect(clientSource).not.toContain("KAMYNA_ADMIN_PASSWORD");
    expect(read("slices/pms/components/property-manager.tsx")).not.toContain("process.env");
    expect(read("slices/admin/components/ai-settings-page.tsx")).not.toContain("process.env");
    expect(read("slices/admin/components/ai-settings-page.tsx")).not.toContain("encryptedApiKey");
  });
});
