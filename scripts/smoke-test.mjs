const target = (process.env.SMOKE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const pages = [
  "/",
  "/stays/ruma-kamyna",
  "/brand-assets",
  "/guides/getting-to-megamendung-from-jakarta",
  "/guides/things-to-do-near-puncak",
  "/guides/planning-a-slow-stay-in-megamendung",
  "/welcome?locale=id&name=Smoke",
  "/admin/login",
  "/api/health",
];

for (const route of pages) {
  const response = await fetch(`${target}${route}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  console.log(`✓ ${route} ${response.status}`);
}

const welcomeResponse = await fetch(`${target}/api/welcome?locale=en&name=Smoke`);
const welcome = await welcomeResponse.json();
if (!welcomeResponse.ok || !welcome.ok || welcome.locale !== "en" || welcome.welcome?.guestName !== "Smoke") {
  throw new Error("/api/welcome returned an invalid payload");
}
console.log(`✓ /api/welcome GET ${welcomeResponse.status} source=${welcome.source}`);

const welcomePostResponse = await fetch(`${target}/api/welcome`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ locale: "id", name: "Smoke" }),
});
const welcomePost = await welcomePostResponse.json();
if (!welcomePostResponse.ok || !welcomePost.ok || welcomePost.locale !== "id") {
  throw new Error("/api/welcome POST returned an invalid payload");
}
console.log(`✓ /api/welcome POST ${welcomePostResponse.status}`);

const adminResponse = await fetch(`${target}/admin`, { redirect: "manual" });
const adminLocation = adminResponse.headers.get("location") ?? "";
if (![307, 308].includes(adminResponse.status) || !adminLocation.includes("/admin/login")) {
  throw new Error(`/admin did not redirect unauthenticated access (${adminResponse.status})`);
}
console.log(`✓ /admin protected ${adminResponse.status}`);
