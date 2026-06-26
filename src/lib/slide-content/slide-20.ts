import type { SlideDefinition } from "@/types/slide-content";

export const slide20: SlideDefinition = {
  id: "slide-20",
  label: "Office Presence",
  layout: "horizontal-split",
  backgroundColor: "#F2F0F6",
  presentation: { rhythm: "framework", sectionLabel: "Presence" },
  horizontalSplit: {
    topColor: "#F2F0F6",
    bottomColor: "#ffffff",
    showDivider: true,
    topTitle: "Office Presence",
    topTitleFontSize: 28,
    topBody:
      "The availability of colleagues is now surfaced throughout the apps",
    topPlaceholderVariant: "slide-20-deck-day",
    topTitleBelowEmbed: "Timeline",
    topBodyBelowEmbed:
      "The timeline shows the daily presence of colleagues in the office. Click an avatar to view their schedule.",
    bottomVerticalSplit: {
      left: {
        color: "#F2F0F6",
        title: "Floor Plans",
        body: "Colleagues' bookings are clearly shown on the floor plans, giving certainty when organising team days",
        placeholder: true,
        placeholderVariant: "slide-20-pod-cluster",
      },
      right: {
        color: "#F2F0F6",
        title: "Filters",
        body: "Filters by teams or select individual colleagues",
        placeholder: true,
        placeholderVariant: "slide-20-team-list",
      },
      showDivider: true,
    },
  },
  blocks: [],
};
