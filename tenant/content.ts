import { tenantMedia as media, tenantSocialImages as socialImages } from "./media";
import type { AreaGuideContent, HomeContent, PublicUiConfig, SiteContent } from "@/shared/content/types";
const home: HomeContent = {
  hero: { eyebrow: "Independent hospitality operations", title: "Run every stay from one place.", description: "Configure the public experience, reservations, guests, finance, tasks, and property operations without coupling the platform to one hospitality brand.", primaryAction: { label: "Open admin", href: "/admin" }, secondaryAction: { label: "Platform approach", href: "/#about" }, image: media.livingCourtyard },
  introduction: { title: "One platform, independently owned deployments.", paragraphs: ["Each provider owns its repository, cloud deployment, data, domains, secrets, and branding.", "Platform releases arrive as tested pull requests so provider-specific configuration remains isolated from core updates."], image: media.welcomeDetails },
  collection: { title: "Properties appear after onboarding.", description: "Create the first property in the authenticated operations dashboard, then publish its public content from CMS.", images: [media.poolCourtyard, media.livingDining] },
  rituals: { title: "Operational foundations.", items: [
    { title: "Operate", description: "Reservations, availability, guests, finance, and tasks share one property-aware model.", image: media.livingDining },
    { title: "Publish", description: "Draft and publish public content without mixing editorial copy with operational truth.", image: media.diningTable },
    { title: "Welcome", description: "Private guest experiences, announcements, presentations, and multilingual content remain property-scoped.", image: media.welcomeDetails },
  ] },
  philosophy: { eyebrow: "Platform principle", title: "Tenant data stays tenant-owned.", paragraphs: ["Core releases improve software behavior while tenant overlays preserve branding and deployment identity.", "Operational facts remain in the provider's backend rather than being embedded in upstream source."], quote: "Upgrade the platform without replacing the business.", image: media.botanicalShadow },
  contact: { title: "Configure your provider deployment.", description: "Set the tenant repository, cloud projects, domains, and business content before publishing the public site.", action: { label: "Open administration", href: "/admin" }, image: media.brandSerenity, locationLabel: "Property location", mapTitle: "Property map", mapPendingText: "Add verified property location details in the provider deployment.", whatsappLabel: "Property contact", whatsappPendingText: "Add a verified contact channel in the provider deployment." },
};
const publicUi: PublicUiConfig = {
  shell: { showHeader: true, showFooter: true, concierge: { enabled: false, desktopButtonLabel: "Ask", mobileButtonLabel: "Chat", eyebrow: "Guest information", title: "Property Concierge", openingMessage: "Verified guest information will appear after a property is configured.", suggestions: ["What facilities are available?", "Where is the property?", "How do I reserve?"], unavailableMessage: "Property information is not available yet.", inputPlaceholder: "Ask about the property", privacyNote: "Public chat is not retained by default." } },
  home: { seoTitle: "Hospitality Operations Platform", seoDescription: "A configurable multi-property hospitality operations platform.", sections: { order: ["hero","introduction","collection","rituals","philosophy","contact"], hidden: ["collection"] }, collectionLinkLabel: "View property" },
  properties: {},
  guide: { backLabel: "Back to property", notesEyebrow: "Local notes", notesTitle: "Verified local information", propertyCtaLabel: "View property" },
  brandAssets: { seoTitle: "Brand assets", seoDescription: "Provider-managed identity assets.", visible: false, backLabel: "Back", heroEyebrow: "Asset library", heroTitle: "Provider identity files.", heroDescription: "Replace example identity files inside the protected tenant overlay.", heroMediaKey: "brandSerenity", identityEyebrow: "Identity system", identityTitle: "Tenant-owned branding", assetEyebrow: "Vector source", downloadLabel: "Download", paletteVisible: true, paletteEyebrow: "Palette", paletteTitle: "Default neutral palette", usageVisible: true, usageEyebrow: "Tenant rule", usageTitle: "Keep provider identity isolated from platform core.", usageRules: ["Store provider-specific identity files under public/tenant/.", "Store provider-specific configuration under tenant/.", "Do not hardcode tenant identity into platform core."], assets: [
      { href: "/tenant/brand/master-wordmark.svg", name: "Master wordmark", description: "Tenant-owned master identity placeholder.", visible: true },
      { href: "/tenant/brand/property-lockup.svg", name: "Property lockup", description: "Tenant-owned property identity placeholder.", visible: true },
      { href: "/tenant/brand/property-horizontal.svg", name: "Property horizontal lockup", description: "Tenant-owned horizontal property identity placeholder.", visible: true },
      { href: "/tenant/brand/property-monogram.svg", name: "Property monogram", description: "Tenant-owned compact property identity placeholder.", visible: true },
    ] },
};
export const tenantSiteContent: SiteContent = { navigation: [
  { label: "Platform", href: "/#about" }, { label: "Admin", href: "/admin" },
], home, properties: [], publicUi, footer: { statement: "Independent hospitality operations, tenant-owned by design.", links: [{ label: "Admin", href: "/admin" }], legal: "Hospitality Operations Platform.", tagline: "operate with clarity" } };
export const tenantAreaGuides: AreaGuideContent[] = [];
export const tenantSocial = socialImages;
