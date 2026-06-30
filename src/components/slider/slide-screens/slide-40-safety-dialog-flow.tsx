"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import {
  SLIDE_40_CHECK_IN_BY,
  SLIDE_40_LATE_TIME_OPTIONS,
  SLIDE_40_TIME_LEFT,
} from "@/lib/slide-screens/slide-40-safety-data";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiButton,
} from "@/components/slider/slide-screens/future-ui-primitives";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

type DialogPhase =
  | { kind: "reminder" }
  | { kind: "release-confirm" }
  | { kind: "late-time" }
  | { kind: "success"; outcome: "check-in" | "release" | "late-time"; newTime?: string };

function TimeMetrics({
  checkInBy,
  timeLeft,
  strikes,
}: {
  checkInBy: string;
  timeLeft: string;
  strikes?: string;
}) {
  const metrics = [
    { label: "Check-in by", value: checkInBy, tone: "warning" as const },
    { label: "Time left", value: timeLeft, tone: "brand" as const },
    ...(strikes ? [{ label: "Strikes", value: strikes, tone: "danger" as const }] : []),
  ];

  return (
    <div
      className="mb-2 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[8px] border px-1.5 py-1 text-center"
          style={{ borderColor: SALTMINE_HAIRLINE, backgroundColor: "#fff" }}
        >
          <p className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {metric.label}
          </p>
          <p className="m-0">
            <FutureUiBadge tone={metric.tone}>{metric.value}</FutureUiBadge>
          </p>
        </div>
      ))}
    </div>
  );
}

/** Simplified safety-booking dialog for slide 40 — reminder, policy, confirmations. */
export function Slide40SafetyDialogFlow({
  onClose,
  onCheckIn,
  onReleaseEarly,
  onLateTime,
}: {
  onClose: () => void;
  onCheckIn?: () => void;
  onReleaseEarly?: () => void;
  onLateTime?: (newCheckInBy: string) => void;
}) {
  const [phase, setPhase] = useState<DialogPhase>({ kind: "reminder" });
  const [checkInBy, setCheckInBy] = useState(SLIDE_40_CHECK_IN_BY);
  const [timeLeft, setTimeLeft] = useState(SLIDE_40_TIME_LEFT);
  const [selectedLateTime, setSelectedLateTime] = useState<string>(SLIDE_40_LATE_TIME_OPTIONS[1]);

  if (phase.kind === "success") {
    if (phase.outcome === "late-time") {
      return (
        <div className="flex flex-col items-center py-1 text-center">
          <CheckCircle2 className="mb-2 h-8 w-8" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
          <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            Arrival updated
          </p>
          <p className={`m-0 mb-3 max-w-[280px] ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            New check-in window: <strong>{phase.newTime}</strong>. Desk held — no strike while you
            update in time.
          </p>
          <FutureUiButton variant="primary" className="w-full" onClick={onClose}>
            Back to My bookings
          </FutureUiButton>
        </div>
      );
    }

    const isCheckIn = phase.outcome === "check-in";
    return (
      <div className="flex flex-col items-center py-1 text-center">
        <CheckCircle2 className="mb-2 h-8 w-8" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
        <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
          {isCheckIn ? "Desk 4B secured" : "Desk released"}
        </p>
        <p className={`m-0 mb-3 max-w-[280px] ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          {isCheckIn
            ? "Checked in until 18:00. Auto-release is off."
            : "Desk 4B is back in the pool. Early release recorded — no strike added."}
        </p>
        <FutureUiButton variant="primary" className="w-full" onClick={onClose}>
          Back to My bookings
        </FutureUiButton>
      </div>
    );
  }

  if (phase.kind === "late-time") {
    return (
      <div className="flex flex-col">
        <p
          className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          Running late
        </p>
        <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
          Update your arrival time
        </h2>
        <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          One extension per day — desk stays held if you check in by the new time.
        </p>

        <TimeMetrics checkInBy={checkInBy} timeLeft={timeLeft} />

        <fieldset className="m-0 mb-3 border-0 p-0">
          <legend className={`mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            New check-in time
          </legend>
          <div className="flex flex-wrap gap-1">
            {SLIDE_40_LATE_TIME_OPTIONS.map((time) => {
              const selected = selectedLateTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedLateTime(time)}
                  className={`rounded-full border px-2 py-0.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
                  style={{
                    borderColor: selected ? SALTMINE.primary : SALTMINE_HAIRLINE,
                    backgroundColor: selected ? "rgba(0, 111, 236, 0.1)" : "#fff",
                    color: selected ? SALTMINE.primary : SALTMINE.textMuted,
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <FutureUiButton
            variant="primary"
            className="w-full"
            onClick={() => {
              setCheckInBy(selectedLateTime);
              setTimeLeft("68 min");
              onLateTime?.(selectedLateTime);
              setPhase({ kind: "success", outcome: "late-time", newTime: selectedLateTime });
            }}
          >
            Confirm new time
          </FutureUiButton>
          <FutureUiButton variant="ghost" className="w-full" onClick={() => setPhase({ kind: "reminder" })}>
            Back
          </FutureUiButton>
        </div>
      </div>
    );
  }

  if (phase.kind === "release-confirm") {
    return (
      <div className="flex flex-col">
        <p
          className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          Confirm release
        </p>
        <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
          Release Desk 4B early?
        </h2>
        <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          The desk returns to the pool for same-day planners. Your meeting at Pod B is unchanged.
        </p>
        <p className={`m-0 mb-3 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          Early release counts toward reliability — <strong style={{ color: SALTMINE.text }}>no strike</strong>{" "}
          and waitlist colleagues get first pick.
        </p>

        <div className="flex flex-col gap-1.5">
          <FutureUiButton
            variant="primary"
            className="w-full"
            onClick={() => {
              onReleaseEarly?.();
              setPhase({ kind: "success", outcome: "release" });
            }}
          >
            Confirm release
          </FutureUiButton>
          <FutureUiButton
            variant="ghost"
            className="w-full"
            onClick={() => setPhase({ kind: "reminder" })}
          >
            Back
          </FutureUiButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p
        className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        Safety booking
      </p>
      <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        Check in to keep your desk
      </h2>
      <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        Desk 4B · Floor 3 — arrive by <strong>{checkInBy}</strong> or the desk returns to the pool.
      </p>

      <TimeMetrics checkInBy={checkInBy} timeLeft={timeLeft} strikes="2 / 3" />

      <p className={`m-0 mb-3 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        One more missed check-in triggers a <strong style={{ color: SALTMINE.text }}>7-day hold</strong>.
        Release early to avoid a strike.
      </p>

      <div className="flex flex-col gap-1.5">
        <FutureUiButton
          variant="primary"
          className="w-full"
          onClick={() => {
            onCheckIn?.();
            setPhase({ kind: "success", outcome: "check-in" });
          }}
        >
          Check in now
        </FutureUiButton>
        <FutureUiButton
          variant="secondary"
          className="w-full"
          onClick={() => setPhase({ kind: "late-time" })}
        >
          Running late? Update time
        </FutureUiButton>
        <FutureUiButton
          variant="ghost"
          className="w-full"
          onClick={() => setPhase({ kind: "release-confirm" })}
        >
          Release early
        </FutureUiButton>
      </div>
    </div>
  );
}
