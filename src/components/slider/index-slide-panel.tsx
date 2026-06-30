"use client";

import { IndexSlideBlock } from "@/components/slider/index-slide-block";
import { IndexSlideLayout } from "@/components/slider/index-slide-layout";
import { ManifestStintsLayout } from "@/components/slider/manifest-stints-layout";
import { SaltmineBentoSlideLayout } from "@/components/slider/saltmine-bento-slide-layout";
import { SaltmineExampleSlideLayout } from "@/components/slider/saltmine-example-slide-layout";
import { SaltmineProblemSlideLayout } from "@/components/slider/saltmine-problem-slide-layout";
import { SaltmineSyncSlideLayout } from "@/components/slider/saltmine-sync-slide-layout";
import { HorizontalSplitSlideLayout } from "@/components/slider/horizontal-split-slide-layout";
import { VerticalSplitSlideLayout } from "@/components/slider/vertical-split-slide-layout";
import { FrameShell } from "@/components/slider/frame-shell";
import type { Frame } from "@/types";
import type { SlideDefinition } from "@/types/slide-content";

interface IndexSlidePanelProps {
  slide: SlideDefinition;
  frame: Frame;
  index: number;
  trackHeight: number;
  onInteract: () => void;
  onGoToSlide?: (index: number) => void;
}

export function IndexSlidePanel({
  slide,
  frame,
  index,
  trackHeight,
  onInteract,
  onGoToSlide,
}: IndexSlidePanelProps) {
  return (
    <FrameShell
      frame={frame}
      index={index}
      trackHeight={trackHeight}
      onInteract={onInteract}
    >
      {slide.layout === "stints-three-column" ? (
        <ManifestStintsLayout />
      ) : slide.layout === "saltmine-sync" ? (
        <SaltmineSyncSlideLayout presentation={slide.presentation} />
      ) : slide.layout === "saltmine-bento" ? (
        <SaltmineBentoSlideLayout presentation={slide.presentation} />
      ) : slide.layout === "vertical-split" ? (
        <VerticalSplitSlideLayout split={slide.verticalSplit} />
      ) : slide.layout === "horizontal-split" ? (
        <HorizontalSplitSlideLayout split={slide.horizontalSplit} />
      ) : slide.layout === "saltmine-problem" ? (
        <SaltmineProblemSlideLayout
          content={slide.problemSplit}
          backgroundColor={slide.backgroundColor}
          presentation={slide.presentation}
        />
      ) : slide.layout === "saltmine-example" ? (
        <SaltmineExampleSlideLayout content={slide.exampleBento} />
      ) : (
        <IndexSlideLayout
          align={slide.align}
          blockGap={slide.blockGap}
          className={slide.className}
          contentClassName={slide.contentClassName}
          coverImage={slide.coverImage}
          presentation={slide.presentation}
        >
          {slide.blocks.map((block) => (
            <IndexSlideBlock
              key={block.id}
              block={block}
              align={slide.align}
              slideIndex={index}
              onGoToSlide={onGoToSlide}
            />
          ))}
        </IndexSlideLayout>
      )}
    </FrameShell>
  );
}
