import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const globals = read("app/globals.css");
const motion = read("app/scroll-effects.css");
const header = read("slices/site-shell/components/site-header.tsx");
const ritual = read("slices/home/components/rituals-section.tsx");
const publicComponents = [
  "slices/home/components/hero-section.tsx",
  "slices/home/components/introduction-section.tsx",
  "slices/home/components/collection-section.tsx",
  "slices/property/components/property-story.tsx",
  "slices/property/components/property-gallery.tsx",
  "slices/brand-assets/components/brand-assets-page.tsx",
].map(read).join("\n");

describe("mobile composition and scroll motion", () => {
  it("keeps mobile section shells edge-to-edge and limits inset to copy", () => {
    expect(globals).toMatch(/\.page-shell\s*\{\s*width: 100%;/);
    expect(globals).toContain(".content-inset");
    expect(globals).toContain("env(safe-area-inset-left)");
    expect(publicComponents).toContain("content-inset");
  });

  it("uses native scroll timelines instead of per-frame React state", () => {
    expect(motion).toContain("animation-timeline: view(block)");
    expect(motion).toContain("animation-timeline: scroll(root block)");
    expect(motion).toContain("view-timeline-name: --hospitality-parallax");
    expect(motion).toContain("animation-timeline: --hospitality-parallax");
    expect(motion).not.toContain("hero-scroll-zoom");
    expect(motion).not.toContain("scrollY");
    expect(publicComponents).not.toContain("addEventListener(\"scroll\"");
  });

  it("provides reduced-motion fallbacks for every scroll effect", () => {
    expect(motion).toContain("prefers-reduced-motion: reduce");
    expect(motion).toContain("animation: none !important");
    expect(motion).toContain(".ritual-stack-card");
  });

  it("keeps readable content fully opaque throughout scroll reveals", () => {
    expect(motion).not.toContain("opacity: 0");
    expect(motion).not.toContain("will-change: transform, opacity");
  });

  it("ships a global progress line and a genuine mobile sticky stack", () => {
    expect(header).toContain('className="scroll-progress"');
    expect(ritual).toContain("--stack-offset");
    expect(ritual).toContain("ritual-stack-card");
  });
});
