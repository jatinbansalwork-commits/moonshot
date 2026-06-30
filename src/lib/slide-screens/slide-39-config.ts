import { DECK_FILTER_DEFAULTS } from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import { SLIDE_39_TIMELINE_DAYS } from "@/lib/slide-screens/slide-39-last-minute-data";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Slide 39 — last-minute lane on My bookings (waitlist + alternatives, not checked in). */
export const SLIDE_39_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  variant: "deck",
  initialActiveNav: "bookings",
  initialFilterValues: { ...DECK_FILTER_DEFAULTS },
  deckTimelineDays: SLIDE_39_TIMELINE_DAYS,
  disabledNavIds: [
    "find-space",
    "inbox",
    "teams",
    "booking-grid",
    "conference-grid",
    "help",
  ],
} satisfies SlideDashboardScreenConfig;
