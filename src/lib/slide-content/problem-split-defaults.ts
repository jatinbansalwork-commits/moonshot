import type { ProblemSplitSlideContent } from "@/types/slide-content";

export const DEFAULT_PROBLEM_SPLIT: ProblemSplitSlideContent = {
  leftLabel: "The Problem",
  leftStatement:
    "Hybrid work created a small but annoying gap: people couldn't see what was going on.",
  rightLabel: "Employees didn't know:",
  rightLabelBold: true,
  rightBullets: [
    "Who was in the office that day",
    "Where teammates were sitting",
    "How to plan a quick catch-up or collaborate in person",
  ],
};
