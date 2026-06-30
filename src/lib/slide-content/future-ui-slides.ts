import type { SlideDefinition, SlideScopedEmbedVariant } from "@/types/slide-content";
import { FUTURE_PLAN_FLOWS } from "@/lib/future-plan-flow-content";
import {
  buildClassicFeatureSlideBlocks,
  DECK_CLASSIC_FEATURE_SLIDE_SHELL,
} from "@/lib/deck-product-slide-shell";

const FLOW_UI_META: {
  slideId: string;
  flowId: keyof typeof FUTURE_PLAN_FLOWS;
  label: string;
  variant: SlideScopedEmbedVariant;
  alt: string;
}[] = [
  {
    slideId: "slide-39",
    flowId: "last-minute",
    label: "Last-minute plan — UI",
    variant: "slide-39",
    alt: "Last-minute plan — see what is left, join a waitlist, confirm your day",
  },
  {
    slideId: "slide-40",
    flowId: "safety-booking",
    label: "No-show bookings — UI",
    variant: "slide-40",
    alt: "Safety booking check-in journey for desk and linked cab with reliability profile",
  },
  {
    slideId: "slide-41",
    flowId: "cab-booking",
    label: "Move in Sync — UI",
    variant: "slide-41",
    alt: "Book desk and Move office cab pickup in one confirmation",
  },
  {
    slideId: "slide-44",
    flowId: "commute",
    label: "Commute-aware planning — UI",
    variant: "slide-44",
    alt: "Commute sync journey comparing office and remote with travel detail",
  },
  {
    slideId: "slide-45",
    flowId: "waitlist",
    label: "Waitlist — UI",
    variant: "slide-45",
    alt: "Waitlist journey from join queue to desk assigned after auto-release",
  },
];

/** UI mock slides paired with future-plan concept slides 32–34 and 37–38. */
export const FUTURE_UI_SLIDES: SlideDefinition[] = FLOW_UI_META.map((meta) => {
  const flow = FUTURE_PLAN_FLOWS[meta.flowId];
  return {
    ...DECK_CLASSIC_FEATURE_SLIDE_SHELL,
    id: meta.slideId,
    label: meta.label,
    blocks: buildClassicFeatureSlideBlocks({
      id: meta.slideId,
      heading: flow.deckHeading,
      body: flow.deckBody,
      variant: meta.variant,
      alt: meta.alt,
    }),
  };
});

/** Concept slide id → UI slide definition (slides 32–34, 37–38 → 39–41, 44–45). */
export const FUTURE_UI_SLIDE_BY_CONCEPT: Record<string, SlideDefinition> = {
  "slide-32": FUTURE_UI_SLIDES[0]!,
  "slide-33": FUTURE_UI_SLIDES[1]!,
  "slide-34": FUTURE_UI_SLIDES[2]!,
  "slide-37": FUTURE_UI_SLIDES[3]!,
  "slide-38": FUTURE_UI_SLIDES[4]!,
};
