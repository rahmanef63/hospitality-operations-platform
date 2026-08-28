import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Kamyna Living guest experience administration.",
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-paper text-charcoal">{children}</div>;
}
