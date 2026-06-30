"use client";

import { Battery, Signal, Wifi } from "lucide-react";
import { SALTMINE_MOBILE_STATUS_BAR_HEIGHT } from "@/lib/saltmine-mobile-nav";
import { SALTMINE_MOBILE_CAPTION_CLASS } from "@/lib/saltmine-mobile-tokens";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const ICON_STROKE = 2;

export function SaltmineMobileStatusBar({ time = "10:21" }: { time?: string }) {
  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-between px-5 pb-0.5 pt-1"
      style={{ height: SALTMINE_MOBILE_STATUS_BAR_HEIGHT }}
      aria-hidden
    >
      <span
        className={`${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold tabular-nums leading-none`}
        style={{ color: SALTMINE.text }}
      >
        {time}
      </span>

      <span
        className="pointer-events-none absolute left-1/2 top-1/2 h-[22px] w-[76px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "#1C252E" }}
      />

      <div className="flex items-center gap-1.5" style={{ color: SALTMINE.text }}>
        <Signal className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} />
        <Wifi className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} />
        <Battery className="h-3.5 w-[18px]" strokeWidth={ICON_STROKE} />
      </div>
    </div>
  );
}
