"use client";

import { FuturePlanDeckScreen } from "@/components/slider/slide-screens/future-plan/future-plan-deck-screen";
import { Slide45WaitlistDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
import { FUTURE_PLAN_DECK_BASE_CONFIG } from "@/lib/slide-screens/future-plan-deck-base-config";
import { SLIDE_45_TIMELINE_DAYS } from "@/lib/slide-screens/future-plan-timeline-data";

export function Slide45Screen() {
  return (
    <FuturePlanDeckScreen
      baseConfig={FUTURE_PLAN_DECK_BASE_CONFIG}
      initialTimeline={SLIDE_45_TIMELINE_DAYS}
      initialDialogOpen
      dialogLabel="Waitlist offer"
      renderDialog={(api) => <Slide45WaitlistDialogFlow {...api} />}
      onDeckBookingAction={(label, id, api) => {
        if (id === "desk-waitlist-offer") api.open();
      }}
    />
  );
}
