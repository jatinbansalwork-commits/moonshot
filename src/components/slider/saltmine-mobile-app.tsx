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
import { SaltmineMobileInboxView } from "@/components/slider/saltmine-mobile-inbox-view";
import { SaltmineMobileOnboarding } from "@/components/slider/saltmine-mobile-onboarding";
import { SaltmineMobileOverlayScreen } from "@/components/slider/saltmine-mobile-overlay-screen";
import { SaltmineMobileProfileView } from "@/components/slider/saltmine-mobile-profile-view";
import { SaltmineMobileSearchOverlay } from "@/components/slider/saltmine-mobile-search-overlay";
import {
  SaltmineMobileBookingGridView,
  SaltmineMobileConferenceGridView,
  SaltmineMobileFindView,
  SaltmineMobileTeamsView,
} from "@/components/slider/saltmine-mobile-segment-views";
import { SaltmineMobileTabBar } from "@/components/slider/saltmine-mobile-tab-bar";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import {
  SALTMINE_MOBILE_TAB_BY_ID,
  type SaltmineMobileTabId,
} from "@/lib/saltmine-mobile-nav";
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

function SaltmineMobileAppRoutes({ displayName }: { displayName: string }) {
  const {
    activeTab,
    setActiveTab,
    overlayRoute,
    closeOverlay,
    inboxBadge,
    showToast,
  } = useSaltmineMobileApp();

  const tabLabel = SALTMINE_MOBILE_TAB_BY_ID[activeTab].label;

  return (
    <>
      <div className="flex h-full min-h-0 flex-col" role="main" aria-label={tabLabel}>
        {activeTab === "bookings" ? (
          <SaltmineMobileBookingsView displayName={displayName} showToast={showToast} />
        ) : null}

        {activeTab === "find" ? <SaltmineMobileFindView showToast={showToast} /> : null}

        {activeTab === "inbox" ? <SaltmineMobileInboxView showToast={showToast} /> : null}

        {activeTab === "teams" ? <SaltmineMobileTeamsView showToast={showToast} /> : null}
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
  initialTab = "bookings",
  showOnboarding = true,
  showInboxNotificationPopup = false,
}: {
  displayName?: string;
  initialTab?: SaltmineMobileTabId;
  showOnboarding?: boolean;
  showInboxNotificationPopup?: boolean;
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
    <SaltmineMobileAppProvider
      displayName={displayName}
      initialTab={initialTab}
      showToast={showToast}
    >
      <SaltmineMobileAppInner
        rootRef={rootRef}
        displayName={displayName}
        showInboxNotificationPopup={showInboxNotificationPopup}
        toast={toast}
      />
    </SaltmineMobileAppProvider>
  );
}

function SaltmineMobileAppInner({
  rootRef,
  displayName,
  showInboxNotificationPopup,
  toast,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  displayName: string;
  showInboxNotificationPopup: boolean;
  toast: string | null;
}) {
  const { activeTab, setActiveTab, inboxBadge } = useSaltmineMobileApp();

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden" data-saltmine-mobile>
      <SaltmineMobileAppShell
        bottomNav={
          <SaltmineMobileTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            inboxBadge={inboxBadge}
          />
        }
      >
        <SaltmineMobileAppRoutes displayName={displayName} />
      </SaltmineMobileAppShell>

      <MobileToast message={toast} />
    </div>
  );
}
