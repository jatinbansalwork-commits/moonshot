import type { SlideDefinition } from "@/types/slide-content";
import { slide5 } from "@/lib/slide-content/slide-5";
import { slide8 } from "@/lib/slide-content/slide-8";

const EXTRA_SLIDE_BACKGROUNDS = ["#ffffff", "#F6FE03", "#F6FE03"] as const;

export const extraSlides: SlideDefinition[] = [
  slide5,
  ...Array.from({ length: 8 }, (_, index) => {
    const slideNumber = index + 6;

    if (slideNumber === 8) {
      return slide8;
    }

    return {
      id: `slide-${slideNumber}`,
      label: `Slide ${slideNumber}`,
      backgroundColor:
        slideNumber === 6 || slideNumber === 7
          ? "#ffffff"
          : EXTRA_SLIDE_BACKGROUNDS[(index + 1) % EXTRA_SLIDE_BACKGROUNDS.length],
      blocks: [
        {
          id: `slide-${slideNumber}-title`,
          type: "title" as const,
          text: `Slide ${slideNumber}`,
        },
      ],
    };
  }),
];
