"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Globe,
  Home,
  Inbox,
  LayoutGrid,
  MapPin,
  Presentation,
  Search,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  SALTMINE_BOOKINGS_DASHBOARD_CONTENT,
  type DashboardNavIcon,
} from "@/lib/saltmine-bookings-dashboard-content";
import { OfficePresencePanel } from "@/components/slider/saltmine-office-presence-panel";
import { DeckBookingDetailPanel } from "@/components/slider/saltmine-deck-booking-detail-panel";
import { DeckMonthlyCalendar } from "@/components/slider/saltmine-deck-monthly-calendar";
import { FindASpaceMainView } from "@/components/slider/saltmine-find-space-view";
import { MyTeamsMainView } from "@/components/slider/saltmine-teams-view";
import {
  officePresencePeople,
  officePresenceSummary,
  OFFICE_PRESENCE_OFFICE_NAME,
} from "@/lib/saltmine-office-presence-data";
import { InboxDetailPanel, InboxMainView, InboxNotificationPopup } from "@/components/slider/saltmine-inbox-view";
import {
  BookingGridDateNav,
  BookingGridMainView,
} from "@/components/slider/saltmine-booking-grid-view";
import {
  ConferenceGridDateNav,
  ConferenceGridMainView,
  ConferenceGridNewGridButton,
} from "@/components/slider/saltmine-conference-grid-view";
import { getInboxNotificationById, INBOX_NOTIFICATION_POPUP_FEATURED_ID, INBOX_NOTIFICATIONS } from "@/lib/saltmine-inbox-data";
import {
  DeckDaySection,
} from "@/components/slider/saltmine-deck-bookings-view";
import {
  DECK_FILTER_DEFAULTS,
  DECK_BOOKING_TYPE_OPTIONS,
  DECK_CALENDAR,
  DECK_OFFICE_AVATARS,
  DECK_TEAM_OPTIONS,
  DECK_TIMELINE_DAYS,
  deckTimelineDaysForMonth,
  findDeckBooking,
  findDeckTimelineDay,
  filterAvatarsByTeam,
  filterBookingsByKind,
  resolveTeamNameFromFilter,
  teamOccupancyLabel,
} from "@/lib/saltmine-deck-bookings-data";
import { DECK_MONTHLY_TODAY } from "@/lib/saltmine-deck-monthly-calendar-data";
import { DEFAULT_CHECKED_MEMBER_IDS } from "@/lib/saltmine-teams-data";
import {
  CALENDAR_MONTHS,
  COWORKERS_IN_OFFICE,
  INITIAL_DAYS,
  LANGUAGE_OPTIONS,
  LOCALE_OPTIONS,
  MONTHLY_DUMMY,
  SEARCH_ITEMS,
  TEAM_OPTIONS,
  WEEKLY_DUMMY,
  WORK_LOCATION_OPTIONS,
  type DayId,
} from "@/lib/saltmine-bookings-dashboard-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_MENU_SHADOW,
  SALTMINE_ONBOARDING,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

const DASHBOARD_RAIL_WIDTH = 148;
const INBOX_DETAIL_RAIL_WIDTH = 168;
const ICON_STROKE = 1.65;
const HAIRLINE = SALTMINE_HAIRLINE;
const SURFACE_INSET = SALTMINE_SURFACE_INSET;
const MENU_SHADOW = SALTMINE_MENU_SHADOW;

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

type ViewMode = (typeof content.viewModes)[number];

function avatarLetter(label: string) {
  return label.charAt(0).toUpperCase();
}

const NAV_ICONS: Record<DashboardNavIcon, LucideIcon> = {
  bookings: CalendarDays,
  search: Search,
  inbox: Inbox,
  teams: Users,
  grid: LayoutGrid,
  conference: Presentation,
  help: CircleHelp,
  locale: MapPin,
  language: Globe,
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, enabled]);
}

type ToastState = {
  message: string;
  onUndo?: () => void;
} | null;

function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, onUndo?: () => void) => {
    setToast({ message: text, onUndo });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, dismissToast };
}

function DashboardIcon({
  icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  const Icon = icon;
  return <Icon className={className} strokeWidth={ICON_STROKE} aria-hidden />;
}

function motionClass(reducedMotion: boolean, className: string) {
  return reducedMotion ? "" : className;
}

function DashboardMenu({
  options,
  value,
  onSelect,
  onClose,
  id,
  placement = "below",
}: {
  options: readonly string[];
  value: string;
  onSelect: (option: string) => void;
  onClose: () => void;
  id: string;
  placement?: "above" | "below";
}) {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const first = menuRef.current?.querySelector<HTMLElement>('[role="option"]');
    first?.focus();
  }, []);

  return (
    <ul
      ref={menuRef}
      id={id}
      role="listbox"
      className={`no-scrollbar absolute left-0 right-0 z-50 max-h-[140px] overflow-y-auto rounded-lg border bg-white py-0.5 ${placement === "above" ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]"}`}
      style={{ borderColor: HAIRLINE, boxShadow: MENU_SHADOW }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <li key={option} role="none">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
              className={`flex w-full items-center gap-1.5 px-2 py-1.5 text-left transition-colors duration-100 hover:bg-[rgba(0,111,236,0.06)] ${TEXT_XS} ${FOCUS_RING}`}
              style={{
                color: selected ? SALTMINE.primary : SALTMINE.text,
                fontWeight: selected ? 700 : 500,
              }}
            >
              {selected ? (
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: SALTMINE.primary }}
                  aria-hidden
                />
              ) : (
                <span className="h-1 w-1 shrink-0" aria-hidden />
              )}
              {option}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function NavItem({
  label,
  active = false,
  icon,
  localeFlag,
  badge,
  reducedMotion,
  disabled = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  icon: DashboardNavIcon;
  localeFlag?: string;
  badge?: boolean;
  reducedMotion: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Icon = NAV_ICONS[icon];
  const isLocale = icon === "locale" && localeFlag;
  const ariaLabel = badge
    ? `${label}, unread notifications`
    : active
      ? `${label}, current page`
      : label;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={`group relative flex w-full min-h-[32px] items-center gap-1.5 rounded-lg px-1.5 py-1 text-left transition-[background-color,color,box-shadow,transform] duration-150 ${disabled ? "cursor-not-allowed opacity-55" : "active:scale-[0.99]"} ${active || disabled ? "" : "hover:bg-[rgba(145,158,171,0.08)]"} ${FOCUS_RING}`}
      style={{
        backgroundColor: active ? SALTMINE.accentSolid : "transparent",
        color: active ? SALTMINE.primaryDark : SALTMINE.textSecondary,
        boxShadow: active
          ? "inset 0 0 0 1px rgba(0, 111, 236, 0.28), 0 1px 2px rgba(0, 111, 236, 0.08)"
          : undefined,
        fontWeight: active ? 700 : 500,
      }}
    >
      {active ? (
        <span
          className={`absolute left-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full ${motionClass(reducedMotion, "transition-transform duration-200")}`}
          style={{ backgroundColor: SALTMINE.primary }}
          aria-hidden
        />
      ) : null}
      <span
        className={`relative inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px] transition-colors duration-150 ${motionClass(reducedMotion, "group-hover:scale-105")}`}
        style={{
          backgroundColor: active ? SALTMINE_ONBOARDING.color.canvas : "transparent",
          color: active ? SALTMINE.primary : SALTMINE.textMuted,
        }}
      >
        {isLocale ? (
          <span className="text-[9px] leading-none" aria-hidden>
            {localeFlag}
          </span>
        ) : (
          <DashboardIcon icon={Icon} className="h-[13px] w-[13px]" />
        )}
        {badge ? (
          <span
            className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full border border-white"
            style={{ backgroundColor: SALTMINE.primary }}
            aria-hidden
          />
        ) : null}
      </span>
      <span className={`truncate font-semibold tracking-[-0.015em] ${TEXT_XS}`}>
        {label}
      </span>
    </button>
  );
}

