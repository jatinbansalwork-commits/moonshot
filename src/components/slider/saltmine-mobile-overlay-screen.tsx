"use client";

import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import {
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_OVERLAY_HEADER_CLASS,
  SALTMINE_MOBILE_OVERLAY_TITLE_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileOverlayScreen({
  title,
  onBack,
  children,
  ariaLabel,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex min-h-0 flex-col bg-white"
      role="dialog"
      aria-label={ariaLabel ?? title}
    >
      <div
        className={SALTMINE_MOBILE_OVERLAY_HEADER_CLASS}
        style={{ borderColor: SALTMINE_HAIRLINE }}
      >
        <button
          type="button"
          aria-label={`Back from ${title}`}
          onClick={onBack}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.text }}
        >
          <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
        <h2 className={SALTMINE_MOBILE_OVERLAY_TITLE_CLASS} style={{ color: SALTMINE.text }}>
          {title}
        </h2>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
