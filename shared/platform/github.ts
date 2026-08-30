import "server-only";
import { compareSemver, majorVersion, updateVersionFromRef } from "./version";
import {
  PLATFORM_APPLY_WORKFLOW,
  PLATFORM_REPOSITORY_MODE,
  PLATFORM_TAG,
  PLATFORM_UPDATE_BRANCH_PREFIX,
  PLATFORM_VERSION,
  platformBuildVersion,
} from "./config";
import type { PlatformApplyRun, PlatformCheckState, PlatformUpdatePullRequest, PlatformUpdateStatus } from "./types";

type GithubRepository = { default_branch: string };
type GithubPull = {
  number: number; html_url: string; title: string; draft?: boolean;
  head: { ref: string; sha: string }; base: { ref: string };
  mergeable?: boolean | null; mergeable_state?: string;
};
type CheckRun = { name?: string; status?: string; conclusion?: string | null };
type WorkflowRun = { display_title?: string; status?: string; conclusion?: string | null; html_url?: string; created_at?: string };

function repositoryName() {
  const explicit = process.env.HOSPITALITY_GITHUB_REPOSITORY?.trim();
  if (explicit?.includes("/")) return explicit;
  const owner = process.env.VERCEL_GIT_REPO_OWNER?.trim();
  const repo = process.env.VERCEL_GIT_REPO_SLUG?.trim();
  return owner && repo ? `${owner}/${repo}` : undefined;
}

function runtimeToken() { return process.env.HOSPITALITY_UPDATE_GITHUB_TOKEN?.trim(); }

async function github<T>(repo: string, path: string, init?: RequestInit): Promise<T> {
  const token = runtimeToken();
  if (!token) throw new Error("Platform update GitHub token is not configured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init, cache: "no-store", signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
    return response.status === 204 ? (undefined as T) : await response.json() as T;
  } finally { clearTimeout(timeout); }
}

function checkState(runs: CheckRun[]): PlatformCheckState {
  if (!runs.length) return "unknown";
  if (runs.some((run) => run.status !== "completed")) return "pending";
  const failed = new Set(["failure", "cancelled", "timed_out", "action_required", "startup_failure", "stale"]);
  if (runs.some((run) => run.conclusion && failed.has(run.conclusion))) return "failure";
  const allowed = new Set(["success", "neutral", "skipped"]);
  return runs.every((run) => run.conclusion && allowed.has(run.conclusion)) ? "success" : "unknown";
}

function parsePull(pull: GithubPull): PlatformUpdatePullRequest {
  return { number: pull.number, url: pull.html_url, title: pull.title, headRef: pull.head.ref, headSha: pull.head.sha, mergeable: pull.mergeable ?? null };
}

function matchingApplyRun(runs: WorkflowRun[], pr: number, version: string): PlatformApplyRun | undefined {
  const match = runs.find((run) => run.display_title?.includes(`PR #${pr}`) && run.display_title.includes(version));
  return match ? { status: match.status ?? "unknown", conclusion: match.conclusion, url: match.html_url, createdAt: match.created_at } : undefined;
}

function baseStatus(overrides: Partial<PlatformUpdateStatus> = {}): PlatformUpdateStatus {
  return {
    mode: PLATFORM_REPOSITORY_MODE, state: PLATFORM_REPOSITORY_MODE === "upstream" ? "upstream" : "current",
    installedVersion: PLATFORM_VERSION, installedTag: PLATFORM_TAG, buildVersion: platformBuildVersion(),
    checkState: "unknown", canApply: false, majorUpgrade: false, configured: false,
    message: PLATFORM_REPOSITORY_MODE === "upstream" ? "Canonical upstream checkout; tenant updates are not applied here." : "No prepared platform update is available.",
    ...overrides,
  };
}

export async function getPlatformUpdateStatus(): Promise<PlatformUpdateStatus> {
  if (PLATFORM_REPOSITORY_MODE === "upstream") return baseStatus();
  const repository = repositoryName();
  const configured = Boolean(repository && runtimeToken());
  if (!configured || !repository) return baseStatus({
    state: "unconfigured", repository, configured: false,
    message: "Connect the tenant repository automation credential before using one-click updates.",
  });
  try {
    const repositoryMeta = await github<GithubRepository>(repository, "");
    const defaultBranch = repositoryMeta.default_branch || "main";
    const pulls = await github<GithubPull[]>(repository, `/pulls?state=open&base=${encodeURIComponent(defaultBranch)}&per_page=100`);
    const candidates = pulls.map((pull) => ({ pull, version: updateVersionFromRef(pull.head.ref, PLATFORM_UPDATE_BRANCH_PREFIX) }))
      .filter((item): item is { pull: GithubPull; version: string } => Boolean(item.version) && compareSemver(item.version!, PLATFORM_VERSION) > 0)
      .sort((a, b) => compareSemver(b.version, a.version));
    const selected = candidates[0];
    if (!selected) return baseStatus({ repository, defaultBranch, configured: true, checkState: "success" });
    const detail = await github<GithubPull>(repository, `/pulls/${selected.pull.number}`);
    const checks = await github<{ check_runs?: CheckRun[] }>(repository, `/commits/${detail.head.sha}/check-runs?per_page=100`);
    const state = checkState(checks.check_runs ?? []);
    const runs = await github<{ workflow_runs?: WorkflowRun[] }>(repository, `/actions/workflows/${PLATFORM_APPLY_WORKFLOW}/runs?event=workflow_dispatch&per_page=20`)
      .catch(() => ({ workflow_runs: [] }));
    const applyRun = matchingApplyRun(runs.workflow_runs ?? [], detail.number, selected.version);
    const applying = applyRun && ["queued", "in_progress", "requested", "waiting", "pending"].includes(applyRun.status);
    const failed = applyRun?.status === "completed" && Boolean(applyRun.conclusion) && applyRun.conclusion !== "success";
    const majorUpgrade = majorVersion(selected.version) !== majorVersion(PLATFORM_VERSION);
    const mergeBlocked = detail.mergeable === false || detail.mergeable_state === "dirty" || detail.draft;
    const ready = state === "success" && !mergeBlocked && !majorUpgrade;
    return baseStatus({
      repository, defaultBranch, configured: true, latestVersion: selected.version, pullRequest: parsePull(detail), applyRun,
      checkState: state, majorUpgrade, canApply: ready && !applying,
      state: applying ? "applying" : failed ? "failed" : majorUpgrade || mergeBlocked || state === "failure" ? "blocked" : ready ? "ready" : "checking",
      message: applying ? "The coordinated update workflow is running."
        : majorUpgrade ? "Major-version updates require an explicit migration plan and manual approval path."
          : mergeBlocked ? "The prepared update is not safely mergeable."
            : state === "failure" ? "The prepared update has failing checks."
              : ready ? "A tested platform update is ready to apply."
                : "The prepared update is still being validated.",
    });
  } catch {
    return baseStatus({ repository, configured: true, state: "unconfigured", message: "Platform update status could not be read from the tenant repository." });
  }
}

export async function dispatchPlatformUpdate(prNumber: number, expectedVersion: string, ref: string) {
  const repository = repositoryName();
  if (!repository || !runtimeToken()) throw new Error("Platform update automation is not configured");
  await github<void>(repository, `/actions/workflows/${PLATFORM_APPLY_WORKFLOW}/dispatches`, {
    method: "POST",
    body: JSON.stringify({ ref, inputs: { pr_number: String(prNumber), expected_version: expectedVersion } }),
  });
}
