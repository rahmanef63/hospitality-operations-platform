import fs from "node:fs";
import path from "node:path";

export const root = process.cwd();
export const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
export const product = () => readJson(".platform/product.json");
export const distribution = () => readJson(".platform/distribution.json");

export function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(value);
  if (!match) throw new Error(`Invalid semantic version: ${value}`);
  return { major: +match[1], minor: +match[2], patch: +match[3], pre: match[4] ?? "" };
}

export function compareVersions(left, right) {
  const a = parseVersion(left); const b = parseVersion(right);
  for (const key of ["major", "minor", "patch"]) if (a[key] !== b[key]) return a[key] - b[key];
  if (a.pre === b.pre) return 0;
  if (!a.pre) return 1;
  if (!b.pre) return -1;
  return a.pre.localeCompare(b.pre);
}

export function isProtected(file, prefixes = distribution().tenantProtectedPrefixes) {
  return prefixes.some((prefix) => file === prefix || file.startsWith(prefix));
}

export function tagForVersion(version, config = product()) {
  return `${config.release.tagPrefix}${version}`;
}
