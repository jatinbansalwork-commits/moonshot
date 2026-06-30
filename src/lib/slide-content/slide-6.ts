import type { SlideDefinition } from "@/types/slide-content";
import { DECK_STATEMENT } from "@/lib/deck-presentation";
import { INDEX_SLIDE_DEFAULT_TITLE } from "@/lib/index-typography";

export const slide6: SlideDefinition = {
  id: "slide-6",
  label: "Saltmine",
  backgroundColor: "#F2F0F6",
  presentation: {
    rhythm: "statement",
    sectionLabel: "About Saltmine",
  },
  align: "center",
  blockGap: "gap-8",
  blocks: [
    {
      id: "slide-6-body",
      type: "body",
      text: "Saltmine is a cloud-based enterprise software company that specialises in workplace performance, design, and space optimisation for corporate real estate teams.",
      textCase: "preserve",
      fontSize: 52,
      typography: INDEX_SLIDE_DEFAULT_TITLE,
      className: `${DECK_STATEMENT} !font-normal max-w-4xl !leading-[1.15]`,
    },
  ],
};
