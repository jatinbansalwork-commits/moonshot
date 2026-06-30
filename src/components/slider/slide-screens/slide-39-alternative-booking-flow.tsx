"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import type { DeckLastMinuteAlternative } from "@/lib/saltmine-deck-bookings-data";
import {
  slide39AlternativeFlow,
} from "@/lib/slide-screens/slide-39-alternative-flow-content";
import type { FuturePlanMetric } from "@/lib/future-plan-flow-content";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiButton,
} from "@/components/slider/slide-screens/future-ui-primitives";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

function MetricStrip({ metrics }: { metrics: FuturePlanMetric[] }) {
  return (
    <div className="mb-2 grid grid-cols-3 gap-1">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[8px] border px-1 py-0.5 text-center"
          style={{ borderColor: SALTMINE_HAIRLINE, backgroundColor: "#fff" }}
        >
          <p className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {metric.label}
          </p>
          <p className="m-0">
            <FutureUiBadge tone={metric.tone ?? "neutral"}>{metric.value}</FutureUiBadge>
          </p>
        </div>
      ))}
    </div>
  );
}

function Breadcrumb({
  current,
  feature,
  onNavigateRoot,
  onNavigateFeature,
}: {
  current: string;
  feature: string;
  onNavigateRoot?: () => void;
  onNavigateFeature?: () => void;
}) {
  const segments = [
    { label: "My bookings", onClick: onNavigateRoot },
    { label: feature, onClick: onNavigateFeature },
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

/** Compact overlay flow when booking a last-minute alternative from slide 39. */
export function Slide39AlternativeBookingFlow({
  alternative,
  onNavigateRoot,
  onComplete,
}: {
  alternative: DeckLastMinuteAlternative;
  onNavigateRoot: () => void;
  onComplete?: () => void;
}) {
  const flow = slide39AlternativeFlow(alternative);
  const [stepIndex, setStepIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const step = flow.steps[stepIndex];
  const isLast = stepIndex === flow.steps.length - 1;

  const restart = () => {
    setStepIndex(0);
    setComplete(false);
  };

  if (complete) {
    return (
      <div className="flex h-full min-h-0 flex-col p-1">
        <Breadcrumb current="Complete" feature={flow.featureName} onNavigateRoot={onNavigateRoot} onNavigateFeature={restart} />
        <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
          <CheckCircle2 className="mb-2 h-7 w-7" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
          <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            {flow.successTitle}
          </p>
          <p className={`m-0 mb-2 max-w-[180px] ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {flow.successBody}
          </p>
          <FutureUiButton variant="primary" className="w-full" onClick={onNavigateRoot}>
            Back to My bookings
          </FutureUiButton>
        </div>
      </div>
    );
  }

  if (!step) return null;

  const advance = () => {
    if (isLast) {
      setComplete(true);
      onComplete?.();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col p-1">
      <Breadcrumb
        current={step.breadcrumb}
        feature={flow.featureName}
        onNavigateRoot={onNavigateRoot}
        onNavigateFeature={restart}
      />
      <p className={`m-0 mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        {step.stepLabel}
      </p>
      <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        {step.title}
      </h2>
      <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {step.body}
      </p>
      <MetricStrip metrics={step.metrics} />
      {step.consequence ? (
        <p className={`m-0 mb-2 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          {step.consequence}
        </p>
      ) : null}
      <div className="mt-auto flex shrink-0 flex-col gap-1 pt-2">
        <FutureUiButton variant="primary" className="w-full" onClick={advance}>
          {step.primaryCta}
        </FutureUiButton>
        {step.secondaryCta && isLast ? (
          <FutureUiButton variant="ghost" className="w-full" onClick={onNavigateRoot}>
            {step.secondaryCta}
          </FutureUiButton>
        ) : null}
        {stepIndex > 0 ? (
          <FutureUiButton variant="ghost" onClick={() => setStepIndex((current) => current - 1)}>
            Back
          </FutureUiButton>
        ) : null}
      </div>
    </div>
  );
}
