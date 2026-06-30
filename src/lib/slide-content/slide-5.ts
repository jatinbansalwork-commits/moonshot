import type { SlideDefinition } from "@/types/slide-content";
import { DECK_HEADLINE_HERO } from "@/lib/deck-presentation";

const SALTMINE_COVER_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/slat1.svg";

export const slide5: SlideDefinition = {
  id: "slide-5",
  label: "Saltmine-Sync",
  backgroundColor: "#F2F0F6",
  presentation: {
    rhythm: "narrative",
    sectionLabel: "Case study",
  },
  blockGap: "gap-6",
  coverImage: {
    src: SALTMINE_COVER_SRC,
    alt: "Isometric workspace campus illustration",
    fullBleedRight: true,
    heightExtra: 48,
    className:
      "h-full w-full bg-[length:auto_112%] bg-no-repeat bg-[center_right_2%]",
  },
  blocks: [
    {
      id: "slide-5-title",
      type: "title",
      text: "Saltmine-\nSync",
      as: "h1",
      textCase: "preserve",
      fontSize: 92,
      className: `${DECK_HEADLINE_HERO} !font-bold !leading-[0.92] !tracking-[-0.045em]`,
      reveal: true,
    },
    {
      id: "slide-5-detail",
      type: "body",
      text: "Saltmine is a B2B SaaS company helping organisations manage their workspaces efficiently.",
      textCase: "preserve",
      fontSize: 19,
      className: "m-0 max-w-[21rem] !leading-[1.62] font-normal text-black/56",
      reveal: true,
      revealDelay: 0.06,
    },
    {
      id: "slide-5-services",
      type: "body",
      text: "UX Research · Design Systems · UX / UI for Desktop + Mobile",
      textCase: "preserve",
      fontSize: 11,
      className: "m-0 pt-2 uppercase tracking-[0.16em] text-black/40",
      reveal: true,
      revealDelay: 0.1,
    },
  ],
};
