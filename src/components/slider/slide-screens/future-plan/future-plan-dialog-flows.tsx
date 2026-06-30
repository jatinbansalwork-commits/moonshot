"use client";

import { useState } from "react";
import type { FuturePlanDialogApi } from "@/components/slider/slide-screens/future-plan/future-plan-deck-screen";
import {
  FuturePlanDialogActions,
  FuturePlanDialogHeader,
  FuturePlanMetricGrid,
  FuturePlanSuccess,
  FP_TEXT_MICRO,
} from "@/components/slider/slide-screens/future-plan/future-plan-dialog-kit";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";
import {
  timelineAfterCabAdded,
  timelineAfterDeskReleased,
  timelineAfterRecurringSaved,
  timelineAfterRemoteAm,
  timelineAfterKeepCommuteDesk,
  timelineAfterWaitlistAccepted,
} from "@/lib/slide-screens/future-plan-timeline-data";

type Phase = "main" | "confirm" | "success";

function usePhase(initial: Phase = "main") {
  return useState<Phase>(initial);
}

/** Slide 41 — add Move office cab to desk trip. */
export function Slide41CabDialogFlow({ close, setTimeline }: FuturePlanDialogApi) {
  const [phase, setPhase] = usePhase();

  if (phase === "success") {
    return (
      <FuturePlanSuccess
        title="Trip complete"
        body="Desk and Move pickup are linked — one cancellation path."
        onClose={close}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Add booking"
        title="Add Move to your trip"
        body={
          <>
            Your desk is set. Suggested Move pickup <strong>08:15</strong> gets you to Pod B on
            time.
          </>
        }
      />
      <FuturePlanMetricGrid
        metrics={[
          { label: "Pickup", value: "08:15", tone: "brand" },
          { label: "ETA office", value: "09:05", tone: "success" },
          { label: "Fleet", value: "Move", tone: "success" },
        ]}
      />
      <p className={`m-0 mb-3 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Move links to <strong style={{ color: SALTMINE.text }}>Desk 4B</strong> — cancel once to
        drop the whole trip.
      </p>
      <FuturePlanDialogActions
        primaryLabel="Confirm Move & trip"
        onPrimary={() => {
          setTimeline((d) => timelineAfterCabAdded(d));
          setPhase("success");
        }}
        ghostLabel="Not today"
        onGhost={close}
      />
    </div>
  );
}

/** Slide 42 — calendar went remote → ask to release or keep desk. */
export function Slide42IntentDialogFlow({ close, setTimeline }: FuturePlanDialogApi) {
  const [phase, setPhase] = usePhase();

  if (phase === "confirm") {
    return (
      <div className="flex flex-col">
        <FuturePlanDialogHeader
          label="Release desk"
          title="Release Desk 4B?"
          body="Someone on the waitlist can use it. You earn +1 priority for an honest release."
        />
        <FuturePlanDialogActions
          primaryLabel="Confirm release"
          onPrimary={() => {
            setTimeline((d) => timelineAfterDeskReleased(d));
            setPhase("success");
          }}
          ghostLabel="Back"
          onGhost={() => setPhase("main")}
        />
      </div>
    );
  }

  if (phase === "success") {
    return (
      <FuturePlanSuccess
        title="Desk released"
        body="Desk 4B is back in the pool — a colleague on the waitlist has been offered it."
        onClose={close}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Desk check"
        title="Still coming in?"
        body={
          <>
            Your <strong>10:00 stand-up</strong> moved to <strong>remote</strong>, so we no longer
            assume you need a desk all day.
          </>
        }
      />
      <p className={`m-0 mb-3 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Desk 4B is on a <strong style={{ color: SALTMINE.text }}>tentative hold</strong> — it
        auto-releases in <strong style={{ color: SALTMINE.text }}>3h 20m</strong> unless you keep
        it.
      </p>
      <FuturePlanDialogActions
        primaryLabel="Release desk"
        onPrimary={() => setPhase("confirm")}
        secondaryLabel="I'm still coming in"
        onSecondary={close}
      />
    </div>
  );
}

/** Slide 43 — repeat weekly pattern. */
export function Slide43RecurringDialogFlow({ close, setTimeline }: FuturePlanDialogApi) {
  const [phase, setPhase] = usePhase();
  const [days, setDays] = useState({ tue: true, thu: true });

  if (phase === "success") {
    return (
      <FuturePlanSuccess
        title="Series saved"
        body="Desk 4B every Tue and Thu until 31 Aug — bank holidays and OOO skipped automatically."
        onClose={close}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Repeat booking"
        title="Set your weekly rhythm"
        body="Pick the days you usually come in. Parking can link to the same pattern."
      />
      <FuturePlanMetricGrid
        metrics={[
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Skip holidays", value: "On", tone: "success" },
          { label: "Ends", value: "31 Aug", tone: "neutral" },
        ]}
      />
      <div className="mb-3" role="group" aria-label="Repeat on">
        <p className={`m-0 mb-1 font-bold ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          Repeat on
        </p>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ["tue", "Tue"],
              ["thu", "Thu"],
            ] as const
          ).map(([key, label]) => {
            const on = days[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setDays((c) => ({ ...c, [key]: !c[key] }))}
                className={`rounded-full border px-2 py-0.5 font-semibold ${FP_TEXT_MICRO}`}
                style={{
                  borderColor: on ? SALTMINE.primary : "rgba(145, 158, 171, 0.2)",
                  backgroundColor: on ? "rgba(0, 111, 236, 0.1)" : "#fff",
                  color: on ? SALTMINE.primary : SALTMINE.textMuted,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <FuturePlanDialogActions
        primaryLabel="Save series"
        onPrimary={() => {
          setTimeline((d) => timelineAfterRecurringSaved(d));
          setPhase("success");
        }}
        ghostLabel="Cancel"
        onGhost={close}
      />
    </div>
  );
}

/** Slide 44 — commute-aware day plan. */
export function Slide44CommuteDialogFlow({ close, setTimeline }: FuturePlanDialogApi) {
  const [phase, setPhase] = usePhase();

  if (phase === "success") {
    return (
      <FuturePlanSuccess
        title="Remote morning set"
        body="On time for 09:30 — Desk 21.P3.2 and Car Park B2.113 released for colleagues. We will suggest office again if your afternoon clears."
        onClose={close}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Plan your day"
        title="Should you come in?"
        body={
          <>
            You are booked for today — live traffic and a dense morning calendar mean office arrival
            lands after your first meeting.
          </>
        }
      />
      <FuturePlanMetricGrid
        metrics={[
          { label: "Commute", value: "75 min", tone: "warning" },
          { label: "Office ETA", value: "10:15", tone: "danger" },
          { label: "Remote", value: "On time", tone: "success" },
        ]}
      />
      <p className={`m-0 mb-3 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Working remote this morning releases{" "}
        <strong style={{ color: SALTMINE.text }}>Desk 21.P3.2</strong> and{" "}
        <strong style={{ color: SALTMINE.text }}>Car Park B2.113</strong> for colleagues. Choose
        office only if you are still planning to travel.
      </p>
      <FuturePlanDialogActions
        primaryLabel="Work remote this morning"
        onPrimary={() => {
          setTimeline((d) => timelineAfterRemoteAm(d));
          setPhase("success");
        }}
        secondaryLabel="Keep my desk — I'm coming"
        onSecondary={() => {
          setTimeline((d) => timelineAfterKeepCommuteDesk(d));
          close();
        }}
      />
    </div>
  );
}

/** Waitlist queue status — last-minute lane “View details” (slide 39, slide 18 add-booking). */
export function WaitlistQueueDetailsDialogFlow({ close }: Pick<FuturePlanDialogApi, "close">) {
  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Waitlist"
        title="Your place in line"
        body={
          <>
            You are <strong>#2</strong> for Desk 4B — fair queue, not first to refresh.
          </>
        }
      />
      <FuturePlanMetricGrid
        metrics={[
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Position", value: "#2", tone: "brand" },
          { label: "Est. release", value: "09:45", tone: "warning" },
        ]}
      />
      <p className={`m-0 mb-3 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        A fallback is held while you wait — your queue position stays unchanged if you book an
        alternative.
      </p>
      <FuturePlanDialogActions primaryLabel="Got it" onPrimary={close} />
    </div>
  );
}

/** Slide 45 — waitlist offer after auto-release. */
export function Slide45WaitlistDialogFlow({ close, setTimeline }: FuturePlanDialogApi) {
  const [phase, setPhase] = usePhase();

  if (phase === "success") {
    return (
      <FuturePlanSuccess
        title="Desk 4B assigned"
        body="Accepted from the queue — fallback hot-desk in zone C released."
        onClose={close}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <FuturePlanDialogHeader
        label="Waitlist"
        title="Desk freed — your turn"
        body={
          <>
            Desk missed check-in. Auto-assign in <strong>4:58</strong> unless you decline.
          </>
        }
      />
      <FuturePlanMetricGrid
        metrics={[
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Timer", value: "4:58", tone: "warning" },
          { label: "Queue", value: "#2", tone: "neutral" },
        ]}
      />
      <p className={`m-0 mb-3 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Accepting assigns <strong style={{ color: SALTMINE.text }}>Desk 4B</strong> and releases your
        fallback in zone C.
      </p>
      <FuturePlanDialogActions
        primaryLabel="Accept desk"
        onPrimary={() => {
          setTimeline((d) => timelineAfterWaitlistAccepted(d));
          setPhase("success");
        }}
        ghostLabel="Stay on waitlist"
        onGhost={close}
      />
    </div>
  );
}
