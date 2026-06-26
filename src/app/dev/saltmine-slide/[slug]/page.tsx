import { notFound } from "next/navigation";
import { SaltmineSlideScreenDevView } from "@/components/slider/saltmine-slide-screen-dev-view";
import { getSaltmineSlideScreen } from "@/lib/saltmine-slide-screens";

interface SaltmineSlideDevPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SaltmineSlideDevPage({ params }: SaltmineSlideDevPageProps) {
  const { slug } = await params;
  const entry = getSaltmineSlideScreen(slug);

  if (!entry) {
    notFound();
  }

  return <SaltmineSlideScreenDevView entry={entry} />;
}
