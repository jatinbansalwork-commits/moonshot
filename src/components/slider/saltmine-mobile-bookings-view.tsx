"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  Cloud,
  Home,
  MoreHorizontal,
  Plus,
  Repeat,
  Search,
  Video,
  X,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DeckBookingDetailPanel } from "@/components/slider/saltmine-deck-booking-detail-panel";
import { DeckMonthlyCalendar } from "@/components/slider/saltmine-deck-monthly-calendar";
import { OfficePresencePanel } from "@/components/slider/saltmine-office-presence-panel";
import {
  SaltmineMobileAddBookingSheet,
  type SaltmineMobileAddBookingActionId,
} from "@/components/slider/saltmine-mobile-add-booking-sheet";
import {
  SaltmineMobileEmptyState,
  SaltmineMobileProfileButton,
} from "@/components/slider/saltmine-mobile-chrome";
import {
  SaltmineMobileBookingsFilters,
  SaltmineMobileWeeklyView,
} from "@/components/slider/saltmine-mobile-bookings-filters";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import {
  SaltmineDeckAvatar,
  SALTMINE_AVATAR_SCALE,
  saltmineAvatarOverlap,
} from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_CALENDAR,
  DECK_OFFICE_AVATARS,
  DECK_OFFICE_PRESENCE,
  DECK_TIMELINE_DAYS,
  filterAvatarsByTeam,
  filterBookingsByKind,
  findDeckBooking,
  findDeckTimelineDay,
  resolveTeamNameFromFilter,
  teamOccupancyShortLabel,
  type DeckBookingAttendee,
  type DeckBookingItem,
  type DeckBookingKind,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import { WORK_LOCATION_OPTIONS } from "@/lib/saltmine-bookings-dashboard-data";
import {
  officePresencePeople,
  officePresenceSummary,
} from "@/lib/saltmine-office-presence-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_BORDER_COLOR,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CARD_PAD_CLASS,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_CHIP_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
  SALTMINE_MOBILE_FAB_CLASS,
  SALTMINE_MOBILE_FAB_SCROLL_CLEARANCE,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_LIST_GAP_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_OVERLAY_HEADER_CLASS,
  SALTMINE_MOBILE_OVERLAY_TITLE_CLASS,
  SALTMINE_MOBILE_PAGE_HEADER_CLASS,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
  SALTMINE_MOBILE_SECTION_TITLE_CLASS,
  SALTMINE_MOBILE_STICKY_CHROME_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const ATTENDEE_SIZE = 24;
const PRESENCE_AVATAR_SIZE = 22;

const MOBILE_WEEK_STRIP = [
  { weekday: "M", day: 30, monthIndex: 0, weekend: false },
  { weekday: "T", day: 31, monthIndex: 0, weekend: false },
  { weekday: "W", day: 1, monthIndex: 1, weekend: false },
  { weekday: "T", day: 2, monthIndex: 1, weekend: false },
  { weekday: "F", day: 3, monthIndex: 1, weekend: false },
  { weekday: "S", day: 4, monthIndex: 1, weekend: true },
  { weekday: "S", day: 5, monthIndex: 1, weekend: true },
] as const;

const DEFAULT_SELECTED = { monthIndex: 0, day: 30 } as const;
const TODAY_RING = { monthIndex: 1, day: 3 } as const;

const BOOKING_DETAIL_KINDS = new Set<DeckBookingKind>(["parking", "desk", "meeting"]);

function formatMobileDayTitle(day: DeckTimelineDay): string {
  const match = day.title.match(/(?:Today—|Tomorrow—)?(\w{3}\s+\d+\s+\w+)/);
  if (match?.[1]) return match[1];
  return day.title.replace(/^Today—/, "").replace(/^Tomorrow—/, "");
}

