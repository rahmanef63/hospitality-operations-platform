#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const root = path.join(repo, "slices");
const errors = [];
let valid = 0;

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolute);
    return /\.(ts|tsx)$/.test(entry.name) ? [absolute] : [];
  });
}

function actualDependencies(directory) {
  const dependencies = new Set();
  const aliasPattern = /["'`]@\/(shared|features|components)\/([^"'`]+)["'`]/g;
  for (const file of sourceFiles(directory)) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(aliasPattern)) {
      const [, scope, rest] = match;
      if (!scope || !rest) continue;
      dependencies.add(scope === "components" ? `components/${rest}` : `${scope}/${rest.split("/")[0]}`);
    }
  }
  return [...dependencies].sort();
}

if (!existsSync(root)) {
  console.error("✖ slices/ is required");
  process.exit(1);
}

for (const slug of readdirSync(root)) {
  const directory = path.join(root, slug);
  if (!statSync(directory).isDirectory()) continue;
  const contractPath = path.join(directory, "slice.json");
  const manifestPath = path.join(directory, "slice.manifest.json");
  if (!existsSync(contractPath) || !existsSync(manifestPath)) {
    errors.push(`${slug}: metadata pair is incomplete`);
    continue;
  }
  try {
    const contract = JSON.parse(readFileSync(contractPath, "utf8"));
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (contract.slug !== slug || manifest.slug !== slug) errors.push(`${slug}: slug drift`);
    if (contract.version !== manifest.version) errors.push(`${slug}: version drift`);
    if (!contract.contract || typeof contract.contract !== "object") errors.push(`${slug}: contract block missing`);
    if (!existsSync(path.join(directory, manifest.entry ?? "index.ts"))) errors.push(`${slug}: manifest entry missing`);
    const declaredDependencies = [...new Set(manifest.dependencies ?? [])].sort();
    const detectedDependencies = actualDependencies(directory);
    if (JSON.stringify(declaredDependencies) !== JSON.stringify(detectedDependencies)) {
      errors.push(`${slug}: dependency drift declared=${JSON.stringify(declaredDependencies)} actual=${JSON.stringify(detectedDependencies)}`);
    }
    if (!errors.some((error) => error.startsWith(`${slug}:`))) valid += 1;
  } catch (error) {
    errors.push(`${slug}: malformed metadata (${error.message})`);
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} slice metadata violation(s):`);
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log(`✓ audit-slices: ${valid} valid slice pair(s)`);
