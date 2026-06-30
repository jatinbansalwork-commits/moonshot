"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
import { DeckLastMinutePanel } from "@/components/slider/saltmine-deck-last-minute-panel";
import { DeckMonthlyCalendar } from "@/components/slider/saltmine-deck-monthly-calendar";
import { SaltmineDashboardCenterDialog } from "@/components/slider/saltmine-dashboard-center-dialog";
import { WaitlistQueueDetailsDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
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
import { SaltmineAvatarStack } from "@/components/slider/saltmine-avatar-stack";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_CALENDAR,
  DECK_OFFICE_AVATARS,
  DECK_OFFICE_PRESENCE,
  DECK_TIMELINE_DAYS,
  deckBookingActionLabel,
  deckBookingActionStyle,
  resolveDeckBookingAction,
  filterAvatarsByTeam,
  filterBookingsByKind,
  findDeckBooking,
  findDeckTimelineDay,
  resolveTeamNameFromFilter,
  type DeckBookingItem,
  type DeckBookingKind,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import {
  appendAddedBookingToDay,
  type DeckAddedDayBookings,
} from "@/lib/saltmine-last-minute-booking";
import { WORK_LOCATION_OPTIONS } from "@/lib/saltmine-bookings-dashboard-data";
import {
  officePresencePeople,
  officePresenceSummary,
} from "@/lib/saltmine-office-presence-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import {
  mobileBookingsSubtitle,
  mobileDayContextLabel,
  mobileGreeting,
  mobilePresenceLead,
} from "@/lib/slide-screens/slide-25-mobile-content";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_BORDER_COLOR,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CARD_PAD_CLASS,
  SALTMINE_MOBILE_CARD_SHADOW_STYLE,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_CHIP_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
  SALTMINE_MOBILE_FAB_CLASS,
  SALTMINE_MOBILE_FAB_SCROLL_CLEARANCE,
  SALTMINE_MOBILE_FAB_SCRIM_STYLE,
  SALTMINE_MOBILE_FAB_SHADOW_STYLE,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_KIND_BADGE_CLASS,
  SALTMINE_MOBILE_LIST_GAP_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_OVERLAY_HEADER_CLASS,
  SALTMINE_MOBILE_OVERLAY_TITLE_CLASS,
  SALTMINE_MOBILE_PAGE_HEADER_CLASS,
  SALTMINE_MOBILE_PAGE_SUBTITLE_CLASS,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_PRIMARY_CTA_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SCROLL_SURFACE_ATTR,
  SALTMINE_MOBILE_SECONDARY_CLASS,
  SALTMINE_MOBILE_SECTION_EYEBROW_CLASS,
  SALTMINE_MOBILE_STICKY_CHROME_CLASS,
  SALTMINE_MOBILE_STICKY_CHROME_SHADOW_STYLE,
  SALTMINE_MOBILE_SURFACE_CHIP_CLASS,
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
const TOMORROW_RING = { monthIndex: 0, day: 31 } as const;

function isSameCalendarDay(
  a: { monthIndex: number; day: number },
  b: { monthIndex: number; day: number },
): boolean {
  return a.monthIndex === b.monthIndex && a.day === b.day;
}

const BOOKING_DETAIL_KINDS = new Set<DeckBookingKind>(["parking", "desk", "meeting"]);

