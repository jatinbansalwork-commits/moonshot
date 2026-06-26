"use client";

import { Globe, Languages, X } from "lucide-react";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import { SaltmineMobileViewModeToggle } from "@/components/slider/saltmine-mobile-bookings-filters";
import { SALTMINE_MOBILE_HUB_ITEMS } from "@/lib/saltmine-mobile-nav";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_SHEET_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import { FOCUS_RING } from "@/lib/a11y";

export function SaltmineMobileHubSheet() {
  const {
    hubOpen,
    setHubOpen,
    openOverlay,
    showToast,
    bookingsViewMode,
    setBookingsViewMode,
    activeTab,
  } = useSaltmineMobileApp();

  if (!hubOpen) return null;

  const showCalendarViewToggle = activeTab === "bookings";

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-[rgba(28,37,46,0.4)]"
        onClick={() => setHubOpen(false)}
      />
      <div
        className={SALTMINE_MOBILE_SHEET_CLASS}
        role="dialog"
        aria-label="More workspace options"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className={`m-0 ${SALTMINE_MOBILE_BODY_CLASS} font-bold`} style={{ color: SALTMINE.text }}>
            More
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setHubOpen(false)}
            className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
            style={{ color: SALTMINE.textMuted }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
          </button>
        </div>

        {showCalendarViewToggle ? (
          <div
            className="mb-4 space-y-2 border-b pb-4"
            style={{ borderColor: SALTMINE_HAIRLINE }}
          >
            <p className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold`} style={{ color: SALTMINE.textMuted }}>
              Calendar view
            </p>
            <SaltmineMobileViewModeToggle
              value={bookingsViewMode}
              onChange={(mode) => {
                setBookingsViewMode(mode);
                if (mode === "Weekly") showToast("Weekly view");
                setHubOpen(false);
              }}
            />
          </div>
        ) : null}

        <ul className="m-0 list-none space-y-1 p-0">
          {SALTMINE_MOBILE_HUB_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openOverlay(item.id)}
                className={`flex min-h-11 w-full items-center rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} font-semibold transition-colors hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
                style={{ color: SALTMINE.text }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div
          className="mt-4 space-y-1 border-t pt-4"
          style={{ borderColor: SALTMINE_HAIRLINE }}
        >
          <button
            type="button"
            onClick={() => {
              setHubOpen(false);
              showToast("Language set to English");
            }}
            className={`flex min-h-11 w-full items-center gap-2.5 rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textSecondary }}
          >
            <Languages className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
            Language
          </button>
          <button
            type="button"
            onClick={() => {
              setHubOpen(false);
              showToast("Region set to India");
            }}
            className={`flex min-h-11 w-full items-center gap-2.5 rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textSecondary }}
          >
            <Globe className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
            Region
          </button>
        </div>
      </div>
    </div>
  );
}
