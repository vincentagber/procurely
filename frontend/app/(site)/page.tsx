import { HomePage } from "@/components/home/home-page";
import { getProcurelyContent } from "@/lib/content";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const content = await getProcurelyContent();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";

  return <HomePage content={content} searchQuery={query} />;
}
