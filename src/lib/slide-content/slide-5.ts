import type { SlideDefinition } from "@/types/slide-content";
import { INDEX_SLIDE_ABOUT_BODY_SIZE_PX } from "@/lib/index-typography";

export const slide5: SlideDefinition = {
  id: "slide-5",
  label: "Kalash Year-End Recap",
  backgroundColor: "#184546",
  className: "text-white",
  blockGap: "gap-10",
  blocks: [
    {
      id: "slide-5-lead",
      type: "body",
      text: "Kalash Year-End Recap",
      fontSize: INDEX_SLIDE_ABOUT_BODY_SIZE_PX,
      className: "index-slide-about-body !text-white",
      textCase: "preserve",
    },
    {
      id: "slide-5-detail",
      type: "title",
      text: "Turning a year of investing into a story worth revisiting.",
      as: "h6",
      fontSize: 24,
      className: "font-normal !text-white",
      textCase: "preserve",
    },
    {
      id: "slide-5-challenge",
      type: "title",
      text: "Kalash serves over 2.5 million users who invest, save, earn rewards, and build better financial habits.",
      as: "h6",
      fontSize: 24,
      className: "font-normal !text-white",
      textCase: "preserve",
    },
  ],
};
