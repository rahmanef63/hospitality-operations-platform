import { RUMA_KAMYNA_CONTACT, RUMA_KAMYNA_LOCATION } from "@/shared/config/ruma-kamyna";
import { CONTACT_EMAIL } from "@/shared/config/site";
import { media, socialImages } from "@/shared/media";
import type { PropertyContent } from "../types";

export const properties: PropertyContent[] = [
  {
    slug: "ruma-kamyna",
    name: "Ruma Kamyna",
    collectionLabel: "Megamendung, Puncak Bogor",
    tagline: "return to stillness",
    status: "Stay enquiries are open",
    shortDescription:
      "A private villa in Megamendung, Puncak Bogor, created for slower mornings, long meals, deep rest, and quiet time.",
    heroStatement: "A private home for slower days.",
    visualNote: "Visual concept. Final property details may evolve.",
    seo: {
      title: "Ruma Kamyna | Private Villa in Megamendung, Puncak Bogor",
      description:
        "Ruma Kamyna is a private villa in Megamendung, Puncak, Bogor, Jawa Barat, shaped for slower mornings, long meals, and quiet stays.",
      keywords: [
        "Ruma Kamyna",
        "private villa Megamendung",
        "villa Puncak Bogor",
        "private stay Bogor",
        "villa Jawa Barat",
      ],
    },
    // TODO(owner): add streetAddress only after the official street name is confirmed.
    // TODO(owner): add geo only from the verified Google Business Profile coordinates.
    location: RUMA_KAMYNA_LOCATION,
    contact: RUMA_KAMYNA_CONTACT,
    heroImage: media.poolCourtyard,
    socialImage: socialImages.rumaKamyna,
    story: [
      "Ruma Kamyna in Megamendung began with a simple idea: that a home in the Puncak area can change the way we move through time.",
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
      label: "Email about a stay",
      href: `mailto:${CONTACT_EMAIL}?subject=Ruma%20Kamyna%20stay%20enquiry`,
      external: true,
    },
  },
];
