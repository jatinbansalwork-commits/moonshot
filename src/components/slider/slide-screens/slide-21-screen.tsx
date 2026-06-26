"use client";

import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { SLIDE_21_SCREEN_CONFIG } from "@/lib/slide-screens/slide-21-config";

/**
 * Slide 21 — booking grid.
 * Edit this file or `slide-21-config.ts` to change slide 21 only.
 */
export function Slide21Screen() {
  return <SlideDashboardScreen config={SLIDE_21_SCREEN_CONFIG} />;
}
