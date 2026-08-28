#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const roots = ["shared/brand", "slices/brand-assets", "public/brand"];
const propertyLocations = [
  /\bbali\b/i,
  /\bmegamendung\b/i,
  /\bpuncak\b/i,
  /\bbogor\b/i,
  /\bjawa barat\b/i,
];
const errors = [];

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const entry = path.join(directory, name);
    return statSync(entry).isDirectory() ? walk(entry) : [entry];
  });
}

for (const root of roots) {
  for (const file of walk(path.join(repo, root))) {
    if (!/\.(ts|tsx|json|svg|css)$/.test(file)) continue;
    const body = readFileSync(file, "utf8");
    for (const pattern of propertyLocations) {
      if (pattern.test(body)) {
        errors.push(`${path.relative(repo, file)} contains a property location in core identity copy`);
      }
    }
  }
}

if (errors.length) {
  console.error("✖ location-neutral core identity rule failed:");
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log("✓ audit-brand-copy: core identity assets remain location-neutral");
