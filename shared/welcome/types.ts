export const WELCOME_LOCALES = ["id", "en"] as const;

export type WelcomeLocale = (typeof WELCOME_LOCALES)[number];

export type WelcomeContent = {
  headline: string;
  body: string;
  signature: string;
};

export type WelcomeConfigState = {
  locale: WelcomeLocale;
  draft: WelcomeContent;
  published?: WelcomeContent;
  version: number;
  updatedAt?: number;
  publishedAt?: number;
};

export type WelcomeAuditEvent = {
  action: "seed" | "save" | "publish";
  locale: WelcomeLocale;
  version: number;
  actorEmailHash: string;
  createdAt: number;
};

export type WelcomeAdminOverview = {
  configs: Record<WelcomeLocale, WelcomeConfigState>;
  events: WelcomeAuditEvent[];
};

export type RenderedWelcome = WelcomeContent & {
  guestName?: string;
};
