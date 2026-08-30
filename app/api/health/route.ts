import { NextResponse } from "next/server";
import { SERVICE_NAME } from "@/shared/config/site";
import { PLATFORM_VERSION, platformBuildVersion } from "@/shared/platform";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: SERVICE_NAME, platformVersion: PLATFORM_VERSION, buildVersion: platformBuildVersion() },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
