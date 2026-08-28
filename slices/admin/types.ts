import type { WelcomeAdminOverview } from "@/shared/welcome";

export type AdminFormAction = (formData: FormData) => void | Promise<void>;

export type AdminLoginPageProps = {
  error?: string;
};

export type AdminDashboardProps = {
  sessionEmail: string;
  overview: WelcomeAdminOverview;
  endpointUrl: string;
  previewUrl: string;
  backendError: boolean;
  status?: string;
  error?: string;
  selectedLocale?: string;
  formAction: AdminFormAction;
};
