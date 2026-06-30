"use client";

import { useCallback, useState } from "react";
import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { Slide39AlternativeBookingFlow } from "@/components/slider/slide-screens/slide-39-alternative-booking-flow";
import { Slide39WithdrawWaitlistFlow } from "@/components/slider/slide-screens/slide-39-withdraw-waitlist-flow";
import { WaitlistQueueDetailsDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
import type {
  DeckLastMinuteAlternative,
  DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import { findSlide39Alternative } from "@/lib/slide-screens/slide-39-alternative-flow-content";
import { SLIDE_39_TIMELINE_DAYS } from "@/lib/slide-screens/slide-39-last-minute-data";
import { SLIDE_39_SCREEN_CONFIG } from "@/lib/slide-screens/slide-39-config";

type Slide39Overlay =
  | { type: "alternative"; alternative: DeckLastMinuteAlternative }
  | { type: "withdraw" }
  | { type: "waitlist-details" }
  | null;

function timelineAfterWithdraw(
  days: readonly DeckTimelineDay[],
): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;

    const bookings = day.bookings.filter((booking) => booking.id !== "desk-waitlist");
    const lastMinute = day.lastMinute
      ? (() => {
          const { waitlist: _removed, ...rest } = day.lastMinute;
          return rest;
        })()
      : undefined;

    return { ...day, bookings, lastMinute };
  });
}

/** Slide 39 — My bookings with waitlist, alternatives, and interactive flows. */
export function Slide39Screen() {
  const [timelineDays, setTimelineDays] = useState<readonly DeckTimelineDay[]>(
    SLIDE_39_TIMELINE_DAYS,
  );
  const [overlay, setOverlay] = useState<Slide39Overlay>(null);

  const closeOverlay = useCallback(() => {
    setOverlay(null);
  }, []);

  const openAlternativeFlow = useCallback((label: string) => {
    const alternative = findSlide39Alternative(label);
    if (alternative) setOverlay({ type: "alternative", alternative });
  }, []);

  const handleBookingAction = useCallback((actionLabel: string, bookingId: string) => {
    if (actionLabel === "Withdraw" && bookingId === "desk-waitlist") {
      setOverlay({ type: "withdraw" });
    }
  }, []);

  const handleWithdrawComplete = useCallback(() => {
    setTimelineDays((current) => timelineAfterWithdraw(current));
  }, []);

  const overlayContent =
    overlay?.type === "alternative" ? (
      <Slide39AlternativeBookingFlow
        alternative={overlay.alternative}
        onNavigateRoot={closeOverlay}
      />
    ) : overlay?.type === "withdraw" ? (
      <Slide39WithdrawWaitlistFlow
        onNavigateRoot={closeOverlay}
        onComplete={handleWithdrawComplete}
      />
    ) : overlay?.type === "waitlist-details" ? (
      <WaitlistQueueDetailsDialogFlow close={closeOverlay} />
    ) : undefined;

  const overlayLabel =
    overlay?.type === "alternative"
      ? `Book ${overlay.alternative.label}`
      : overlay?.type === "withdraw"
        ? "Withdraw waitlist"
        : overlay?.type === "waitlist-details"
          ? "Waitlist"
          : "Panel";

  return (
    <SlideDashboardScreen
      config={{
        ...SLIDE_39_SCREEN_CONFIG,
        deckTimelineDays: timelineDays,
        deckCustomOverlay: overlayContent,
        deckCustomOverlayLabel: overlayLabel,
        deckCustomOverlayPlacement: "center",
        deckCustomOverlayOnClose: closeOverlay,
        onLastMinuteAlternative: openAlternativeFlow,
        onLastMinuteWaitlist: () => setOverlay({ type: "waitlist-details" }),
        onDeckBookingAction: handleBookingAction,
      }}
    />
  );
}
