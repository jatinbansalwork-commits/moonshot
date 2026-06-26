"use client";

import { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

/** Shared frame for dashboard-based slide screens (18–23). */
export function SlideDashboardScreen({
  config,
}: {
  config: SlideDashboardScreenConfig;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-visible bg-white">
      <SaltmineBookingsDashboard
        displayName={config.displayName}
        variant={config.variant}
        initialActiveNav={config.initialActiveNav}
        initialViewMode={config.initialViewMode}
        showInboxNotificationPopup={config.showInboxNotificationPopup}
        initialAddedBookings={config.initialAddedBookings}
        initialFilterValues={config.initialFilterValues}
        disabledNavIds={config.disabledNavIds}
      />
    </div>
  );
}
