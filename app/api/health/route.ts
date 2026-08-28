export async function GET() {
  return Response.json(
    { status: "ok", service: "kamyna-living" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