function formatMobileDayTitle(day: DeckTimelineDay): string {
  const match = day.title.match(/(?:Today—|Tomorrow—)?(\w{3}\s+\d+\s+\w+)/);
  if (match?.[1]) return match[1];
  return day.title.replace(/^Today—/, "").replace(/^Tomorrow—/, "");
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
    <div className="pt-0.5">
      <div className="grid grid-cols-7 justify-items-center">
        {MOBILE_WEEK_STRIP.map((item, index) => (
          <span
            key={`label-${index}`}
            className={`mb-1 flex h-5 w-9 items-center justify-center ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold leading-none`}
            style={{
              color: item.weekend ? "rgba(145, 158, 171, 0.55)" : SALTMINE.textMuted,
            }}
          >
            {item.weekday}
          </span>
        ))}
      </div>
      <div
        className="grid grid-cols-7 justify-items-center border-b pb-2.5"
        style={{ borderColor: "rgba(145, 158, 171, 0.12)" }}
      >
        {MOBILE_WEEK_STRIP.map((item, index) => {
          const isSelected =
            selected.monthIndex === item.monthIndex && selected.day === item.day;
          const isToday =
            TODAY_RING.monthIndex === item.monthIndex && TODAY_RING.day === item.day;

          return (
            <button
              key={`date-${index}`}
              type="button"
              aria-label={`${item.weekday} ${item.day}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(item.monthIndex, item.day)}
              className={`relative inline-flex h-10 w-10 flex-col items-center justify-center rounded-full ${SALTMINE_MOBILE_BODY_CLASS} font-semibold tabular-nums leading-none transition-all duration-150 ${pressClass} ${FOCUS_RING}`}
              style={{
                backgroundColor: isSelected ? SALTMINE.primary : "transparent",
                color: isSelected
                  ? "#FFFFFF"
                  : item.weekend
                    ? "rgba(99, 115, 129, 0.65)"
                    : SALTMINE.textSecondary,
                boxShadow: isSelected ? "0 2px 8px rgba(0, 111, 236, 0.26)" : undefined,
                transform: isSelected && !reducedMotion ? "scale(1.04)" : undefined,
              }}
            >
              {item.day}
              {isToday && !isSelected ? (
                <span
                  className="absolute bottom-1 h-1 w-1 rounded-full"
                  style={{ backgroundColor: SALTMINE.primary }}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobilePresenceRow({
  avatars,
  leadLabel,
  count,
  onPress,
  reducedMotion,
}: {
  avatars: readonly { initials: string; color: string; memberId: string }[];
  leadLabel: string;
  count: number;
  onPress: () => void;
  reducedMotion: boolean;
}) {
  const pressClass = reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`w-full rounded-[14px] border bg-white px-4 py-3 text-left ${pressClass} ${FOCUS_RING}`}
      style={{
        borderColor: "rgba(145, 158, 171, 0.2)",
        ...SALTMINE_MOBILE_CARD_SHADOW_STYLE,
      }}
      aria-label={`View who is in the office — ${leadLabel}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[12px]"
          style={{
            backgroundColor: count > 0 ? "rgba(0, 111, 236, 0.08)" : "rgba(145, 158, 171, 0.1)",
          }}
          aria-hidden
        >
          <span
            className={`${SALTMINE_MOBILE_BODY_CLASS} font-bold tabular-nums leading-none`}
            style={{ color: count > 0 ? SALTMINE.primary : SALTMINE.textMuted }}
          >
            {count}
          </span>
          <span
            className={`mt-0.5 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold leading-none`}
            style={{ color: SALTMINE.textMuted }}
          >
            in
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`m-0 ${SALTMINE_MOBILE_SECTION_EYEBROW_CLASS}`}
            style={{ color: SALTMINE.textMuted }}
          >
            Who&apos;s in today
          </p>
          <p
            className={`m-0 mt-1 ${SALTMINE_MOBILE_SECONDARY_CLASS} font-semibold leading-snug`}
            style={{ color: SALTMINE.text }}
          >
            {leadLabel}
          </p>
          <div className="mt-2 min-w-0 overflow-hidden">
            <SaltmineAvatarStack
              people={avatars}
              size={PRESENCE_AVATAR_SIZE}
              maxVisible={5}
              overflowClassName={`${SALTMINE_MOBILE_CAPTION_CLASS} font-bold`}
            />
          </div>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 opacity-40"
          strokeWidth={SALTMINE_MOBILE_ICON.stroke}
          style={{ color: SALTMINE.textMuted }}
          aria-hidden
        />
      </div>
    </button>
  );
}

const BOOKING_KIND_LABEL: Record<DeckBookingKind, string> = {
  desk: "Desk",
  meeting: "Meeting",
  parking: "Parking",
};

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
  const accentColor = isMeeting ? "#F59E0B" : booking.kind === "parking" ? "#6366F1" : "#EF4444";
  const titleColor = isMeeting ? "#B45309" : SALTMINE.text;
  const actionLabel = deckBookingActionLabel(resolveDeckBookingAction(booking));
  const actionStyle = deckBookingActionStyle(resolveDeckBookingAction(booking));
  const kindLabel = BOOKING_KIND_LABEL[booking.kind];

  const subtitle = isMeeting
    ? booking.location
    : [booking.duration, booking.location].filter(Boolean).join(" · ");

  const bookingMeta = (
    <div className="min-w-0 flex-1 py-0.5">
      <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
        <span
          className={SALTMINE_MOBILE_KIND_BADGE_CLASS}
          style={{
            backgroundColor: `${accentColor}14`,
            color: accentColor,
          }}
        >
          {kindLabel}
        </span>
        <span
          className={`shrink-0 ${SALTMINE_MOBILE_BODY_CLASS} font-bold tabular-nums`}
          style={{ color: SALTMINE.text }}
        >
          {booking.time}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5">
        {isMeeting ? (
          <Video
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={SALTMINE_MOBILE_ICON.stroke}
            style={{ color: accentColor }}
            aria-hidden
          />
        ) : (
          <Repeat
            className="h-3 w-3 shrink-0 opacity-45"
            strokeWidth={SALTMINE_MOBILE_ICON.stroke}
            style={{ color: SALTMINE.textMuted }}
            aria-hidden
          />
        )}
        <span
          className={`truncate ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`}
          style={{ color: titleColor }}
        >
          {booking.title}
        </span>
      </div>
      <p className={`m-0 mt-1 ${SALTMINE_MOBILE_CAPTION_CLASS} leading-snug`} style={{ color: SALTMINE.textMuted }}>
        {subtitle}
      </p>
      {booking.attendees?.length ? (
        <div className="mt-2.5">
          <SaltmineAvatarStack
            people={booking.attendees.map((person) => ({
              letter: person.letter,
              color: person.color,
            }))}
            size={ATTENDEE_SIZE}
            maxVisible={4}
            overflowClassName={`${SALTMINE_MOBILE_CAPTION_CLASS} font-bold`}
          />
        </div>
      ) : null}
    </div>
  );

  const canOpenDetails = BOOKING_DETAIL_KINDS.has(booking.kind) && onSelect;

  return (
    <article
      className={`flex overflow-hidden ${SALTMINE_MOBILE_CARD_CLASS}`}
      style={{
        borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR,
        ...SALTMINE_MOBILE_CARD_SHADOW_STYLE,
      }}
    >
      <span
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
      <div className={`min-w-0 flex-1 ${SALTMINE_MOBILE_CARD_PAD_CLASS}`}>
        {canOpenDetails ? (
          <button
            type="button"
            aria-label={`${content.bookingDetailOpenLabel} ${booking.title}`}
            onClick={onSelect}
            className={`w-full rounded-[8px] text-left outline-none focus:outline-none focus-visible:outline-none ${FOCUS_RING}`}
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
            className={`mt-3 ${SALTMINE_MOBILE_PRIMARY_CTA_CLASS}`}
            style={actionStyle}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </article>
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
  const [waitlistDetailsOpen, setWaitlistDetailsOpen] = useState(false);
  const [addedByDay, setAddedByDay] = useState<Record<string, DeckAddedDayBookings>>({});
  const locationRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const teamFilter = filterValues.team ?? "";
  const bookingTypeFilter = filterValues["booking-type"] ?? "Show all";

  const timelineDay = useMemo(
    () =>
      findDeckTimelineDay(selectedDate.monthIndex, selectedDate.day) ?? DECK_TIMELINE_DAYS[0],
    [selectedDate.day, selectedDate.monthIndex],
  );

  const filteredBookings = useMemo(() => {
    const added = addedByDay[timelineDay.id]?.bookings ?? [];
    return filterBookingsByKind([...timelineDay.bookings, ...added], bookingTypeFilter);
  }, [addedByDay, timelineDay.bookings, timelineDay.id, bookingTypeFilter]);

  const lastMinute = addedByDay[timelineDay.id]?.lastMinute ?? timelineDay.lastMinute;

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

  const selectedBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    const fromTimeline = findDeckBooking(selectedBookingId);
    if (fromTimeline) return fromTimeline;

    for (const [dayId, patch] of Object.entries(addedByDay)) {
      const booking = patch.bookings.find((entry) => entry.id === selectedBookingId);
      if (!booking) continue;
      const day = findDeckTimelineDay(timelineDay.calendar.monthIndex, timelineDay.calendar.day);
      return {
        booking,
        day: day?.id === dayId ? day : { ...timelineDay, id: dayId },
      };
    }

    return null;
  }, [addedByDay, selectedBookingId, timelineDay]);

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
    setAddedByDay((prev) =>
      appendAddedBookingToDay(prev, timelineDay.id, timelineDay, {
        label: "Desk 21.P3.2",
        actionId: "desk",
      }),
    );
    showToast(`${content.addedBookingToast} ${formatMobileDayTitle(timelineDay)}`);
  }

  function handleAddBookingMenuSelect(actionId: SaltmineMobileAddBookingActionId) {
    setAddMenuOpen(false);

    switch (actionId) {
      case "team-day":
        showToast("Create a team day — demo");
        break;
      case "car-parking":
        showToast("Find car parking — demo");
        break;
      case "meeting-space":
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
  const isTodaySelected = isSameCalendarDay(selectedDate, TODAY_RING);
  const isTomorrowSelected = isSameCalendarDay(selectedDate, TOMORROW_RING);
  const dayTitle = formatMobileDayTitle(timelineDay);
  const dayContextLabel = mobileDayContextLabel(dayTitle, isTodaySelected, isTomorrowSelected);
  const presenceLead = mobilePresenceLead(occupancyCount, teamName);
  const bookingsSubtitle = mobileBookingsSubtitle(
    dayTitle,
    filteredBookings.length,
    displayName,
    isTodaySelected,
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col" style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}>
      <div
        className={SALTMINE_MOBILE_STICKY_CHROME_CLASS}
        style={{ borderColor: SALTMINE_HAIRLINE, ...SALTMINE_MOBILE_STICKY_CHROME_SHADOW_STYLE }}
      >
        <div className={SALTMINE_MOBILE_PAGE_HEADER_CLASS}>
          <div className="mb-2.5 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className={SALTMINE_MOBILE_PAGE_TITLE_CLASS} style={{ color: SALTMINE.text }}>
                {content.pageTitle}
              </h1>
              {showDailyChrome ? (
                <p
                  className={`${SALTMINE_MOBILE_PAGE_SUBTITLE_CLASS} mt-1`}
                  style={{ color: SALTMINE.textMuted }}
                >
                  {bookingsSubtitle}
                </p>
              ) : (
                <p
                  className={`${SALTMINE_MOBILE_PAGE_SUBTITLE_CLASS} mt-1`}
                  style={{ color: SALTMINE.textMuted }}
                >
                  {mobileGreeting(displayName)}
                </p>
              )}
            </div>
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
        {...SALTMINE_MOBILE_SCROLL_SURFACE_ATTR}
        className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} pt-4`}
        style={{
          paddingBottom:
            SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING +
            (showDailyChrome ? SALTMINE_MOBILE_FAB_SCROLL_CLEARANCE : 16),
        }}
      >
        {showDailyChrome ? (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p
                className={`m-0 ${SALTMINE_MOBILE_SECTION_EYEBROW_CLASS}`}
                style={{ color: isTodaySelected ? SALTMINE.primary : SALTMINE.textMuted }}
              >
                {dayContextLabel}
              </p>
            </div>
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <div ref={locationRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={locationOpen}
                    aria-haspopup="listbox"
                    onClick={() => setLocationOpen((open) => !open)}
                    className={`${SALTMINE_MOBILE_SURFACE_CHIP_CLASS} font-semibold ${FOCUS_RING}`}
                    style={{
                      backgroundColor: SALTMINE.accentSolid,
                      borderColor: "rgba(0, 111, 236, 0.16)",
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
                  className={SALTMINE_MOBILE_SURFACE_CHIP_CLASS}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(145, 158, 171, 0.18)",
                    color: SALTMINE.textSecondary,
                  }}
                >
                  <Cloud className="h-3.5 w-3.5" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
                  {timelineDay.weatherLabel}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <MobilePresenceRow
                avatars={avatars}
                leadLabel={presenceLead}
                count={occupancyCount}
                onPress={() => setPresenceOpen(true)}
                reducedMotion={reducedMotion}
              />
            </div>

            {lastMinute ? (
              <div className="mb-4">
                <DeckLastMinutePanel
                  context={lastMinute}
                  onViewWaitlist={() => setWaitlistDetailsOpen(true)}
                  onBookAlternative={(label) => showToast(`Booked ${label} — demo`)}
                />
              </div>
            ) : null}

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
        <>
          <div
            className="pointer-events-none absolute inset-x-0 z-10 h-24"
            style={{ bottom: 0, ...SALTMINE_MOBILE_FAB_SCRIM_STYLE }}
            aria-hidden
          />
          <button
            type="button"
            aria-label={content.addBookingLabel}
            aria-expanded={addMenuOpen}
            onClick={() => setAddMenuOpen(true)}
            className={`absolute right-4 z-20 ${SALTMINE_MOBILE_FAB_CLASS} ${reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS}`}
            style={{
              bottom: SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
              backgroundColor: SALTMINE.primary,
              ...SALTMINE_MOBILE_FAB_SHADOW_STYLE,
            }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
        </>
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
              showSummary={false}
              onClose={() => setPresenceOpen(false)}
              onFloorPlan={() => {
                setPresenceOpen(false);
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

      {waitlistDetailsOpen ? (
        <SaltmineDashboardCenterDialog
          ariaLabel="Waitlist"
          onClose={() => setWaitlistDetailsOpen(false)}
        >
          <WaitlistQueueDetailsDialogFlow close={() => setWaitlistDetailsOpen(false)} />
        </SaltmineDashboardCenterDialog>
      ) : null}
    </div>
  );
}
