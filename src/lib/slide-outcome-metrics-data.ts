/**
 * Outcome metrics bar chart — slide 25.
 */

export interface OutcomeMetricBar {
  id: string;
  value: string;
  /** Numeric value used to scale bar height (tallest bar = max height). */
  percentage: number;
  description: string;
  backgroundColor: string;
}

export const SLIDE_OUTCOME_METRICS: readonly OutcomeMetricBar[] = [
  {
    id: "confidence",
    value: "25%",
    percentage: 25,
    description:
      "Increase in user confidence + positive feedback during client demos",
    backgroundColor: "#E8E8E8",
  },
  {
    id: "sus",
    value: "96%",
    percentage: 96,
    description:
      "Prototype usability score (SUS) from internal + client walkthroughs",
    backgroundColor: "#D1D1D1",
  },
  {
    id: "clarity",
    value: "40%",
    percentage: 40,
    description:
      "Increase in clarity and task success during early scenario testing",
    backgroundColor: "#FDE2E1",
  },
];

export const SLIDE_OUTCOME_METRICS_MAX_HEIGHT = 480;

export const SLIDE_OUTCOME_METRICS_MAX_PERCENTAGE = Math.max(
  ...SLIDE_OUTCOME_METRICS.map((metric) => metric.percentage),
);

export function getOutcomeMetricBarHeight(percentage: number): number {
  return Math.round(
    (percentage / SLIDE_OUTCOME_METRICS_MAX_PERCENTAGE) *
      SLIDE_OUTCOME_METRICS_MAX_HEIGHT,
  );
}
