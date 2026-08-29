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
  "/admin/login",
  "/api/health",
];

for (const route of pages) {
  const response = await fetch(`${target}${route}`, { redirect: "follow" });
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  console.log(`✓ ${route} ${response.status}`);
}

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
