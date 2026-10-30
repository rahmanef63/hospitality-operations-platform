import fs from "node:fs";
import { parseVersion } from "./lib.mjs";
const next = process.argv[2];
if (!next) throw new Error("Usage: npm run platform:version -- 1.2.3");
parseVersion(next);
for (const file of ["package.json", ".platform/product.json"]) {
  const json = JSON.parse(fs.readFileSync(file, "utf8")); json.version = next;
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
lock.version = next; if (lock.packages?.[""]) lock.packages[""].version = next;
fs.writeFileSync("package-lock.json", `${JSON.stringify(lock, null, 2)}\n`);
console.log(`Platform version set to ${next}`);
