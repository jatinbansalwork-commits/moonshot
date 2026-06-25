"use client";

import { useEffect, useState } from "react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppHeaderRow } from "@/components/AppHeaderRow";
import { AssetMetricsGrid } from "@/components/AssetMetricsGrid";
import { KalashActionSheet } from "@/components/KalashActionSheet";
import { StoryViewOverlay } from "@/components/StoryViewOverlay";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { PromoBanner } from "@/components/PromoBanner";
import { PromoStrip } from "@/components/PromoStrip";
import { SaveMoreButton } from "@/components/SaveMoreButton";
import { TotalSavingHero } from "@/components/TotalSavingHero";
import { ViewContainer } from "@/components/ViewContainer";

const ACTION_SHEET_DELAY_MS = 1000;

interface KalashAppScreenProps {
  initialStoryOpen?: boolean;
  initialStoryIndex?: number;
  storyAutoAdvance?: boolean;
  disableActionSheet?: boolean;
}

/** Screen 3 — Kalash app home (main build target). */
export function KalashAppScreen({
  initialStoryOpen = false,
  initialStoryIndex = 0,
  storyAutoAdvance = true,
  disableActionSheet = false,
}: KalashAppScreenProps = {}) {
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(initialStoryOpen);

  const openStory = () => {
    setActionSheetOpen(false);
    setStoryOpen(true);
  };

  useEffect(() => {
    if (disableActionSheet) return;

    const timer = window.setTimeout(() => {
      setActionSheetOpen(true);
    }, ACTION_SHEET_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [disableActionSheet]);

  return (
    <div className="relative h-full min-h-0 w-full">
      <ViewContainer
        header={
          <>
            <AppHeaderRow onAvatarClick={openStory} />
            <PromoStrip />
          </>
        }
        bottomNav={<AppBottomNav />}
      >
        <TotalSavingHero />
        <AssetMetricsGrid />
        <MarqueeTicker />
        <SaveMoreButton />
        <PromoBanner onBannerClick={openStory} />
      </ViewContainer>

      <StoryViewOverlay
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        initialStoryIndex={initialStoryIndex}
        autoAdvance={storyAutoAdvance}
      />

      <KalashActionSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
      />
    </div>
  );
}
