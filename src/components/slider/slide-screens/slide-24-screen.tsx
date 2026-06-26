"use client";

import { SaltmineHelpSupportSlideEmbed } from "@/components/slider/saltmine-help-support-slide-embed";
import { SLIDE_24_SCREEN_CONFIG } from "@/lib/slide-screens/slide-24-config";

/**
 * Slide 24 — help & support centre.
 * Edit this file or `slide-24-config.ts` to change slide 24 only.
 */
export function Slide24Screen() {
  return (
    <SaltmineHelpSupportSlideEmbed displayName={SLIDE_24_SCREEN_CONFIG.displayName} />
  );
}
