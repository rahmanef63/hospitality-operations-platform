export { PLATFORM_TAG, PLATFORM_UPSTREAM, PLATFORM_VERSION, platformBuildVersion, platformRepositoryMode } from "./config";
export { dispatchPlatformUpdate, getPlatformUpdateStatus } from "./github";
export { compareSemver, majorVersion, parseSemver, updateVersionFromRef } from "./version";
export type { PlatformApplyRun, PlatformCheckState, PlatformRepositoryMode, PlatformUpdatePullRequest, PlatformUpdateState, PlatformUpdateStatus } from "./types";
