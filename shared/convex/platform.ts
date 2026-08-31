import "server-only";
import type { PlatformUpdateStatus } from "@/shared/platform/types";
import { adminFetch } from "./core";

type PlatformQueueSnapshot = {
  repository: string; defaultBranch: string; installedVersion: string; latestVersion?: string;
  prNumber?: number; prUrl?: string; prTitle?: string; headRef?: string; headSha?: string; mergeable?: boolean;
  checkState: PlatformUpdateStatus["checkState"]; state: Exclude<PlatformUpdateStatus["state"], "upstream" | "unconfigured">;
  majorUpgrade: boolean; applyRunStatus?: string; applyRunConclusion?: string; applyRunUrl?: string; workerSyncedAt: number;
  requestState?: "queued" | "dispatching" | "dispatched"; requestedAt?: number; lastDispatchError?: string;
};

export function getPlatformQueueSnapshot() {
  return adminFetch<PlatformQueueSnapshot | null>("/admin/platform/status", {});
}

export function queuePlatformUpdate(prNumber: number, expectedVersion: string) {
  return adminFetch<{ queued: boolean; requestedAt: number }>("/admin/platform/queue", { prNumber, expectedVersion });
}
