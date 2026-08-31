import "server-only";
import { createSign } from "node:crypto";

type Installation = { id: number };
type InstallationToken = { token: string; expires_at: string };
type CachedToken = { repository: string; token: string; expiresAt: number };

let cachedToken: CachedToken | undefined;

function personalToken() {
  return process.env.HOSPITALITY_UPDATE_GITHUB_TOKEN?.trim();
}

function appId() {
  return process.env.HOSPITALITY_UPDATE_GITHUB_APP_ID?.trim();
}

function appPrivateKey() {
  const value = process.env.HOSPITALITY_UPDATE_GITHUB_APP_PRIVATE_KEY?.trim();
  return value?.replace(/\\n/g, "\n");
}

export function githubCredentialConfigured() {
  return Boolean(personalToken() || (appId() && appPrivateKey()));
}

function githubAppJwt() {
  const id = appId();
  const privateKey = appPrivateKey();
  if (!id || !privateKey) throw new Error("Platform update GitHub App is not configured");
  const now = Math.floor(Date.now() / 1_000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iat: now - 60, exp: now + 540, iss: id })).toString("base64url");
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(privateKey).toString("base64url")}`;
}

async function authRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!response.ok) throw new Error(`GitHub App authentication failed (${response.status})`);
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function installationToken(repository: string) {
  const now = Date.now();
  if (cachedToken?.repository === repository && cachedToken.expiresAt - now > 60_000) return cachedToken.token;
  const jwt = githubAppJwt();
  const installation = await authRequest<Installation>(`/repos/${repository}/installation`, jwt);
  const result = await authRequest<InstallationToken>(`/app/installations/${installation.id}/access_tokens`, jwt, { method: "POST" });
  const expiresAt = Date.parse(result.expires_at);
  if (!result.token || !Number.isFinite(expiresAt)) throw new Error("GitHub App returned an invalid installation token");
  cachedToken = { repository, token: result.token, expiresAt };
  return result.token;
}

export async function githubRuntimeToken(repository: string) {
  const token = personalToken();
  if (token) return token;
  if (!appId() || !appPrivateKey()) throw new Error("Platform update GitHub credential is not configured");
  return installationToken(repository);
}
