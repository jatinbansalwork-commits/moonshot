"use client";

import { useState } from "react";
import { SlideDashboardScreen } from "@/components/slider/slide-screens/slide-dashboard-screen";
import { FuturePlanInteractiveFlow } from "@/components/slider/slide-screens/future-plan-flow-kit";
import { FutureUiCard } from "@/components/slider/slide-screens/future-ui-primitives";
import type { FuturePlanFlowId } from "@/lib/future-plan-flow-content";
import { FUTURE_PLAN_DECK_BASE_CONFIG } from "@/lib/slide-screens/future-plan-deck-base-config";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const TIMELINE_HINT = "text-[8px] leading-[11px]";

/** Dashboard embed with dismissible future flow — breadcrumb "My bookings" returns to timeline. */
export function FuturePlanDeckFlowScreen({
  flowId,
  headerTitle,
  variant = "main",
}: {
  flowId: FuturePlanFlowId;
  headerTitle?: string;
  variant?: "main" | "overlay";
}) {
  const [flowActive, setFlowActive] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(true);

  const exitToBookings = () => {
    setFlowActive(false);
    setOverlayOpen(false);
  };

  if (variant === "overlay") {
    return (
      <SlideDashboardScreen
        config={{
          ...FUTURE_PLAN_DECK_BASE_CONFIG,
          deckCustomMainContent: (
            <div className="p-1.5 opacity-60">
              <FutureUiCard title="Today · timeline">
                <p className={`m-0 ${TIMELINE_HINT}`} style={{ color: SALTMINE.textMuted }}>
                  {overlayOpen
                    ? "Add booking panel open — complete desk and cab in one flow."
                    : "My bookings timeline — add booking closed."}
                </p>
              </FutureUiCard>
            </div>
          ),
          deckCustomOverlay:
            overlayOpen ? (
              <FuturePlanInteractiveFlow
                flowId={flowId}
                compact
                onNavigateRoot={exitToBookings}
              />
            ) : undefined,
          deckCustomOverlayLabel: "Add booking",
        }}
      />
    );
  }

  return (
    <SlideDashboardScreen
      config={{
        ...FUTURE_PLAN_DECK_BASE_CONFIG,
        deckCustomHeaderTitle: headerTitle,
        deckCustomMainContent: flowActive ? (
          <FuturePlanInteractiveFlow flowId={flowId} onNavigateRoot={exitToBookings} />
        ) : undefined,
      }}
    />
  );
}
