"use client";

import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { SLIDE_22_SCREEN_CONFIG } from "@/lib/slide-screens/slide-22-config";

/**
 * Slide 22 — conference grid.
 * Edit this file or `slide-22-config.ts` to change slide 22 only.
 */
export function Slide22Screen() {
  return <SlideDashboardScreen config={SLIDE_22_SCREEN_CONFIG} />;
}
