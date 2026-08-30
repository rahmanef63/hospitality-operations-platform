import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { compareVersions, distribution, isProtected, product, tagForVersion, versionFromUpdateBranch } from "./lib.mjs";

const platform = product();
const policy = distribution();
const owner = process.env.TENANT_OWNER?.trim();
const repo = process.env.TENANT_REPO?.trim();
const baseBranch = process.env.TENANT_DEFAULT_BRANCH?.trim() || "main";
const token = process.env.TENANT_TOKEN?.trim();
const requestedTag = process.env.PLATFORM_TAG?.trim() || tagForVersion(platform.version, platform);
if (!owner || !repo || !token) throw new Error("TENANT_OWNER, TENANT_REPO, and TENANT_TOKEN are required");
if (!requestedTag.startsWith(platform.release.tagPrefix)) throw new Error(`Invalid platform tag ${requestedTag}`);
const nextVersion = requestedTag.slice(platform.release.tagPrefix.length);
const nwo = `${owner}/${repo}`;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hospitality-platform-update-"));
const target = path.join(tempRoot, "tenant");
const baseEnv = { ...process.env, GH_TOKEN: token, GITHUB_TOKEN: token };

function run(command, args, options = {}) {
  execFileSync(command, args, { cwd: options.cwd, env: options.env ?? baseEnv, stdio: options.stdio ?? "inherit" });
}
function capture(command, args, cwd = target) {
  return execFileSync(command, args, { cwd, env: baseEnv, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
function lines(value) { return value ? value.split("\n").map((item) => item.trim()).filter(Boolean) : []; }
function readTargetJson(relative) { return JSON.parse(fs.readFileSync(path.join(target, relative), "utf8")); }
function writeTargetJson(relative, value) { fs.writeFileSync(path.join(target, relative), `${JSON.stringify(value, null, 2)}\n`); }
function truncate(items, limit = 20) { return items.slice(0, limit).map((item) => `- \`${item}\``).join("\n"); }

function notifyBlocked(reason, details = []) {
  const title = `Platform update ${requestedTag} blocked`;
  const body = [`The automated Hospitality Operations Platform update could not be prepared safely.`, "", `**Reason:** ${reason}`];
  if (details.length) body.push("", "**Details**", truncate(details));
  body.push("", "No tenant files were overwritten. Resolve the drift/conflict, then rerun the upstream tenant-sync workflow.");
  try {
    const existing = JSON.parse(capture("gh", ["issue", "list", "--repo", nwo, "--state", "open", "--search", `${title} in:title`, "--json", "number", "--limit", "1"], process.cwd()) || "[]");
    if (existing[0]?.number) run("gh", ["issue", "edit", String(existing[0].number), "--repo", nwo, "--body", body.join("\n")], { cwd: process.cwd(), stdio: "ignore" });
    else run("gh", ["issue", "create", "--repo", nwo, "--title", title, "--body", body.join("\n")], { cwd: process.cwd(), stdio: "ignore" });
  } catch (error) { console.warn(`Could not create blocked-update issue for ${nwo}: ${error.message}`); }
}

try {
  run("gh", ["auth", "setup-git"], { cwd: process.cwd(), stdio: "ignore" });
  run("gh", ["repo", "clone", nwo, target], { cwd: process.cwd() });
  run("git", ["config", "user.name", "Hospitality Platform Updater"], { cwd: target });
  run("git", ["config", "user.email", "platform-updater@users.noreply.github.com"], { cwd: target });
  const tenant = readTargetJson(".platform/tenant.json");
  const lock = readTargetJson(".platform/tenant.lock.json");
  const expectedUpstream = `${platform.upstream.owner}/${platform.upstream.repo}`;
  if (tenant.upstream !== expectedUpstream || lock.upstream !== expectedUpstream) throw new Error(`Tenant ${nwo} does not target ${expectedUpstream}`);
  if (tenant.channel === "stable" && nextVersion.includes("-")) {
    console.log(`${nwo} skips prerelease ${requestedTag} on stable channel`); process.exit(0);
  }
  if (compareVersions(nextVersion, lock.version) <= 0) {
    console.log(`${nwo} already has ${lock.version}; no update needed`); process.exit(0);
  }

  run("git", ["remote", "add", "platform-local", process.cwd()], { cwd: target });
  run("git", ["fetch", "platform-local", "--tags", "--force"], { cwd: target });
  const nextCommit = capture("git", ["rev-parse", `${requestedTag}^{commit}`]);
  capture("git", ["rev-parse", `${lock.tag}^{commit}`]);

  const tenantDrift = lines(capture("git", ["diff", "--name-only", `${lock.tag}..HEAD`])).filter((file) => !isProtected(file, policy.tenantProtectedPrefixes));
  if (tenantDrift.length) {
    notifyBlocked("Tenant core-code drift exists outside protected overlays.", tenantDrift);
    throw new Error(`Unsafe tenant drift in ${tenantDrift.length} file(s)`);
  }
  const upstreamProtected = lines(capture("git", ["diff", "--name-only", `${lock.tag}..${requestedTag}`])).filter((file) => isProtected(file, policy.tenantProtectedPrefixes));
  if (upstreamProtected.length) {
    notifyBlocked("The upstream release modifies tenant-protected paths.", upstreamProtected);
    throw new Error(`Upstream release touches ${upstreamProtected.length} protected path(s)`);
  }

  const updateBranch = `${policy.updater.branchPrefix}${requestedTag.replace(/[^0-9A-Za-z._-]/g, "-")}`;
  run("git", ["checkout", "-B", updateBranch, `origin/${baseBranch}`], { cwd: target });
  const merge = spawnSync("git", ["merge", "--no-ff", "--no-commit", requestedTag], { cwd: target, env: baseEnv, encoding: "utf8" });
  if (merge.status !== 0) {
    const conflicts = lines(capture("git", ["diff", "--name-only", "--diff-filter=U"]));
    const diagnostics = conflicts.length ? conflicts : lines(`${merge.stderr ?? ""}\n${merge.stdout ?? ""}`).slice(0, 12);
    try { run("git", ["merge", "--abort"], { cwd: target, stdio: "ignore" }); } catch {}
    notifyBlocked(conflicts.length ? "Git merge conflict requires manual review." : "Git merge failed before a conflict set could be resolved.", diagnostics);
    throw new Error(`Could not merge ${nwo} to ${requestedTag}`);
  }

  writeTargetJson(".platform/tenant.lock.json", { schemaVersion: 1, upstream: expectedUpstream, version: nextVersion, tag: requestedTag, commit: nextCommit, installedAt: new Date().toISOString() });
  run("git", ["add", "-A"], { cwd: target });
  run("git", ["commit", "-m", `chore(platform): update to ${requestedTag}`], { cwd: target });

  const verifyEnv = { ...baseEnv, NEXT_PUBLIC_SITE_URL: "https://tenant.example", NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud" };
  run("npm", ["ci", "--include=dev", "--legacy-peer-deps"], { cwd: target, env: verifyEnv });
  run("npm", ["run", "verify"], { cwd: target, env: verifyEnv });
  run("git", ["push", "--force-with-lease", "origin", `HEAD:refs/heads/${updateBranch}`], { cwd: target });

  const existing = JSON.parse(capture("gh", ["pr", "list", "--repo", nwo, "--state", "open", "--head", updateBranch, "--base", baseBranch, "--json", "number,url", "--limit", "1"], process.cwd()) || "[]");
  const changes = lines(capture("git", ["log", "--oneline", "--no-merges", `${lock.tag}..${requestedTag}`], target)).slice(0, 30);
  const body = [`## Hospitality Operations Platform ${requestedTag}`, "", `Automated update from \`${lock.version}\` to \`${nextVersion}\`.`, "", "### Validation", "- Tenant protected overlays were unchanged.", "- No tenant core-code drift was detected.", "- `npm run verify` passed on the merged tenant tree.", "", "### Upstream changes", ...(changes.length ? changes.map((item) => `- ${item}`) : ["- No non-merge commits listed."]), "", "Apply this update from the tenant `/admin/settings` Update now action so Convex deploys before the exact PR is merged and frontend promotion is verified. Runtime data and secrets are not modified by this PR."].join("\n");
  let url;
  if (existing[0]?.number) {
    run("gh", ["pr", "edit", String(existing[0].number), "--repo", nwo, "--title", `chore(platform): update to ${requestedTag}`, "--body", body], { cwd: process.cwd(), stdio: "ignore" });
    url = existing[0].url;
  } else {
    url = capture("gh", ["pr", "create", "--repo", nwo, "--head", updateBranch, "--base", baseBranch, "--title", `chore(platform): update to ${requestedTag}`, "--body", body], process.cwd());
  }
  const openUpdates = JSON.parse(capture("gh", ["pr", "list", "--repo", nwo, "--state", "open", "--base", baseBranch, "--json", "number,headRefName,url", "--limit", "100"], process.cwd()) || "[]");
  for (const candidate of openUpdates) {
    if (candidate.headRefName === updateBranch) continue;
    const candidateVersion = versionFromUpdateBranch(candidate.headRefName ?? "", policy.updater.branchPrefix);
    if (!candidateVersion || compareVersions(candidateVersion, nextVersion) >= 0) continue;
    run("gh", ["pr", "close", String(candidate.number), "--repo", nwo, "--comment", `Superseded by tested platform update ${requestedTag}.`, "--delete-branch"], { cwd: process.cwd(), stdio: "ignore" });
  }

  const reviewers = (process.env.TENANT_REVIEWERS ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  if (reviewers.length) run("gh", ["pr", "edit", url, "--repo", nwo, "--add-reviewer", reviewers.join(",")], { cwd: process.cwd(), stdio: "ignore" });
  console.log(JSON.stringify({ tenant: nwo, from: lock.version, to: nextVersion, branch: updateBranch, pullRequest: url }));
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
