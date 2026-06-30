import type { ComponentProps } from "react";
import type { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";

type BookingsDashboardProps = ComponentProps<typeof SaltmineBookingsDashboard>;

/** Props passed from a slide screen into `SaltmineBookingsDashboard`. */
export type SlideDashboardScreenConfig = Pick<
  BookingsDashboardProps,
  | "displayName"
  | "variant"
  | "initialActiveNav"
  | "initialViewMode"
  | "showInboxNotificationPopup"
  | "initialAddedBookings"
  | "initialFilterValues"
  | "disabledNavIds"
  | "deckCustomMainContent"
  | "deckCustomOverlay"
  | "deckCustomOverlayLabel"
  | "deckCustomOverlayPlacement"
  | "deckCustomHeaderTitle"
  | "deckTimelineDays"
  | "deckCustomOverlayOnClose"
  | "onLastMinuteAlternative"
  | "onLastMinuteWaitlist"
  | "onDeckBookingAction"
>;

export type SlideHelpScreenConfig = {
  displayName: string;
};
