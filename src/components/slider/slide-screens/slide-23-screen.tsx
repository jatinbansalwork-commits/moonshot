"use client";

import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { SLIDE_23_SCREEN_CONFIG } from "@/lib/slide-screens/slide-23-config";

/**
 * Slide 23 — inbox notifications.
 * Edit this file or `slide-23-config.ts` to change slide 23 only.
 */
export function Slide23Screen() {
  return <SlideDashboardScreen config={SLIDE_23_SCREEN_CONFIG} />;
}
