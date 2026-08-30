import { PmsShell } from "@/features/pms";
import { requireAdminSession } from "@/shared/admin";

export const instant = false;

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminSession();
  return <PmsShell sessionEmail={session.email}>{children}</PmsShell>;
}
