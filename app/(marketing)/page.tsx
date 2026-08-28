import { HomePage } from "@/features/home";
import { getSiteContent } from "@/shared/content";

export default async function Page() {
  const content = await getSiteContent();
  return <HomePage content={content.home} properties={content.properties} />;
}
