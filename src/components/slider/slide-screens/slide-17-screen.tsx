"use client";

import { SaltmineSignInCard } from "@/components/slider/saltmine-sign-in-card";
import { SLIDE_17_SCREEN_CONFIG } from "@/lib/slide-screens/slide-17-config";

/**
 * Slide 17 — sign-in & onboarding.
 * Edit this file or `slide-17-config.ts` to change slide 17 only.
 */
export function Slide17Screen() {
  return (
    <SaltmineSignInCard
      disableDashboardNavigation={SLIDE_17_SCREEN_CONFIG.disableDashboardNavigation}
    />
  );
}
