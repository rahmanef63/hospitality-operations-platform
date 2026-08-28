const target = process.env.SMOKE_URL ?? "http://127.0.0.1:3000";
const routes = ["/", "/stays/ruma-kamyna", "/brand-assets", "/api/health"];

for (const route of routes) {
  const response = await fetch(`${target}${route}`, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`${route} returned ${response.status}`);
  }
  console.log(`✓ ${route} ${response.status}`);
}
