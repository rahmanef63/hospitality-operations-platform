import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/shared/convex/session";
import { getAdminSessionToken } from "./cookie";
import type { AdminSessionClaims } from "./token";

export async function getAdminSession(): Promise<AdminSessionClaims | null> {
  const token = await getAdminSessionToken();
  if (!token) return null;
  try { return await verifyAdminSession(token); } catch { return null; }
}

export async function requireAdminSession(): Promise<AdminSessionClaims> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
