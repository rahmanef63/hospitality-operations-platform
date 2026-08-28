import { SiteFooter, SiteHeader } from "@/features/site-shell";
import { getSiteContent } from "@/shared/content";

export default async function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <SiteHeader navigation={content.navigation} />
      {children}
      <SiteFooter footer={content.footer} />
    </div>
  );
}
