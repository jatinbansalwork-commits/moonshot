import type { SlideDefinition } from "@/types/slide-content";

export const slide20: SlideDefinition = {
  id: "slide-20",
  label: "The Monthly Calendar",
  layout: "horizontal-split",
  backgroundColor: "#F2F0F6",
  horizontalSplit: {
    topColor: "#F2F0F6",
    bottomColor: "#ffffff",
    showDivider: true,
    topTitle: "The Monthly Calendar",
    topBody:
      "Switch to monthly view for a full-grid overview of car park, desk, and meeting bookings — with recurring reservations marked at a glance",
    bottomVerticalSplit: {
      left: {
        color: "#ffffff",
        title: "Office Presence",
        body: "See who's in at a glance — teammates, their desk or meeting room, and how many from your team are in the office",
        placeholder: true,
        placeholderVariant: "dashboard",
        dashboardInitialNav: "bookings",
        dashboardInitialViewMode: "Monthly",
      },
      right: { color: "#ffffff" },
      showDivider: true,
    },
  },
  blocks: [],
};
