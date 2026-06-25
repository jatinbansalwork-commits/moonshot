"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
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
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  SALTMINE_BOOKINGS_DASHBOARD_CONTENT,
  type DashboardNavIcon,
} from "@/lib/saltmine-bookings-dashboard-content";
import { MyTeamsMainView } from "@/components/slider/saltmine-teams-view";
import { FindASpaceMainView } from "@/components/slider/saltmine-find-space-view";
import { InboxDetailPanel, InboxMainView } from "@/components/slider/saltmine-inbox-view";
import { getInboxNotificationById, INBOX_NOTIFICATIONS } from "@/lib/saltmine-inbox-data";
import {
  DeckDaySection,
} from "@/components/slider/saltmine-deck-bookings-view";
import {
  DECK_FILTER_DEFAULTS,
  DECK_DAY_TITLES,
  DECK_BOOKING_TYPE_OPTIONS,
  DECK_CALENDAR,
  DECK_OFFICE_AVATARS,
  DECK_TEAM_OPTIONS,
  DECK_TODAY_BOOKINGS,
  filterAvatarsByTeam,
  filterBookingsByKind,
  resolveTeamNameFromFilter,
  teamOccupancyLabel,
} from "@/lib/saltmine-deck-bookings-data";
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
  SALTMINE_ONLINE_GREEN,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

