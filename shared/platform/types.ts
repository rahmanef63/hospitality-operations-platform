export type PlatformRepositoryMode = "upstream" | "tenant";
export type PlatformCheckState = "success" | "pending" | "failure" | "unknown";
export type PlatformUpdateState =
  | "upstream"
  | "unconfigured"
  | "current"
  | "checking"
  | "ready"
  | "applying"
  | "failed"
  | "blocked";

export type PlatformUpdatePullRequest = {
  number: number;
  url: string;
  title: string;
  headRef: string;
  headSha: string;
  mergeable: boolean | null;
};

export type PlatformApplyRun = {
  status: string;
  conclusion?: string | null;
  url?: string;
  createdAt?: string;
};

export type PlatformUpdateStatus = {
  mode: PlatformRepositoryMode;
  state: PlatformUpdateState;
  installedVersion: string;
  installedTag: string;
  buildVersion: string;
  repository?: string;
  defaultBranch?: string;
  latestVersion?: string;
  checkState: PlatformCheckState;
  pullRequest?: PlatformUpdatePullRequest;
  applyRun?: PlatformApplyRun;
  canApply: boolean;
  majorUpgrade: boolean;
  configured: boolean;
  message: string;
};
