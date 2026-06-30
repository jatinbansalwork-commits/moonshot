"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiButton,
} from "@/components/slider/slide-screens/future-ui-primitives";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

function Breadcrumb({
  current,
  onNavigateRoot,
  onNavigateFeature,
}: {
  current: string;
  onNavigateRoot: () => void;
  onNavigateFeature: () => void;
}) {
  const segments = [
    { label: "My bookings", onClick: onNavigateRoot },
    { label: "Withdraw waitlist", onClick: onNavigateFeature },
    { label: current, onClick: undefined },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="m-0 flex list-none flex-wrap items-center gap-0.5 p-0">
        {segments.map((segment, index) => (
          <li key={segment.label} className="flex items-center gap-0.5">
            {index > 0 ? (
              <ChevronRight className="h-2.5 w-2.5 shrink-0" style={{ color: SALTMINE.textMuted }} aria-hidden />
            ) : null}
            {index === segments.length - 1 ? (
              <span className={`${TEXT_MICRO} font-semibold`} style={{ color: SALTMINE.text }} aria-current="page">
                {segment.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={segment.onClick}
                className={`${TEXT_MICRO} font-medium underline-offset-2 hover:text-[#006FEC] hover:underline ${FOCUS_RING}`}
                style={{ color: SALTMINE.textMuted }}
              >
                {segment.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Compact overlay flow when withdrawing from the Desk 4B waitlist on slide 39. */
export function Slide39WithdrawWaitlistFlow({
  onNavigateRoot,
  onComplete,
}: {
  onNavigateRoot: () => void;
  onComplete?: () => void;
}) {
  const [complete, setComplete] = useState(false);

  if (complete) {
    return (
      <div className="flex h-full min-h-0 flex-col p-1">
        <Breadcrumb current="Complete" onNavigateRoot={onNavigateRoot} onNavigateFeature={() => setComplete(false)} />
        <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
          <CheckCircle2 className="mb-2 h-7 w-7" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
          <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            Waitlist request withdrawn
          </p>
          <p className={`m-0 mb-2 max-w-[180px] ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            You are no longer queued for Desk 4B. Alternatives below are still available to book.
          </p>
          <FutureUiButton variant="primary" className="w-full" onClick={onNavigateRoot}>
            Back to My bookings
          </FutureUiButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-1">
      <Breadcrumb current="Confirm" onNavigateRoot={onNavigateRoot} onNavigateFeature={onNavigateRoot} />
      <p className={`m-0 mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Withdraw waitlist
      </p>
      <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        Leave Desk 4B queue?
      </h2>
      <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        Withdrawing removes your place — we will not auto-assign this desk if it releases today.
      </p>
      <div className="mb-2 grid grid-cols-3 gap-1">
        {[
          { label: "Position", value: "#2", tone: "brand" as const },
          { label: "Est. release", value: "09:45", tone: "warning" as const },
          { label: "Auto-assign", value: "Off", tone: "neutral" as const },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-[8px] border px-1 py-0.5 text-center"
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
      <p className={`m-0 mb-2 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Your Design sync at 09:30 is unchanged — book a hot-desk or bay below if you still plan to
        come in.
      </p>
      <div className="mt-auto flex shrink-0 flex-col gap-1 pt-2">
        <FutureUiButton
          variant="primary"
          className="w-full"
          onClick={() => {
            setComplete(true);
            onComplete?.();
          }}
        >
          Confirm withdrawal
        </FutureUiButton>
        <FutureUiButton variant="ghost" className="w-full" onClick={onNavigateRoot}>
          Stay on waitlist
        </FutureUiButton>
      </div>
    </div>
  );
}
