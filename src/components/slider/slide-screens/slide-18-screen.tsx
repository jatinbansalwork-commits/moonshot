"use client";

import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { SLIDE_18_SCREEN_CONFIG } from "@/lib/slide-screens/slide-18-config";

/**
 * Slide 18 — My bookings start screen.
 * Edit this file or `slide-18-config.ts` to change slide 18 only.
 */
export function Slide18Screen() {
  return <SlideDashboardScreen config={SLIDE_18_SCREEN_CONFIG} />;
}
