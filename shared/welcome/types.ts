export const WELCOME_LOCALES = [
  "id", "en", "ar", "ja", "zh-CN", "ko", "es", "fr", "de", "pt",
  "it", "nl", "ru", "tr", "th", "vi", "hi", "ms", "fil", "la",
] as const;

export type WelcomeLocale = (typeof WELCOME_LOCALES)[number];
export type WelcomeDirection = "ltr" | "rtl";

export type WelcomeLocaleMeta = {
  code: WelcomeLocale;
  label: string;
  nativeLabel: string;
  htmlLang: string;
  direction: WelcomeDirection;
  sampleName: string;
  genericHeadline: string;
  contactLabel: string;
  noteLabel: string;
  privateLabel: string;
};

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
  action: "seed" | "save" | "publish" | "translate";
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

export type ReservationWelcomeContext = {
  reference: string;
  propertySlug: string;
  guestName: string;
  propertyName: string;
  unitName?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  locale: WelcomeLocale;
};

export type ReservationWelcomeLink = ReservationWelcomeContext & {
  reservationId: string;
  guestEmail?: string;
  guestPhone?: string;
  url: string;
};
