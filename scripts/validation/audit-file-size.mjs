#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cap = 280;
const roots = ["app", "convex", "slices", "shared", "components", "lib", "scripts", "tests"];
const extensions = /\.(ts|tsx|mjs|css)$/;
const errors = [];
let scanned = 0;

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    if (["node_modules", ".next", "coverage", "_generated"].includes(name) || name.startsWith(".")) return [];
    const entry = path.join(directory, name);
    return statSync(entry).isDirectory() ? walk(entry) : [entry];
  });
}

for (const root of roots) {
  for (const file of walk(path.join(repo, root))) {
    if (!extensions.test(file)) continue;
    scanned += 1;
    const lines = readFileSync(file, "utf8").split("\n").length;
    if (lines > cap) {
      errors.push(`${path.relative(repo, file)} (${lines} > ${cap})`);
    }
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} file-size violation(s):`);
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log(`✓ audit-file-size: ${scanned} file(s), all ≤${cap} lines`);