function AttendeeStatusBadge({ status }: { status: DeckBookingAttendee["status"] }) {
  if (status === "declined") {
    return (
      <span
        className="absolute -bottom-px -right-px inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white"
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
        className="absolute -bottom-px -right-px inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white text-[6px] font-bold text-white"
        style={{ backgroundColor: "#94A3B8" }}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <span
      className="absolute -bottom-px -right-px inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white"
      style={{ backgroundColor: "#22C55E" }}
      aria-hidden
    >
      <Check className="h-1.5 w-1.5 text-white" strokeWidth={3} />
    </span>
  );
}

function MobileWeekStrip({
  selected,
  onSelect,
  reducedMotion,
}: {
  selected: { monthIndex: number; day: number };
  onSelect: (monthIndex: number, day: number) => void;
  reducedMotion: boolean;
}) {
  const pressClass = reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS;

  return (
    <div className="pt-1">
      <div className="grid grid-cols-7 justify-items-center">
        {MOBILE_WEEK_STRIP.map((item, index) => (
          <span
            key={`label-${index}`}
            className={`mb-1.5 flex h-5 w-9 items-center justify-center ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold leading-none`}
            style={{
              color: item.weekend ? "rgba(145, 158, 171, 0.65)" : SALTMINE.textMuted,
            }}
          >
            {item.weekday}
          </span>
        ))}
      </div>
      <div
        className="grid grid-cols-7 justify-items-center border-b pb-2"
        style={{ borderColor: "rgba(145, 158, 171, 0.16)" }}
      >
        {MOBILE_WEEK_STRIP.map((item, index) => {
          const isSelected =
            selected.monthIndex === item.monthIndex && selected.day === item.day;
          const isTodayRing =
            TODAY_RING.monthIndex === item.monthIndex && TODAY_RING.day === item.day;

          return (
            <button
              key={`date-${index}`}
              type="button"
              aria-label={`${item.weekday} ${item.day}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(item.monthIndex, item.day)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${SALTMINE_MOBILE_BODY_CLASS} font-semibold tabular-nums leading-none transition-colors duration-150 ${pressClass} ${FOCUS_RING}`}
              style={{
                backgroundColor: isSelected ? SALTMINE.primary : "transparent",
                color: isSelected
                  ? "#FFFFFF"
                  : item.weekend
                    ? "rgba(99, 115, 129, 0.72)"
                    : SALTMINE.textSecondary,
                boxShadow: isSelected ? "0 2px 6px rgba(0, 111, 236, 0.28)" : undefined,
                outline: !isSelected && isTodayRing ? "2px solid rgba(145, 158, 171, 0.35)" : undefined,
                outlineOffset: !isSelected && isTodayRing ? 1 : undefined,
              }}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobilePresenceRow({
  avatars,
  occupancyLabel,
  onPress,
  reducedMotion,
}: {
  avatars: readonly { initials: string; color: string; memberId: string }[];
  occupancyLabel?: string;
  onPress: () => void;
  reducedMotion: boolean;
}) {
  const overlap = saltmineAvatarOverlap(PRESENCE_AVATAR_SIZE);
  const pressClass = reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`w-full rounded-[12px] px-3 py-3 text-left transition-colors hover:bg-[rgba(0,111,236,0.08)] ${pressClass} ${FOCUS_RING}`}
      style={{ backgroundColor: "rgba(0, 111, 236, 0.06)" }}
      aria-label="View who is in the office"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`shrink-0 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textSecondary }}>
            At {DECK_OFFICE_PRESENCE.officeName}:
          </span>
          <span className="inline-flex min-w-0 flex-1 items-center overflow-hidden py-px">
            {avatars.map((person, index) => (
              <SaltmineDeckAvatar
                key={person.memberId}
                memberId={person.memberId}
                letter={person.initials}
                color={person.color}
                size={PRESENCE_AVATAR_SIZE}
                stacked
                style={{
                  zIndex: avatars.length - index,
                  marginLeft: index === 0 ? 0 : -overlap,
                }}
              />
            ))}
          </span>
        </div>
        {occupancyLabel ? (
          <p className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textMuted }}>
            {occupancyLabel}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function MobileBookingCard({
  booking,
  onAction,
  onSelect,
}: {
  booking: DeckBookingItem;
  onAction: (label: string) => void;
  onSelect?: () => void;
}) {
  const isMeeting = booking.kind === "meeting";
  const accentColor = isMeeting ? "#F59E0B" : "#EF4444";
  const titleColor = isMeeting ? "#F59E0B" : SALTMINE.text;
  const actionLabel = booking.action === "check-out" ? "Check out" : "Check in";
  const actionStyle =
    booking.action === "check-out"
      ? {
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          color: "#DC2626",
          borderColor: "rgba(239, 68, 68, 0.28)",
        }
      : {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "#D97706",
          borderColor: "rgba(245, 158, 11, 0.32)",
        };

  const subtitle = isMeeting
    ? `${booking.time} • ${booking.duration} • ${booking.location}`
    : `${booking.duration} • ${booking.location}`;

  const bookingMeta = (
    <div className="min-w-0 flex-1">
      <div className="flex min-w-0 items-center gap-1">
        {isMeeting ? (
          <Video
            className="h-3 w-3 shrink-0"
            strokeWidth={SALTMINE_MOBILE_ICON.stroke}
            style={{ color: accentColor }}
            aria-hidden
          />
        ) : null}
        <span
          className={`truncate ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`}
          style={{ color: titleColor }}
        >
          {booking.title}
        </span>
        {!isMeeting ? (
          <Repeat
            className="h-3 w-3 shrink-0 opacity-50"
            strokeWidth={SALTMINE_MOBILE_ICON.stroke}
            style={{ color: SALTMINE.textMuted }}
            aria-hidden
          />
        ) : null}
      </div>
      <p className={`m-0 mt-1 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textMuted }}>
        {subtitle}
      </p>
      {booking.attendees?.length ? (
        <div className="mt-2 flex items-center overflow-visible">
          {booking.attendees.map((person, index) => (
            <span
              key={`${person.letter}-${index}`}
              className="relative inline-flex"
              style={{
                marginLeft: index === 0 ? 0 : -Math.round(7 * SALTMINE_AVATAR_SCALE),
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
              <AttendeeStatusBadge status={person.status ?? "accepted"} />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const canOpenDetails = BOOKING_DETAIL_KINDS.has(booking.kind) && onSelect;

  return (
    <div
      className={`${SALTMINE_MOBILE_CARD_CLASS} ${SALTMINE_MOBILE_CARD_PAD_CLASS}`}
      style={{ borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR }}
    >
      <div className="flex items-start gap-1.5">
        <span
          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
        {canOpenDetails ? (
          <button
            type="button"
            aria-label={`${content.bookingDetailOpenLabel} ${booking.title}`}
            onClick={onSelect}
            className={`min-w-0 flex-1 rounded-[8px] text-left outline-none focus:outline-none focus-visible:outline-none ${FOCUS_RING}`}
          >
            {bookingMeta}
          </button>
        ) : (
          bookingMeta
        )}
        {!isMeeting ? (
          <button
            type="button"
            aria-label={`${actionLabel} for ${booking.title}`}
            onClick={() => onAction(actionLabel)}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] border px-3 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold leading-none transition-[transform,background-color] duration-150 active:scale-[0.98] ${FOCUS_RING}`}
            style={actionStyle}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {isMeeting ? (
        <button
          type="button"
          aria-label={`${actionLabel} for ${booking.title}`}
          onClick={() => onAction(actionLabel)}
          className={`mt-3 flex min-h-11 w-full items-center justify-center rounded-[10px] border ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} leading-none transition-[transform,background-color] duration-150 active:scale-[0.98] ${FOCUS_RING}`}
          style={actionStyle}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function SaltmineMobileBookingsView({
  displayName = SALTMINE_DEMO_USER.name,
  showToast,
}: {
  displayName?: string;
  showToast: (message: string) => void;
}) {
  const {
    filterValues,
    setFilterValue,
    workLocation,
    setWorkLocation,
    bookingsViewMode,
    setBookingsViewMode,
    setSearchOpen,
    setHubOpen,
    openOverlay,
    navigateToFind,
    setActiveTab,
  } = useSaltmineMobileApp();

  const [selectedDate, setSelectedDate] = useState<{ monthIndex: number; day: number }>({
    monthIndex: DECK_CALENDAR.monthIndex,
    day: DECK_CALENDAR.selectedDay,
  });
  const [calendarMonthIndex, setCalendarMonthIndex] = useState<number>(DECK_CALENDAR.monthIndex);
  const [calendarDay, setCalendarDay] = useState<number>(DECK_CALENDAR.selectedDay);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [presenceOpen, setPresenceOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addedBookingLabels, setAddedBookingLabels] = useState<Record<string, string[]>>({});
  const locationRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const teamFilter = filterValues.team ?? "";
  const bookingTypeFilter = filterValues["booking-type"] ?? "Show all";

  const timelineDay = useMemo(
    () =>
      findDeckTimelineDay(selectedDate.monthIndex, selectedDate.day) ?? DECK_TIMELINE_DAYS[0],
    [selectedDate.day, selectedDate.monthIndex],
  );

  const filteredBookings = useMemo(
    () => filterBookingsByKind(timelineDay.bookings, bookingTypeFilter),
    [timelineDay.bookings, bookingTypeFilter],
  );

  const avatars = useMemo(
    () =>
      filterAvatarsByTeam(DECK_OFFICE_AVATARS, teamFilter).map((avatar) => ({
        initials: avatar.initials,
        color: avatar.color,
        memberId: avatar.memberId,
      })),
    [teamFilter],
  );

  const teamName = resolveTeamNameFromFilter(teamFilter);
  const occupancyCount = avatars.length;
  const presencePeople = officePresencePeople(teamFilter, timelineDay);
  const presenceSummary = officePresenceSummary(teamFilter, timelineDay, presencePeople);

  const selectedBooking = selectedBookingId ? findDeckBooking(selectedBookingId) : null;

  useEffect(() => {
    if (!locationOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!locationRef.current?.contains(event.target as Node)) setLocationOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [locationOpen]);

  function handleBookingAction(label: string) {
    showToast(`${label} — demo`);
  }

  function handleAddDeskBooking() {
    const label = "Desk — Floor 21";
    setAddedBookingLabels((prev) => ({
      ...prev,
      [timelineDay.id]: [...(prev[timelineDay.id] ?? []), label],
    }));
    showToast(`${content.addedBookingToast} ${formatMobileDayTitle(timelineDay)}`);
  }

  function handleAddBookingMenuSelect(actionId: SaltmineMobileAddBookingActionId) {
    setAddMenuOpen(false);

    switch (actionId) {
      case "team-day":
        setActiveTab("teams");
        showToast("Create a team day — demo");
        break;
      case "car-parking":
        navigateToFind();
        showToast("Find car parking — demo");
        break;
      case "meeting-space":
        navigateToFind();
        showToast("Find a meeting space — demo");
        break;
      case "desk":
        handleAddDeskBooking();
        break;
      default:
        break;
    }
  }

  const showDailyChrome = bookingsViewMode === "Daily";
  const occupancyLabel =
    occupancyCount > 0 ? teamOccupancyShortLabel(occupancyCount, teamName) : undefined;

  return (
    <div className="relative flex h-full min-h-0 flex-col" style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}>
      <div
        className={SALTMINE_MOBILE_STICKY_CHROME_CLASS}
        style={{ borderColor: SALTMINE_HAIRLINE }}
      >
        <div className={SALTMINE_MOBILE_PAGE_HEADER_CLASS}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className={SALTMINE_MOBILE_PAGE_TITLE_CLASS} style={{ color: SALTMINE.text }}>
              {content.pageTitle}
            </h1>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                aria-label="Search workspace"
                onClick={() => setSearchOpen(true)}
                className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
                style={{ color: SALTMINE.textSecondary }}
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
              </button>
              <button
                type="button"
                aria-label="More options"
                onClick={() => setHubOpen(true)}
                className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
                style={{ color: SALTMINE.textSecondary }}
              >
                <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
              </button>
              <SaltmineMobileProfileButton onClick={() => openOverlay("profile")} />
            </div>
          </div>

          {showDailyChrome ? (
            <MobileWeekStrip
              selected={selectedDate}
              onSelect={(monthIndex, day) => setSelectedDate({ monthIndex, day })}
              reducedMotion={reducedMotion}
            />
          ) : null}
        </div>

        {showDailyChrome ? (
          <div className={`${SALTMINE_MOBILE_CONTENT_X_CLASS} pb-3 pt-1`}>
            <SaltmineMobileBookingsFilters
              bookingType={bookingTypeFilter}
              team={teamFilter}
              onBookingTypeChange={(value) => setFilterValue("booking-type", value)}
              onTeamChange={(value) => setFilterValue("team", value)}
            />
          </div>
        ) : null}
      </div>

      <div
        className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} pt-3`}
        style={{
          paddingBottom:
            SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING +
            (showDailyChrome ? SALTMINE_MOBILE_FAB_SCROLL_CLEARANCE : 16),
        }}
      >
        {showDailyChrome ? (
          <>
            <div className="mb-3 flex flex-col gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "#EF4444" }}
                  aria-hidden
                />
                <h2 className={SALTMINE_MOBILE_SECTION_TITLE_CLASS} style={{ color: SALTMINE.text }}>
                  {formatMobileDayTitle(timelineDay)}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <div ref={locationRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={locationOpen}
                    aria-haspopup="listbox"
                    onClick={() => setLocationOpen((open) => !open)}
                    className={`${SALTMINE_MOBILE_CHIP_CLASS} font-semibold ${FOCUS_RING}`}
                    style={{
                      backgroundColor: SALTMINE.accentSolid,
                      color: SALTMINE.primaryDark,
                    }}
                  >
                    <Home className="h-3.5 w-3.5" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                    {workLocation}
                    <ChevronDown className="h-3.5 w-3.5 opacity-80" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                  </button>
                  {locationOpen ? (
                    <ul
                      role="listbox"
                      className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[140px] rounded-lg border bg-white py-0.5 shadow-lg"
                      style={{ borderColor: SALTMINE_HAIRLINE }}
                    >
                      {WORK_LOCATION_OPTIONS.map((option) => (
                        <li key={option} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={option === workLocation}
                            onClick={() => {
                              setWorkLocation(option);
                              setLocationOpen(false);
                              showToast(`Work location set to ${option}`);
                            }}
                            className={`w-full px-3 py-2.5 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} ${FOCUS_RING}`}
                            style={{
                              color: option === workLocation ? SALTMINE.primary : SALTMINE.text,
                              fontWeight: option === workLocation ? 700 : 500,
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <span
                  className={SALTMINE_MOBILE_CHIP_CLASS}
                  style={{
                    backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                    color: SALTMINE.textSecondary,
                  }}
                >
                  <Cloud className="h-3 w-3" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                  {timelineDay.weatherLabel}
                </span>
                {timelineDay.showCommutePill ? (
                  <span
                    className={SALTMINE_MOBILE_CHIP_CLASS}
                    style={{
                      backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                      color: SALTMINE.textSecondary,
                    }}
                  >
                    <Car className="h-3.5 w-3.5" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                    {DECK_OFFICE_PRESENCE.commuteLabel}
                    <Check className="h-3 w-3 text-[#22C55E]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <MobilePresenceRow
                avatars={avatars}
                occupancyLabel={occupancyLabel}
                onPress={() => setPresenceOpen(true)}
                reducedMotion={reducedMotion}
              />
            </div>

            {filteredBookings.length === 0 ? (
              <SaltmineMobileEmptyState>
                {bookingTypeFilter === "Show all"
                  ? "No bookings for this day"
                  : "No bookings match this filter"}
              </SaltmineMobileEmptyState>
            ) : (
              <div className={SALTMINE_MOBILE_LIST_GAP_CLASS}>
                {filteredBookings.map((booking) => (
                  <MobileBookingCard
                    key={booking.id}
                    booking={booking}
                    onAction={handleBookingAction}
                    onSelect={
                      BOOKING_DETAIL_KINDS.has(booking.kind)
                        ? () => {
                            setSelectedBookingId(booking.id);
                            setDetailOpen(true);
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {(addedBookingLabels[timelineDay.id] ?? []).map((label, index) => (
              <p
                key={`${label}-${index}`}
                className={`m-0 mt-3 rounded-[12px] bg-white px-3.5 py-2.5 ${SALTMINE_MOBILE_CAPTION_CLASS}`}
                style={{ color: SALTMINE.textSecondary }}
              >
                {label}
              </p>
            ))}
          </>
        ) : bookingsViewMode === "Weekly" ? (
          <SaltmineMobileWeeklyView
            bookingTypeFilter={bookingTypeFilter}
            selected={selectedDate}
            onSelectDay={(monthIndex, day) => {
              setSelectedDate({ monthIndex, day });
              setBookingsViewMode("Daily");
            }}
          />
        ) : (
          <DeckMonthlyCalendar
            layout="mobile"
            monthIndex={calendarMonthIndex}
            selectedDay={calendarDay}
            bookingTypeFilter={bookingTypeFilter}
            monthMenuOpen={monthMenuOpen}
            onPrevMonth={() => setCalendarMonthIndex((index) => Math.max(0, index - 1))}
            onNextMonth={() => setCalendarMonthIndex((index) => Math.min(1, index + 1))}
            onToggleMonthMenu={() => setMonthMenuOpen((open) => !open)}
            onCloseMonthMenu={() => setMonthMenuOpen(false)}
            onSelectMonth={(index) => {
              setCalendarMonthIndex(index);
              setMonthMenuOpen(false);
            }}
            onSelectDay={(day) => {
              setCalendarDay(day);
              const match = findDeckTimelineDay(calendarMonthIndex, day);
              if (match) {
                setSelectedDate({ monthIndex: calendarMonthIndex, day });
                setBookingsViewMode("Daily");
              } else {
                showToast(`No bookings scheduled for ${day}`);
              }
            }}
            onToday={() => {
              setCalendarMonthIndex(DECK_CALENDAR.monthIndex);
              setCalendarDay(DECK_CALENDAR.selectedDay);
              setSelectedDate({
                monthIndex: DECK_CALENDAR.monthIndex,
                day: DECK_CALENDAR.selectedDay,
              });
              setBookingsViewMode("Daily");
            }}
          />
        )}
      </div>

      {showDailyChrome && !addMenuOpen ? (
        <button
          type="button"
          aria-label={content.addBookingLabel}
          aria-expanded={addMenuOpen}
          onClick={() => setAddMenuOpen(true)}
          className={`absolute right-4 z-20 ${SALTMINE_MOBILE_FAB_CLASS} ${reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS}`}
          style={{
            bottom: SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
            backgroundColor: SALTMINE.primary,
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.2} aria-hidden />
        </button>
      ) : null}

      <SaltmineMobileAddBookingSheet
        open={addMenuOpen}
        onClose={() => setAddMenuOpen(false)}
        onSelect={handleAddBookingMenuSelect}
        reducedMotion={reducedMotion}
      />

      {presenceOpen ? (
        <div className="absolute inset-0 z-30 flex flex-col bg-white" role="dialog" aria-label="Office presence">
          <div
            className={SALTMINE_MOBILE_OVERLAY_HEADER_CLASS}
            style={{ borderColor: SALTMINE_HAIRLINE }}
          >
            <button
              type="button"
              aria-label="Back to bookings"
              onClick={() => setPresenceOpen(false)}
              className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
              style={{ color: SALTMINE.text }}
            >
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
            </button>
            <span className={SALTMINE_MOBILE_OVERLAY_TITLE_CLASS} style={{ color: SALTMINE.text }}>
              {content.officePresencePanelLabel}
            </span>
          </div>
          <div className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} py-3`}>
            <OfficePresencePanel
              officeName={DECK_OFFICE_PRESENCE.officeName}
              teamName={teamName}
              dayTitle={formatMobileDayTitle(timelineDay)}
              summary={presenceSummary}
              people={presencePeople}
              layout="mobile"
              onClose={() => setPresenceOpen(false)}
              onFloorPlan={() => {
                setPresenceOpen(false);
                navigateToFind();
                showToast(`${content.officePresenceFloorPlanToast} ${DECK_OFFICE_PRESENCE.officeName}`);
              }}
            />
          </div>
        </div>
      ) : null}

      {detailOpen && selectedBooking ? (
        <div
          className="absolute inset-0 z-30 flex flex-col bg-white"
          role="dialog"
          aria-label="Booking details"
        >
          <div
            className={SALTMINE_MOBILE_OVERLAY_HEADER_CLASS}
            style={{ borderColor: SALTMINE_HAIRLINE }}
          >
            <button
              type="button"
              aria-label="Back to bookings"
              onClick={() => setDetailOpen(false)}
              className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
              style={{ color: SALTMINE.text }}
            >
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
            </button>
            <span className={SALTMINE_MOBILE_OVERLAY_TITLE_CLASS} style={{ color: SALTMINE.text }}>
              {content.bookingDetailPanelLabel}
            </span>
          </div>
          <div className={SALTMINE_MOBILE_SCROLL_Y_CLASS}>
            <DeckBookingDetailPanel
              layout="mobile"
              booking={selectedBooking.booking}
              day={selectedBooking.day}
              onClose={() => setDetailOpen(false)}
              onAction={(label) => {
                handleBookingAction(label);
                setDetailOpen(false);
              }}
              onMap={() => showToast(`${content.bookingDetailMapToast} ${selectedBooking.booking.title}`)}
              onShare={() =>
                showToast(`${content.bookingDetailShareToast} ${selectedBooking.booking.title}`)
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
