import type { SlideDefinition } from "@/types/slide-content";

/** Commercial selling points — why Sync as a Saltmine add-on. */
export const slide28: SlideDefinition = {
  id: "slide-28",
  label: "Value",
  backgroundColor: "#E0EAFF",
  presentation: { rhythm: "narrative", sectionLabel: "Value" },
  layout: "saltmine-problem",
  problemSplit: {
    leftLabel: "Why add Sync?",
    leftStatement: "Saltmine plans the office. Sync is where people book and show up.",
    leftLabelBelow:
      "A simple layer for employees — not another desk app or a chat tool.",
    leftStatementMaxWidth: "max-w-lg",
    rightLabel: "Why customers buy it:",
    rightLabelBold: true,
    rightBullets: [
      "Plan the space, people book it, facilities see what really happened",
      "One supplier for the building and the daily hybrid routine",
      "My bookings answers “who is in?” and “what is left?” on one screen",
      "Room to grow — same-day booking, fair rules, and commute help on the roadmap",
    ],
  },
  blocks: [],
};
