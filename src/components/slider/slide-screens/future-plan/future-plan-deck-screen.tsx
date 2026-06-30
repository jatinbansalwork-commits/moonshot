"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import type { DeckTimelineDay } from "@/lib/saltmine-deck-bookings-data";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

export type FuturePlanDialogApi = {
  close: () => void;
  open: () => void;
  setTimeline: React.Dispatch<React.SetStateAction<readonly DeckTimelineDay[]>>;
};

/** My bookings timeline + centred dialog — shared future-plan shell (slides 39–45). */
export function FuturePlanDeckScreen({
  baseConfig,
  initialTimeline,
  initialDialogOpen = false,
  dialogLabel,
  renderDialog,
  onDeckBookingAction,
  onLastMinuteAlternative,
}: {
  baseConfig: Omit<SlideDashboardScreenConfig, "deckTimelineDays">;
  initialTimeline: readonly DeckTimelineDay[];
  initialDialogOpen?: boolean;
  dialogLabel: string;
  renderDialog: (api: FuturePlanDialogApi) => ReactNode;
  onDeckBookingAction?: (
    actionLabel: string,
    bookingId: string,
    api: FuturePlanDialogApi,
  ) => void;
  onLastMinuteAlternative?: (label: string) => void;
}) {
  const [timelineDays, setTimelineDays] = useState(initialTimeline);
  const [dialogOpen, setDialogOpen] = useState(initialDialogOpen);

  const close = useCallback(() => setDialogOpen(false), []);
  const open = useCallback(() => setDialogOpen(true), []);
  const api: FuturePlanDialogApi = { close, open, setTimeline: setTimelineDays };

  return (
    <SlideDashboardScreen
      config={{
        ...baseConfig,
        deckTimelineDays: timelineDays,
        deckCustomOverlay: dialogOpen ? renderDialog(api) : undefined,
        deckCustomOverlayLabel: dialogLabel,
        deckCustomOverlayPlacement: "center",
        deckCustomOverlayOnClose: close,
        onDeckBookingAction: onDeckBookingAction
          ? (label, id) => onDeckBookingAction(label, id, api)
          : undefined,
        onLastMinuteAlternative,
        onLastMinuteWaitlist: open,
      }}
    />
  );
}
