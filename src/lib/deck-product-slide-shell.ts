import type { SlideScopedEmbedVariant } from "@/types/slide-content";
import type { SlideDefinition } from "@/types/slide-content";
import { DEFAULT_SLIDE_EMBED_FRAME_CLASS } from "@/components/slider/slide-embeds/slide-embed-registry";
import {
  DECK_BODY_PRODUCT,
  DECK_HEADLINE_PRODUCT,
  DECK_PRODUCT_SLIDE_PRESENTATION,
} from "@/lib/deck-presentation";

/** Matches slides 17–23 — title, body, and framed product embed. */
export const DECK_CLASSIC_FEATURE_SLIDE_SHELL: Pick<
  SlideDefinition,
  "align" | "blockGap" | "className" | "backgroundColor"
> = {
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-start justify-center pt-10",
};

export function buildClassicFeatureSlideBlocks({
  id,
  heading,
  body,
  variant,
  alt,
}: {
  id: string;
  heading: string;
  body: string;
  variant: SlideScopedEmbedVariant;
  alt: string;
}) {
  return [
    {
      id: `${id}-heading`,
      type: "title" as const,
      text: heading,
      textCase: "preserve" as const,
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: `${id}-body`,
      type: "body" as const,
      text: body,
      textCase: "preserve" as const,
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: `${id}-media`,
      type: "image" as const,
      placeholder: true,
      placeholderVariant: variant,
      alt,
      align: "center" as const,
      className: DEFAULT_SLIDE_EMBED_FRAME_CLASS,
    },
  ];
}

export function buildProductSlideBlocks({
  id,
  heading,
  body,
  variant,
  alt,
}: {
  id: string;
  heading: string;
  body: string;
  variant: SlideScopedEmbedVariant;
  alt: string;
}) {
  return [
    {
      id: `${id}-heading`,
      type: "title" as const,
      text: heading,
      textCase: "preserve" as const,
      className: DECK_HEADLINE_PRODUCT,
    },
    {
      id: `${id}-body`,
      type: "body" as const,
      text: body,
      textCase: "preserve" as const,
      className: DECK_BODY_PRODUCT,
    },
    {
      id: `${id}-media`,
      type: "image" as const,
      placeholder: true,
      placeholderVariant: variant,
      alt,
      align: "center" as const,
      wrapperClassName: "mt-auto w-full max-w-5xl",
    },
  ];
}

export const DECK_PRODUCT_SLIDE_SHELL: Pick<
  SlideDefinition,
  "align" | "blockGap" | "className" | "contentClassName" | "presentation" | "backgroundColor"
> = {
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-3",
  presentation: DECK_PRODUCT_SLIDE_PRESENTATION,
};
