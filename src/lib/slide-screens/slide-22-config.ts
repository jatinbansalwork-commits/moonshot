import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Slide 22 — edit props here without affecting other slides. */
export const SLIDE_22_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  variant: "deck",
  initialActiveNav: "conference-grid",
  /** Non-interactive nav items — conference grid only for this slide. */
  disabledNavIds: [
    "bookings",
    "find-space",
    "inbox",
    "teams",
    "booking-grid",
    "help",
  ],
} satisfies SlideDashboardScreenConfig;
