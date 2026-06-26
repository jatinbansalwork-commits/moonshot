"use client";

import { SaltmineMobileApp } from "@/components/slider/saltmine-mobile-app";
import { SLIDE_25_MOBILE_SCREEN_CONFIG } from "@/lib/slide-screens/slide-25-mobile-config";

/**
 * Slide 25 — full Saltmine mobile app (mirrors slides 17–24 flow).
 * Edit this file or `slide-25-mobile-config.ts` to change slide 25 only.
 */
export function Slide25MobileScreen() {
  return (
    <SaltmineMobileApp
      displayName={SLIDE_25_MOBILE_SCREEN_CONFIG.displayName}
      initialTab={SLIDE_25_MOBILE_SCREEN_CONFIG.initialTab}
      showOnboarding={SLIDE_25_MOBILE_SCREEN_CONFIG.showOnboarding}
      showInboxNotificationPopup={SLIDE_25_MOBILE_SCREEN_CONFIG.showInboxNotificationPopup}
    />
  );
}
