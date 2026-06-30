"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import {
  FUTURE_PLAN_FLOWS,
  type FuturePlanFlowId,
  type FuturePlanMetric,
} from "@/lib/future-plan-flow-content";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiButton,
  FutureUiCard,
} from "@/components/slider/slide-screens/future-ui-primitives";
import { FuturePlanStepPanel } from "@/components/slider/slide-screens/future-plan-step-panels";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

function FuturePlanBreadcrumb({
  root,
  feature,
  current,
  onNavigateRoot,
  onNavigateFeature,
}: {
  root: string;
  feature: string;
  current: string;
  onNavigateRoot?: () => void;
  onNavigateFeature?: () => void;
}) {
  const segments: {
    label: string;
    isCurrent: boolean;
    onClick?: () => void;
    ariaLabel?: string;
  }[] = [
    {
      label: root,
      isCurrent: false,
      onClick: onNavigateRoot,
      ariaLabel: `Back to ${root}`,
    },
    {
      label: feature,
      isCurrent: false,
      onClick: onNavigateFeature,
      ariaLabel: `Back to ${feature} start`,
    },
    { label: current, isCurrent: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="m-0 flex list-none flex-wrap items-center gap-0.5 p-0">
        {segments.map((segment, index) => (
          <li key={`${segment.label}-${index}`} className="flex items-center gap-0.5">
            {index > 0 ? (
              <ChevronRight className="h-2.5 w-2.5 shrink-0" style={{ color: SALTMINE.textMuted }} aria-hidden />
            ) : null}
            {segment.isCurrent ? (
              <span
                className={`${TEXT_MICRO} font-semibold`}
                style={{ color: SALTMINE.text }}
                aria-current="page"
              >
                {segment.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={segment.onClick}
                disabled={!segment.onClick}
                aria-label={segment.ariaLabel}
                className={`${TEXT_MICRO} font-medium underline-offset-2 transition-colors hover:text-[#006FEC] hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-100 ${FOCUS_RING}`}
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

function FuturePlanJourneyStrip({
  steps,
  currentIndex,
  onSelect,
}: {
  steps: { breadcrumb: string }[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mb-2 flex gap-0.5 overflow-x-auto" role="tablist" aria-label="Journey steps">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <button
            key={step.breadcrumb}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(index)}
            className={`shrink-0 rounded-full border px-1.5 py-0.5 font-semibold ${TEXT_MICRO}`}
            style={{
              borderColor: active ? SALTMINE.primary : SALTMINE_HAIRLINE,
              backgroundColor: active
                ? "rgba(0, 111, 236, 0.1)"
                : done
                  ? "rgba(34, 197, 94, 0.08)"
                  : "#fff",
              color: active ? SALTMINE.primary : done ? "#15803D" : SALTMINE.textMuted,
            }}
          >
            {done ? "✓ " : ""}
            {step.breadcrumb}
          </button>
        );
      })}
      <span
        className={`ml-0.5 shrink-0 self-center rounded-full px-1.5 py-0.5 font-semibold ${TEXT_MICRO}`}
        style={{ backgroundColor: "rgba(145, 158, 171, 0.12)", color: SALTMINE.textMuted }}
        role="tab"
        aria-selected={false}
      >
        Done
      </span>
    </div>
  );
}

function FuturePlanMetricStrip({ metrics }: { metrics: FuturePlanMetric[] }) {
  return (
    <div className="mb-2 grid grid-cols-3 gap-1">
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
            <FutureUiBadge tone={metric.tone ?? "neutral"}>{metric.value}</FutureUiBadge>
          </p>
        </div>
      ))}
    </div>
  );
}

function FuturePlanSuccess({
  title,
  body,
  onRestart,
}: {
  title: string;
  body: string;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <CheckCircle2 className="mb-2 h-8 w-8" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
      <p
        className={`m-0 mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        Goal reached
      </p>
      <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        {title}
      </p>
      <p className={`m-0 mb-3 max-w-[280px] ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {body}
      </p>
      <FutureUiButton variant="ghost" onClick={onRestart}>
        Replay journey
      </FutureUiButton>
    </div>
  );
}

/** Interactive end-to-end journey for a future-plan concept. */
export function FuturePlanInteractiveFlow({
  flowId,
  compact = false,
  onNavigateRoot,
  onComplete,
}: {
  flowId: FuturePlanFlowId;
  /** Tighter layout for overlay panels (cab flow). */
  compact?: boolean;
  /** Breadcrumb "My bookings" — return to the main bookings timeline. */
  onNavigateRoot?: () => void;
  /** Called when the user completes the final step. */
  onComplete?: () => void;
}) {
  const flow = FUTURE_PLAN_FLOWS[flowId];
  const [stepIndex, setStepIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  const step = flow.steps[stepIndex];
  const isLast = stepIndex === flow.steps.length - 1;

  const goToFeatureStart = () => {
    setStepIndex(0);
    setComplete(false);
  };

  const breadcrumbProps = {
    root: "My bookings",
    feature: flow.featureName,
    onNavigateRoot,
    onNavigateFeature: goToFeatureStart,
  };

  const advance = () => {
    if (isLast) {
      setComplete(true);
      onComplete?.();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  const restart = () => {
    setStepIndex(0);
    setComplete(false);
  };

  if (complete) {
    return (
      <div className={compact ? "p-1" : "p-1.5"}>
        <FuturePlanBreadcrumb {...breadcrumbProps} current="Complete" />
        <FuturePlanSuccess
          title={flow.successTitle}
          body={flow.successBody}
          onRestart={restart}
        />
      </div>
    );
  }

  if (!step) return null;

  return (
    <div className={compact ? "flex h-full min-h-0 flex-col p-1" : "p-1.5"}>
      <FuturePlanBreadcrumb {...breadcrumbProps} current={step.breadcrumb} />
      {!compact ? (
        <FuturePlanJourneyStrip
          steps={flow.steps}
          currentIndex={stepIndex}
          onSelect={(index) => setStepIndex(index)}
        />
      ) : null}
      <p
        className={`m-0 mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {step.stepLabel}
      </p>
      <h2 className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        {step.title}
      </h2>
      <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {step.body}
      </p>
      {step.entryContext ? (
        <p
          className={`m-0 mb-2 rounded-[6px] px-2 py-1 ${TEXT_MICRO}`}
          style={{ backgroundColor: "rgba(145, 158, 171, 0.1)", color: SALTMINE.textMuted }}
        >
          Entry · {step.entryContext}
        </p>
      ) : null}
      {step.metrics ? <FuturePlanMetricStrip metrics={step.metrics} /> : null}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FuturePlanStepPanel flowId={flowId} stepId={step.id} />
      </div>
      <div className={`mt-2 flex shrink-0 flex-wrap gap-1.5 ${compact ? "flex-col" : ""}`}>
        {step.primaryCta ? (
          <FutureUiButton variant="primary" className={compact ? "w-full" : ""} onClick={advance}>
            {isLast ? step.primaryCta : step.primaryCta}
          </FutureUiButton>
        ) : null}
        {step.secondaryCta && !isLast ? (
          <FutureUiButton variant="ghost" className={compact ? "w-full" : ""} onClick={advance}>
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
