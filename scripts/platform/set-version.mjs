import fs from "node:fs";
import { parseVersion } from "./lib.mjs";
const next = process.argv[2];
if (!next) throw new Error("Usage: bun run platform:version -- 1.2.3");
parseVersion(next);
for (const file of ["package.json", ".platform/product.json"]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8")); json.version = next;
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}
// bun.lock carries no root version field, so a release bump has nothing to
// write there. Do not hand-edit a lockfile a package manager owns.
console.log(`Platform version set to ${next}`);
