import type { SlideDefinition } from "@/types/slide-content";

export const slide12: SlideDefinition = {
  id: "slide-12",
  label: "Why Sync, not Teams alone",
  backgroundColor: "#F2F0F6",
  presentation: { rhythm: "narrative", sectionLabel: "Positioning" },
  layout: "saltmine-problem",
  problemSplit: {
    leftLabel: "Teams · Meet · Zoom",
    leftStatement: "Who is free to talk?",
    leftLabelBelow:
      "They handle chat and video — not whether there is a desk free, or where your team is sitting.",
    leftStatementMaxWidth: "max-w-lg",
    rightLabel: "Saltmine Sync links people and the office.",
    rightLabelBold: true,
    rightBullets: [
      "Book desk, room, and travel in one place — not three apps",
      "See who is in and where — not just a green dot",
      "Check in or release your desk so empty bookings do not block others",
      "Give facilities real booking data — not guesses from chat",
    ],
  },
  blocks: [],
};
