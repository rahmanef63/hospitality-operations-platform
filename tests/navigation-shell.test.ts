import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("public and admin navigation shells", () => {
  it("keeps desktop public navigation and replaces the mobile burger with a dock", () => {
    const header = read("slices/site-shell/components/site-header.tsx");
    const layout = read("app/(marketing)/layout.tsx");
    const dock = read("slices/concierge/components/public-mobile-dock.tsx");
    expect(header).toContain('className="hidden items-center gap-8 md:flex"');
    expect(header).not.toContain("<details");
    expect(header).not.toContain("Toggle navigation");
    expect(layout).toContain("<GuestConcierge");
    expect(dock).toContain("fixed inset-x-0 bottom-0");
    expect(dock).toContain("env(safe-area-inset-bottom)");
    expect(dock).toContain("Mobile navigation");
  });

  it("renders a desktop admin sidebar and a safe-area mobile dock", () => {
    const shell = read("slices/pms/components/pms-shell.tsx");
    const nav = read("slices/pms/components/pms-nav.tsx");
    expect(shell).toContain("lg:grid-cols-[17rem_minmax(0,1fr)]");
    expect(shell).toContain("sticky top-0 hidden h-screen flex-col");
    expect(shell).toContain("<PmsDesktopNav");
    expect(shell).toContain("<PmsMobileDock");
    expect(nav).toContain("Admin mobile navigation");
    expect(nav).toContain("fixed inset-x-0 bottom-0");
    expect(nav).toContain("env(safe-area-inset-bottom)");
    expect(nav).toContain('href: "/admin/ai"');
    expect(nav).not.toContain("overflow-x-auto");
  });

  it("ships the chatbot only on public routes with desktop and mobile launchers", () => {
    const concierge = read("slices/concierge/components/guest-concierge.tsx");
    const api = read("app/api/concierge/route.ts");
    expect(concierge).toContain("Ask Kamyna");
    expect(concierge).toContain("Kamyna Concierge");
    expect(concierge).toContain("<PublicMobileDock");
    expect(concierge).toContain("hidden min-h-13");
    expect(api).toContain('"Cache-Control": "no-store"');
    expect(api).toContain("getPublicPropertyFacts");
    expect(api).not.toContain("OPENAI");
  });
});
