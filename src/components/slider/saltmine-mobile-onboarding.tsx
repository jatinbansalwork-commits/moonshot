"use client";

import { ArrowRight, CalendarDays, CalendarCheck, MapPin } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  mobileFirstName,
  SLIDE_25_MOBILE_ONBOARDING_BENEFITS,
} from "@/lib/slide-screens/slide-25-mobile-content";
import {
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_ELEVATION,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

const BENEFIT_ICONS = {
  desk: MapPin,
  "check-in": CalendarCheck,
  bookings: CalendarDays,
} as const;

export function SaltmineMobileOnboarding({
  displayName,
  floorLetter,
  onContinue,
}: {
  displayName: string;
  floorLetter: string;
  onContinue: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const firstName = mobileFirstName(displayName);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col items-center justify-between overflow-hidden px-6 pb-8 pt-5 text-center"
      style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[48%]"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(0, 111, 236, 0.14) 0%, rgba(0, 111, 236, 0) 72%)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-col items-center pt-7">
        <span
          className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#1C252E] p-1.5"
          style={{ boxShadow: "0 4px 16px rgba(28, 37, 46, 0.18)" }}
        >
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
          className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold tracking-[0.04em]`}
          style={{ color: SALTMINE.textMuted }}
        >
          Welcome back
        </p>
        <h1
          className={`m-0 mt-2 ${SALTMINE_MOBILE_PAGE_TITLE_CLASS} text-[24px] leading-[1.15]`}
          style={{ color: SALTMINE.text }}
        >
          Ready for today, {firstName}?
        </h1>
        <p
          className={`m-0 mt-3 max-w-[272px] ${SALTMINE_MOBILE_SECONDARY_CLASS}`}
          style={{ color: SALTMINE.textSecondary }}
        >
          Book your desk, check in on arrival, and review today's bookings.
        </p>

        <ul className="m-0 mt-5 flex list-none flex-wrap justify-center gap-2 p-0">
          {SLIDE_25_MOBILE_ONBOARDING_BENEFITS.map((benefit) => {
            const Icon = BENEFIT_ICONS[benefit.id];
            return (
              <li key={benefit.id}>
                <span
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold leading-none"
                  style={{
                    backgroundColor: benefit.tint,
                    color: benefit.icon,
                    borderColor: benefit.border,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                  {benefit.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative flex w-full flex-col items-center gap-5">
        <div
          className="rounded-full p-1"
          style={{
            background: "linear-gradient(135deg, rgba(0,111,236,0.35) 0%, rgba(0,111,236,0.08) 100%)",
          }}
        >
          <div className="rounded-full bg-white p-0.5">
            <SaltmineDeckAvatar memberId="jb" letter={floorLetter} size={56} color={SALTMINE.primary} />
          </div>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className={`inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-[14px] px-4 ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} text-white transition-transform duration-150 active:scale-[0.98] ${FOCUS_RING} ${reducedMotion ? "" : "hover:brightness-105"}`}
          style={{
            backgroundColor: SALTMINE.primary,
            boxShadow: SALTMINE_MOBILE_ELEVATION.fab,
          }}
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
