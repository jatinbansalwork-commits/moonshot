import type { SlideDefinition } from "@/types/slide-content";

export const slide13: SlideDefinition = {
  id: "slide-13",
  label: "Typical Example",
  backgroundColor: "#F2F0F6",
  presentation: { rhythm: "quote", sectionLabel: "Scenario" },
  layout: "saltmine-example",
  exampleBento: {
    eyebrow: "A typical example:",
    statement:
      "Someone would come in hoping to sync with a teammate, only to discover they were working from home or sitting on another floor.",
    topQuestion: "Simple questions like “Where’s my team sitting today?”",
    bottomQuestion: "“Which space should I book?”",
    colors: {
      main: "#FFF5D6",
      topRight: "#E8EDFF",
      bottomRight: "#F3E8FF",
    },
  },
  blocks: [],
};
