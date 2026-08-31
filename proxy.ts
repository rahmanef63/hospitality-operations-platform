import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/shared/admin/cookie-name";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const loginPath = path === "/admin/login";
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token && !loginPath) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
