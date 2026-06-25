import type { SlideDefinition } from "@/types/slide-content";
import { DEFAULT_PROBLEM_SPLIT } from "@/lib/slide-content/problem-split-defaults";

export const slide10: SlideDefinition = {
  id: "slide-10",
  label: "My Approach",
  backgroundColor: "#F2F0F6",
  layout: "saltmine-problem",
  problemSplit: {
    ...DEFAULT_PROBLEM_SPLIT,
    leftLabel: "My Approach",
    leftLabelBelow:
      "It was a proof of concept to show what Saltmine could feel like if the experience was more connected.",
    leftStatement:
      "A unified feature that would make hybrid days easier to navigate.",
    rightLabel: "I focused on three things:",
    rightLabelBold: true,
    rightBullets: [
      "Give people a clear view of who's in the office and where they're sitting",
      "Reduce the friction of planning or coordinating on hybrid days",
      "Explore a direction that could strengthen Saltmine's long-term product vision",
    ],
  },
  blocks: [],
};
