import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideHelpScreenConfig } from "@/lib/slide-screens/types";

/** Slide 25 (mobile app) — edit props here without affecting other slides. */
export const SLIDE_25_MOBILE_SCREEN_CONFIG = {
  displayName: SALTMINE_DEMO_USER.name,
  showOnboarding: true,
} satisfies SlideHelpScreenConfig & {
  showOnboarding: boolean;
};
