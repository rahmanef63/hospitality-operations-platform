import type { Metadata } from "next";
import { BrandAssetsPage } from "@/features/brand-assets";

export const metadata: Metadata = {
  title: "Brand Assets",
  description: "Production-ready Kamyna Living and Ruma Kamyna brand assets.",
  alternates: { canonical: "/brand-assets" },
};

export default function Page() {
  return <BrandAssetsPage />;
}
