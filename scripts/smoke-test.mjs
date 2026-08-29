const target = (process.env.SMOKE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const pages = [
  "/",
  "/stays/ruma-kamyna",
  "/brand-assets",
  "/guides/getting-to-megamendung-from-jakarta",
  "/guides/things-to-do-near-puncak",
  "/guides/planning-a-slow-stay-in-megamendung",
  "/welcome?locale=id&name=Smoke",
  "/welcome?locale=ar&name=Smoke",
  "/presentation?locale=id&name=Smoke&tv=1",
  "/admin/login",
  "/api/health",
  "/offline",
  "/sw.js",
  "/manifest.webmanifest",
  "/presentation.webmanifest",
];

for (const route of pages) {
  const response = await fetch(`${target}${route}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  console.log(`✓ ${route} ${response.status}`);
}

const serviceWorkerResponse = await fetch(`${target}/sw.js`, { cache: "no-store" });
const serviceWorkerSource = await serviceWorkerResponse.text();
if (!serviceWorkerResponse.ok || !serviceWorkerSource.includes("KAMYNA_SKIP_WAITING")) {
  throw new Error("/sw.js did not expose the expected update lifecycle.");
}
if (!serviceWorkerResponse.headers.get("service-worker-allowed")?.includes("/")) {
  throw new Error("/sw.js is missing root scope permission.");
}
console.log(`✓ /sw.js update lifecycle ${serviceWorkerResponse.status}`);

const manifestResponse = await fetch(`${target}/manifest.webmanifest`, { cache: "no-store" });
const webManifest = await manifestResponse.json();
if (!manifestResponse.ok || webManifest.id !== "/" || webManifest.display !== "standalone" || !webManifest.shortcuts?.some((item) => item.url === "/presentation?tv=1")) {
  throw new Error("/manifest.webmanifest is missing install metadata.");
}
for (const asset of [...(webManifest.icons ?? []), ...(webManifest.screenshots ?? [])]) {
  const response = await fetch(`${target}${asset.src}`);
  if (!response.ok) throw new Error(`PWA asset ${asset.src} returned ${response.status}`);
}
console.log(`✓ /manifest.webmanifest install metadata ${manifestResponse.status}`);

const presentationManifestResponse = await fetch(`${target}/presentation.webmanifest`, { cache: "no-store" });
const presentationManifest = await presentationManifestResponse.json();
if (!presentationManifestResponse.ok || presentationManifest.id !== "/presentation" || presentationManifest.start_url !== "/presentation?tv=1" || presentationManifest.display !== "fullscreen") {
  throw new Error("/presentation.webmanifest is missing TV install metadata.");
}
console.log(`✓ /presentation.webmanifest TV identity ${presentationManifestResponse.status}`);

const presentationResponse = await fetch(`${target}/presentation?locale=id&name=Smoke&tv=1`);
const presentationHtml = await presentationResponse.text();
for (const marker of ["TV slideshow controls", "Fullscreen", "Pause"]) {
  if (!presentationHtml.includes(marker)) throw new Error(`/presentation is missing ${marker}`);
}
console.log(`✓ /presentation TV slideshow ${presentationResponse.status}`);

const regularWelcomeResponse = await fetch(`${target}/welcome?locale=id&name=Smoke`);
const regularWelcomeHtml = await regularWelcomeResponse.text();
if (regularWelcomeHtml.includes("TV slideshow controls")) throw new Error("/welcome unexpectedly renders the TV presentation.");
console.log(`✓ /welcome remains the standard guest page ${regularWelcomeResponse.status}`);

const propertyResponse = await fetch(`${target}/stays/ruma-kamyna`);
const propertyHtml = await propertyResponse.text();
for (const fact of ["3", "Kolam renang", "Gym", "Jacuzzi", "Pemandangan gunung", '"numberOfRooms":3']) {
  if (!propertyHtml.includes(fact)) throw new Error(`Ruma Kamyna page is missing confirmed fact: ${fact}`);
}
for (const forbidden of ["Maximum guests", "Base nightly rate", "Cancellation policy"]) {
  if (propertyHtml.includes(forbidden)) throw new Error(`Ruma Kamyna page published unconfirmed copy: ${forbidden}`);
}
console.log("✓ /stays/ruma-kamyna confirmed dynamic facts");

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


const conciergeResponse = await fetch(`${target}/api/concierge`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Fasilitas apa saja?" }),
});
const concierge = await conciergeResponse.json();
if (!conciergeResponse.ok || !concierge.ok || concierge.reply?.topic !== "amenities") {
  throw new Error("/api/concierge returned an invalid payload");
}
for (const fact of ["3 kamar tidur", "Kolam renang", "Gym", "Jacuzzi", "Pemandangan gunung"]) {
  if (!concierge.reply.answer.includes(fact)) throw new Error(`/api/concierge is missing confirmed fact: ${fact}`);
}
console.log(`✓ /api/concierge POST ${conciergeResponse.status} source=${concierge.source}`);

const protectedRoutes = [
  "/admin",
  "/admin/calendar",
  "/admin/reservations",
  "/admin/guests",
  "/admin/properties",
  "/admin/units",
  "/admin/amenities",
  "/admin/finance",
  "/admin/tasks",
  "/admin/welcome",
  "/admin/ai",
];
for (const route of protectedRoutes) {
  const response = await fetch(`${target}${route}`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  if (![307, 308].includes(response.status) || !location.includes("/admin/login")) {
    throw new Error(`${route} did not redirect unauthenticated access (${response.status})`);
  }
  console.log(`✓ ${route} protected ${response.status}`);
}
