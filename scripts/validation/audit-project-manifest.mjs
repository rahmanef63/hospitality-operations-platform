#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = JSON.parse(readFileSync(path.join(repo, "rr.json"), "utf8"));
const shadcn = JSON.parse(readFileSync(path.join(repo, "components.json"), "utf8"));
const errors = [];

const expected = {
  framework: "next-16",
  sliceRoot: "slices",
  publicRoute: "app/(marketing)",
  auth: "env-cookie",
};

if (manifest.framework !== expected.framework) errors.push(`framework must be ${expected.framework}`);
if (manifest.layout?.kind !== "vertical-slice") errors.push("layout.kind must be vertical-slice");
if (manifest.layout?.sliceRoot !== expected.sliceRoot) errors.push(`sliceRoot must be ${expected.sliceRoot}`);
if (manifest.layout?.publicRoute !== expected.publicRoute) errors.push(`publicRoute must be ${expected.publicRoute}`);
if (manifest.auth?.provider !== expected.auth) errors.push(`auth.provider must be ${expected.auth}`);
if (manifest.convex?.mode !== "cloud") errors.push("convex.mode must be cloud");
if (manifest.convex?.urlEnv !== "NEXT_PUBLIC_CONVEX_URL") errors.push("convex.urlEnv must be NEXT_PUBLIC_CONVEX_URL");
if (manifest.convex?.generatedDir !== "convex/_generated") errors.push("convex.generatedDir must be convex/_generated");
for (const domain of ["welcome", "adminSecurity", "pms"]) {
  if (!manifest.convex?.domains?.includes(domain)) errors.push(`convex.domains must include ${domain}`);
}
for (const file of ["api.d.ts", "api.js", "dataModel.d.ts", "server.d.ts", "server.js"]) {
  if (!existsSync(path.join(repo, "convex/_generated", file))) errors.push(`missing Convex generated file ${file}`);
}
if (!existsSync(path.join(repo, "convex/tsconfig.json"))) errors.push("missing Convex typecheck configuration");
if (manifest.auth?.session !== "signed-http-only-cookie") errors.push("auth.session must be signed-http-only-cookie");
if (manifest.auth?.loginRateLimit !== "convex-cloud") errors.push("auth.loginRateLimit must be convex-cloud");

const aliases = {
  components: "@/components",
  ui: "@/components/ui",
  shared: "@/shared",
  features: "@/features",
  lib: "@/lib",
};
for (const [key, value] of Object.entries(aliases)) {
  if (manifest.aliases?.[key] !== value) errors.push(`rr alias ${key} must be ${value}`);
  if (key !== "features" && shadcn.aliases?.[key] !== value) errors.push(`components alias ${key} must be ${value}`);
}
if (shadcn.aliases?.features !== "@/features") errors.push("components feature alias must be @/features");

const sliceRoot = path.join(repo, "slices");
const folders = readdirSync(sliceRoot).filter((name) => existsSync(path.join(sliceRoot, name, "slice.json"))).sort();
const declared = (manifest.slices ?? []).map((slice) => slice.slug).sort();
if (JSON.stringify(folders) !== JSON.stringify(declared)) {
  errors.push(`rr slices ${JSON.stringify(declared)} do not match folders ${JSON.stringify(folders)}`);
}
for (const slice of manifest.slices ?? []) {
  const contract = JSON.parse(readFileSync(path.join(sliceRoot, slice.slug, "slice.json"), "utf8"));
  if (contract.version !== slice.version) errors.push(`${slice.slug}: rr version drift`);
  if (contract.category !== slice.category) errors.push(`${slice.slug}: rr category drift`);
}

if (errors.length) {
  console.error(`✖ ${errors.length} project manifest violation(s):`);
  errors.forEach((error) => console.error(`  · ${error}`));
  process.exit(1);
}
console.log(`✓ audit-project-manifest: ${folders.length} slices, Convex Cloud and env-cookie auth metadata aligned`);
