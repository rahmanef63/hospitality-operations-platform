import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyPage } from "@/features/property";
import { getPropertyBySlug, listProperties } from "@/shared/content";

export async function generateStaticParams() {
  const properties = await listProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: property.name,
    description: property.shortDescription,
    alternates: { canonical: `/stays/${property.slug}` },
    openGraph: {
      title: `${property.name} — Kamyna Living`,
      description: property.shortDescription,
      url: `/stays/${property.slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  return <PropertyPage property={property} />;
}
