import { type NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  fingerprintAdminRequest,
  getAdminCookieOptions,
  getAdminRuntimeConfig,
  verifyAdminCredentials,
} from "@/shared/admin";
import { recordAdminLoginAttempt } from "@/shared/convex";


function sameOrigin(request: NextRequest): boolean {
  const expectedOrigin = process.env.NODE_ENV === "production"
    ? getAdminRuntimeConfig().siteOrigin
    : request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (origin) return origin === expectedOrigin;
  const fetchSite = request.headers.get("sec-fetch-site");
  return fetchSite === "same-origin" || fetchSite === "none";
}

function redirectTo(request: NextRequest, path: string) {
  const origin = process.env.NODE_ENV === "production"
    ? getAdminRuntimeConfig().siteOrigin
    : request.nextUrl.origin;
  return NextResponse.redirect(new URL(path, origin), 303);
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse("Forbidden", { status: 403 });
  const form = await request.formData();
  if (form.get("intent") === "logout") {
    const response = redirectTo(request, "/admin/login");
    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      ...getAdminCookieOptions(),
      expires: new Date(0),
      maxAge: 0,
    });
    return response;
  }
  const email = String(form.get("email") ?? "").slice(0, 254);
  const password = String(form.get("password") ?? "").slice(0, 512);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const fingerprint = fingerprintAdminRequest(ip, request.headers.get("user-agent") ?? "unknown");
  const credentialsValid = verifyAdminCredentials(email, password);
  try {
    const attempt = await recordAdminLoginAttempt({ fingerprint, success: credentialsValid });
    if (!credentialsValid || !attempt.allowed) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const reason = attempt.locked ? "locked" : "invalid";
      return redirectTo(request, `/admin/login?error=${reason}`);
    }
    const config = getAdminRuntimeConfig();
    const token = createAdminSessionToken(config.email, config.sessionSecret);
    const response = redirectTo(request, "/admin");
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      ...getAdminCookieOptions(),
      maxAge: ADMIN_SESSION_TTL_SECONDS,
      expires: new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000),
    });
    return response;
  } catch {
    return redirectTo(request, "/admin/login?error=service");
  }
}
