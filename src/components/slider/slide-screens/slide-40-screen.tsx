"use client";

import { FuturePlanDeckScreen } from "@/components/slider/slide-screens/future-plan/future-plan-deck-screen";
import { Slide40SafetyDialogFlow } from "@/components/slider/slide-screens/slide-40-safety-dialog-flow";
import { FUTURE_PLAN_DECK_BASE_CONFIG } from "@/lib/slide-screens/future-plan-deck-base-config";
import {
  SLIDE_40_TIMELINE_DAYS,
  timelineAfterEarlyRelease,
  timelineAfterLateExtension,
  timelineAfterSafetyCheckIn,
} from "@/lib/slide-screens/slide-40-safety-data";

/** Slide 40 — safety booking on My bookings with centred dialog. */
export function Slide40Screen() {
  return (
    <FuturePlanDeckScreen
      baseConfig={FUTURE_PLAN_DECK_BASE_CONFIG}
      initialTimeline={SLIDE_40_TIMELINE_DAYS}
      initialDialogOpen
      dialogLabel="Safety booking"
      renderDialog={(api) => (
        <Slide40SafetyDialogFlow
          onClose={api.close}
          onCheckIn={() => api.setTimeline((d) => timelineAfterSafetyCheckIn(d))}
          onReleaseEarly={() => api.setTimeline((d) => timelineAfterEarlyRelease(d))}
          onLateTime={(newTime) => api.setTimeline((d) => timelineAfterLateExtension(d, newTime))}
        />
      )}
      onDeckBookingAction={(label, id, api) => {
        if (label === "Check in" && id === "desk-safety") api.open();
      }}
    />
  );
}
