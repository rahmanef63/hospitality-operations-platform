#!/usr/bin/env node
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const expected = {
  next: /^\^16\./,
  react: /^\^19\./,
  "react-dom": /^\^19\./,
  tailwindcss: /^\^4\./,
  "@tailwindcss/postcss": /^\^4\./,
};
const errors = [];

for (const [name, pattern] of Object.entries(expected)) {
  const version = pkg.dependencies?.[name] ?? pkg.devDependencies?.[name];
  if (!version || !pattern.test(version)) errors.push(`${name}: expected ${pattern}, found ${version ?? "missing"}`);
}

if (errors.length) {
  console.error("✖ stack pin drift:");
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log("✓ check-stack-pin: Next 16, React 19, Tailwind 4");
