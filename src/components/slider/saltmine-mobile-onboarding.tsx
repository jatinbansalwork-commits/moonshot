"use client";

import { ArrowRight } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

export function SaltmineMobileOnboarding({
  displayName,
  floorLetter,
  onContinue,
}: {
  displayName: string;
  floorLetter: string;
  onContinue: () => void;
}) {
  return (
    <div
      className="flex h-full min-h-0 flex-col items-center justify-between px-6 pb-8 pt-5 text-center"
      style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}
    >
      <div className="flex flex-col items-center pt-8">
        <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#1C252E] p-1">
          <img
            src={content.brandLogoSrc}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            decoding="async"
            draggable={false}
          />
        </span>
        <p
          className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS} font-bold uppercase tracking-[0.12em]`}
          style={{ color: SALTMINE.textMuted }}
        >
          Welcome back
        </p>
        <h1 className={`m-0 mt-3 ${SALTMINE_MOBILE_PAGE_TITLE_CLASS} text-[20px]`} style={{ color: SALTMINE.text }}>
          {displayName}
        </h1>
        <p
          className={`m-0 mt-3 max-w-[240px] ${SALTMINE_MOBILE_SECONDARY_CLASS}`}
          style={{ color: SALTMINE.textSecondary }}
        >
          Your workspace is ready. Book desks, check in, and stay on top of office updates.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-5">
        <SaltmineDeckAvatar memberId="jb" letter={floorLetter} size={56} color={SALTMINE.primary} />
        <button
          type="button"
          onClick={onContinue}
          className={`inline-flex min-h-11 w-full max-w-[260px] items-center justify-center gap-2 rounded-[12px] px-4 ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} text-white transition-transform duration-150 active:scale-[0.98] ${FOCUS_RING}`}
          style={{ backgroundColor: SALTMINE.primary }}
        >
          Enter workspace
          <ArrowRight className="h-4 w-4" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
        </button>
        <p className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textMuted }}>
          Saltmine · India · English
        </p>
      </div>
    </div>
  );
}
