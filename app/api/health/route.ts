import { NextResponse } from "next/server";
import { SERVICE_NAME } from "@/shared/config/site";
export function GET() { return NextResponse.json({ status: "ok", service: SERVICE_NAME }); }
