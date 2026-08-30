export type PlatformProduct = {
  schemaVersion: number;
  id: string;
  name: string;
  version: string;
  upstream: { owner: string; repo: string; defaultBranch: string };
  release: { channel: string; tagPrefix: string };
};
export function parseVersion(value: string): { major: number; minor: number; patch: number; pre: string };
export function compareVersions(left: string, right: string): number;
export function isProtected(file: string, prefixes?: string[]): boolean;
export function versionFromUpdateBranch(branch: string, prefix?: string): string | null;
export function tagForVersion(version: string, config?: PlatformProduct): string;
export function product(): PlatformProduct;
export function distribution(): Record<string, unknown>;
export function readJson(relative: string): unknown;
