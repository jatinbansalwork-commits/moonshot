import { DECK_FILTER_DEFAULTS } from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Slide 18 — edit props here without affecting other slides. */
export const SLIDE_18_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  variant: "deck",
  initialActiveNav: "bookings",
  initialFilterValues: { ...DECK_FILTER_DEFAULTS },
  /** Non-interactive nav items for this slide mockup. */
  disabledNavIds: ["booking-grid", "conference-grid", "help"],
} satisfies SlideDashboardScreenConfig;
