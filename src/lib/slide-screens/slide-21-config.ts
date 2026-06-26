import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Slide 21 — edit props here without affecting other slides. */
export const SLIDE_21_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  variant: "deck",
  initialActiveNav: "booking-grid",
  /** Non-interactive nav items — booking grid only for this slide. */
  disabledNavIds: [
    "bookings",
    "find-space",
    "inbox",
    "teams",
    "conference-grid",
    "help",
  ],
} satisfies SlideDashboardScreenConfig;
