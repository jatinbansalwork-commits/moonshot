import {
  FRAME_STRIDE,
  FRAME_WIDTH,
  SCROLL_PER_FRAME,
} from "@/lib/constants";
import { aboutSlide } from "@/lib/slide-content/about";
import { extraSlides } from "@/lib/slide-content/extra-slides";
import { FUTURE_PLAN_SLIDES } from "@/lib/slide-content/future-slides";
import { heroSlide } from "@/lib/slide-content/hero";
import { manifestSlide } from "@/lib/slide-content/manifest";
import { preIndexSlide } from "@/lib/slide-content/pre-index";
import type { SlideDefinition } from "@/types/slide-content";

/**
 * Index slider content — one entry per slide.
 * Add blocks to any slide; each block renders as a separate element.
 * For large decks, split slides into files under `slide-content/`.
 */
export const SLIDES: SlideDefinition[] = [
  heroSlide,
  aboutSlide,
  preIndexSlide,
  manifestSlide,
  ...extraSlides,
  ...FUTURE_PLAN_SLIDES,
];

export const FRAMES = SLIDES.map((slide, index) => ({
  id: slide.id,
  label: slide.label,
  variant: index === 0 ? ("main" as const) : ("default" as const),
  backgroundColor: slide.backgroundColor,
  frameSize: slide.frameSize,
}));

/** Total slides on the index page — derived from `SLIDES`. */
export const SLIDE_COUNT = SLIDES.length;

/** Scroll distance from first to last slide. */
export const SCROLL_RANGE = (SLIDE_COUNT - 1) * SCROLL_PER_FRAME;

/** Full horizontal track width for all frames. */
export const TRACK_WIDTH = FRAME_WIDTH + (SLIDE_COUNT - 1) * FRAME_STRIDE;

export function getSlideById(id: string): SlideDefinition | undefined {
  return SLIDES.find((slide) => slide.id === id);
}

/** Zero-based deck index for dock links and deep navigation. */
export function getSlideDeckIndex(slideId: string): number | undefined {
  const index = SLIDES.findIndex((slide) => slide.id === slideId);
  return index === -1 ? undefined : index;
}
