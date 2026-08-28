import { CONTACT_EMAIL } from "@/shared/config/site";
import { media, socialImages } from "@/shared/media";
import type { PropertyContent } from "../types";

export const properties: PropertyContent[] = [
  {
    slug: "ruma-kamyna",
    name: "Ruma Kamyna",
    collectionLabel: "Kamyna Living · Home 01",
    tagline: "return to stillness",
    status: "Stay enquiries are open",
    shortDescription:
      "A private home created for slower mornings, long meals, deep rest, and the quiet moments between them.",
    heroStatement: "A private home for slower days.",
    visualNote: "Visual concept — final property details may evolve.",
    heroImage: media.poolCourtyard,
    socialImage: socialImages.rumaKamyna,
    story: [
      "Ruma Kamyna began with a simple idea: that a home can change the way we move through time.",
      "Warm materials, soft light, thoughtful objects, and visual restraint create a place that feels refined without becoming formal. Nothing asks for attention. Instead, the home gives it back to you.",
      "Come without an agenda. Wake slowly. Stay at the table. Change your plans. Make none at all.",
    ],
    storyImages: [media.livingDining, media.welcomeDetails],
    gallery: [
      { label: "Rest", image: media.bedroomRetreat },
      { label: "Restore", image: media.spaBath },
      { label: "Gather", image: media.diningTable },
      { label: "Material direction", image: media.materialPalette },
    ],
    pillars: [
      {
        title: "Quiet by design",
        description: "Natural tones, tactile surfaces, and visual restraint create calm without feeling empty.",
        image: media.materialPalette,
      },
      {
        title: "Comfort with purpose",
        description: "Every detail is considered for how it supports rest, ease, and everyday use.",
        image: media.bedroomRetreat,
      },
      {
        title: "Hospitality at your pace",
        description: "Care is available when needed, with privacy preserved throughout the stay.",
        image: media.welcomeDetails,
      },
    ],
    rhythm: [
      {
        moment: "Morning",
        title: "Wake without urgency.",
        description: "Let light enter slowly. Begin with coffee, breakfast, silence, or whatever the day asks for.",
      },
      {
        moment: "Afternoon",
        title: "Leave room for nothing.",
        description: "Read, gather, rest, wander, or let one unplanned hour become the whole afternoon.",
      },
      {
        moment: "Evening",
        title: "Stay at the table.",
        description: "Allow dinner to stretch, conversations to soften, and the day to end without being rushed.",
      },
    ],
    enquiryImage: media.livingCourtyard,
    primaryAction: {
      label: "Enquire about your stay",
      href: `mailto:${CONTACT_EMAIL}?subject=Ruma%20Kamyna%20stay%20enquiry`,
      external: true,
    },
  },
];
