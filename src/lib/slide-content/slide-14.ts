import type { SlideDefinition } from "@/types/slide-content";

export const slide14: SlideDefinition = {
  id: "slide-14",
  label: "Customer Feedback - Interview",
  backgroundColor: "#F2F0F6",
  presentation: { rhythm: "quote", sectionLabel: "Research" },
  layout: "saltmine-problem",
  problemSplit: {
    leftLabel: "Customer Feedback - Interview",
    leftLabelBelow: "Project Leader, Harshey’s",
    leftStatement:
      "How can I arrange a team day when I can't see who's in office or where they're going to sit?",
    leftStatementMaxWidth: "max-w-[54rem]",
    showRightColumn: false,
  },
  blocks: [],
};
