#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const roots = ["app", "convex", "slices", "shared"];
const errors = [];

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const entry = path.join(directory, name);
    if (name.startsWith(".") || name === "node_modules" || name === "_generated") return [];
    return statSync(entry).isDirectory() ? walk(entry) : [entry];
  });
}

for (const root of roots) {
  for (const file of walk(path.join(repo, root))) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    const relative = path.relative(repo, file).replaceAll(path.sep, "/");
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (line.trim().startsWith("//")) return;
      if (/<img\s/.test(line)) errors.push(`${relative}:${index + 1} raw <img> — use next/image`);
      if (/<a\s[^>]*href=["']\//.test(line)) errors.push(`${relative}:${index + 1} internal anchor — use next/link`);
      if (/from\s+["']@\/features\/[^"']+\/(components|lib|hooks|config|utils)\//.test(line)) {
        errors.push(`${relative}:${index + 1} deep cross-slice import — use the slice barrel`);
      }
      if (/console\.log\(/.test(line)) errors.push(`${relative}:${index + 1} shipped console.log`);
    });
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} rr-rule violation(s):`);
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log("✓ audit-rr-rules: no violations");
