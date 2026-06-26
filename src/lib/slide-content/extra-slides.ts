import type { SlideDefinition } from "@/types/slide-content";
import { slide5 } from "@/lib/slide-content/slide-5";
import { slide6 } from "@/lib/slide-content/slide-6";
import { slide7 } from "@/lib/slide-content/slide-7";
import { slide8 } from "@/lib/slide-content/slide-8";
import { slide9 } from "@/lib/slide-content/slide-9";
import { slide10 } from "@/lib/slide-content/slide-10";
import { slide11 } from "@/lib/slide-content/slide-11";
import { slide13 } from "@/lib/slide-content/slide-13";
import { slide14 } from "@/lib/slide-content/slide-14";
import { slide15 } from "@/lib/slide-content/slide-15";
import { slide16 } from "@/lib/slide-content/slide-16";
import { slide17 } from "@/lib/slide-content/slide-17";
import { slide18 } from "@/lib/slide-content/slide-18";
import { slide19 } from "@/lib/slide-content/slide-19";
import { slide20 } from "@/lib/slide-content/slide-20";

const EXTRA_SLIDE_BACKGROUNDS = ["#ffffff", "#F6FE03", "#F6FE03"] as const;

/** Deck order for slides 6+ — skips removed slide 12. */
const EXTRA_SLIDE_ORDER = [
  6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
] as const;

export const extraSlides: SlideDefinition[] = [
  slide5,
  ...EXTRA_SLIDE_ORDER.map((slideNumber, index) => {

    if (slideNumber === 6) {
      return slide6;
    }

    if (slideNumber === 7) {
      return slide7;
    }

    if (slideNumber === 8) {
      return slide8;
    }

    if (slideNumber === 9) {
      return slide9;
    }

    if (slideNumber === 10) {
      return slide10;
    }

    if (slideNumber === 11) {
      return slide11;
    }

    if (slideNumber === 13) {
      return slide13;
    }

    if (slideNumber === 14) {
      return slide14;
    }

    if (slideNumber === 15) {
      return slide15;
    }

    if (slideNumber === 16) {
      return slide16;
    }

    if (slideNumber === 18) {
      return slide18;
    }

    if (slideNumber === 17) {
      return slide17;
    }

    if (slideNumber === 19) {
      return slide19;
    }

    if (slideNumber === 20) {
      return slide20;
    }

    return {
      id: `slide-${slideNumber}`,
      label: `Slide ${slideNumber}`,
      backgroundColor:
        EXTRA_SLIDE_BACKGROUNDS[(index + 1) % EXTRA_SLIDE_BACKGROUNDS.length],
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
