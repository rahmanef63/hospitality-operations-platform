import { compareVersions, readJson, versionFromUpdateBranch } from "./lib.mjs";

const token = process.env.GH_TOKEN?.trim();
const repository = process.env.GITHUB_REPOSITORY?.trim();
const convexSite = process.env.HOSPITALITY_CONVEX_SITE_URL?.trim()?.replace(/\/$/, "");
const workerToken = process.env.HOSPITALITY_UPDATE_WORKFLOW_TOKEN?.trim();
const applyWorkflow = readJson(".platform/distribution.json").updater.tenantApplyWorkflow ?? "apply-platform-update.yml";
const installedVersion = readJson(".platform/tenant.lock.json").version;
if (!token || !repository || !convexSite || !workerToken) throw new Error("Platform update worker configuration is incomplete.");
if (!/^https:\/\/[^/]+\.convex\.site$/.test(convexSite)) throw new Error("HOSPITALITY_CONVEX_SITE_URL must be a Convex site origin.");
if (workerToken.length < 32) throw new Error("HOSPITALITY_UPDATE_WORKFLOW_TOKEN is invalid.");

async function github(path, init = {}) {
  const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
    ...init, headers: {
      Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json", ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}) for ${path}`);
  return response.status === 204 ? undefined : response.json();
}

async function convex(path, body) {
  const response = await fetch(`${convexSite}${path}`, {
    method: "POST", headers: { Authorization: `Bearer ${workerToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || !payload?.ok) throw new Error(`Convex worker request failed (${response.status})`);
  return payload.data;
}

function checkState(runs) {
  if (!runs.length) return "unknown";
  if (runs.some((run) => run.status !== "completed")) return "pending";
  const allowed = new Set(["success", "neutral", "skipped"]);
  return runs.every((run) => allowed.has(run.conclusion)) ? "success" : "failure";
}

const repo = await github("");
const defaultBranch = repo.default_branch || "main";
const pulls = await github(`/pulls?state=open&base=${encodeURIComponent(defaultBranch)}&per_page=100`);
const candidates = pulls
  .map((pull) => ({ pull, version: versionFromUpdateBranch(pull.head.ref) }))
  .filter((item) => item.version && compareVersions(item.version, installedVersion) > 0)
  .sort((a, b) => compareVersions(b.version, a.version));
const selected = candidates[0];
let status = {
  repository, defaultBranch, installedVersion, checkState: "success", state: "current", majorUpgrade: false,
};
if (selected) {
  const detail = await github(`/pulls/${selected.pull.number}`);
  const checks = await github(`/commits/${detail.head.sha}/check-runs?per_page=100`);
  const state = checkState(checks.check_runs ?? []);
  const runs = await github(`/actions/workflows/${encodeURIComponent(applyWorkflow)}/runs?event=workflow_dispatch&per_page=20`);
  const applyRun = (runs.workflow_runs ?? []).find((run) => run.display_title?.includes(`PR #${detail.number}`) && run.display_title.includes(selected.version));
  const applying = applyRun && ["queued", "in_progress", "requested", "waiting", "pending"].includes(applyRun.status);
  const applyFailed = applyRun?.status === "completed" && applyRun.conclusion && applyRun.conclusion !== "success";
  const installedMajor = Number(installedVersion.split(".")[0]);
  const nextMajor = Number(selected.version.split(".")[0]);
  const majorUpgrade = installedMajor !== nextMajor;
  const mergeBlocked = detail.draft || detail.mergeable === false || detail.mergeable_state === "dirty";
  const ready = state === "success" && !mergeBlocked && !majorUpgrade;
  status = {
    repository, defaultBranch, installedVersion, latestVersion: selected.version,
    prNumber: detail.number, prUrl: detail.html_url, prTitle: detail.title, headRef: detail.head.ref, headSha: detail.head.sha,
    mergeable: detail.mergeable ?? undefined, checkState: state, majorUpgrade,
    state: applying ? "applying" : applyFailed ? "failed" : majorUpgrade || mergeBlocked || state === "failure" ? "blocked" : ready ? "ready" : "checking",
    applyRunStatus: applyRun?.status, applyRunConclusion: applyRun?.conclusion ?? undefined, applyRunUrl: applyRun?.html_url,
  };
}
const synced = await convex("/platform/worker/sync", status);
const request = synced?.request;
if (request) {
  try {
    await github(`/actions/workflows/${encodeURIComponent(applyWorkflow)}/dispatches`, {
      method: "POST", body: JSON.stringify({
        ref: defaultBranch, inputs: { pr_number: String(request.prNumber), expected_version: request.expectedVersion },
      }),
    });
    await convex("/platform/worker/ack", { ...request, success: true });
    console.log(`Platform update request dispatched for v${request.expectedVersion}.`);
  } catch (error) {
    await convex("/platform/worker/ack", {
      ...request, success: false, error: error instanceof Error ? error.message.slice(0, 200) : "dispatch failed",
    }).catch(() => undefined);
    throw error;
  }
} else {
  console.log(`Platform update worker synced: ${status.state}${status.latestVersion ? ` v${status.latestVersion}` : ""}.`);
}
