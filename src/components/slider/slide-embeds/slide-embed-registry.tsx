"use client";

import type { ReactNode } from "react";
import { renderSaltmineSlideScreen } from "@/components/slider/slide-screens/render-saltmine-slide-screen";
import type { SlideScopedEmbedVariant } from "@/types/slide-content";
export const DEFAULT_SLIDE_EMBED_FRAME_CLASS =
  "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]";

/** Portrait phone frame for slide 25 mobile app (360×780). */
export const SALTMINE_MOBILE_FRAME_WIDTH = 360;
export const SALTMINE_MOBILE_FRAME_HEIGHT = 780;

/** Index-deck presentation scale for slide 25 (30% smaller than native frame). */
export const SALTMINE_MOBILE_PRESENTATION_SCALE = 0.7;

export const SALTMINE_MOBILE_PRESENTATION_FRAME_SIZE = {
  width: Math.round(SALTMINE_MOBILE_FRAME_WIDTH * SALTMINE_MOBILE_PRESENTATION_SCALE),
  height: Math.round(SALTMINE_MOBILE_FRAME_HEIGHT * SALTMINE_MOBILE_PRESENTATION_SCALE),
} as const;

export const SALTMINE_MOBILE_FRAME_STYLE = {
  width: SALTMINE_MOBILE_FRAME_WIDTH,
  height: SALTMINE_MOBILE_FRAME_HEIGHT,
} as const;

export const SALTMINE_HELP_SUPPORT_MOBILE_FRAME_CLASS =
  "mx-auto h-[780px] w-[360px] max-w-full overflow-hidden rounded-[28px] border-[5px] border-[#1C252E] bg-white shadow-[0_12px_40px_rgba(28,37,46,0.14)]";

const SLIDE_SCOPED_VARIANTS = new Set<SlideScopedEmbedVariant>([
  "slide-17",
  "slide-18",
  "slide-19",
  "slide-20-deck-day",
  "slide-20-pod-cluster",
  "slide-20-team-list",
  "slide-21",
  "slide-22",
  "slide-23",
  "slide-24",
  "slide-25-mobile",
  "slide-39",
  "slide-40",
  "slide-41",
  "slide-44",
  "slide-45",
]);

export function isSlideScopedEmbedVariant(
  variant: string | undefined,
): variant is SlideScopedEmbedVariant {
  return variant != null && SLIDE_SCOPED_VARIANTS.has(variant as SlideScopedEmbedVariant);
}

function renderSlideScopedEmbedContent(variant: SlideScopedEmbedVariant): ReactNode {
  return renderSaltmineSlideScreen(variant);
}

const FRAMED_SLIDE_VARIANTS = new Set<SlideScopedEmbedVariant>([
  "slide-17",
  "slide-18",
  "slide-19",
  "slide-21",
  "slide-22",
  "slide-23",
  "slide-24",
  "slide-25-mobile",
  "slide-39",
  "slide-40",
  "slide-41",
  "slide-44",
  "slide-45",
]);

/** Renders a slide-scoped embed — each slide 17–24 has its own component file. */
export function SlideScopedEmbed({
  variant,
  frameClassName,
  unframed = false,
}: {
  variant: SlideScopedEmbedVariant;
  frameClassName?: string;
  /** Skip the presentation frame — used when wrapped in `DeckProductStage`. */
  unframed?: boolean;
}) {
  const content = renderSlideScopedEmbedContent(variant);

  if (unframed || !FRAMED_SLIDE_VARIANTS.has(variant)) {
    return content;
  }

  const defaultFrameClass =
    variant === "slide-25-mobile"
      ? SALTMINE_HELP_SUPPORT_MOBILE_FRAME_CLASS
      : DEFAULT_SLIDE_EMBED_FRAME_CLASS;

  const frameClass = frameClassName ?? defaultFrameClass;

  if (variant === "slide-25-mobile") {
    return (
      <div
        className="mx-auto shrink-0"
        style={{
          width: SALTMINE_MOBILE_PRESENTATION_FRAME_SIZE.width,
          height: SALTMINE_MOBILE_PRESENTATION_FRAME_SIZE.height,
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: SALTMINE_MOBILE_FRAME_WIDTH,
            height: SALTMINE_MOBILE_FRAME_HEIGHT,
            transform: `scale(${SALTMINE_MOBILE_PRESENTATION_SCALE})`,
          }}
        >
          <div className={frameClass}>{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      {content}
    </div>
  );
}
