"use client";

import Image from "next/image";
import { Map, Share2, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import type { DeckBookingItem, DeckTimelineDay } from "@/lib/saltmine-deck-bookings-data";
import { deckDayDateBadge } from "@/lib/saltmine-deck-bookings-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const PARKING_HERO_SRC = "/assets/saltmine/booking-parking-hero.svg";
const DESK_HERO_SRC = "/assets/saltmine/booking-desk-hero.svg";

const BOOKING_HERO_SRC: Partial<Record<DeckBookingItem["kind"], string>> = {
  parking: PARKING_HERO_SRC,
  desk: DESK_HERO_SRC,
};

export function DeckBookingDetailPanel({
  booking,
  day,
  onClose,
  onAction,
  onMap,
  onShare,
}: {
  booking: DeckBookingItem;
  day: DeckTimelineDay;
  onClose: () => void;
  onAction: (label: string) => void;
  onMap: () => void;
  onShare: () => void;
}) {
  const { weekday, dayNumber } = deckDayDateBadge(day);
  const actionLabel = booking.action === "check-out" ? "Check out" : "Check in";
  const actionStyle =
    booking.action === "check-out"
      ? {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#DC2626",
          borderColor: "rgba(239, 68, 68, 0.24)",
        }
      : {
          backgroundColor: "rgba(245, 158, 11, 0.12)",
          color: "#D97706",
          borderColor: "rgba(245, 158, 11, 0.28)",
        };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-start justify-end">
        <button
          type="button"
          aria-label={content.bookingDetailCloseLabel}
          onClick={onClose}
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <X className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>

      {BOOKING_HERO_SRC[booking.kind] ? (
        <div className="relative mb-2 h-[72px] w-full overflow-hidden rounded-[10px]">
          <Image
            src={BOOKING_HERO_SRC[booking.kind]!}
            alt=""
            fill
            className={`object-cover ${booking.kind === "desk" ? "grayscale" : ""}`}
            sizes="148px"
            aria-hidden
          />
        </div>
      ) : null}

      <div className="mb-2 flex items-start gap-1.5">
        <div
          className="inline-flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[6px] border bg-white"
          style={{ borderColor: HAIRLINE }}
          aria-hidden
        >
          <span
            className={`font-semibold uppercase leading-none ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {weekday}
          </span>
          <span
            className="text-[13px] font-extrabold leading-none tracking-[-0.02em]"
            style={{ color: SALTMINE.text }}
          >
            {dayNumber}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`m-0 truncate font-bold tracking-[-0.02em] ${TEXT_XS}`}
            style={{ color: SALTMINE.text }}
          >
            {booking.title}
          </p>
          <p className={`m-0 font-bold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {booking.time}
          </p>
          <p className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {booking.duration} • {booking.location}
          </p>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-1">
        <button
          type="button"
          aria-label={content.bookingDetailMapLabel}
          onClick={onMap}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] border transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`}
          style={{ borderColor: HAIRLINE, color: SALTMINE.textSecondary }}
        >
          <Map className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
        <button
          type="button"
          aria-label={content.bookingDetailShareLabel}
          onClick={onShare}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] border transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`}
          style={{ borderColor: HAIRLINE, color: SALTMINE.textSecondary }}
        >
          <Share2 className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>

      <div className="mb-2 h-px shrink-0" style={{ backgroundColor: HAIRLINE }} aria-hidden />

      <div className="mt-auto pt-1">
        <button
          type="button"
          onClick={() => onAction(actionLabel)}
          className={`flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
          style={actionStyle}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
