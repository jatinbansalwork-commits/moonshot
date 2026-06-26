import type { SlideDefinition } from "@/types/slide-content";
import { DECK_HEADLINE_HERO } from "@/lib/deck-presentation";
import {
  INDEX_SLIDE_ABOUT_BODY_SIZE_PX,
  INDEX_SLIDE_ABOUT_TITLE,
} from "@/lib/index-typography";

export const slide5: SlideDefinition = {
  id: "slide-5",
  label: "Kalash Year-End Recap",
  backgroundColor: "#F2F0F6",
  presentation: {
    rhythm: "hero",
    sectionLabel: "Case study",
  },
  blockGap: "gap-8",
  coverImage: {
    src: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/slat1.svg",
    alt: "Saltmine Sync cover artwork",
    fullBleedRight: true,
  },
  blocks: [
    {
      id: "slide-5-lead",
      type: "body",
      text: "Saltmine-Sync",
      fontSize: INDEX_SLIDE_ABOUT_BODY_SIZE_PX * 1.15,
      className: `${DECK_HEADLINE_HERO} !text-[82px] !leading-[1.02]`,
      textCase: "preserve",
    },
    {
      id: "slide-5-detail",
      type: "title",
      text: "Saltmine is a B2B SaaS company helping organizations manage their workspaces efficiently.",
      as: "h6",
      fontSize: 20,
      typography: INDEX_SLIDE_ABOUT_TITLE,
      className:
        "relative z-10 max-w-[32rem] !leading-[1.55] font-normal text-black/72",
      textCase: "preserve",
    },
  ],
};
