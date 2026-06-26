import type { SlideDefinition } from "@/types/slide-content";

export const slide15: SlideDefinition = {
  id: "slide-15",
  label: "Role-Play Exercise",
  backgroundColor: "#F2F0F6",
  presentation: { rhythm: "quote", sectionLabel: "Validation" },
  layout: "saltmine-problem",
  problemSplit: {
    leftLabel: "Role-Play Exercise",
    leftLabelBelow:
      "I ran a small role-play inside the office. Nothing formal — just a quick simulation of a normal hybrid day.",
    leftStatement:
      "Try planning a team catch-up without using any tool or device… go!",
    leftStatementMaxWidth: "max-w-[54rem]",
    showRightColumn: false,
  },
  blocks: [],
};
