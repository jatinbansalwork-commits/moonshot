import type { SlideDefinition } from "@/types/slide-content";
import { SALTMINE_VISION_CARD_COPY } from "@/components/slider/saltmine-vision-card";

export const slide11: SlideDefinition = {
  id: "slide-11",
  label: "Way of working",
  presentation: { rhythm: "framework", sectionLabel: "Process" },
  layout: "vertical-split",
  verticalSplit: {
    leftColor: "#F2E2FF",
    rightColor: "#C77CFF",
    showDivider: false,
    leftText: "Way of working model",
    leftImage: {
      src: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/sync/Frame%20152.png",
      alt: "Way of working model diagram",
    },
    rightText: "User stories as prioritizations model",
    rightImage: {
      src: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/sync/Frame%20151.png",
      alt: "User stories as prioritizations model diagram",
    },
    visionCardText: SALTMINE_VISION_CARD_COPY,
  },
  blocks: [],
};
