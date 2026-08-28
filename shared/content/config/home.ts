import { CONTACT_EMAIL } from "@/shared/config/site";
import type { HomeContent } from "../types";

const enquiryHref = `mailto:${CONTACT_EMAIL}?subject=Kamyna%20Living%20enquiry`;

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "A collection of private stays",
    title: "Homes for slower living.",
    description:
      "Kamyna Living creates quiet places shaped by natural materials, considered comfort, and hospitality that follows your pace.",
    primaryAction: { label: "Discover Ruma Kamyna", href: "/stays/ruma-kamyna" },
    secondaryAction: { label: "Our philosophy", href: "/#philosophy" },
    note: "Private stays · thoughtful hospitality · unhurried time",
  },
  introduction: {
    eyebrow: "Why Kamyna",
    title: "Space changes the way time feels.",
    paragraphs: [
      "We believe a stay can be more than somewhere to sleep. It can create room between plans, soften the pace of a day, and help people notice what usually passes quietly by.",
      "Every Kamyna home is distinct, yet guided by the same intention: warm design, meaningful simplicity, and service that is present when needed and invisible when not.",
    ],
  },
  collection: {
    eyebrow: "The collection",
    title: "Each home has its own rhythm.",
    description:
      "The Kamyna collection grows thoughtfully. Every property responds to its own setting while sharing one calm, recognisable way of welcoming people.",
  },
  rituals: {
    eyebrow: "A quieter way to stay",
    title: "Nothing to complete. More to notice.",
    items: [
      {
        number: "01",
        title: "Rest",
        description: "Rooms that feel settled, mornings without urgency, and comfort designed to help the body exhale.",
      },
      {
        number: "02",
        title: "Gather",
        description: "Long meals, familiar spaces, and enough time for conversations to become the shape of the day.",
      },
      {
        number: "03",
        title: "Restore",
        description: "Simple rituals, natural textures, and moments of privacy that return attention to what matters.",
      },
    ],
  },
  philosophy: {
    eyebrow: "Our philosophy",
    title: "Luxury, in its quietest form.",
    paragraphs: [
      "For us, luxury is not excess. It is the ease of feeling cared for without being interrupted. It is thoughtful light, useful objects, generous silence, and freedom from a crowded itinerary.",
      "Kamyna homes are designed with restraint so that life—not decoration—remains at the centre of the experience.",
    ],
    quote: "Come for the space. Stay for the stillness. Take a little of it home.",
  },
  contact: {
    eyebrow: "Stay with Kamyna",
    title: "Whenever you are ready.",
    description:
      "For stays, private gatherings, partnerships, or future properties, send us a note. We will respond with the care and clarity your plans deserve.",
    action: { label: "Begin an enquiry", href: enquiryHref, external: true },
  },
};
