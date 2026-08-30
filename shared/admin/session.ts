import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminRuntimeConfig } from "./config";
import { verifyAdminSessionToken, type AdminSessionClaims } from "./token";

export const ADMIN_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-hop-admin"
  : "hop-admin";

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function getAdminSession(): Promise<AdminSessionClaims | null> {
  try {
    const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    const { sessionSecret } = getAdminRuntimeConfig();
    return verifyAdminSessionToken(token, sessionSecret);
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSessionClaims> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
