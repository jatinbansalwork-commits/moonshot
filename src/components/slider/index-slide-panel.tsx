"use client";

import { IndexSlideBlock } from "@/components/slider/index-slide-block";
import { IndexSlideLayout } from "@/components/slider/index-slide-layout";
import { ManifestStintsLayout } from "@/components/slider/manifest-stints-layout";
import { KalashIphoneHomeLayout } from "@/components/slider/kalash-iphone-home-layout";
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
      ) : slide.layout === "iphone-home" ? (
        <KalashIphoneHomeLayout />
      ) : (
        <IndexSlideLayout
          align={slide.align}
          blockGap={slide.blockGap}
          className={slide.className}
        >
          {slide.blocks.map((block) => (
            <IndexSlideBlock
              key={block.id}
              block={block}
              align={slide.align}
              onGoToSlide={onGoToSlide}
            />
          ))}
        </IndexSlideLayout>
      )}
    </FrameShell>
  );
}
