import { CONTACT_EMAIL } from "@/shared/config/site";
import { media } from "@/shared/media";
import type { HomeContent } from "../types";

const enquiryHref = `mailto:${CONTACT_EMAIL}?subject=Kamyna%20Living%20enquiry`;

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Private villa stays in Puncak, Bogor",
    title: "Homes for slower living.",
    description:
      "Kamyna Living begins with Ruma Kamyna in Megamendung, a private villa shaped by quiet design and unhurried time.",
    primaryAction: { label: "Explore Ruma Kamyna in Puncak, Bogor", href: "/stays/ruma-kamyna" },
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
      "The collection begins with Ruma Kamyna in Megamendung, Puncak Bogor. Each future home will respond to its setting while sharing one calm way of welcoming people.",
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
      "For stays at Ruma Kamyna in Megamendung, Puncak Bogor, or future Kamyna Living partnerships, send us a note.",
    action: { label: "Email Kamyna Living", href: enquiryHref, external: true },
    image: media.brandSerenity,
    locationLabel: "Ruma Kamyna location",
    mapTitle: "Find Ruma Kamyna in Megamendung",
    mapPendingText:
      "The official Google Business Profile map will appear here after its verified embed link is supplied.",
    whatsappLabel: "WhatsApp Ruma Kamyna",
    whatsappPendingText: "WhatsApp contact will be added after the verified number is confirmed.",
  },
};