function FilterSelect({
  filterId,
  label,
  value,
  options,
  icon,
  open,
  onToggle,
  onSelect,
  onClose,
}: {
  filterId: string;
  label: string;
  value: string;
  options: readonly string[];
  icon: "bookmark" | "users";
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const FilterIcon = icon === "bookmark" ? Bookmark : Users;

  useClickOutside(containerRef, onClose, open);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${filterId}-menu` : undefined}
        title={label}
        onClick={onToggle}
        className={`flex h-[30px] w-full items-center gap-1.5 rounded-lg border px-2 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 hover:bg-white active:scale-[0.99] ${FOCUS_RING}`}
        style={{
          backgroundColor: open ? SALTMINE_ONBOARDING.color.canvas : SALTMINE.neutral,
          color: SALTMINE.text,
          borderColor: open ? "rgba(0, 111, 236, 0.32)" : "transparent",
          boxShadow: open ? "0 0 0 3px rgba(0, 111, 236, 0.12)" : SURFACE_INSET,
        }}
      >
        <span
          className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px]"
          style={{
            backgroundColor: open ? SALTMINE.accentSolid : SALTMINE_ONBOARDING.color.canvas,
            color: SALTMINE.primary,
            boxShadow: SURFACE_INSET,
          }}
        >
          <DashboardIcon icon={FilterIcon} className="h-[11px] w-[11px]" />
        </span>
        <span className={`min-w-0 flex-1 truncate font-semibold tracking-[-0.01em] ${TEXT_XS}`}>
          {value}
        </span>
        <ChevronDown
          className={`h-2.5 w-2.5 shrink-0 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
          style={{ color: SALTMINE.textMuted }}
          aria-hidden
        />
      </button>
      {open ? (
        <DashboardMenu
          id={`${filterId}-menu`}
          options={options}
          value={value}
          onSelect={onSelect}
          onClose={onClose}
        />
      ) : null}
    </div>
  );
}

