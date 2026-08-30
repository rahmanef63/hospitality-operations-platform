import type { ConciergeUi, NavigationItem } from "@/shared/content";
import type { ConciergeLink } from "@/shared/concierge";

export type GuestConciergeProps = {
  navigation: NavigationItem[];
  config: ConciergeUi;
};

export type ConciergeMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: ConciergeLink[];
  suggestions?: string[];
};
