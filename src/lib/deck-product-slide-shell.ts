import type { SlideScopedEmbedVariant } from "@/types/slide-content";
import type { SlideDefinition } from "@/types/slide-content";
import {
  DECK_BODY_PRODUCT,
  DECK_HEADLINE_PRODUCT,
  DECK_PRODUCT_SLIDE_PRESENTATION,
} from "@/lib/deck-presentation";

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
