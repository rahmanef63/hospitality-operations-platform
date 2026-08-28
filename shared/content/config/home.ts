import { CONTACT_EMAIL } from "@/shared/config/site";
import { media } from "@/shared/media";
import type { HomeContent } from "../types";

const enquiryHref = `mailto:${CONTACT_EMAIL}?subject=Kamyna%20Living%20enquiry`;

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "A considered collection of private stays",
    title: "Homes for slower living.",
    description:
      "Private homes shaped by quiet design, considered comfort, and hospitality that follows your pace.",
    primaryAction: { label: "Explore Ruma Kamyna", href: "/stays/ruma-kamyna" },
    secondaryAction: { label: "Our approach", href: "/#about" },
    image: media.livingCourtyard,
  },
  introduction: {
    title: "Space changes the way time feels.",
    paragraphs: [
      "A stay can be more than somewhere to sleep. It can create room between plans, soften the pace of a day, and help us notice what usually passes quietly by.",
      "Every Kamyna home is distinct, yet guided by the same intention: warm design, meaningful simplicity, and service that is present when needed and invisible when not.",
    ],
    image: media.welcomeDetails,
  },
  collection: {
    title: "Each home has its own rhythm.",
    description:
      "The collection grows thoughtfully. Every property responds to its setting while sharing one calm, recognisable way of welcoming people.",
    images: [media.poolCourtyard, media.livingDining],
  },
  rituals: {
    title: "Nothing to complete. More to notice.",
    items: [
      {
        title: "Rest",
        description: "Rooms that feel settled, mornings without urgency, and comfort designed to help the body exhale.",
        image: media.bedroomRetreat,
      },
      {
        title: "Gather",
        description: "Long meals, familiar spaces, and enough time for conversations to shape the day.",
        image: media.diningTable,
      },
      {
        title: "Restore",
        description: "Simple rituals, natural textures, and privacy that returns attention to what matters.",
        image: media.spaBath,
      },
    ],
  },
  philosophy: {
    eyebrow: "Our philosophy",
    title: "Luxury, in its quietest form.",
    paragraphs: [
      "For us, luxury is not excess. It is the ease of feeling cared for without being interrupted: thoughtful light, useful objects, generous silence, and freedom from a crowded itinerary.",
      "Kamyna homes are designed with restraint so that life, rather than decoration, remains at the centre of the experience.",
    ],
    quote: "Come for the space. Stay for the stillness. Take a little of it home.",
    image: media.botanicalShadow,
  },
  contact: {
    title: "Whenever you are ready.",
    description:
      "For stays, private gatherings, partnerships, or future properties, send us a note. We will reply with care and clarity.",
    action: { label: "Begin an enquiry", href: enquiryHref, external: true },
    image: media.brandSerenity,
  },
};
