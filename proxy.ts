import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/shared/admin/token";

const ADMIN_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-kamyna-admin"
  : "kamyna-admin";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const loginPath = path === "/admin/login";
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = process.env.KAMYNA_ADMIN_SESSION_SECRET;
  const configuredEmail = process.env.KAMYNA_ADMIN_EMAIL?.trim().toLowerCase();
  const session = token && secret ? verifyAdminSessionToken(token, secret) : null;
  const authenticated = Boolean(session && configuredEmail && session.email === configuredEmail);

  if (!authenticated && !loginPath) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (authenticated && loginPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
