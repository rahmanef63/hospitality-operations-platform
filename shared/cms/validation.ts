import type { CmsDocument } from "./types";

const HOME_SECTIONS = new Set(["hero", "introduction", "collection", "rituals", "philosophy", "contact"]);
const PROPERTY_SECTIONS = new Set(["hero", "story", "facts", "gallery", "pillars", "rhythm", "guides", "enquiry"]);
const MEDIA_KEYS = new Set(["livingCourtyard","poolCourtyard","livingDining","bedroomRetreat","spaBath","welcomeDetails","diningTable","materialPalette","botanicalShadow","brandSerenity"]);

function text(value: unknown, label: string, max = 1200) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`${label} tidak valid.`);
}
function composition(value: { order: string[]; hidden: string[] }, allowed: Set<string>, label: string) {
  if (new Set(value.order).size !== allowed.size || value.order.some((item) => !allowed.has(item))) throw new Error(`${label} order tidak valid.`);
  if (value.hidden.some((item) => !allowed.has(item))) throw new Error(`${label} hidden tidak valid.`);
}
function mediaPath(value: string, label: string) {
  if (!value.startsWith("/media/kamyna/")) throw new Error(`${label} media tidak valid.`);
}
function href(value: string, label: string) {
  if (!(value.startsWith("/") && !value.startsWith("//")) && !value.startsWith("https://") && !value.startsWith("mailto:")) throw new Error(`${label} href tidak valid.`);
}

export function validateCmsDocument(input: CmsDocument): CmsDocument {
  if (!input || input.schemaVersion !== 1 || !input.site || !Array.isArray(input.guides)) throw new Error("CMS document tidak valid.");
  if (input.site.navigation.length < 1 || input.site.navigation.length > 8) throw new Error("Navigation CMS tidak valid.");
  input.site.navigation.forEach((item, index) => { text(item.label, `Navigation ${index + 1}`, 40); text(item.href, `Navigation href ${index + 1}`, 160); href(item.href, `Navigation ${index + 1}`); });
  text(input.site.footer.statement, "Footer statement", 300); text(input.site.footer.legal, "Footer legal", 180);
  composition(input.site.publicUi.home.sections, HOME_SECTIONS, "Home sections");
  text(input.site.publicUi.home.seoTitle, "Home SEO title", 90); text(input.site.publicUi.home.seoDescription, "Home SEO description", 220);
  mediaPath(input.site.home.hero.image.src, "Home hero");
  for (const property of input.site.properties) {
    text(property.slug, "Property slug", 80); text(property.name, "Property name", 100);
    const ui = input.site.publicUi.properties[property.slug];
    if (!ui) throw new Error(`UI properti ${property.slug} belum tersedia.`);
    composition(ui.sections, PROPERTY_SECTIONS, `Property ${property.slug}`);
    mediaPath(property.heroImage.src, `Property ${property.slug} hero`);
  }
  if (input.guides.length > 30) throw new Error("Terlalu banyak guide.");
  const slugs = new Set<string>();
  input.guides.forEach((guide) => {
    text(guide.slug, "Guide slug", 100); text(guide.title, "Guide title", 140); text(guide.introduction, "Guide introduction", 1400);
    if (slugs.has(guide.slug)) throw new Error("Guide slug harus unik.");
    slugs.add(guide.slug);
  });
  const brand = input.site.publicUi.brandAssets;
  text(brand.heroTitle, "Brand assets title", 140); if (!MEDIA_KEYS.has(brand.heroMediaKey)) throw new Error("Brand hero media tidak valid.");
  input.site.footer.links.forEach((item, index) => href(item.href, `Footer ${index + 1}`));
  href(input.site.home.hero.primaryAction.href, "Home primary CTA"); href(input.site.home.hero.secondaryAction.href, "Home secondary CTA"); href(input.site.home.contact.action.href, "Home contact CTA");
  input.site.properties.forEach((property) => href(property.primaryAction.href, `Property ${property.slug} CTA`));
  return structuredClone(input);
}

export function parseCmsJson(value: string): CmsDocument {
  if (value.length > 300_000) throw new Error("CMS payload terlalu besar.");
  return validateCmsDocument(JSON.parse(value) as CmsDocument);
}
