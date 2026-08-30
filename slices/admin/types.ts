import type { ReservationWelcomeLink, WelcomeAdminOverview, WelcomeLocale } from "@/shared/welcome";
import type { AnnouncementAdminOverview, PrayerMoment } from "@/shared/announcements";

export type AdminFormAction = (formData: FormData) => void | Promise<void>;
export type AdminLoginPageProps = { error?: string };
export type AdminPropertyOption = { slug: string; name: string };

export type AdminDashboardProps = {
  sessionEmail: string;
  overview: WelcomeAdminOverview;
  links: ReservationWelcomeLink[];
  linkError: boolean;
  properties: AdminPropertyOption[];
  selectedProperty: AdminPropertyOption;
  endpointUrl: string;
  previewUrl: string;
  backendError: boolean;
  status?: string;
  error?: string;
  selectedLocale: WelcomeLocale;
  formAction: AdminFormAction;
  announcementOverview: AnnouncementAdminOverview;
  announcementTimezone: string;
  announcementCoordinatesAvailable: boolean;
  prayerPreview: PrayerMoment[];
  announcementSettingsAction: AdminFormAction;
  announcementExperienceAction: AdminFormAction;
  announcementRuleAction: AdminFormAction;
  announcementArchiveAction: AdminFormAction;
  announcementSeedAction: AdminFormAction;
};
