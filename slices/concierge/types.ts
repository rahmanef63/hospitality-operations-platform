import type { NavigationItem } from "@/shared/content";
import type { ConciergeLink } from "@/shared/concierge";

export type GuestConciergeProps = {
  navigation: NavigationItem[];
};

export type ConciergeMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: ConciergeLink[];
  suggestions?: string[];
};
