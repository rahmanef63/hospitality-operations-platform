import fs from "node:fs";
import { distribution, parseVersion, product, readJson, tagForVersion } from "./lib.mjs";

const packageJson = readJson("package.json");
const config = product();
const policy = distribution();
parseVersion(config.version);
if (packageJson.name !== config.id) throw new Error(`package.json name must be ${config.id}`);
if (packageJson.version !== config.version) throw new Error("package.json and platform product versions differ");
if (`${config.upstream.owner}/${config.upstream.repo}` !== "rahmanef63/hospitality-operations-platform") throw new Error("Unexpected upstream repository");
if (!Array.isArray(policy.tenantProtectedPrefixes) || policy.tenantProtectedPrefixes.length < 4) throw new Error("Tenant protection policy is incomplete");
const tenants = readJson(".platform/tenants.json");
if (!Array.isArray(tenants.tenants)) throw new Error("Tenant registry is invalid");
for (const tenant of tenants.tenants) {
  if (!tenant.id || !tenant.owner || !tenant.repo || !tenant.defaultBranch || !tenant.channel || !Array.isArray(tenant.reviewers)) throw new Error(`Invalid tenant registry entry: ${JSON.stringify(tenant)}`);
}
const requestedTag = process.argv[2] || process.env.PLATFORM_TAG;
if (requestedTag && requestedTag !== tagForVersion(config.version, config)) throw new Error(`Tag ${requestedTag} must match ${tagForVersion(config.version, config)}`);
for (const file of [".platform/product.json", ".platform/distribution.json", ".platform/tenant.example.json", ".platform/tenants.json"]) if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
console.log(JSON.stringify({ product: config.name, version: config.version, tag: tagForVersion(config.version, config), tenants: tenants.tenants.length, strategy: policy.strategy }));
