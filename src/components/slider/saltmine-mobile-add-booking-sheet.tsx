"use client";

import { useEffect } from "react";
import { Building2, Car, DoorOpen, LampDesk, X, type LucideIcon } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_PRESS_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

const MENU_ICONS: Record<string, LucideIcon> = {
  "team-day": Building2,
  "car-parking": Car,
  "meeting-space": DoorOpen,
  desk: LampDesk,
};

export type SaltmineMobileAddBookingActionId =
  (typeof content.addBookingMenuItems)[number]["id"];

export function SaltmineMobileAddBookingSheet({
  open,
  onClose,
  onSelect,
  reducedMotion = false,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (actionId: SaltmineMobileAddBookingActionId) => void;
  reducedMotion?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const pressClass = reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col"
      style={{ backgroundColor: SALTMINE.primary }}
      role="dialog"
      aria-modal="true"
      aria-label={content.addBookingLabel}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center px-8 pb-28 pt-20">
        <ul className="m-0 list-none space-y-7 p-0">
          {content.addBookingMenuItems.map((item) => {
            const Icon = MENU_ICONS[item.id] ?? LampDesk;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`flex min-h-12 w-full items-center gap-4 text-left text-white ${pressClass} ${FOCUS_RING}`}
                >
                  <Icon
                    className="h-7 w-7 shrink-0"
                    strokeWidth={SALTMINE_MOBILE_ICON.stroke}
                    aria-hidden
                  />
                  <span className={`${SALTMINE_MOBILE_BODY_CLASS} text-[20px] font-semibold leading-7`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        aria-label={content.addBookingMenuCloseLabel}
        onClick={onClose}
        className={`absolute right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_18px_rgba(28,37,46,0.22)] ${pressClass} ${FOCUS_RING}`}
        style={{ bottom: SALTMINE_MOBILE_FAB_BOTTOM_OFFSET }}
      >
        <X
          className="h-6 w-6"
          strokeWidth={2.25}
          style={{ color: SALTMINE.primary }}
          aria-hidden
        />
      </button>
    </div>
  );
}