function WorkLocationBadge({
  workLocation,
  locationOpen,
  onToggleLocation,
  onSelectLocation,
}: {
  workLocation: string;
  locationOpen: boolean;
  onToggleLocation: () => void;
  onSelectLocation: (location: string) => void;
}) {
  const locationRef = useRef<HTMLDivElement>(null);

  useClickOutside(locationRef, () => {
    if (locationOpen) onToggleLocation();
  }, locationOpen);

  return (
    <div ref={locationRef} className="relative">
      <button
        type="button"
        aria-label={`Working location: ${workLocation}`}
        aria-expanded={locationOpen}
        aria-haspopup="listbox"
        aria-controls={locationOpen ? "location-menu" : undefined}
        onClick={onToggleLocation}
        className={`inline-flex h-5 min-w-[24px] shrink-0 items-center gap-0.5 rounded-full px-1.5 font-semibold leading-none transition-[background-color,box-shadow,transform] duration-150 hover:brightness-[0.98] active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
        style={{
          backgroundColor: locationOpen
            ? SALTMINE_ONBOARDING.color.canvas
            : SALTMINE.accentSolid,
          color: SALTMINE.primaryDark,
          boxShadow: locationOpen
            ? "0 0 0 2px rgba(0, 111, 236, 0.2)"
            : `inset 0 0 0 1px rgba(0, 111, 236, 0.14)`,
        }}
      >
        <Home className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
        {workLocation}
        <ChevronDown
          className={`h-2 w-2 opacity-80 transition-transform duration-150 ${locationOpen ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
      </button>
      {locationOpen ? (
        <DashboardMenu
          id="location-menu"
          options={WORK_LOCATION_OPTIONS}
          value={workLocation}
          onSelect={onSelectLocation}
          onClose={onToggleLocation}
        />
      ) : null}
    </div>
  );
}

function WeeklyView({
  reducedMotion,
  onRowClick,
}: {
  reducedMotion: boolean;
  onRowClick?: (day: string) => void;
}) {
  return (
    <div className="space-y-1.5" aria-label="Weekly schedule">
      <p className={`m-0 px-0.5 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        Week of 30 Jan — 3 Feb
      </p>
      {WEEKLY_DUMMY.map((row) => (
        <button
          key={row.day}
          type="button"
          onClick={() => onRowClick?.(row.day)}
          className={`flex w-full items-center justify-between rounded-[8px] border px-2 py-1.5 text-left transition-[box-shadow,transform] duration-150 hover:border-[rgba(0,111,236,0.24)] active:scale-[0.99] ${motionClass(reducedMotion, "hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(145,158,171,0.1)]")} ${FOCUS_RING}`}
          style={{
            borderColor: HAIRLINE,
            backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          }}
        >
          <span className={`font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            {row.day}
          </span>
          <span
            className={`rounded-full px-1.5 py-px font-semibold ${TEXT_MICRO}`}
            style={{
              backgroundColor: SALTMINE.accentSolid,
              color: SALTMINE.primaryDark,
            }}
          >
            {row.location}
          </span>
          <span className={`font-medium tabular-nums ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {row.bookings === 0 ? "No bookings" : `${row.bookings} booking${row.bookings > 1 ? "s" : ""}`}
          </span>
        </button>
      ))}
    </div>
  );
}

function MonthlyView() {
  return (
    <div
      className="space-y-2 rounded-[10px] border p-2.5"
      style={{
        borderColor: HAIRLINE,
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
      }}
      aria-label="Monthly summary"
    >
      <p className={`m-0 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
        February 2026 overview
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        <div
          className="rounded-[8px] px-2 py-1.5"
          style={{ backgroundColor: SALTMINE.accentSolid }}
        >
          <p className={`m-0 font-bold tabular-nums ${TEXT_XS}`} style={{ color: SALTMINE.primary }}>
            {MONTHLY_DUMMY.totalBookings}
          </p>
          <p className={`m-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
            Total bookings
          </p>
        </div>
        <div
          className="rounded-[8px] px-2 py-1.5"
          style={{ backgroundColor: SALTMINE.accentSolid }}
        >
          <p className={`m-0 font-bold tabular-nums ${TEXT_XS}`} style={{ color: SALTMINE.primary }}>
            {MONTHLY_DUMMY.daysInOffice}
          </p>
          <p className={`m-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
            Days in office
          </p>
        </div>
      </div>
      <p className={`m-0 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {MONTHLY_DUMMY.highlight}
      </p>
    </div>
  );
}

function DeckDemoSkeleton({ label }: { label: string }) {
  return (
    <div
      className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed px-4 py-6 text-center"
      style={{ borderColor: HAIRLINE, backgroundColor: "rgba(145, 158, 171, 0.04)" }}
      aria-label={`${label} view preview`}
    >
      <p className={`m-0 font-semibold ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
        {label} view
      </p>
      <p className={`m-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        Switch to Daily for the full demo
      </p>
    </div>
  );
}

function MiniCalendar({
  monthIndex,
  selectedDay,
  bookingDays = [],
  todayDay,
  monthMenuOpen,
  onPrevMonth,
  onNextMonth,
  onToggleMonthMenu,
  onSelectMonth,
  onCloseMonthMenu,
  onSelectDay,
  reducedMotion,
}: {
  monthIndex: number;
  selectedDay: number;
  bookingDays?: readonly number[];
  todayDay?: number;
  monthMenuOpen: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleMonthMenu: () => void;
  onCloseMonthMenu: () => void;
  onSelectMonth: (index: number) => void;
  onSelectDay: (day: number) => void;
  reducedMotion: boolean;
}) {
  const month = CALENDAR_MONTHS[monthIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const weekendIndexes = new Set([5, 6]);
  const labelMatch = month.label.match(/^(.+)\s+(\d{4})$/);
  const monthName = labelMatch?.[1] ?? month.label;
  const year = labelMatch?.[2] ?? "";

  useClickOutside(containerRef, onCloseMonthMenu, monthMenuOpen);

  return (
    <div
      ref={containerRef}
      className="rounded-[12px] p-2.5"
      style={{
        border: `1px solid ${HAIRLINE}`,
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        boxShadow: "0 1px 3px rgba(145, 158, 171, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <div className="relative mb-2 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label="Previous month"
          onClick={onPrevMonth}
          disabled={monthIndex === 0}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] transition-colors duration-150 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ChevronLeft className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        </button>

        <button
          type="button"
          aria-expanded={monthMenuOpen}
          aria-haspopup="listbox"
          onClick={onToggleMonthMenu}
          className={`min-w-0 flex-1 rounded-[6px] px-1 py-0.5 text-center transition-colors duration-150 hover:bg-white/80 ${FOCUS_RING}`}
        >
          <span
            className={`block truncate font-extrabold tracking-[-0.02em] ${TEXT_XS}`}
            style={{ color: SALTMINE.text }}
          >
            {monthName}
          </span>
          {year ? (
            <span
              className={`mt-px block font-semibold tabular-nums ${TEXT_MICRO}`}
              style={{ color: SALTMINE.textMuted }}
            >
              {year}
            </span>
          ) : null}
          <ChevronDown
            className={`mx-auto mt-0.5 h-2 w-2 opacity-60 transition-transform duration-150 ${monthMenuOpen ? "rotate-180" : ""}`}
            strokeWidth={ICON_STROKE}
            style={{ color: SALTMINE.textMuted }}
            aria-hidden
          />
        </button>

        <button
          type="button"
          aria-label="Next month"
          onClick={onNextMonth}
          disabled={monthIndex === CALENDAR_MONTHS.length - 1}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] transition-colors duration-150 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ChevronRight className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        </button>

        {monthMenuOpen ? (
          <ul
            role="listbox"
            className="absolute left-1/2 top-[calc(100%+4px)] z-50 w-[128px] -translate-x-1/2 rounded-lg border bg-white py-0.5 shadow-lg"
            style={{ borderColor: HAIRLINE, boxShadow: MENU_SHADOW }}
          >
            {CALENDAR_MONTHS.map((item, index) => (
              <li key={item.label} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === monthIndex}
                  onClick={() => {
                    onSelectMonth(index);
                    onCloseMonthMenu();
                  }}
                  className={`w-full px-2 py-1 text-left ${TEXT_XS} ${FOCUS_RING}`}
                  style={{
                    color: index === monthIndex ? SALTMINE.primary : SALTMINE.text,
                    fontWeight: index === monthIndex ? 700 : 500,
                    backgroundColor:
                      index === monthIndex ? "rgba(0, 111, 236, 0.06)" : "transparent",
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div
        className="mb-1 grid grid-cols-7 justify-items-center border-b pb-1"
        style={{ borderColor: "rgba(145, 158, 171, 0.16)" }}
      >
        {weekdayLabels.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="flex h-4 w-[22px] items-center justify-center text-[7px] font-bold uppercase leading-none tracking-[0.08em]"
            style={{
              color: weekendIndexes.has(index)
                ? "rgba(145, 158, 171, 0.65)"
                : SALTMINE.textMuted,
            }}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-y-1 pt-1">
        {month.weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (date === null) {
              return (
                <span
                  key={`empty-${weekIndex}-${dayIndex}`}
                  className="h-[22px] w-[22px]"
                  aria-hidden
                />
              );
            }
            const selected = date === selectedDay;
            const isToday = todayDay === date;
            const hasBooking = bookingDays.includes(date);
            const weekend = dayIndex >= 5;

            return (
              <button
                key={`${weekIndex}-${date}`}
                type="button"
                aria-label={`${date} ${month.label}${hasBooking ? ", has booking" : ""}${isToday ? ", today" : ""}`}
                aria-pressed={selected}
                aria-current={isToday ? "date" : undefined}
                onClick={() => onSelectDay(date)}
                className={`relative inline-flex h-[22px] w-[22px] min-h-[22px] min-w-[22px] items-center justify-center rounded-full font-semibold tabular-nums leading-none transition-[background-color,box-shadow,transform,color] duration-150 hover:bg-[rgba(0,111,236,0.1)] active:scale-95 ${TEXT_MICRO} ${FOCUS_RING} ${motionClass(reducedMotion, "")}`}
                style={{
                  backgroundColor: selected ? SALTMINE.primary : "transparent",
                  color: selected
                    ? SALTMINE_ONBOARDING.color.text.inverse
                    : weekend
                      ? "rgba(99, 115, 129, 0.78)"
                      : SALTMINE.textSecondary,
                  boxShadow: selected ? "0 2px 6px rgba(0, 111, 236, 0.28)" : undefined,
                  outline: !selected && isToday ? `2px solid rgba(0, 111, 236, 0.35)` : undefined,
                  outlineOffset: !selected && isToday ? 1 : undefined,
                }}
              >
                {date}
                {hasBooking && !selected ? (
                  <span
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: SALTMINE.primary }}
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}

function ViewToggle({
  value,
  onChange,
  reducedMotion,
}: {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
  reducedMotion: boolean;
}) {
  const activeIndex = content.viewModes.indexOf(value);

  return (
    <div
      role="group"
      aria-label="Calendar view"
      className="relative inline-flex rounded-[8px] p-0.5"
      style={{
        backgroundColor: SALTMINE.neutral,
        boxShadow: SURFACE_INSET,
      }}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0.5 top-0.5 rounded-[6px] ${motionClass(reducedMotion, "transition-transform duration-200 ease-out")}`}
        style={{
          width: `calc((100% - 4px) / ${content.viewModes.length})`,
          left: 2,
          transform: `translateX(${activeIndex * 100}%)`,
          backgroundColor: SALTMINE.primary,
          boxShadow: "0 1px 4px rgba(0, 111, 236, 0.22)",
        }}
      />
      {content.viewModes.map((view) => {
        const selected = view === value;
        return (
          <button
            key={view}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(view)}
            className={`relative z-[1] min-h-6 min-w-[40px] rounded-[6px] px-2 font-bold leading-none tracking-[-0.01em] transition-colors duration-150 active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              color: selected
                ? SALTMINE_ONBOARDING.color.text.inverse
                : SALTMINE.textSecondary,
            }}
          >
            {view}
          </button>
        );
      })}
    </div>
  );
}

export function SaltmineBookingsDashboard({
  displayName,
  initialAddedBookings,
  variant = "onboarding",
  initialActiveNav = "bookings",
  initialViewMode,
  showInboxNotificationPopup = false,
  navigationDisabled = false,
  initialFilterValues,
  disabledNavIds,
  embedLayout = "desktop",
}: {
  displayName: string;
  initialAddedBookings?: Record<DayId, string[]>;
  /** Deck slide 18 — populated bookings UI; onboarding keeps the empty start screen. */
  variant?: "onboarding" | "deck";
  /** Sidebar item selected on first render (deck slides). */
  initialActiveNav?: string;
  /** Bookings calendar mode on first render (deck slides). */
  initialViewMode?: ViewMode;
  /** Slide 23 — floating mobile notification stack beside the inbox. */
  showInboxNotificationPopup?: boolean;
  /** Deck mockup — sidebar nav and search are visible but not interactive. */
  navigationDisabled?: boolean;
  /** Per-slide filter defaults (e.g. team for office presence). */
  initialFilterValues?: Record<string, string>;
  /** Per-slide nav ids to show but not allow interaction. */
  disabledNavIds?: readonly string[];
  /** Mobile app embed — main content only, no side rails. */
  embedLayout?: "desktop" | "mobile";
}) {
  const isDeckVariant = variant === "deck";
  const isMobileEmbed = embedLayout === "mobile";
  const reducedMotion = useReducedMotion();
  const initial = displayName.charAt(0).toUpperCase();
  const { toast, showToast, dismissToast } = useToast();

  const isNavItemDisabled = useCallback(
    (id: string) => {
      if (disabledNavIds?.includes(id)) return true;
      if (navigationDisabled && id !== "bookings") return true;
      return false;
    },
    [disabledNavIds, navigationDisabled],
  );

  const [viewMode, setViewMode] = useState<ViewMode>(
    initialViewMode ?? content.defaultViewMode,
  );
  const [activeNav, setActiveNav] = useState(initialActiveNav);
  const [checkedTeamMemberIds, setCheckedTeamMemberIds] = useState<Set<string>>(
    () => new Set(DEFAULT_CHECKED_MEMBER_IDS),
  );

  const [selectedInboxId, setSelectedInboxId] = useState<string | null>(
    INBOX_NOTIFICATIONS[0]?.id ?? null,
  );
  const [inboxDetailOpen, setInboxDetailOpen] = useState(true);

  const selectedInboxNotification = getInboxNotificationById(selectedInboxId);

  function handleInboxSelect(id: string) {
    setSelectedInboxId(id);
    setInboxDetailOpen(true);
  }

  function handleInboxAction(label: string) {
    if (label === "Accept") {
      showToast(content.inboxAcceptToast);
      setInboxDetailOpen(false);
      return;
    }
    if (label === "Decline") {
      showToast(content.inboxDeclineToast);
      setInboxDetailOpen(false);
      return;
    }
    showToast(`${label} — demo`);
  }
  const [inboxBadge, setInboxBadge] = useState(true);
  const [bookingGridDayOffset, setBookingGridDayOffset] = useState(0);
  const [calendarMonthIndex, setCalendarMonthIndex] = useState<number>(
    isDeckVariant ? DECK_CALENDAR.monthIndex : content.calendar.defaultMonthIndex,
  );
  const [calendarDay, setCalendarDay] = useState<number>(
    isDeckVariant ? DECK_CALENDAR.selectedDay : content.calendar.selectedDay,
  );
  const [selectedTimelineDayId, setSelectedTimelineDayId] = useState<string | null>(
    isDeckVariant ? "today" : null,
  );
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const [presencePanelDayId, setPresencePanelDayId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openLocationDay, setOpenLocationDay] = useState<DayId | null>(null);
  const [openSecondary, setOpenSecondary] = useState<"locale" | "language" | null>(
    null,
  );

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    isDeckVariant
      ? { ...DECK_FILTER_DEFAULTS, ...initialFilterValues }
      : Object.fromEntries(content.filters.map((f) => [f.id, f.defaultValue])),
  );

  const [dayLocations, setDayLocations] = useState<Record<DayId, string>>({
    today: "Remote",
    tomorrow: "Remote",
  });

  const [addedBookings, setAddedBookings] = useState<Record<DayId, string[]>>(() =>
    initialAddedBookings ?? { today: [], tomorrow: [] },
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [locale, setLocale] = useState<(typeof LOCALE_OPTIONS)[number]>(
    LOCALE_OPTIONS[0],
  );
  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]>(
    LANGUAGE_OPTIONS[0],
  );

  const secondaryRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    secondaryRef,
    () => setOpenSecondary(null),
    openSecondary !== null,
  );
  useClickOutside(
    searchRef,
    () => setSearchOpen(false),
    searchOpen,
  );

  const closeAllOverlays = useCallback(() => {
    setOpenFilter(null);
    setOpenLocationDay(null);
    setOpenSecondary(null);
    setSearchOpen(false);
    setMonthMenuOpen(false);
    setPresencePanelDayId(null);
    setSelectedBookingId(null);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAllOverlays();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAllOverlays]);

  useEffect(() => {
    if (!presencePanelDayId) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPresencePanelDayId(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [presencePanelDayId]);

  function daysInMonth(monthIndex: number): number[] {
    const days: number[] = [];
    for (const week of CALENDAR_MONTHS[monthIndex].weeks) {
      for (const day of week) {
        if (day !== null) days.push(day);
      }
    }
    return days;
  }

  function clampCalendarDay(monthIndex: number, day: number): number {
    const days = daysInMonth(monthIndex);
    if (days.includes(day)) return day;
    return days[0] ?? 1;
  }

  const teamFilter = filterValues.team ?? DECK_TEAM_OPTIONS[0];
  const bookingTypeFilter = filterValues["booking-type"] ?? "Show all";

  const deckFilteredAvatars = isDeckVariant
    ? filterAvatarsByTeam(DECK_OFFICE_AVATARS, teamFilter)
    : [];

  const deckTeamName = resolveTeamNameFromFilter(teamFilter);
  const deckOccupancyLabel = isDeckVariant
    ? teamFilter.includes("Create a team")
      ? "No-one's in!"
      : teamOccupancyLabel(deckFilteredAvatars.length, deckTeamName)
    : "";

  const presencePanelDay = presencePanelDayId
    ? DECK_TIMELINE_DAYS.find((day) => day.id === presencePanelDayId)
    : null;
  const presencePanelPeople =
    presencePanelDay && isDeckVariant
      ? officePresencePeople(teamFilter, presencePanelDay)
      : [];
  const presencePanelSummary =
    presencePanelDay && isDeckVariant
      ? officePresenceSummary(teamFilter, presencePanelDay, presencePanelPeople)
      : "";

  const selectedBookingDetail =
    selectedBookingId && isDeckVariant ? findDeckBooking(selectedBookingId) : null;
  const bookingsRailOpen = Boolean(presencePanelDayId || selectedBookingDetail);

  const openMonthlyCalendar = useCallback(() => {
    closeAllOverlays();
    setSelectedBookingId(null);
    setPresencePanelDayId(null);
    setCalendarMonthIndex(DECK_MONTHLY_TODAY.monthIndex);
    setCalendarDay(DECK_MONTHLY_TODAY.day);
    setSelectedTimelineDayId("today");
    setViewMode("Monthly");
  }, [closeAllOverlays]);

  const showTeamCoworkers = isDeckVariant || teamFilter === "London Design";
  const occupancyLabel = isDeckVariant
    ? deckOccupancyLabel
    : showTeamCoworkers
      ? "2 teammates in"
      : "No-one's in!";
  const coworkers = isDeckVariant
    ? deckFilteredAvatars
    : showTeamCoworkers
      ? COWORKERS_IN_OFFICE.map((c) => ({
          initials: c.initials,
          color: c.color,
          memberId: c.memberId,
        }))
      : [];

  const searchResults = (
    searchQuery.trim()
      ? SEARCH_ITEMS.filter((item) =>
          item.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        )
      : [...SEARCH_ITEMS]
  ).slice(0, 8);

  const handleNavClick = (id: string, label: string) => {
    if (isNavItemDisabled(id)) return;
    closeAllOverlays();
    setActiveNav(id);
    if (id === "inbox") {
      setInboxBadge(false);
      return;
    }
    if (id === "bookings" || id === "teams") return;
    if (id === "find-space" && isDeckVariant) return;
    if (id === "booking-grid" && isDeckVariant) return;
    if (id === "conference-grid" && isDeckVariant) return;
    showToast(`Opening ${label.toLowerCase()}`);
  };

  const isTeamsView = activeNav === "teams";
  const isFindSpaceView = isDeckVariant && activeNav === "find-space";
  const isInboxView = activeNav === "inbox";
  const isBookingGridView = isDeckVariant && activeNav === "booking-grid";
  const isConferenceGridView = isDeckVariant && activeNav === "conference-grid";
  const isBookingsView =
    !isTeamsView &&
    !isFindSpaceView &&
    !isInboxView &&
    !isBookingGridView &&
    !isConferenceGridView;
  const showBookingsCalendarRail =
    !isMobileEmbed && isBookingsView && viewMode === "Daily" && !bookingsRailOpen;

  const handleAddBooking = (dayId: string, dayTitle: string) => {
    const type = filterValues["booking-type"] ?? "Desk";
    const label =
      type === "Show all" ? "Desk — Floor 21" : `${type} — Floor 21`;
    setAddedBookings((prev) => ({
      ...prev,
      [dayId]: [...(prev[dayId as DayId] ?? []), label],
    }));
    showToast(`${content.addedBookingToast} ${dayTitle}`);
  };

  const scrollToTimelineDay = useCallback(
    (dayId: string) => {
      requestAnimationFrame(() => {
        const section = timelineScrollRef.current?.querySelector(
          `[data-timeline-day="${dayId}"]`,
        );
        section?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      });
    },
    [reducedMotion],
  );

  const handleSelectCalendarDay = useCallback(
    (day: number) => {
      setCalendarDay(day);
      if (!isDeckVariant) return;
      const match = findDeckTimelineDay(calendarMonthIndex, day);
      setSelectedTimelineDayId(match?.id ?? null);
      if (match) {
        scrollToTimelineDay(match.id);
        return;
      }
      const monthName = CALENDAR_MONTHS[calendarMonthIndex]?.label.split(" ")[0] ?? "";
      showToast(`No bookings scheduled for ${day} ${monthName}`);
    },
    [calendarMonthIndex, isDeckVariant, scrollToTimelineDay, showToast],
  );

  const deckCalendarBookingDays = isDeckVariant
    ? deckTimelineDaysForMonth(calendarMonthIndex)
    : [];

  function selectMonth(index: number) {
    const nextDay = clampCalendarDay(index, calendarDay);
    setCalendarMonthIndex(index);
    setCalendarDay(nextDay);
    setMonthMenuOpen(false);
    if (isDeckVariant) {
      const match = findDeckTimelineDay(index, nextDay);
      setSelectedTimelineDayId(match?.id ?? null);
      if (match) scrollToTimelineDay(match.id);
    }
  }

  return (
    <div
      className={`relative flex h-full w-full antialiased text-left ${showInboxNotificationPopup ? "overflow-visible" : "overflow-hidden"}`}
      style={{
        fontFamily: SALTMINE_ONBOARDING.font.family,
        backgroundColor: "#F4F6F8",
      }}
      role="application"
      aria-label={
        isTeamsView
          ? content.teamsPageTitle
          : isFindSpaceView
            ? content.findSpacePageTitle
            : isInboxView
              ? content.inboxPageTitle
              : isBookingGridView
                ? content.bookingGridPageTitle
                : isConferenceGridView
                  ? content.conferenceGridPageTitle
                  : `${content.pageTitle} workspace`
      }
    >
      <aside
        className="flex shrink-0 flex-col border-r bg-white px-2 py-2.5 text-left"
        style={{
          width: DASHBOARD_RAIL_WIDTH,
          borderColor: HAIRLINE,
        }}
        aria-label="Main navigation"
        hidden={isMobileEmbed}
      >
        <div className="mb-2 flex items-center gap-1.5 px-0.5">
          <span
            className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#1C252E] p-0.5"
            style={{ boxShadow: "0 1px 2px rgba(28, 37, 46, 0.2)" }}
          >
            <img
              src={content.brandLogoSrc}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] object-contain"
              decoding="async"
              draggable={false}
            />
          </span>
          <span
            className="truncate text-[10px] font-extrabold leading-3 tracking-[-0.035em]"
            style={{ color: SALTMINE.text }}
          >
            {content.brandName}
          </span>
        </div>

        <div ref={searchRef} className="relative mb-2">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <Search
              className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-80"
              strokeWidth={ICON_STROKE}
              style={{ color: SALTMINE.textMuted }}
              aria-hidden
            />
            <input
              type="search"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              disabled={navigationDisabled}
              readOnly={navigationDisabled}
              aria-disabled={navigationDisabled || undefined}
              onChange={(event) => {
                if (navigationDisabled) return;
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => {
                if (navigationDisabled) return;
                setSearchOpen(true);
              }}
              className={`h-[30px] w-full rounded-[8px] border-0 py-0 pl-[26px] ${TEXT_XS} font-medium outline-none transition-[box-shadow,background-color] duration-150 placeholder:font-normal placeholder:text-[#919EAB] focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(0,111,236,0.16)] ${searchOpen ? "pr-7" : "pr-2"} ${navigationDisabled ? "cursor-not-allowed opacity-55" : ""} ${FOCUS_RING}`}
              style={{
                color: SALTMINE.text,
                backgroundColor: searchOpen
                  ? SALTMINE_ONBOARDING.color.canvas
                  : SALTMINE.neutral,
                boxShadow: SURFACE_INSET,
              }}
            />
            <span
              className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 py-px text-[6px] font-semibold tabular-nums leading-none transition-opacity duration-150 ${searchOpen ? "opacity-100" : "opacity-0"}`}
              style={{
                color: SALTMINE.textMuted,
                backgroundColor: "rgba(145, 158, 171, 0.12)",
              }}
              aria-hidden
            >
              ⌘K
            </span>
          </label>
          {searchOpen ? (
            <ul
              role="listbox"
              className="no-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[120px] overflow-y-auto rounded-lg border bg-white py-0.5"
              style={{ borderColor: HAIRLINE, boxShadow: MENU_SHADOW }}
            >
              {searchResults.length === 0 ? (
                <li className={`px-2 py-1.5 ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
                  {content.searchEmptyLabel}
                </li>
              ) : (
                searchResults.map((item) => (
                  <li key={item} role="none">
                    <button
                      type="button"
                      role="option"
                      onClick={() => {
                        setSearchQuery(item);
                        setSearchOpen(false);
                        if (item === "My teams") {
                          setActiveNav("teams");
                          closeAllOverlays();
                          return;
                        }
                        if (item === "My bookings") {
                          setActiveNav("bookings");
                          closeAllOverlays();
                          return;
                        }
                        if (item === "Find a space" && isDeckVariant) {
                          setActiveNav("find-space");
                          closeAllOverlays();
                          return;
                        }
                        showToast(`Navigating to ${item}`);
                      }}
                      className={`w-full px-2 py-1.5 text-left hover:bg-[rgba(0,111,236,0.06)] ${TEXT_XS} ${FOCUS_RING}`}
                      style={{ color: SALTMINE.text }}
                    >
                      {item}
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>

        <p
          className="mb-0.5 w-full px-1.5 text-left font-bold uppercase tracking-[0.1em] text-[6px] leading-3"
          style={{ color: SALTMINE.textMuted }}
        >
          {content.navSectionWorkspace}
        </p>
        <nav className="space-y-px" aria-label="Workspace">
          {content.primaryNav.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              active={activeNav === item.id}
              icon={item.icon}
              badge={item.id === "inbox" && inboxBadge}
              reducedMotion={reducedMotion}
              disabled={isNavItemDisabled(item.id)}
              onClick={() => handleNavClick(item.id, item.label)}
            />
          ))}
        </nav>

        <div
          className="my-1.5 h-px shrink-0"
          style={{ backgroundColor: HAIRLINE }}
          aria-hidden
        />

        <div ref={secondaryRef} className="mt-auto space-y-px pt-1">
          <p
            className="mb-0.5 w-full px-1.5 text-left font-bold uppercase tracking-[0.1em] text-[6px] leading-3"
            style={{ color: SALTMINE.textMuted }}
          >
            {content.navSectionSupport}
          </p>
          {content.secondaryNav.map((item) => {
            if (item.id === "help") {
              return (
                <NavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  reducedMotion={reducedMotion}
                  disabled={isNavItemDisabled(item.id)}
                  onClick={() => showToast(content.helpToast)}
                />
              );
            }
            if (item.id === "locale") {
              return (
                <div key={item.id} className="relative">
                  <NavItem
                    label={locale.label}
                    icon={item.icon}
                    localeFlag={locale.flag}
                    reducedMotion={reducedMotion}
                    disabled={isNavItemDisabled(item.id)}
                    onClick={() =>
                      setOpenSecondary((current) =>
                        current === "locale" ? null : "locale",
                      )
                    }
                  />
                  {openSecondary === "locale" ? (
                    <ul
                      role="listbox"
                      className="absolute bottom-full left-0 right-0 z-50 mb-1 rounded-lg border bg-white py-0.5"
                      style={{ borderColor: HAIRLINE, boxShadow: MENU_SHADOW }}
                    >
                      {LOCALE_OPTIONS.map((option) => (
                        <li key={option.label} role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={option.label === locale.label}
                            onClick={() => {
                              setLocale(option);
                              setOpenSecondary(null);
                              showToast(`Region set to ${option.label}`);
                            }}
                            className={`flex w-full items-center gap-1.5 px-2 py-1 text-left ${TEXT_XS} ${FOCUS_RING}`}
                          >
                            <span aria-hidden>{option.flag}</span>
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            }
            if (item.id === "language") {
              return (
                <div key={item.id} className="relative">
                  <NavItem
                    label={language}
                    icon={item.icon}
                    reducedMotion={reducedMotion}
                    disabled={isNavItemDisabled(item.id)}
                    onClick={() =>
                      setOpenSecondary((current) =>
                        current === "language" ? null : "language",
                      )
                    }
                  />
                  {openSecondary === "language" ? (
                    <DashboardMenu
                      id="language-menu"
                      options={LANGUAGE_OPTIONS}
                      value={language}
                      placement="above"
                      onSelect={(value) => {
                        setLanguage(value as (typeof LANGUAGE_OPTIONS)[number]);
                        showToast(`Language set to ${value}`);
                      }}
                      onClose={() => setOpenSecondary(null)}
                    />
                  ) : null}
                </div>
              );
            }
            return null;
          })}

          <button
            type="button"
            aria-label={`${displayName} profile`}
            title="Open profile"
            onClick={() => showToast(`Opening profile for ${displayName}`)}
            className={`mt-1.5 flex min-h-[38px] w-full items-center gap-1.5 rounded-[10px] border p-1.5 text-left transition-[border-color,box-shadow,transform] duration-150 hover:border-[rgba(0,111,236,0.24)] hover:shadow-[0_2px_8px_rgba(145,158,171,0.1)] active:scale-[0.99] ${FOCUS_RING}`}
            style={{
              borderColor: HAIRLINE,
              backgroundColor: SALTMINE_ONBOARDING.color.canvas,
              boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)",
            }}
          >
            <SaltmineDeckAvatar
              memberId="jb"
              letter={initial}
              size={13}
              color={SALTMINE.primary}
            />
            <span
              className="min-w-0 flex-1 truncate font-bold leading-none tracking-[-0.015em] text-[10px]"
              style={{ color: SALTMINE.text }}
            >
              {displayName}
            </span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1">
        <main
          className={`relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F4F6F8] ${isMobileEmbed ? "px-2 py-2" : "px-3 py-2.5"}`}
        >
          <div
            className={`flex items-center gap-2 ${
              isConferenceGridView
                ? "mb-1 grid grid-cols-[1fr_auto_1fr] gap-2"
                : isFindSpaceView || isBookingGridView
                  ? "mb-1 justify-between"
                  : "mb-1.5 justify-between"
            }`}
          >
            <div className="min-w-0">
              <h1
                className={`m-0 font-extrabold tracking-[-0.035em] ${isMobileEmbed ? "text-[12px] leading-[14px]" : "text-[14px] leading-4"}`}
                style={{ color: SALTMINE.text }}
              >
                {isTeamsView
                  ? content.teamsPageTitle
                  : isFindSpaceView
                    ? content.findSpacePageTitle
                    : isInboxView
                      ? content.inboxPageTitle
                      : isBookingGridView
                        ? content.bookingGridPageTitle
                        : isConferenceGridView
                          ? content.conferenceGridPageTitle
                          : content.pageTitle}
              </h1>
            </div>
            {isConferenceGridView ? (
              <>
                <ConferenceGridDateNav
                  onPrev={() => showToast("Previous day")}
                  onNext={() => showToast("Next day")}
                  onCalendar={() => showToast("Open calendar")}
                />
                <div className="flex justify-end">
                  <ConferenceGridNewGridButton
                    onClick={() => showToast(content.conferenceGridNewGridLabel)}
                  />
                </div>
              </>
            ) : isBookingGridView ? (
              <BookingGridDateNav
                dayOffset={bookingGridDayOffset}
                onDayOffsetChange={setBookingGridDayOffset}
              />
            ) : isBookingsView ? (
              <ViewToggle
                value={viewMode}
                onChange={(mode) => {
                  closeAllOverlays();
                  if (isDeckVariant && mode === "Weekly") {
                    showToast("Demo view");
                  }
                  setViewMode(mode);
                }}
                reducedMotion={reducedMotion}
              />
            ) : null}
          </div>

          {isBookingsView && viewMode === "Daily" ? (
            <div className={isMobileEmbed ? "mb-1" : "mb-1.5"}>
              <div className={`flex gap-1 ${isMobileEmbed ? "flex-col" : "gap-1.5"}`}>
                {content.filters.map((filter) => (
                  <div key={filter.id} className="min-w-0 flex-1">
                    <p
                      className={`mb-0.5 px-0.5 font-medium ${TEXT_MICRO}`}
                      style={{ color: SALTMINE.textMuted }}
                    >
                      {filter.label}
                    </p>
                    <FilterSelect
                      filterId={filter.id}
                      label={filter.label}
                      value={
                        filterValues[filter.id] ??
                        (isDeckVariant
                          ? filter.id === "team"
                            ? DECK_TEAM_OPTIONS[0]
                            : filter.id === "booking-type"
                              ? DECK_BOOKING_TYPE_OPTIONS[0]
                              : filter.defaultValue
                          : filter.defaultValue)
                      }
                      options={
                        isDeckVariant
                          ? filter.id === "team"
                            ? DECK_TEAM_OPTIONS
                            : filter.id === "booking-type"
                              ? DECK_BOOKING_TYPE_OPTIONS
                              : filter.options
                          : filter.options
                      }
                      icon={filter.icon}
                      open={openFilter === filter.id}
                      onToggle={() => {
                        setOpenFilter((current) => {
                          const next = current === filter.id ? null : filter.id;
                          if (next) {
                            setOpenLocationDay(null);
                            setOpenSecondary(null);
                            setMonthMenuOpen(false);
                          }
                          return next;
                        });
                      }}
                      onSelect={(value) =>
                        setFilterValues((prev) => ({ ...prev, [filter.id]: value }))
                      }
                      onClose={() => setOpenFilter(null)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="relative min-h-0 flex-1">
            {isTeamsView ? (
              <MyTeamsMainView
                checkedMemberIds={checkedTeamMemberIds}
                onCheckedMemberIdsChange={setCheckedTeamMemberIds}
                showToast={showToast}
                compact={isMobileEmbed}
              />
            ) : isFindSpaceView ? (
              <FindASpaceMainView
                checkedMemberIds={checkedTeamMemberIds}
                showToast={showToast}
              />
            ) : isInboxView ? (
              <InboxMainView
                selectedId={selectedInboxId}
                onSelect={handleInboxSelect}
                showToast={showToast}
              />
            ) : isBookingGridView ? (
              <BookingGridMainView
                dayOffset={bookingGridDayOffset}
                showToast={showToast}
              />
            ) : isConferenceGridView ? (
              <ConferenceGridMainView showToast={showToast} compact={isMobileEmbed} />
            ) : (
            <div
              ref={isDeckVariant && viewMode === "Daily" ? timelineScrollRef : undefined}
              className={
                isDeckVariant
                  ? viewMode === "Monthly"
                    ? "flex h-full min-h-0 flex-col overflow-hidden"
                    : "no-scrollbar h-full min-h-0 space-y-2 overflow-y-auto overscroll-y-contain"
                  : "no-scrollbar h-full space-y-2 overflow-y-auto overscroll-contain"
              }
              role="region"
              aria-label={
                isDeckVariant
                  ? viewMode === "Monthly"
                    ? "Monthly bookings calendar"
                    : "Booking timeline"
                  : "Bookings"
              }
            >
              {viewMode === "Daily" ? (
                isDeckVariant ? (
                  DECK_TIMELINE_DAYS.map((day, index) => {
                    const filteredBookings = filterBookingsByKind(
                      day.bookings,
                      bookingTypeFilter,
                    );
                    const dayCoworkers =
                      day.occupancyHighlight && deckFilteredAvatars.length > 0
                        ? filterAvatarsByTeam(DECK_OFFICE_AVATARS, teamFilter).map(
                            (avatar) => ({
                              initials: avatar.initials,
                              color: avatar.color,
                              memberId: avatar.memberId,
                            }),
                          )
                        : coworkers;

                    return (
                      <div key={day.id} data-timeline-day={day.id}>
                        {index > 0 ? (
                          <div
                            className="h-px"
                            style={{ backgroundColor: HAIRLINE }}
                            aria-hidden
                          />
                        ) : null}
                        <DeckDaySection
                          title={day.title}
                          weatherLabel={day.weatherLabel}
                          weatherIcon={day.weatherIcon}
                          coworkers={dayCoworkers}
                          occupancyLabel={deckOccupancyLabel}
                          bookings={filteredBookings}
                          isToday={day.isToday}
                          showCommutePill={day.showCommutePill}
                          presenceMode={day.presenceMode}
                          occupancyHighlight={day.occupancyHighlight}
                          emptyState={day.emptyState}
                          filterEmptyMessage={
                            day.isToday &&
                            day.bookings.length > 0 &&
                            filteredBookings.length === 0
                              ? "No bookings match this filter"
                              : undefined
                          }
                          onView={() => {
                            setSelectedBookingId(null);
                            setPresencePanelDayId((current) =>
                              current === day.id ? null : day.id,
                            );
                          }}
                          onAddBooking={() => handleAddBooking(day.id, day.title)}
                          onBookingAction={(label) => showToast(`${label} — demo`)}
                          onBookingSelect={(bookingId) => {
                            setPresencePanelDayId(null);
                            setSelectedBookingId((current) =>
                              current === bookingId ? null : bookingId,
                            );
                          }}
                          onExternalLink={() => showToast(content.externalLinkToast)}
                          onRepeatDesk={() =>
                            showToast("Desk 21.P3.2 repeated for tomorrow")
                          }
                        />
                      </div>
                    );
                  })
                ) : (
                INITIAL_DAYS.map((day, index) => (
                    <div key={day.id}>
                      {index > 0 ? (
                        <div
                          className="h-px"
                          style={{ backgroundColor: HAIRLINE }}
                          aria-hidden
                        />
                      ) : null}
                      <DeckDaySection
                        title={day.title}
                        weatherLabel={day.weatherLabel}
                        weatherIcon={day.weatherIcon}
                        officeName={day.officeName}
                        coworkers={coworkers}
                        occupancyLabel={occupancyLabel}
                        bookings={[]}
                        isToday={index === 0}
                        isEmptyTomorrow={index === 1}
                        workLocationBadge={
                          <WorkLocationBadge
                            workLocation={dayLocations[day.id]}
                            locationOpen={openLocationDay === day.id}
                            onToggleLocation={() => {
                              setOpenLocationDay((current) => {
                                const next = current === day.id ? null : day.id;
                                if (next) {
                                  setOpenFilter(null);
                                  setOpenSecondary(null);
                                  setMonthMenuOpen(false);
                                }
                                return next;
                              });
                            }}
                            onSelectLocation={(location) =>
                              setDayLocations((prev) => ({
                                ...prev,
                                [day.id]: location,
                              }))
                            }
                          />
                        }
                        onView={() =>
                          showToast(
                            `${content.viewDetailToast} ${day.officeName}`,
                          )
                        }
                        onAddBooking={() => handleAddBooking(day.id, day.title)}
                        onBookingAction={(label) => showToast(`${label} — demo`)}
                        onExternalLink={() =>
                          showToast(content.externalLinkToast)
                        }
                      />
                    </div>
                  ))
                )
              ) : null}
              {viewMode === "Weekly" ? (
                isDeckVariant ? (
                  <DeckDemoSkeleton label="Weekly" />
                ) : (
                  <WeeklyView
                    reducedMotion={reducedMotion}
                    onRowClick={(day) => showToast(`Opening ${day}`)}
                  />
                )
              ) : null}
              {viewMode === "Monthly" ? (
                isDeckVariant ? (
                  <DeckMonthlyCalendar
                    monthIndex={calendarMonthIndex}
                    selectedDay={calendarDay}
                    bookingTypeFilter={bookingTypeFilter}
                    monthMenuOpen={monthMenuOpen}
                    onPrevMonth={() => {
                      const next = Math.max(0, calendarMonthIndex - 1);
                      selectMonth(next);
                    }}
                    onNextMonth={() => {
                      const next = Math.min(CALENDAR_MONTHS.length - 1, calendarMonthIndex + 1);
                      selectMonth(next);
                    }}
                    onToggleMonthMenu={() => {
                      setMonthMenuOpen((open) => !open);
                      setOpenFilter(null);
                      setOpenLocationDay(null);
                    }}
                    onCloseMonthMenu={() => setMonthMenuOpen(false)}
                    onSelectMonth={selectMonth}
                    onSelectDay={(day) => {
                      setCalendarDay(day);
                      const timelineDay = findDeckTimelineDay(calendarMonthIndex, day);
                      setSelectedTimelineDayId(timelineDay?.id ?? null);
                    }}
                    onToday={() => {
                      setCalendarMonthIndex(DECK_MONTHLY_TODAY.monthIndex);
                      setCalendarDay(DECK_MONTHLY_TODAY.day);
                      setSelectedTimelineDayId("today");
                    }}
                  />
                ) : (
                  <MonthlyView />
                )
              ) : null}
            </div>
            )}
            {isBookingsView ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#F4F6F8] to-transparent"
              aria-hidden
            />
            ) : null}
          </div>
        </main>

        {showBookingsCalendarRail ? (
        <aside
          className="flex shrink-0 flex-col border-l bg-white px-2 py-2.5"
          style={{
            width: DASHBOARD_RAIL_WIDTH,
            borderColor: HAIRLINE,
          }}
          aria-label="Calendar"
        >
          <MiniCalendar
            monthIndex={calendarMonthIndex}
            selectedDay={calendarDay}
            bookingDays={deckCalendarBookingDays}
            todayDay={
              isDeckVariant && calendarMonthIndex === DECK_CALENDAR.todayMonthIndex
                ? DECK_CALENDAR.todayDay
                : !isDeckVariant && calendarMonthIndex === content.calendar.defaultMonthIndex
                  ? content.calendar.selectedDay
                  : undefined
            }
            monthMenuOpen={monthMenuOpen}
            onPrevMonth={() => {
              const next = Math.max(0, calendarMonthIndex - 1);
              selectMonth(next);
            }}
            onNextMonth={() => {
              const next = Math.min(CALENDAR_MONTHS.length - 1, calendarMonthIndex + 1);
              selectMonth(next);
            }}
            onToggleMonthMenu={() => {
              setMonthMenuOpen((open) => !open);
              setOpenFilter(null);
              setOpenLocationDay(null);
            }}
            onCloseMonthMenu={() => setMonthMenuOpen(false)}
            onSelectMonth={selectMonth}
            onSelectDay={handleSelectCalendarDay}
            reducedMotion={reducedMotion}
          />
          <button
            type="button"
            onClick={() => showToast(content.helpToast)}
            className={`group mt-auto inline-flex min-h-6 w-full items-center justify-center gap-1 rounded-full border px-2 font-semibold leading-none transition-all duration-150 hover:border-[rgba(0,111,236,0.5)] hover:bg-[rgba(0,111,236,0.06)] active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: "rgba(0, 111, 236, 0.32)",
              color: SALTMINE.primary,
              backgroundColor: SALTMINE_ONBOARDING.color.canvas,
              boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)",
            }}
          >
            <Sparkles
              className={`h-2.5 w-2.5 ${motionClass(reducedMotion, "transition-transform duration-300 group-hover:rotate-12")}`}
              strokeWidth={ICON_STROKE}
              aria-hidden
            />
            {content.helpButtonLabel}
          </button>
        </aside>
        ) : null}
        {isBookingsView && selectedBookingDetail && isDeckVariant && !isMobileEmbed ? (
        <aside
          className="flex shrink-0 flex-col border-l bg-white px-2 py-2.5"
          style={{
            width: DASHBOARD_RAIL_WIDTH,
            borderColor: HAIRLINE,
          }}
          aria-label={content.bookingDetailPanelLabel}
        >
          <div className="min-h-0 flex-1">
            <DeckBookingDetailPanel
              booking={selectedBookingDetail.booking}
              day={selectedBookingDetail.day}
              onClose={() => setSelectedBookingId(null)}
              onAction={(label) => {
                showToast(`${label} — demo`);
                setSelectedBookingId(null);
              }}
              onMap={() =>
                showToast(
                  `${content.bookingDetailMapToast} ${selectedBookingDetail.booking.title}`,
                )
              }
              onShare={() =>
                showToast(
                  `${content.bookingDetailShareToast} ${selectedBookingDetail.booking.title}`,
                )
              }
            />
          </div>
        </aside>
        ) : null}
        {isBookingsView && presencePanelDay && isDeckVariant && !isMobileEmbed ? (
        <aside
          className="flex shrink-0 flex-col border-l bg-white px-2 py-2.5"
          style={{
            width: DASHBOARD_RAIL_WIDTH,
            borderColor: HAIRLINE,
          }}
          aria-label={content.officePresencePanelLabel}
        >
          <p
            className={`mb-1.5 px-0.5 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {content.officePresencePanelLabel}
          </p>
          <div className="min-h-0 flex-1">
            <OfficePresencePanel
              officeName={OFFICE_PRESENCE_OFFICE_NAME}
              teamName={deckTeamName}
              dayTitle={presencePanelDay.title}
              summary={presencePanelSummary}
              people={presencePanelPeople}
              onClose={() => setPresencePanelDayId(null)}
              onFloorPlan={() => {
                showToast(
                  `${content.officePresenceFloorPlanToast} ${OFFICE_PRESENCE_OFFICE_NAME}`,
                );
                setPresencePanelDayId(null);
              }}
            />
          </div>
        </aside>
        ) : null}
        {isInboxView && inboxDetailOpen && !isMobileEmbed ? (
        <aside
          className="flex shrink-0 flex-col border-l bg-white px-2 py-2.5"
          style={{
            width: INBOX_DETAIL_RAIL_WIDTH,
            borderColor: HAIRLINE,
          }}
          aria-label={content.inboxDetailPanelLabel}
        >
          <p
            className={`mb-1.5 px-0.5 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {content.inboxDetailPanelLabel}
          </p>
          <div className="min-h-0 flex-1">
            <InboxDetailPanel
              notification={selectedInboxNotification}
              onAction={handleInboxAction}
              onClose={() => setInboxDetailOpen(false)}
            />
          </div>
        </aside>
        ) : null}
        {isInboxView && showInboxNotificationPopup ? (
          <InboxNotificationPopup
            notifications={INBOX_NOTIFICATIONS}
            featuredId={INBOX_NOTIFICATION_POPUP_FEATURED_ID}
            selectedId={selectedInboxId}
            onSelect={handleInboxSelect}
            onBookings={() => {
              showToast(content.inboxNotificationPopupBookingsToast);
              setActiveNav("bookings");
              closeAllOverlays();
            }}
          />
        ) : null}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`absolute bottom-3 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1 font-semibold shadow-lg transition-opacity duration-200 ${TEXT_XS} ${toast ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{
          borderColor: "rgba(0, 111, 236, 0.24)",
          backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          color: SALTMINE.text,
          boxShadow: MENU_SHADOW,
        }}
      >
        <span>{toast?.message ?? ""}</span>
        {toast?.onUndo ? (
          <button
            type="button"
            onClick={() => {
              toast.onUndo?.();
              dismissToast();
            }}
            className={`shrink-0 font-bold underline-offset-2 hover:underline ${FOCUS_RING}`}
            style={{ color: SALTMINE.primary }}
          >
            Undo
          </button>
        ) : null}
      </div>
    </div>
  );
}
