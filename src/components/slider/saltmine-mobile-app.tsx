"use client";

import { useRef, useState, type RefObject } from "react";
import { SaltmineMobileAppShell } from "@/components/slider/saltmine-mobile-app-shell";
import {
  SaltmineMobileAppProvider,
  useSaltmineMobileApp,
} from "@/components/slider/saltmine-mobile-app-context";
import { SaltmineMobileBookingsView } from "@/components/slider/saltmine-mobile-bookings-view";
import { SaltmineMobileHelpView } from "@/components/slider/saltmine-mobile-help-view";
import { SaltmineMobileHubSheet } from "@/components/slider/saltmine-mobile-hub-sheet";
import { SaltmineMobileOnboarding } from "@/components/slider/saltmine-mobile-onboarding";
import { SaltmineMobileOverlayScreen } from "@/components/slider/saltmine-mobile-overlay-screen";
import { SaltmineMobileProfileView } from "@/components/slider/saltmine-mobile-profile-view";
import { SaltmineMobileSearchOverlay } from "@/components/slider/saltmine-mobile-search-overlay";
import {
  SaltmineMobileBookingGridView,
  SaltmineMobileConferenceGridView,
} from "@/components/slider/saltmine-mobile-segment-views";
import { SaltmineMobileTabBar } from "@/components/slider/saltmine-mobile-tab-bar";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import { SALTMINE_MOBILE_TAB_BAR_VISIBLE } from "@/lib/saltmine-mobile-nav";
import {
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
} from "@/lib/saltmine-mobile-tokens";
import {
  SALTMINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

function MobileToast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none absolute left-1/2 z-[100] max-w-[90%] -translate-x-1/2 rounded-full border px-4 py-2 font-semibold shadow-lg transition-opacity duration-200 ${SALTMINE_MOBILE_CAPTION_CLASS} ${message ? "opacity-100" : "opacity-0"}`}
      style={{
        bottom: SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING - 8,
        borderColor: "rgba(0, 111, 236, 0.24)",
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        color: SALTMINE.text,
      }}
    >
      {message ?? ""}
    </div>
  );
}

function SaltmineMobileAppRoutes({
  displayName,
}: {
  displayName: string;
}) {
  const { overlayRoute, closeOverlay, showToast } = useSaltmineMobileApp();

  return (
    <>
      <div className="flex h-full min-h-0 flex-col" role="main" aria-label="My bookings">
        <SaltmineMobileBookingsView displayName={displayName} showToast={showToast} />
      </div>

      <SaltmineMobileSearchOverlay />
      <SaltmineMobileHubSheet />

      {overlayRoute === "booking-grid" ? (
        <SaltmineMobileOverlayScreen title="Booking grid" onBack={closeOverlay}>
          <SaltmineMobileBookingGridView displayName={displayName} />
        </SaltmineMobileOverlayScreen>
      ) : null}

      {overlayRoute === "conference-grid" ? (
        <SaltmineMobileOverlayScreen title="Conference grid" onBack={closeOverlay}>
          <SaltmineMobileConferenceGridView displayName={displayName} />
        </SaltmineMobileOverlayScreen>
      ) : null}

      {overlayRoute === "help" ? (
        <SaltmineMobileOverlayScreen title="Help & support" onBack={closeOverlay}>
          <SaltmineMobileHelpView showToast={showToast} />
        </SaltmineMobileOverlayScreen>
      ) : null}

      {overlayRoute === "profile" ? (
        <SaltmineMobileOverlayScreen title="Profile" onBack={closeOverlay}>
          <SaltmineMobileProfileView />
        </SaltmineMobileOverlayScreen>
      ) : null}
    </>
  );
}

export function SaltmineMobileApp({
  displayName = SALTMINE_DEMO_USER.name,
  showOnboarding = true,
}: {
  displayName?: string;
  showOnboarding?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"onboarding" | "app">(
    showOnboarding ? "onboarding" : "app",
  );
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  if (phase === "onboarding") {
    return (
      <div ref={rootRef} className="relative h-full w-full overflow-hidden" data-saltmine-mobile>
        <SaltmineMobileOnboarding
          displayName={displayName}
          floorLetter={SALTMINE_DEMO_USER.floorLetter}
          onContinue={() => setPhase("app")}
        />
      </div>
    );
  }

  return (
    <SaltmineMobileAppProvider displayName={displayName} showToast={showToast}>
      <SaltmineMobileAppInner rootRef={rootRef} displayName={displayName} toast={toast} />
    </SaltmineMobileAppProvider>
  );
}

function SaltmineMobileAppInner({
  rootRef,
  displayName,
  toast,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  displayName: string;
  toast: string | null;
}) {
  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden" data-saltmine-mobile>
      <SaltmineMobileAppShell
        bottomNav={
          SALTMINE_MOBILE_TAB_BAR_VISIBLE ? (
            <SaltmineMobileTabBar activeTab="bookings" onTabChange={() => {}} />
          ) : undefined
        }
      >
        <SaltmineMobileAppRoutes displayName={displayName} />
      </SaltmineMobileAppShell>

      <MobileToast message={toast} />
    </div>
  );
}
