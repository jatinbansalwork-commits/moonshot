"use client";

import { SaltmineMobileClippedDashboard } from "@/components/slider/saltmine-mobile-clipped-dashboard";
import { SaltmineMobileFindSpaceView } from "@/components/slider/saltmine-mobile-find-space-view";
import { SaltmineMobileTeamsView } from "@/components/slider/saltmine-mobile-teams-view";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import { DECK_FILTER_DEFAULTS } from "@/lib/saltmine-deck-bookings-data";

function useSharedFilterDefaults() {
  const { filterValues } = useSaltmineMobileApp();
  return { ...DECK_FILTER_DEFAULTS, ...filterValues };
}

export { SaltmineMobileFindSpaceView };

export function SaltmineMobileFindView({
  showToast,
}: {
  showToast: (message: string) => void;
}) {
  return <SaltmineMobileFindSpaceView showToast={showToast} />;
}

export { SaltmineMobileTeamsView };

export function SaltmineMobileBookingGridView({ displayName }: { displayName: string }) {
  const initialFilterValues = useSharedFilterDefaults();

  return (
    <SaltmineMobileClippedDashboard
      displayName={displayName}
      variant="deck"
      initialActiveNav="booking-grid"
      initialFilterValues={initialFilterValues}
    />
  );
}

export function SaltmineMobileConferenceGridView({ displayName }: { displayName: string }) {
  const initialFilterValues = useSharedFilterDefaults();

  return (
    <SaltmineMobileClippedDashboard
      displayName={displayName}
      variant="deck"
      initialActiveNav="conference-grid"
      initialFilterValues={initialFilterValues}
    />
  );
}
