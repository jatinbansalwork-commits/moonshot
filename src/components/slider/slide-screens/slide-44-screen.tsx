"use client";

import { FuturePlanDeckScreen } from "@/components/slider/slide-screens/future-plan/future-plan-deck-screen";
import { Slide44CommuteDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
import { FUTURE_PLAN_DECK_BASE_CONFIG } from "@/lib/slide-screens/future-plan-deck-base-config";
import {
  SLIDE_44_DESK_ID,
  SLIDE_44_PARKING_ID,
  SLIDE_44_TIMELINE_DAYS,
} from "@/lib/slide-screens/future-plan-timeline-data";

export function Slide44Screen() {
  return (
    <FuturePlanDeckScreen
      baseConfig={FUTURE_PLAN_DECK_BASE_CONFIG}
      initialTimeline={SLIDE_44_TIMELINE_DAYS}
      initialDialogOpen
      dialogLabel="Plan your day"
      renderDialog={(api) => <Slide44CommuteDialogFlow {...api} />}
      onDeckBookingAction={(_label, id, api) => {
        if (id === SLIDE_44_DESK_ID || id === SLIDE_44_PARKING_ID) api.open();
      }}
    />
  );
}
