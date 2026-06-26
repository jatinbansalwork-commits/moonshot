"use client";

import { Battery, Signal, Wifi } from "lucide-react";
import { SALTMINE_MOBILE_STATUS_BAR_HEIGHT } from "@/lib/saltmine-mobile-nav";
import { SALTMINE_MOBILE_CAPTION_CLASS } from "@/lib/saltmine-mobile-tokens";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const ICON_STROKE = 2;

export function SaltmineMobileStatusBar({ time = "10:21" }: { time?: string }) {
  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-between px-4"
      style={{ height: SALTMINE_MOBILE_STATUS_BAR_HEIGHT }}
      aria-hidden
    >
      <span
        className={`${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold tabular-nums leading-none`}
        style={{ color: SALTMINE.text }}
      >
        {time}
      </span>
      <div className="flex items-center gap-1" style={{ color: SALTMINE.text }}>
        <Signal className="h-3 w-3" strokeWidth={ICON_STROKE} />
        <Wifi className="h-3 w-3" strokeWidth={ICON_STROKE} />
        <Battery className="h-3.5 w-4" strokeWidth={ICON_STROKE} />
      </div>
    </div>
  );
}
