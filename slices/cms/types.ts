import type { CmsAdminOverview } from "@/shared/cms";
export type CmsAction = (formData: FormData) => void | Promise<void>;
export type CmsPageBase = { overview: CmsAdminOverview; status?: string; error?: string };
