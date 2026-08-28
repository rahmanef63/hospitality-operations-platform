import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/features", replacement: path.resolve(root, "slices") },
      { find: "@/shared", replacement: path.resolve(root, "shared") },
      { find: "@", replacement: root },
    ],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "**/__tests__/**/*.test.ts"],
  },
});
