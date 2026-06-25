import type { SlideDefinition } from "@/types/slide-content";
import { INDEX_SLIDE_DEFAULT_TITLE } from "@/lib/index-typography";

export const slide6: SlideDefinition = {
  id: "slide-6",
  label: "Slide 6",
  backgroundColor: "#F2F0F6",
  blockGap: "gap-10",
  blocks: [
    {
      id: "slide-6-lead",
      type: "title",
      text: "Every day, hybrid workflows were slowing down because people lacked simple things — visibility, quick coordination, and easy access to help.",
      textCase: "preserve",
      fontSize: 60,
      typography: INDEX_SLIDE_DEFAULT_TITLE,
      className: "max-w-4xl !font-normal !leading-snug !text-black",
    },
  ],
};
