import { redirect } from "next/navigation";
import { AdminLoginPage } from "@/features/admin";
import { getAdminSession } from "@/shared/admin";


export const instant = false;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/admin");
  const { error } = await searchParams;
  return <AdminLoginPage error={error} />;
}
