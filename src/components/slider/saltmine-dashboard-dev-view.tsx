"use client";

import { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";

const DASHBOARD_WIDTH = 880;
const DASHBOARD_HEIGHT = 530;

export function SaltmineDashboardDevView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#EEF2F6] p-8">
      <p className="m-0 text-center text-[13px] font-medium text-[#637381]">
        Dev preview — edit{" "}
        <code className="rounded-md border border-[#DFE3E8] bg-white px-2 py-1 text-[11px] font-semibold text-[#1C252E] shadow-sm">
          src/lib/saltmine-bookings-dashboard-content.ts
        </code>
      </p>
      <div
        className="shrink-0 overflow-hidden rounded-[20px] bg-white ring-1 ring-black/5"
        style={{
          width: DASHBOARD_WIDTH,
          height: DASHBOARD_HEIGHT,
          boxShadow:
            "0 0 2px rgba(145, 158, 171, 0.2), 0 24px 48px -12px rgba(145, 158, 171, 0.22)",
        }}
      >
        <SaltmineBookingsDashboard
          displayName={SALTMINE_BOOKINGS_DASHBOARD_CONTENT.defaultDisplayName}
        />
      </div>
    </div>
  );
}
