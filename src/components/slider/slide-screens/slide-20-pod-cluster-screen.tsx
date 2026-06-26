"use client";

import { useMemo } from "react";
import { PodCluster } from "@/components/slider/saltmine-pod-cluster";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DISPLAY_POD_IDS } from "@/lib/saltmine-find-space-layout";
import {
  computeFindSpaceFloorPlan,
  FIND_SPACE_DEFAULT_FILTER_VALUES,
} from "@/lib/saltmine-find-space-filters";
import { SALTMINE_MOCKUP_FONT_FAMILY } from "@/lib/saltmine-mockup-font";

/**
 * Slide 20 (centre) — floor plan pod cluster.
 * Edit this file to change this slice of slide 20 only.
 */
export function Slide20PodClusterScreen() {
  const reducedMotion = useReducedMotion();
  const pod = useMemo(() => {
    const { pods } = computeFindSpaceFloorPlan(FIND_SPACE_DEFAULT_FILTER_VALUES);
    return (
      pods.find((entry) => entry.id === DISPLAY_POD_IDS[0] && entry.visible) ??
      null
    );
  }, []);

  if (!pod) return null;

  return (
    <div
      className="h-full max-h-[280px] w-full max-w-[240px]"
      style={{ fontFamily: SALTMINE_MOCKUP_FONT_FAMILY }}
      aria-label="Floor 21 pod cluster with team bookings"
    >
      <PodCluster
        pod={pod}
        pulseKey={0}
        selectedDeskId={null}
        reducedMotion={reducedMotion}
        onSeatClick={() => undefined}
        interactive={false}
        markerBase={14}
      />
    </div>
  );
}
