import type { DeckLastMinuteAlternative } from "@/lib/saltmine-deck-bookings-data";
import type { FuturePlanMetric } from "@/lib/future-plan-flow-content";
import { SLIDE_39_TIMELINE_DAYS } from "@/lib/slide-screens/slide-39-last-minute-data";

export interface Slide39AlternativeFlowStep {
  id: "review" | "confirm";
  breadcrumb: string;
  stepLabel: string;
  title: string;
  body: string;
  metrics: FuturePlanMetric[];
  consequence?: string;
  primaryCta: string;
  secondaryCta?: string;
}

export interface Slide39AlternativeFlowCopy {
  featureName: string;
  steps: Slide39AlternativeFlowStep[];
  successTitle: string;
  successBody: string;
}

const SLIDE_39_ALTERNATIVES =
  SLIDE_39_TIMELINE_DAYS[0]?.lastMinute?.alternatives ?? [];

const KIND_FEATURE: Record<DeckLastMinuteAlternative["kind"], string> = {
  desk: "Book desk",
  parking: "Book parking",
  meeting: "Book room",
};

export function findSlide39Alternative(
  label: string,
): DeckLastMinuteAlternative | undefined {
  return SLIDE_39_ALTERNATIVES.find((item) => item.label === label);
}

export function slide39AlternativeFlow(
  alternative: DeckLastMinuteAlternative,
): Slide39AlternativeFlowCopy {
  const featureName = KIND_FEATURE[alternative.kind];

  const reviewMetrics: FuturePlanMetric[] =
    alternative.kind === "desk"
      ? [
          { label: "Available", value: "3 desks", tone: "success" },
          { label: "Check-in by", value: "10:00", tone: "warning" },
          { label: "Waitlist", value: "#2", tone: "brand" },
        ]
      : alternative.kind === "parking"
        ? [
            { label: "Bay", value: "Open", tone: "success" },
            { label: "Walk", value: "2 min", tone: "neutral" },
            { label: "Window", value: "10:00", tone: "warning" },
          ]
        : [
            { label: "Seats", value: "1 left", tone: "warning" },
            { label: "Until", value: "12:00", tone: "neutral" },
            { label: "Sync", value: "09:30", tone: "brand" },
          ];

  const reviewConsequence =
    alternative.kind === "desk"
      ? "Desk 4B waitlist stays at #2 — this is an extra hold you can check in to on arrival."
      : alternative.kind === "parking"
        ? "Held for today only — auto-release if you miss the 10:00 window."
        : "Held alongside your Design sync — check in on arrival to secure the room.";

  const confirmMetrics: FuturePlanMetric[] =
    alternative.kind === "desk"
      ? [
          { label: "Desk", value: alternative.label.split(" ")[0] ?? "Held", tone: "brand" },
          { label: "Release", value: "10:00", tone: "warning" },
          { label: "Waitlist", value: "#2", tone: "neutral" },
        ]
      : alternative.kind === "parking"
        ? [
            { label: "Bay", value: "B2-22", tone: "brand" },
            { label: "Release", value: "10:00", tone: "warning" },
            { label: "Waitlist", value: "#2", tone: "neutral" },
          ]
        : [
            { label: "Room", value: "Pod B", tone: "brand" },
            { label: "Until", value: "12:00", tone: "warning" },
            { label: "Waitlist", value: "#2", tone: "neutral" },
          ];

  return {
    featureName,
    steps: [
      {
        id: "review",
        breadcrumb: "Review",
        stepLabel: "Step 1 of 2",
        title: `Book ${alternative.label}`,
        body: `${alternative.detail}. Available now while you wait for Desk 4B.`,
        metrics: reviewMetrics,
        consequence: reviewConsequence,
        primaryCta: "Continue",
      },
      {
        id: "confirm",
        breadcrumb: "Confirm",
        stepLabel: "Step 2 of 2",
        title: `Confirm ${alternative.label}`,
        body: "Check in on arrival to secure it — your waitlist position stays unchanged.",
        metrics: confirmMetrics,
        primaryCta: `Confirm ${alternative.kind === "parking" ? "bay" : "booking"}`,
        secondaryCta: "Keep browsing",
      },
    ],
    successTitle: `${alternative.label} held`,
    successBody: "Check in when you arrive to secure it. Your waitlist position is unchanged.",
  };
}
