"use client";

import { type ReactNode } from "react";
import {
  Car,
  Check,
  ChevronDown,
  Cloud,
  CloudRain,
  ExternalLink,
  Home,
  MapPin,
  Monitor,
  Plus,
  Repeat,
  Sun,
  Video,
  X,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import {
  SaltmineDeckAvatar,
  SALTMINE_AVATAR_SCALE,
  saltmineAvatarOverlap,
} from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_OFFICE_PRESENCE,
  type DeckBookingAttendee,
  type DeckBookingItem,
  type DeckBookingKind,
  type DeckWeatherIcon,
} from "@/lib/saltmine-deck-bookings-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const SURFACE_INSET = SALTMINE_SURFACE_INSET;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const ATTENDEE_SIZE = 18;

const WEATHER_ICONS: Record<DeckWeatherIcon, typeof Cloud> = {
  cloud: Cloud,
  sun: Sun,
  rain: CloudRain,
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

const BOOKING_DETAIL_KINDS = new Set<DeckBookingKind>(["parking", "desk", "meeting"]);

const KIND_ICONS: Record<DeckBookingKind, typeof Car> = {
  parking: Car,
  desk: Monitor,
  meeting: Video,
};

function DeckAvatarStack({
  people,
  size = 14,
  showEmptyPlaceholder = false,
  maxVisible,
}: {
  people: readonly { initials?: string; letter?: string; color: string; memberId?: string }[];
  size?: number;
  showEmptyPlaceholder?: boolean;
  maxVisible?: number;
}) {
  if (people.length === 0 && showEmptyPlaceholder) {
    const overlap = saltmineAvatarOverlap(size);
    return (
      <span className="inline-flex shrink-0 items-center py-px" aria-hidden>
        {["placeholder-a", "placeholder-b"].map((key, index) => (
          <SaltmineDeckAvatar
            key={key}
            size={size}
            placeholder
            stacked
            style={{ zIndex: 2 - index, marginLeft: index === 0 ? 0 : -overlap }}
          />
        ))}
      </span>
    );
  }

  if (people.length === 0) return null;

  const overlap = saltmineAvatarOverlap(size);
  const visiblePeople =
    maxVisible != null && maxVisible > 0 ? people.slice(0, maxVisible) : people;
  const stackOverlap = visiblePeople.length > 1;

  return (
    <span className="inline-flex shrink-0 items-center py-px" aria-hidden>
      {visiblePeople.map((person, index) => (
        <SaltmineDeckAvatar
          key={`${person.memberId ?? person.letter ?? person.initials ?? "?"}-${index}`}
          memberId={person.memberId}
          letter={person.letter ?? person.initials}
          color={person.color}
          size={size}
          stacked={stackOverlap}
          style={{
            zIndex: visiblePeople.length - index,
            marginLeft: index === 0 ? 0 : -overlap,
          }}
        />
      ))}
    </span>
  );
}

function DeckBookingCard({
  booking,
  onAction,
  onSelect,
}: {
  booking: DeckBookingItem;
  onAction: (label: string) => void;
  onSelect?: () => void;
}) {
  const KindIcon = KIND_ICONS[booking.kind];
  const isMeeting = booking.kind === "meeting";
  const isSelectable = BOOKING_DETAIL_KINDS.has(booking.kind) && Boolean(onSelect);
  const accentColor = isMeeting ? "#F59E0B" : "#EF4444";
  const titleColor = isMeeting ? "#F59E0B" : SALTMINE.text;
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
    <div
      className="rounded-[8px] border bg-white px-2 py-2 transition-[box-shadow,border-color] duration-150 hover:border-[rgba(145,158,171,0.45)]"
      style={{ borderColor: HAIRLINE, boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        {isSelectable ? (
          <button
            type="button"
            aria-label={`${content.bookingDetailOpenLabel} ${booking.title}`}
            onClick={onSelect}
            className="min-w-0 flex-1 rounded-[4px] text-left outline-none focus:outline-none focus-visible:outline-none"
          >
            <BookingCardBody
              KindIcon={KindIcon}
              booking={booking}
              isMeeting={isMeeting}
              accentColor={accentColor}
              titleColor={titleColor}
            />
          </button>
        ) : (
          <div className="min-w-0 flex-1">
            <BookingCardBody
              KindIcon={KindIcon}
              booking={booking}
              isMeeting={isMeeting}
              accentColor={accentColor}
              titleColor={titleColor}
            />
          </div>
        )}
        <button
          type="button"
          aria-label={`${actionLabel} for ${booking.title}`}
          onClick={() => onAction(actionLabel)}
          className={`inline-flex h-6 shrink-0 items-center justify-center rounded-[6px] border px-2 font-semibold leading-none transition-[transform,background-color] duration-150 active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
          style={actionStyle}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function BookingCardBody({
  KindIcon,
  booking,
  isMeeting,
  accentColor,
  titleColor,
}: {
  KindIcon: typeof Car;
  booking: DeckBookingItem;
  isMeeting: boolean;
  accentColor: string;
  titleColor: string;
}) {
  return (
    <>
      <div className="mb-0.5 flex min-w-0 items-center gap-1">
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          aria-hidden
        >
          <KindIcon className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} />
        </span>
        <span
          className={`inline-flex min-w-0 items-center gap-0.5 truncate font-bold tracking-[-0.015em] ${TEXT_XS}`}
          style={{ color: titleColor }}
        >
          {booking.title}
        </span>
      </div>
      <p className={`m-0 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {booking.time} • {booking.duration} • {booking.location}
      </p>
      {booking.attendees?.length ? (
        <div className="mt-1.5 flex items-center overflow-visible">
          {booking.attendees.map((person, index) => (
            <span
              key={`${person.letter}-${index}`}
              className="relative inline-flex"
              style={{
                marginLeft: index === 0 ? 0 : -Math.round(6 * SALTMINE_AVATAR_SCALE),
                zIndex: booking.attendees!.length - index,
              }}
              aria-hidden
            >
              <SaltmineDeckAvatar
                letter={person.letter}
                color={person.color}
                size={ATTENDEE_SIZE}
                stacked={booking.attendees!.length > 1}
              />
              {isMeeting ? (
                <AttendeeStatusBadge status={person.status ?? "accepted"} />
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

function BookingTimelineGroup({
  label,
  bookings,
  onBookingAction,
  onBookingSelect,
}: {
  label: string;
  bookings: readonly DeckBookingItem[];
  onBookingAction: (label: string) => void;
  onBookingSelect?: (bookingId: string) => void;
}) {
  if (bookings.length === 0) return null;

  return (
    <div className="space-y-1">
      <p
        className={`m-0 px-0.5 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      {bookings.map((booking) => (
        <DeckBookingCard
          key={booking.id}
          booking={booking}
          onAction={onBookingAction}
          onSelect={
            BOOKING_DETAIL_KINDS.has(booking.kind) && onBookingSelect
              ? () => onBookingSelect(booking.id)
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function DeckDaySection({
  title,
  weatherLabel,
  weatherIcon,
  coworkers,
  bookings,
  occupancyLabel,
  officeName = DECK_OFFICE_PRESENCE.officeName,
  isToday = false,
  isEmptyTomorrow = false,
  showCommutePill = false,
  filterEmptyMessage,
  presenceMode = "team",
  occupancyHighlight,
  emptyState,
  workLocationBadge,
  hideDayHeader = false,
  hideBookings = false,
  presenceRowOnly = false,
  presenceCompact = false,
  avatarStackSize = 14,
  onView,
  onAddBooking,
  onBookingAction,
  onBookingSelect,
  onExternalLink,
  onRepeatDesk,
}: {
  title: string;
  weatherLabel: string;
  weatherIcon: DeckWeatherIcon;
  coworkers: readonly { initials: string; color: string }[];
  bookings: readonly DeckBookingItem[];
  occupancyLabel: string;
  officeName?: string;
  isToday?: boolean;
  isEmptyTomorrow?: boolean;
  showCommutePill?: boolean;
  filterEmptyMessage?: string;
  presenceMode?: "team" | "ghost";
  occupancyHighlight?: string;
  emptyState?: "repeat-desk";
  workLocationBadge?: ReactNode;
  hideDayHeader?: boolean;
  hideBookings?: boolean;
  presenceRowOnly?: boolean;
  presenceCompact?: boolean;
  avatarStackSize?: number;
  onView: () => void;
  onAddBooking: () => void;
  onBookingAction: (label: string) => void;
  onBookingSelect?: (bookingId: string) => void;
  onExternalLink: () => void;
  onRepeatDesk?: () => void;
}) {
  const WeatherIcon = WEATHER_ICONS[weatherIcon];
  const allDayBookings = bookings.filter(
    (booking) => booking.kind === "parking" || booking.kind === "desk",
  );
  const upNextBookings = bookings.filter((booking) => booking.kind === "meeting");
  const showEmptyPlaceholder = coworkers.length === 0 && presenceMode === "team";
  const showRepeatDesk = emptyState === "repeat-desk" || isEmptyTomorrow;

  const defaultWorkLocationBadge = (
    <span
      className={`inline-flex h-5 shrink-0 items-center gap-0.5 rounded-full px-1.5 font-semibold leading-none ${TEXT_MICRO}`}
      style={{
        backgroundColor: SALTMINE.accentSolid,
        color: SALTMINE.primaryDark,
        boxShadow: `inset 0 0 0 1px rgba(0, 111, 236, 0.14)`,
      }}
    >
      <Home className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
      {DECK_OFFICE_PRESENCE.workLocation}
      <ChevronDown className="h-2 w-2 opacity-80" strokeWidth={ICON_STROKE} aria-hidden />
    </span>
  );

  const presenceRow = (
    <div
      className={`rounded-[8px] ${presenceCompact ? "px-1.5 py-0.5" : "px-2 py-1"}`}
      style={{
        border: `1px solid rgba(145, 158, 171, 0.38)`,
        backgroundColor: "rgba(244, 246, 248, 0.72)",
      }}
    >
      <div className={`flex items-center justify-between ${presenceCompact ? "gap-1.5" : "gap-2"}`}>
        <div
          className={`flex min-w-0 flex-1 items-center overflow-visible ${presenceCompact ? "gap-1" : "gap-1.5"} ${TEXT_2XS}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <MapPin
            className="h-2.5 w-2.5 shrink-0"
            strokeWidth={ICON_STROKE}
            style={{ color: SALTMINE.primary }}
            aria-hidden
          />
          <span className="shrink-0 font-medium" style={{ color: SALTMINE.textSecondary }}>
            At {officeName}:
          </span>
          {presenceMode === "ghost" ? (
            <span
              className="inline-flex h-3 w-3 shrink-0 items-center justify-center text-[9px] leading-none"
              aria-hidden
            >
              👻
            </span>
          ) : (
            <>
              <span className="shrink-0 overflow-visible">
                <DeckAvatarStack
                  people={coworkers}
                  size={avatarStackSize}
                  showEmptyPlaceholder={showEmptyPlaceholder}
                  maxVisible={presenceCompact ? 3 : 5}
                />
              </span>
              <span className="min-w-0 truncate">
                {occupancyHighlight ?? occupancyLabel}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onView}
          className={`inline-flex h-5 min-w-[36px] shrink-0 items-center justify-center rounded-[6px] border px-1.5 font-semibold leading-none transition-colors duration-150 hover:bg-[rgba(0,111,236,0.06)] ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.24)",
            color: SALTMINE.primary,
            backgroundColor: "transparent",
          }}
        >
          {content.viewButtonLabel}
        </button>
      </div>
    </div>
  );

  if (presenceRowOnly) {
    return presenceRow;
  }

  return (
    <section
      className="relative space-y-1 rounded-[8px] transition-[box-shadow] duration-150"
      aria-label={title}
    >
      {hideDayHeader ? null : (
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <h3
            className={`m-0 truncate font-extrabold tracking-[-0.03em] ${isToday ? "text-[11px] leading-4" : TEXT_XS}`}
            style={{ color: isToday ? SALTMINE.primary : SALTMINE.text }}
          >
            {title}
          </h3>
          {workLocationBadge ?? defaultWorkLocationBadge}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <span
            className={`inline-flex min-h-6 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums leading-none ${TEXT_MICRO}`}
            style={{
              backgroundColor: SALTMINE_ONBOARDING.color.canvas,
              color: SALTMINE.textSecondary,
              boxShadow: SURFACE_INSET,
            }}
          >
            <WeatherIcon className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
            {weatherLabel}
          </span>
          {showCommutePill ? (
            <span
              className={`inline-flex min-h-6 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums leading-none ${TEXT_MICRO}`}
              style={{
                backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                color: SALTMINE.textSecondary,
                boxShadow: SURFACE_INSET,
              }}
            >
              <Car className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {DECK_OFFICE_PRESENCE.commuteLabel}
              <Check className="h-3.5 w-3.5 text-[#22C55E]" strokeWidth={ICON_STROKE} aria-hidden />
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Open day in calendar"
            onClick={onExternalLink}
            className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-[6px] transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <ExternalLink className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} />
          </button>
        </div>
      </div>
      )}

      {presenceRow}

      {filterEmptyMessage ? (
        <div
          className="rounded-[8px] border border-dashed px-2 py-2 text-center"
          style={{
            borderColor: "rgba(145, 158, 171, 0.4)",
            backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          }}
        >
          <p className={`m-0 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {filterEmptyMessage}
          </p>
        </div>
      ) : showRepeatDesk && bookings.length === 0 ? (
        <div
          className="rounded-[8px] border border-dashed px-2 py-2 text-center"
          style={{
            borderColor: "rgba(145, 158, 171, 0.4)",
            backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          }}
        >
          <p className={`m-0 mb-1.5 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {content.tomorrowEmptyLabel}
          </p>
          {onRepeatDesk ? (
            <button
              type="button"
              onClick={onRepeatDesk}
              className={`inline-flex min-h-6 items-center justify-center gap-1 rounded-[6px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{
                borderColor: "rgba(0, 111, 236, 0.32)",
                color: SALTMINE.primary,
                backgroundColor: "rgba(0, 111, 236, 0.06)",
              }}
            >
              <Repeat className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {content.repeatDeskCta}
            </button>
          ) : null}
        </div>
      ) : hideBookings ? null : bookings.length > 0 ? (
        <div className="space-y-1.5">
          <BookingTimelineGroup
            label="All day"
            bookings={allDayBookings}
            onBookingAction={onBookingAction}
            onBookingSelect={onBookingSelect}
          />
          <BookingTimelineGroup
            label="Up next"
            bookings={upNextBookings}
            onBookingAction={onBookingAction}
            onBookingSelect={onBookingSelect}
          />
        </div>
      ) : null}

      {hideBookings ? null : (
      <button
        type="button"
        onClick={onAddBooking}
        className={`flex h-6 w-full items-center justify-center gap-1 rounded-[8px] border border-dashed font-semibold leading-none transition-colors duration-150 hover:border-[rgba(0,111,236,0.5)] hover:bg-[rgba(0,111,236,0.08)] ${TEXT_XS} ${FOCUS_RING}`}
        style={{
          borderColor: "rgba(0, 111, 236, 0.28)",
          color: SALTMINE.primary,
          backgroundColor: "rgba(0, 111, 236, 0.06)",
        }}
      >
        <Plus className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        {content.addBookingLabel}
      </button>
      )}
    </section>
  );
}
