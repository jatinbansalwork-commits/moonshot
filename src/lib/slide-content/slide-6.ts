import type { SlideDefinition } from "@/types/slide-content";
import { DECK_STATEMENT } from "@/lib/deck-presentation";
import { INDEX_SLIDE_DEFAULT_TITLE } from "@/lib/index-typography";

export const slide6: SlideDefinition = {
  id: "slide-6",
  label: "Slide 6",
  backgroundColor: "#F2F0F6",
  presentation: {
    rhythm: "statement",
    sectionLabel: "Context",
  },
  align: "center",
  blockGap: "gap-10",
  blocks: [
    {
      id: "slide-6-lead",
      type: "title",
      text: "Every day, hybrid workflows were slowing down because people lacked simple things — visibility, quick coordination, and easy access to help.",
      textCase: "preserve",
      fontSize: 52,
      typography: INDEX_SLIDE_DEFAULT_TITLE,
      className: `${DECK_STATEMENT} !font-normal`,
    },
  ],
};
