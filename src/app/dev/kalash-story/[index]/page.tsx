import { notFound } from "next/navigation";
import { KalashStoryDevView } from "@/components/slider/kalash-story-dev-view";
import { KALASH_STORY_COUNT } from "@/lib/kalash-dev";

interface KalashStoryDevPageProps {
  params: Promise<{ index: string }>;
}

export default async function KalashStoryDevPage({ params }: KalashStoryDevPageProps) {
  const { index } = await params;
  const storyNumber = Number.parseInt(index, 10);

  if (
    !Number.isFinite(storyNumber) ||
    storyNumber < 1 ||
    storyNumber > KALASH_STORY_COUNT
  ) {
    notFound();
  }

  return <KalashStoryDevView storyIndex={storyNumber - 1} />;
}
