"use client";

import { FuturePlanDeckScreen } from "@/components/slider/slide-screens/future-plan/future-plan-deck-screen";
import { Slide41CabDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
import { FUTURE_PLAN_DECK_BASE_CONFIG } from "@/lib/slide-screens/future-plan-deck-base-config";
import { SLIDE_41_TIMELINE_DAYS } from "@/lib/slide-screens/future-plan-timeline-data";

export function Slide41Screen() {
  return (
    <FuturePlanDeckScreen
      baseConfig={FUTURE_PLAN_DECK_BASE_CONFIG}
      initialTimeline={SLIDE_41_TIMELINE_DAYS}
      initialDialogOpen
      dialogLabel="Add Move"
      renderDialog={(api) => <Slide41CabDialogFlow {...api} />}
      onDeckBookingAction={(label, id, api) => {
        if (label === "Check in" && id === "desk-cab") api.open();
      }}
    />
  );
}
