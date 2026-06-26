"use client";

import {
  SLIDE_OUTCOME_METRICS,
  getOutcomeMetricBarHeight,
  type OutcomeMetricBar,
} from "@/lib/slide-outcome-metrics-data";

function OutcomeMetricColumn({ metric }: { metric: OutcomeMetricBar }) {
  const height = getOutcomeMetricBarHeight(metric.percentage);

  return (
    <div
      className="flex min-w-0 flex-1 flex-col justify-between rounded-t-[16px] border border-b-0 border-black px-3.5 pb-3 pt-3 text-left sm:px-4"
      style={{
        height,
        backgroundColor: metric.backgroundColor,
      }}
    >
      <div
        className="font-bold text-[2.85rem] leading-[0.95] tracking-[-0.04em] text-black"
      >
        {metric.value}
      </div>
      <p
        className="index-slide-about-body m-0 max-w-[11.5rem] font-normal leading-[1.35] text-black sm:max-w-[13rem]"
        style={{ fontSize: "0.7rem" }}
      >
        {metric.description}
      </p>
    </div>
  );
}

/** Slide 25 — three-bar outcome metrics chart. */
export function OutcomeMetricsChartSlideEmbed() {
  return (
    <div
      className="mx-auto w-full px-1"
      role="img"
      aria-label="Outcome metrics: 25% increase in user confidence, 96% prototype usability score, 40% increase in clarity and task success"
    >
      <div className="flex items-end justify-center gap-3 border-b-[3px] border-black sm:gap-4">
        {SLIDE_OUTCOME_METRICS.map((metric) => (
          <OutcomeMetricColumn key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
