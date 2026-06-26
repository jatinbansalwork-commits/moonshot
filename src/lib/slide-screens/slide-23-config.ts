import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Slide 23 — edit props here without affecting other slides. */
export const SLIDE_23_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  variant: "deck",
  initialActiveNav: "inbox",
  /** Non-interactive nav items — inbox only for this slide. */
  disabledNavIds: [
    "bookings",
    "find-space",
    "teams",
    "booking-grid",
    "conference-grid",
    "help",
  ],
} satisfies SlideDashboardScreenConfig;
