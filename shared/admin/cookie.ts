import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "./cookie-name";

export { ADMIN_COOKIE_NAME };

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function getAdminSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
}
