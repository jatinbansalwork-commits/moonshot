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
  Sun,
  Video,
  X,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineAvatarStack } from "@/components/slider/saltmine-avatar-stack";
import {
  SaltmineDeckAvatar,
  SALTMINE_AVATAR_SCALE,
  saltmineAvatarOverlap,
} from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_OFFICE_PRESENCE,
  deckBookingActionLabel,
  deckBookingActionStyle,
  resolveDeckBookingAction,
  type DeckBookingAttendee,
  type DeckBookingItem,
  type DeckBookingKind,
  type DeckLastMinuteContext,
  type DeckWeatherIcon,
} from "@/lib/saltmine-deck-bookings-data";
import { DeckLastMinutePanel } from "@/components/slider/saltmine-deck-last-minute-panel";
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
import {
  SALTMINE_DECK_TEXT_2XS,
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";
import {
  SALTMINE_DECK_BOOKING_CARD_PAD_CLASS,
  SALTMINE_DECK_BOOKING_GROUP_GAP_CLASS,
  SALTMINE_DECK_BOOKING_GROUPS_GAP_CLASS,
  SALTMINE_DECK_DAY_SECTION_GAP_CLASS,
  SALTMINE_DECK_PRESENCE_ROW_PAD_CLASS,
  SALTMINE_DECK_PRESENCE_ROW_PAD_COMPACT_CLASS,
} from "@/lib/saltmine-deck-spacing";

const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_2XS = SALTMINE_DECK_TEXT_2XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;
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
  return (
    <SaltmineAvatarStack
      people={people}
      size={size}
      maxVisible={maxVisible ?? people.length}
      showOverflowCount={maxVisible != null && maxVisible > 0}
      showEmptyPlaceholder={showEmptyPlaceholder}
    />
  );
}

function DeckBookingCard({
  booking,
  onAction,
  onSelect,
}: {
  booking: DeckBookingItem;
  onAction: (label: string, bookingId: string) => void;
  onSelect?: () => void;
}) {
  const KindIcon = KIND_ICONS[booking.kind];
  const isMeeting = booking.kind === "meeting";
  const isSelectable = BOOKING_DETAIL_KINDS.has(booking.kind) && Boolean(onSelect);
  const accentColor = isMeeting ? "#F59E0B" : "#EF4444";
  const titleColor = isMeeting ? "#F59E0B" : SALTMINE.text;
  const actionLabel = deckBookingActionLabel(resolveDeckBookingAction(booking));
  const actionStyle = deckBookingActionStyle(resolveDeckBookingAction(booking));

  return (
    <div
      className={`rounded-[8px] border bg-white ${SALTMINE_DECK_BOOKING_CARD_PAD_CLASS} transition-[box-shadow,border-color] duration-150 hover:border-[rgba(145,158,171,0.45)]`}
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
        {!isMeeting ? (
        <button
          type="button"
          aria-label={`${actionLabel} for ${booking.title}`}
          onClick={() => onAction(actionLabel, booking.id)}
          className={`inline-flex h-6 shrink-0 items-center justify-center rounded-[6px] border px-2 font-semibold leading-none transition-[transform,background-color] duration-150 active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
          style={actionStyle}
        >
          {actionLabel}
        </button>
        ) : null}
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
      {booking.statusNote ? (
        <p className={`m-0 mt-0.5 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.primary }}>
          {booking.statusNote}
        </p>
      ) : null}
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
  onBookingAction: (label: string, bookingId: string) => void;
  onBookingSelect?: (bookingId: string) => void;
}) {
  if (bookings.length === 0) return null;

  return (
    <div className={SALTMINE_DECK_BOOKING_GROUP_GAP_CLASS}>
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
  workLocationLabel,
  lastMinute,
  filterEmptyMessage,
  presenceMode = "team",
  occupancyHighlight,
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
  onLastMinuteWaitlist,
  onLastMinuteAlternative,
}: {
  title: string;
  weatherLabel: string;
  weatherIcon: DeckWeatherIcon;
  coworkers: readonly { initials: string; color: string }[];
  bookings: readonly DeckBookingItem[];
  occupancyLabel: string;
  officeName?: string;
  isToday?: boolean;
  workLocationLabel?: string;
  lastMinute?: DeckLastMinuteContext;
  filterEmptyMessage?: string;
  presenceMode?: "team" | "ghost";
  occupancyHighlight?: string;
  workLocationBadge?: ReactNode;
  hideDayHeader?: boolean;
  hideBookings?: boolean;
  presenceRowOnly?: boolean;
  presenceCompact?: boolean;
  avatarStackSize?: number;
  onView: () => void;
  onAddBooking: () => void;
  onBookingAction: (label: string, bookingId: string) => void;
  onBookingSelect?: (bookingId: string) => void;
  onExternalLink: () => void;
  onLastMinuteWaitlist?: () => void;
  onLastMinuteAlternative?: (label: string) => void;
}) {
  const WeatherIcon = WEATHER_ICONS[weatherIcon];
  const allDayBookings = bookings.filter(
    (booking) => booking.kind === "parking" || booking.kind === "desk",
  );
  const upNextBookings = bookings.filter((booking) => booking.kind === "meeting");
  const showEmptyPlaceholder = coworkers.length === 0 && presenceMode === "team";

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
      {workLocationLabel ?? DECK_OFFICE_PRESENCE.workLocation}
      <ChevronDown className="h-2 w-2 opacity-80" strokeWidth={ICON_STROKE} aria-hidden />
    </span>
  );

  const presenceRow = (
    <div
      className={`rounded-[8px] ${presenceCompact ? SALTMINE_DECK_PRESENCE_ROW_PAD_COMPACT_CLASS : SALTMINE_DECK_PRESENCE_ROW_PAD_CLASS}`}
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
      className={`relative ${SALTMINE_DECK_DAY_SECTION_GAP_CLASS} rounded-[8px] transition-[box-shadow] duration-150`}
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

      {lastMinute ? (
        <DeckLastMinutePanel
          context={lastMinute}
          onViewWaitlist={onLastMinuteWaitlist}
          onBookAlternative={onLastMinuteAlternative}
        />
      ) : null}

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
      ) : hideBookings ? null : bookings.length > 0 ? (
        <div className={SALTMINE_DECK_BOOKING_GROUPS_GAP_CLASS}>
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
