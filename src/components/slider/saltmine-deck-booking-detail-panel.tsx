"use client";

import Image from "next/image";
import { Check, Map, Share2, Video, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar, SALTMINE_AVATAR_SCALE } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  deckBookingActionLabel,
  deckBookingActionStyle,
  resolveDeckBookingAction,
  deckDayDateBadge,
  type DeckBookingAttendee,
  type DeckBookingItem,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import { saltmineBookingLocationLine } from "@/lib/saltmine-ui-copy";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
} from "@/lib/saltmine-onboarding-tokens";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
import {
  SALTMINE_DECK_TEXT_2XS,
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";

const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_2XS = SALTMINE_DECK_TEXT_2XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;
const ATTENDEE_SIZE_DESKTOP = 20;
const ATTENDEE_SIZE_MOBILE = 28;
const PARKING_HERO_SRC = "/assets/saltmine/booking-parking-hero.svg";
const DESK_HERO_SRC = "/assets/saltmine/booking-desk-hero.svg";

const BOOKING_HERO_SRC: Partial<Record<DeckBookingItem["kind"], string>> = {
  parking: PARKING_HERO_SRC,
  desk: DESK_HERO_SRC,
};

function AttendeeStatusBadge({ status }: { status: DeckBookingAttendee["status"] }) {
  if (status === "declined") {
    return (
      <span
        className="absolute -bottom-px -right-px inline-flex h-2 w-2 items-center justify-center rounded-full border border-white"
        style={{ backgroundColor: "#EF4444" }}
        aria-hidden
      >
        <X className="h-1.5 w-1.5 text-white" strokeWidth={3} />
      </span>
    );
  }

  if (status === "tentative") {
    return (
      <span
        className="absolute -bottom-px -right-px inline-flex h-2 w-2 items-center justify-center rounded-full border border-white text-[6px] font-bold text-white"
        style={{ backgroundColor: "#94A3B8" }}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <span
      className="absolute -bottom-px -right-px inline-flex h-2 w-2 items-center justify-center rounded-full border border-white"
      style={{ backgroundColor: "#22C55E" }}
      aria-hidden
    >
      <Check className="h-1.5 w-1.5 text-white" strokeWidth={3} />
    </span>
  );
}

export function DeckBookingDetailPanel({
  booking,
  day,
  onClose,
  onAction,
  onMap,
  onShare,
  layout = "desktop",
}: {
  booking: DeckBookingItem;
  day: DeckTimelineDay;
  onClose: () => void;
  onAction: (label: string) => void;
  onMap: () => void;
  onShare: () => void;
  layout?: "desktop" | "mobile";
}) {
  const { weekday, dayNumber } = deckDayDateBadge(day);
  const isMeeting = booking.kind === "meeting";
  const titleColor = isMeeting ? "#F59E0B" : SALTMINE.text;
  const actionLabel = deckBookingActionLabel(resolveDeckBookingAction(booking));
  const isMobile = layout === "mobile";
  const attendeeSize = isMobile ? ATTENDEE_SIZE_MOBILE : ATTENDEE_SIZE_DESKTOP;
  const iconStroke = isMobile ? SALTMINE_MOBILE_ICON.stroke : ICON_STROKE;
  const actionStyle = deckBookingActionStyle(resolveDeckBookingAction(booking));

  return (
    <div className={`flex h-full min-h-0 flex-col ${isMobile ? "px-4 py-3" : ""}`}>
      {layout === "desktop" ? (
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
      ) : null}

      {BOOKING_HERO_SRC[booking.kind] ? (
        <div
          className={`relative mb-3 w-full overflow-hidden rounded-[12px] ${isMobile ? "h-[120px]" : "mb-2 h-[72px] rounded-[10px]"}`}
        >
          <Image
            src={BOOKING_HERO_SRC[booking.kind]!}
            alt=""
            fill
            className={`object-cover ${booking.kind === "desk" ? "grayscale" : ""}`}
            sizes="148px"
            aria-hidden
          />
        </div>
      ) : isMeeting ? (
        <div
          className={`mb-3 flex w-full items-center justify-center rounded-[12px] ${isMobile ? "h-[120px]" : "mb-2 h-[72px] rounded-[10px]"}`}
          style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
          aria-hidden
        >
          <Video
            className={isMobile ? "h-10 w-10" : "h-8 w-8"}
            strokeWidth={iconStroke}
            style={{ color: "#F59E0B" }}
          />
        </div>
      ) : null}

      <div className={`mb-3 flex items-start gap-2 ${isMobile ? "" : "mb-2 gap-1.5"}`}>
        <div
          className={`inline-flex shrink-0 flex-col items-center justify-center rounded-[8px] border bg-white ${isMobile ? "h-12 w-12" : "h-9 w-9 rounded-[6px]"}`}
          style={{ borderColor: HAIRLINE }}
          aria-hidden
        >
          <span
            className={`font-semibold uppercase leading-none ${isMobile ? SALTMINE_MOBILE_CAPTION_CLASS : TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {weekday}
          </span>
          <span
            className={`font-extrabold leading-none tracking-[-0.02em] ${isMobile ? "text-[18px]" : "text-[13px]"}`}
            style={{ color: SALTMINE.text }}
          >
            {dayNumber}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`m-0 ${isMobile ? SALTMINE_MOBILE_CARD_TITLE_CLASS : `truncate font-bold tracking-[-0.02em] ${TEXT_XS}`}`}
            style={{ color: titleColor }}
          >
            {booking.title}
          </p>
          <p
            className={`m-0 font-bold ${isMobile ? SALTMINE_MOBILE_BODY_CLASS : TEXT_2XS}`}
            style={{ color: SALTMINE.text }}
          >
            {booking.time}
          </p>
          <p
            className={`m-0 font-medium ${isMobile ? SALTMINE_MOBILE_SECONDARY_CLASS : TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {saltmineBookingLocationLine({
              duration: booking.duration,
              location: booking.location,
              floor: booking.floor,
            })}
          </p>
        </div>
      </div>

      {booking.attendees?.length ? (
        <div className="mb-3">
          <p
            className={`mb-1.5 px-0.5 font-bold uppercase tracking-[0.06em] ${isMobile ? SALTMINE_MOBILE_CAPTION_CLASS : TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {content.bookingGridPopupAttendeesLabel}
          </p>
          <div className="flex flex-wrap gap-1.5 overflow-visible">
            {booking.attendees.map((person, index) => (
              <span
                key={`${person.letter}-${index}`}
                className="relative inline-flex"
                style={{
                  marginLeft: index === 0 ? 0 : -Math.round((isMobile ? 6 : 4) * SALTMINE_AVATAR_SCALE),
                }}
                aria-hidden
              >
                <SaltmineDeckAvatar
                  letter={person.letter}
                  color={person.color}
                  size={attendeeSize}
                  stacked={booking.attendees!.length > 1}
                />
                {isMeeting ? (
                  <AttendeeStatusBadge status={person.status ?? "accepted"} />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          aria-label={content.bookingDetailMapLabel}
          onClick={onMap}
          className={
            isMobile
              ? `${SALTMINE_MOBILE_ICON_BUTTON_CLASS} rounded-[10px] border`
              : `inline-flex h-7 w-7 items-center justify-center rounded-[6px] border transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`
          }
          style={{ borderColor: HAIRLINE, color: SALTMINE.textSecondary }}
        >
          <Map className={isMobile ? "h-[18px] w-[18px]" : "h-3 w-3"} strokeWidth={iconStroke} />
        </button>
        <button
          type="button"
          aria-label={content.bookingDetailShareLabel}
          onClick={onShare}
          className={
            isMobile
              ? `${SALTMINE_MOBILE_ICON_BUTTON_CLASS} rounded-[10px] border`
              : `inline-flex h-7 w-7 items-center justify-center rounded-[6px] border transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`
          }
          style={{ borderColor: HAIRLINE, color: SALTMINE.textSecondary }}
        >
          <Share2 className={isMobile ? "h-[18px] w-[18px]" : "h-3 w-3"} strokeWidth={iconStroke} />
        </button>
      </div>

      <div className="mb-3 h-px shrink-0" style={{ backgroundColor: HAIRLINE }} aria-hidden />

      {!isMeeting ? (
      <div className="mt-auto pt-1">
        <button
          type="button"
          onClick={() => onAction(actionLabel)}
          className={`flex w-full items-center justify-center rounded-[10px] border px-2 font-semibold leading-none ${isMobile ? `min-h-11 ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS}` : `min-h-7 ${TEXT_MICRO}`} ${FOCUS_RING}`}
          style={actionStyle}
        >
          {actionLabel}
        </button>
      </div>
      ) : null}
    </div>
  );
}
