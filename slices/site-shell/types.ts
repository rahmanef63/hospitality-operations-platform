import type { NavigationItem, SiteContent } from "@/shared/content";

export type SiteHeaderProps = {
  navigation: NavigationItem[];
};

export type SiteFooterProps = {
  footer: SiteContent["footer"];
};
