import { media, socialImages, type MediaAsset } from "@/shared/media";
import type { PropertyContent } from "@/shared/content";
export const TEST_PROPERTY_CONTENT: PropertyContent = {
  slug:"test-property", name:"Test Property", collectionLabel:"Test District", tagline:"welcome with care", status:"Test enquiries", timezone:"Asia/Jakarta",
  shortDescription:"A generic property fixture for schema tests.", heroStatement:"A test stay.", visualNote:"Test visual.",
  seo:{title:"Test Property | Test City",description:"A test property in Test City.",keywords:["test property"]},
  location:{addressLocality:"Test City",destination:"Test Destination",administrativeArea:"Test Area",addressRegion:"Test Region",postalCode:"10000",addressCountry:"ID",countryName:"Indonesia",displayAddress:"Test City, Test Region"},
  contact:{email:"host@example.com"}, heroImage:media.livingCourtyard, socialImage:socialImages.property,
  story:["Test story."], storyImages:[media.livingDining], gallery:[{label:"Room",image:media.bedroomRetreat}],
  pillars:[{title:"Care",description:"Test description.",image:media.materialPalette}],
  rhythm:[{moment:"Morning",title:"Start slowly.",description:"Test rhythm."}], enquiryImage:media.brandSerenity,
  primaryAction:{label:"Contact host",href:"mailto:host@example.com",external:true},
};
export function allTestMedia(): readonly MediaAsset[]{return Object.values(media) as readonly MediaAsset[];}
