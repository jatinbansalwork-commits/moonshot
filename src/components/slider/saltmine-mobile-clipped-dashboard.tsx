"use client";

import type { ComponentProps } from "react";
import { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";
import { SALTMINE_MOBILE_CANVAS_BG } from "@/lib/saltmine-mobile-tokens";

/** Full-width dashboard main panel for the mobile app — no desktop side rails. */
export function SaltmineMobileClippedDashboard(
  props: ComponentProps<typeof SaltmineBookingsDashboard>,
) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden" style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}>
      <SaltmineBookingsDashboard embedLayout="mobile" navigationDisabled {...props} />
    </div>
  );
}
