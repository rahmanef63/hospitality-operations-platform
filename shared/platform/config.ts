import product from "../../.platform/product.json";
import distribution from "../../.platform/distribution.json";
import { tenantSite } from "@/tenant";

export const PLATFORM_VERSION = product.version;
export const PLATFORM_TAG = `${product.release.tagPrefix}${PLATFORM_VERSION}`;
export const PLATFORM_UPSTREAM = `${product.upstream.owner}/${product.upstream.repo}`;
export const PLATFORM_UPDATE_BRANCH_PREFIX = distribution.updater.branchPrefix;
export const PLATFORM_APPLY_WORKFLOW = distribution.updater.tenantApplyWorkflow ?? "apply-platform-update.yml";
export const PLATFORM_REPOSITORY_MODE = tenantSite.id === "default-tenant" ? "upstream" : "tenant";

export function platformBuildVersion() {
  return process.env.NEXT_PUBLIC_BUILD_VERSION?.trim()
    || process.env.VERCEL_GIT_COMMIT_SHA?.trim()
    || process.env.SOURCE_COMMIT?.trim()
    || process.env.GITHUB_SHA?.trim()
    || "development";
}