const DASHBOARD_RAIL_WIDTH = 148;
const INBOX_DETAIL_RAIL_WIDTH = 168;
const ICON_STROKE = 1.65;
const HAIRLINE = SALTMINE_HAIRLINE;
const SURFACE_INSET = SALTMINE_SURFACE_INSET;
const MENU_SHADOW = SALTMINE_MENU_SHADOW;
const ONLINE_GREEN = SALTMINE_ONLINE_GREEN;

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
  status: Activity,
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
      className={`absolute left-0 right-0 z-50 max-h-[140px] overflow-y-auto rounded-lg border bg-white py-0.5 ${placement === "above" ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]"}`}
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
  onClick,
}: {
  label: string;
  active?: boolean;
  icon: DashboardNavIcon;
  localeFlag?: string;
  badge?: boolean;
  reducedMotion: boolean;
  onClick?: () => void;
}) {
  const Icon = NAV_ICONS[icon];
  const isLocale = icon === "locale" && localeFlag;

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      title={label}
      onClick={onClick}
      className={`group relative flex w-full min-h-[27px] items-center gap-1.5 rounded-lg px-1.5 py-[3px] text-left transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.99] ${active ? "" : "hover:bg-[rgba(145,158,171,0.08)]"} ${FOCUS_RING}`}
      style={{
        backgroundColor: active ? SALTMINE.accentSolid : "transparent",
        color: active ? SALTMINE.primaryDark : SALTMINE.textSecondary,
        boxShadow: active ? `inset 0 0 0 1px rgba(0, 111, 236, 0.18)` : undefined,
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
        ) : icon === "status" ? (
          <span className="relative inline-flex h-2 w-2 items-center justify-center" aria-hidden>
            {!reducedMotion ? (
              <span
                className="absolute inline-flex h-2 w-2 animate-pulse rounded-full opacity-40"
                style={{ backgroundColor: ONLINE_GREEN }}
              />
            ) : null}
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ONLINE_GREEN }}
            />
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
}: {
  displayName: string;
  initialAddedBookings?: Record<DayId, string[]>;
  /** Deck slide 18 — populated bookings UI; onboarding keeps the empty start screen. */
  variant?: "onboarding" | "deck";
  /** Sidebar item selected on first render (deck slides). */
  initialActiveNav?: string;
}) {
  const isDeckVariant = variant === "deck";
  const reducedMotion = useReducedMotion();
  const initial = displayName.charAt(0).toUpperCase();
  const { toast, showToast, dismissToast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>(content.defaultViewMode);
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
  const [calendarMonthIndex, setCalendarMonthIndex] = useState<number>(
    isDeckVariant ? DECK_CALENDAR.monthIndex : content.calendar.defaultMonthIndex,
  );
  const [calendarDay, setCalendarDay] = useState<number>(
    isDeckVariant ? DECK_CALENDAR.selectedDay : content.calendar.selectedDay,
  );
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openLocationDay, setOpenLocationDay] = useState<DayId | null>(null);
  const [openSecondary, setOpenSecondary] = useState<"locale" | "language" | null>(
    null,
  );

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    isDeckVariant
      ? { ...DECK_FILTER_DEFAULTS }
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
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAllOverlays();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAllOverlays]);

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

  function selectMonth(index: number) {
    setCalendarMonthIndex(index);
    setCalendarDay((current) => clampCalendarDay(index, current));
    setMonthMenuOpen(false);
  }

  const teamFilter = filterValues.team ?? DECK_TEAM_OPTIONS[0];
  const bookingTypeFilter = filterValues["booking-type"] ?? "Show all";

  const deckFilteredBookings = isDeckVariant
    ? filterBookingsByKind(DECK_TODAY_BOOKINGS, bookingTypeFilter)
    : [];

  const deckFilteredAvatars = isDeckVariant
    ? filterAvatarsByTeam(DECK_OFFICE_AVATARS, teamFilter)
    : [];

  const deckTeamName = resolveTeamNameFromFilter(teamFilter);
  const deckOccupancyLabel = isDeckVariant
    ? teamFilter.includes("Add a team")
      ? "No-one's in!"
      : teamOccupancyLabel(deckFilteredAvatars.length, deckTeamName)
    : "";

  const showTeamCoworkers = isDeckVariant || teamFilter === "London Design";
  const occupancyLabel = isDeckVariant
    ? deckOccupancyLabel
    : showTeamCoworkers
      ? "2 teammates in"
      : "No-one's in!";
  const coworkers = isDeckVariant
    ? deckFilteredAvatars
    : showTeamCoworkers
      ? COWORKERS_IN_OFFICE.map((c) => ({ initials: c.initials, color: c.color }))
      : [];

  const searchResults = (
    searchQuery.trim()
      ? SEARCH_ITEMS.filter((item) =>
          item.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        )
      : [...SEARCH_ITEMS]
  ).slice(0, 8);

  const handleNavClick = (id: string, label: string) => {
    closeAllOverlays();
    setActiveNav(id);
    if (id === "inbox") {
      setInboxBadge(false);
      return;
    }
    if (id === "bookings" || id === "teams") return;
    if (id === "find-space" && isDeckVariant) return;
    showToast(label);
  };

  const isTeamsView = activeNav === "teams";
  const isFindSpaceView = isDeckVariant && activeNav === "find-space";
  const isInboxView = activeNav === "inbox";
  const isBookingsView = !isTeamsView && !isFindSpaceView && !isInboxView;

  const handleAddBooking = (dayId: DayId, dayTitle: string) => {
    const type = filterValues["booking-type"] ?? "Desk";
    const label =
      type === "Show all" ? "Desk — Floor 21" : `${type} — Floor 21`;
    setAddedBookings((prev) => ({
      ...prev,
      [dayId]: [...prev[dayId], label],
    }));
    showToast(`${content.addedBookingToast} ${dayTitle}`);
  };

  return (
    <div
      className="relative flex h-full w-full overflow-hidden antialiased text-left"
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
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className={`h-[30px] w-full rounded-[8px] border-0 py-0 pl-[26px] ${TEXT_XS} font-medium outline-none transition-[box-shadow,background-color] duration-150 placeholder:font-normal placeholder:text-[#919EAB] focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(0,111,236,0.16)] ${searchOpen ? "pr-7" : "pr-2"} ${FOCUS_RING}`}
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
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[120px] overflow-y-auto rounded-lg border bg-white py-0.5"
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
                  onClick={() => showToast(content.helpToast)}
                />
              );
            }
            if (item.id === "status") {
              return (
                <NavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  reducedMotion={reducedMotion}
                  onClick={() => showToast("All systems operational")}
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
            <span
              className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold leading-none text-white"
              style={{
                background: `linear-gradient(145deg, ${SALTMINE.primary} 0%, #4D9BF7 100%)`,
                boxShadow: "0 2px 6px rgba(0, 111, 236, 0.24)",
              }}
              aria-hidden
            >
              <span className="block translate-y-px leading-none">{initial}</span>
            </span>
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
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F4F6F8] px-3 py-2.5">
          <div className={`flex items-center justify-between gap-2 ${isFindSpaceView ? "mb-1" : "mb-1.5"}`}>
            <div className="min-w-0">
              <h1
                className="m-0 text-[14px] font-extrabold leading-4 tracking-[-0.035em]"
                style={{ color: SALTMINE.text }}
              >
                {isTeamsView
                  ? content.teamsPageTitle
                  : isFindSpaceView
                    ? content.findSpacePageTitle
                    : isInboxView
                      ? content.inboxPageTitle
                      : content.pageTitle}
              </h1>
            </div>
            {isBookingsView ? (
              <ViewToggle
                value={viewMode}
                onChange={(mode) => {
                  closeAllOverlays();
                  if (isDeckVariant && mode !== "Daily") {
                    showToast("Demo view");
                  }
                  setViewMode(mode);
                }}
                reducedMotion={reducedMotion}
              />
            ) : null}
          </div>

          {isBookingsView && viewMode === "Daily" ? (
            <div className="mb-1.5">
              <div className="flex gap-1.5">
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
                      value={filterValues[filter.id] ?? filter.defaultValue}
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
            ) : (
            <div className="h-full space-y-2 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {viewMode === "Daily" ? (
                isDeckVariant ? (
                  <>
                    <DeckDaySection
                      dayKey="today"
                      weatherLabel="14°"
                      weatherIcon="cloud"
                      coworkers={coworkers}
                      occupancyLabel={occupancyLabel}
                      bookings={deckFilteredBookings}
                      isToday
                      showCommutePill
                      filterEmptyMessage={
                        deckFilteredBookings.length === 0 &&
                        DECK_TODAY_BOOKINGS.length > 0
                          ? "No bookings match this filter"
                          : undefined
                      }
                      onView={() =>
                        showToast(`${content.viewDetailToast} St Mary Axe`)
                      }
                      onAddBooking={() => handleAddBooking("today", DECK_DAY_TITLES.today)}
                      onBookingAction={(label) => showToast(`${label} — demo`)}
                      onExternalLink={() => showToast(content.externalLinkToast)}
                    />
                    <div
                      className="h-px"
                      style={{ backgroundColor: HAIRLINE }}
                      aria-hidden
                    />
                    <DeckDaySection
                      dayKey="tomorrow"
                      weatherLabel="12°"
                      weatherIcon="sun"
                      coworkers={coworkers}
                      occupancyLabel={occupancyLabel}
                      bookings={[]}
                      isEmptyTomorrow
                      onView={() =>
                        showToast(`${content.viewDetailToast} St Mary Axe`)
                      }
                      onAddBooking={() =>
                        handleAddBooking("tomorrow", DECK_DAY_TITLES.tomorrow)
                      }
                      onBookingAction={(label) => showToast(`${label} — demo`)}
                      onExternalLink={() => showToast(content.externalLinkToast)}
                      onRepeatDesk={() =>
                        showToast("Desk 21.P3.2 repeated for tomorrow")
                      }
                    />
                  </>
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
                        dayKey={day.id}
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
                  <DeckDemoSkeleton label="Monthly" />
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

        {isBookingsView ? (
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
            bookingDays={isDeckVariant ? DECK_CALENDAR.bookingDays : []}
            todayDay={
              isDeckVariant && calendarMonthIndex === DECK_CALENDAR.monthIndex
                ? DECK_CALENDAR.selectedDay
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
            onSelectDay={setCalendarDay}
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
        {isInboxView && inboxDetailOpen ? (
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
