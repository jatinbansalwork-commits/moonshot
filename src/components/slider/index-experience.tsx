"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollSlider } from "@/hooks/use-scroll-slider";
import {
  getGhostSpacerSize,
} from "@/hooks/use-index-scroll-reset";
import { SliderProvider } from "@/context/slider-context";
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
} from "@/lib/constants";
import { getTrackHeight } from "@/lib/frame-size";
import { FRAMES, SLIDES } from "@/lib/slide-content";
import { FloatingUtilityDock } from "@/components/slider/floating-utility-dock";
import { Minimap } from "@/components/slider/minimap";
import { IndexSlidePanel } from "@/components/slider/index-slide-panel";

function IndexCanvas() {
  const {
    springTrackX,
    springScaleValue,
    playClick,
    frameCount,
    activeFrameIndex,
    snapToIndex,
  } = useScrollSlider();
  const [ghostSize, setGhostSize] = useState(getGhostSpacerSize);
  const trackHeight = getTrackHeight(FRAMES);

  useEffect(() => {
    const updateGhostSize = () => {
      setGhostSize(getGhostSpacerSize());
    };

    updateGhostSize();
    const settleFrame = requestAnimationFrame(updateGhostSize);
    window.addEventListener("resize", updateGhostSize);
    return () => {
      cancelAnimationFrame(settleFrame);
      window.removeEventListener("resize", updateGhostSize);
    };
  }, [frameCount]);

  return (
    <>
      <main
        id="main-content"
        data-sheet="index"
        className="index-root fixed inset-0 z-10 overflow-hidden bg-background"
        style={
          {
            "--frame-width": `${FRAME_WIDTH}px`,
            "--frame-height": `${FRAME_HEIGHT}px`,
          } as React.CSSProperties
        }
      >
        <Minimap />

        <div className="scrollable-content pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
          <motion.div
            className="pointer-events-auto origin-center"
            style={{ scale: springScaleValue }}
          >
            <motion.div
              className="relative overflow-visible"
              style={{
                x: springTrackX,
                width: FRAME_WIDTH,
                height: trackHeight,
              }}
            >
              {SLIDES.map((slide, index) => {
                const frame = FRAMES[index];
                if (!frame) return null;

                return (
                  <IndexSlidePanel
                    key={slide.id}
                    slide={slide}
                    frame={frame}
                    index={index}
                    trackHeight={trackHeight}
                    onInteract={playClick}
                    onGoToSlide={(slideIndex) => snapToIndex(slideIndex, "nav")}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <div
          id="utility-dock-cluster"
          className="pointer-events-auto fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3"
        >
          {(
            [
              {
                dockId: "utility-dock-primary",
                ariaLabel: "Primary utility dock",
                navPreset: "primary" as const,
                showPrevious: true,
                showNext: false,
              },
              {
                dockId: "utility-dock-work",
                ariaLabel: "Work utility dock",
                navPreset: "full" as const,
                showPrevious: false,
                showNext: false,
              },
              {
                dockId: "utility-dock-explore",
                ariaLabel: "Explore utility dock",
                navPreset: "nav-only" as const,
                showPrevious: false,
                showNext: true,
              },
            ] as const
          ).map((dock) => (
            <FloatingUtilityDock
              key={dock.dockId}
              dockId={dock.dockId}
              ariaLabel={dock.ariaLabel}
              navPreset={dock.navPreset}
              showPrevious={dock.showPrevious}
              showNext={dock.showNext}
              onGoToSlide={(index) => snapToIndex(index, "nav")}
              onPrevious={() => {
                const nextIndex =
                  activeFrameIndex <= 0 ? frameCount - 1 : activeFrameIndex - 1;
                snapToIndex(nextIndex, "nav");
              }}
              onNext={() => {
                const nextIndex =
                  activeFrameIndex >= frameCount - 1 ? 0 : activeFrameIndex + 1;
                snapToIndex(nextIndex, "nav");
              }}
            />
          ))}
        </div>

        <p className="sr-only">
          Use arrow keys, Page Up, Page Down, Home, or End to move between slides. On touch
          devices, swipe horizontally or vertically on a slide to move between frames.
        </p>
      </main>

      <div
        aria-hidden
        className="ghost-spacer"
        suppressHydrationWarning
        style={{ width: ghostSize.width, height: ghostSize.height }}
      />
    </>
  );
}

export function IndexExperience() {
  return (
    <SliderProvider>
      <IndexCanvas />
    </SliderProvider>
  );
}
