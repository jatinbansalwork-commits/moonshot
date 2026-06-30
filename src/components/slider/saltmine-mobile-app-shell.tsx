"use client";

import type { ReactNode } from "react";
import { AppHomeIndicator } from "@/components/AppHomeIndicator";
import { SaltmineMobileStatusBar } from "@/components/slider/saltmine-mobile-status-bar";
import { SALTMINE_ONBOARDING } from "@/lib/saltmine-onboarding-tokens";
import { SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING } from "@/lib/saltmine-mobile-tokens";

export { SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING };

export function SaltmineMobileAppShell({
  children,
  bottomNav,
}: {
  children: ReactNode;
  bottomNav?: ReactNode;
}) {
  return (
    <div
      className="relative flex h-full w-full min-h-0 flex-col overflow-hidden antialiased"
      data-saltmine-mobile
      style={{
        fontFamily: SALTMINE_ONBOARDING.font.family,
        backgroundColor: "#FFFFFF",
      }}
      role="application"
    >
      <SaltmineMobileStatusBar />

      <div className="relative z-0 min-h-0 flex-1 overflow-hidden">{children}</div>

      <div className="relative z-20 shrink-0">
        {bottomNav}
        <div className="flex justify-center bg-white pb-1 pt-0.5">
          <AppHomeIndicator />
        </div>
      </div>
    </div>
  );
}
