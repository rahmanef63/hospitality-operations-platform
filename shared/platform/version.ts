const semver = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function parseSemver(value: string) {
  const match = semver.exec(value);
  if (!match) throw new Error(`Invalid semantic version: ${value}`);
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), pre: match[4] ?? "" };
}

export function compareSemver(left: string, right: string) {
  const a = parseSemver(left); const b = parseSemver(right);
  for (const key of ["major", "minor", "patch"] as const) if (a[key] !== b[key]) return a[key] - b[key];
  if (a.pre === b.pre) return 0;
  if (!a.pre) return 1;
  if (!b.pre) return -1;
  return a.pre.localeCompare(b.pre);
}

export function majorVersion(value: string) { return parseSemver(value).major; }

export function updateVersionFromRef(ref: string, prefix: string) {
  if (!ref.startsWith(prefix)) return undefined;
  const raw = ref.slice(prefix.length).replace(/^v/, "");
  try { parseSemver(raw); return raw; } catch { return undefined; }
}
