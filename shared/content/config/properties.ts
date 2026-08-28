import { CONTACT_EMAIL } from "@/shared/config/site";
import type { PropertyContent } from "../types";

export const properties: PropertyContent[] = [
  {
    slug: "ruma-kamyna",
    name: "Ruma Kamyna",
    collectionLabel: "The first Ruma in the Kamyna collection",
    tagline: "return to stillness",
    status: "Now welcoming enquiries",
    shortDescription:
      "A private home created for slower mornings, long meals, deep rest, and the quiet moments between them.",
    heroStatement: "A private home shaped around slower days.",
    story: [
      "Ruma Kamyna began with a simple idea: that a home can change the way we move through time.",
      "The experience is shaped through warm materials, soft light, thoughtful objects, and spaces that feel refined without becoming formal. Nothing asks for attention. Instead, the home gives it back to you.",
      "Come without an agenda. Wake slowly. Stay at the table. Change your plans. Make none at all.",
    ],
    pillars: [
      {
        title: "Quiet by design",
        description: "Natural tones, tactile surfaces, and visual restraint create calm without feeling empty.",
      },
      {
        title: "Comfort with purpose",
        description: "Every detail is considered for how it supports rest, ease, and everyday use.",
      },
      {
        title: "Hospitality at your pace",
        description: "Care is available when needed, with privacy preserved throughout the stay.",
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
    primaryAction: {
      label: "Enquire about Ruma Kamyna",
      href: `mailto:${CONTACT_EMAIL}?subject=Ruma%20Kamyna%20stay%20enquiry`,
      external: true,
    },
  },
];
