"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import {
  DeckAddBookingPanel,
  type DeckAddBookingActionId,
} from "@/components/slider/saltmine-deck-add-booking-panel";
import { DeckMonthlyCalendar } from "@/components/slider/saltmine-deck-monthly-calendar";
import { SaltmineMiniCalendar } from "@/components/slider/saltmine-mini-calendar";
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
import { SaltmineDashboardSideOverlay } from "@/components/slider/saltmine-dashboard-side-overlay";
import { SaltmineDashboardCenterDialog } from "@/components/slider/saltmine-dashboard-center-dialog";
import { WaitlistQueueDetailsDialogFlow } from "@/components/slider/slide-screens/future-plan/future-plan-dialog-flows";
import {
  DECK_FILTER_DEFAULTS,
  DECK_BOOKING_TYPE_OPTIONS,
  DECK_CALENDAR,
  DECK_OFFICE_AVATARS,
  DECK_TEAM_OPTIONS,
  DECK_TIMELINE_DAYS,
  deckBookingDaysFromTimeline,
  findDeckBooking,
  findTimelineDay,
  filterAvatarsByTeam,
  filterBookingsByKind,
  resolveTeamNameFromFilter,
  teamOccupancyLabel,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import {
  appendAddedBookingToDay,
  labelsToAddedDayBookings,
  mergeAddedBookingsIntoTimeline,
  type DeckAddedDayBookings,
} from "@/lib/saltmine-last-minute-booking";
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
const ADD_BOOKING_RAIL_WIDTH = 200;
const INBOX_DETAIL_RAIL_WIDTH = 300;
const ICON_STROKE = 1.65;
const HAIRLINE = SALTMINE_HAIRLINE;
const SURFACE_INSET = SALTMINE_SURFACE_INSET;
const MENU_SHADOW = SALTMINE_MENU_SHADOW;

import {
  SALTMINE_DECK_TEXT_2XS,
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";
import {
  SALTMINE_DECK_MAIN_PAD_CLASS,
  SALTMINE_DECK_MAIN_PAD_MOBILE_CLASS,
  SALTMINE_DECK_TIMELINE_GAP_CLASS,
} from "@/lib/saltmine-deck-spacing";

const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_2XS = SALTMINE_DECK_TEXT_2XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;

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
  const segmentCount = content.viewModes.length;

  return (
    <div
      role="group"
      aria-label="Calendar view"
      className="relative mx-auto grid w-full max-w-[228px] grid-cols-3 rounded-[10px] p-0.5"
      style={{
        backgroundColor: SALTMINE.neutral,
        boxShadow: SURFACE_INSET,
      }}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0.5 top-0.5 rounded-[8px] ${motionClass(reducedMotion, "transition-transform duration-200 ease-out")}`}
        style={{
          width: `calc((100% - 4px) / ${segmentCount})`,
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
            className={`relative z-[1] flex min-h-7 items-center justify-center rounded-[8px] px-1 font-bold leading-none tracking-[-0.01em] transition-colors duration-150 active:scale-[0.98] ${TEXT_MICRO} ${FOCUS_RING}`}
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
  deckCustomMainContent,
  deckCustomOverlay,
  deckCustomOverlayLabel,
  deckCustomOverlayPlacement = "side",
  deckCustomHeaderTitle,
  deckTimelineDays,
  deckCustomOverlayOnClose,
  onLastMinuteAlternative,
  onLastMinuteWaitlist,
  onDeckBookingAction,
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
  /** Future-plan deck mocks — replace bookings main panel while keeping real dashboard chrome. */
  deckCustomMainContent?: ReactNode;
  /** Future-plan deck mocks — persistent right-rail panel (e.g. cab step in add booking). */
  deckCustomOverlay?: ReactNode;
  deckCustomOverlayLabel?: string;
  /** Side rail (default) or centred modal for `deckCustomOverlay`. */
  deckCustomOverlayPlacement?: "side" | "center";
  /** Override the bookings header title on deck slides. */
  deckCustomHeaderTitle?: string;
  /** Per-slide timeline rows (defaults to `DECK_TIMELINE_DAYS`). */
  deckTimelineDays?: readonly DeckTimelineDay[];
  /** Called when the deck custom overlay dismiss control is used. */
  deckCustomOverlayOnClose?: () => void;
  onLastMinuteAlternative?: (label: string) => void;
  onLastMinuteWaitlist?: () => void;
  onDeckBookingAction?: (actionLabel: string, bookingId: string) => void;
}) {
  const isDeckVariant = variant === "deck";
  const deckTimeline = deckTimelineDays ?? DECK_TIMELINE_DAYS;
  const isMobileEmbed = embedLayout === "mobile";
  const supportsAddBookingFlow = !isMobileEmbed;
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
  const [addBookingPanel, setAddBookingPanel] = useState<{
    dayId: string;
    dayTitle: string;
  } | null>(null);
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

  const resolveTimelineDay = useCallback(
    (dayId: string): Pick<DeckTimelineDay, "isToday" | "calendar" | "id"> => {
      const fromDeck = deckTimeline.find((day) => day.id === dayId);
      if (fromDeck) {
        return {
          id: fromDeck.id,
          isToday: fromDeck.isToday,
          calendar: fromDeck.calendar,
        };
      }

      if (dayId === "today") {
        return {
          id: "today",
          isToday: true,
          calendar: {
            monthIndex: DECK_CALENDAR.monthIndex,
            day: DECK_CALENDAR.todayDay,
          },
        };
      }

      return {
        id: dayId,
        calendar: {
          monthIndex: DECK_CALENDAR.monthIndex,
          day: DECK_CALENDAR.todayDay + 1,
        },
      };
    },
    [deckTimeline],
  );

  const [addedByDay, setAddedByDay] = useState<Record<string, DeckAddedDayBookings>>(() =>
    labelsToAddedDayBookings(initialAddedBookings ?? { today: [], tomorrow: [] }, (dayId) =>
      resolveTimelineDay(dayId),
    ),
  );

  const displayTimeline = useMemo(
    () => mergeAddedBookingsIntoTimeline(deckTimeline, addedByDay),
    [addedByDay, deckTimeline],
  );

  const hasAnyAddedBooking = Object.values(addedByDay).some(
    (entry) => entry.bookings.length > 0,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [waitlistDetailsOpen, setWaitlistDetailsOpen] = useState(false);
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
    setAddBookingPanel(null);
    setSelectedBookingId(null);
    setWaitlistDetailsOpen(false);
  }, []);

  const openWaitlistDetails = useCallback(() => {
    if (onLastMinuteWaitlist) {
      onLastMinuteWaitlist();
      return;
    }
    closeAllOverlays();
    setWaitlistDetailsOpen(true);
  }, [closeAllOverlays, onLastMinuteWaitlist]);

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
    ? deckTimeline.find((day) => day.id === presencePanelDayId)
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
    !isMobileEmbed && isBookingsView && viewMode === "Daily";

  const handleAddBooking = (dayId: string, dayTitle: string) => {
    if (!supportsAddBookingFlow) {
      const type = filterValues["booking-type"] ?? "Desk";
      const label =
        type === "Show all" ? "Desk — Floor 21" : `${type} — Floor 21`;
      setAddedByDay((prev) =>
        appendAddedBookingToDay(prev, dayId, resolveTimelineDay(dayId), { label }),
      );
      showToast(`${content.addedBookingToast} ${dayTitle}`);
      return;
    }

    setSelectedBookingId(null);
    setPresencePanelDayId(null);
    setAddBookingPanel({ dayId, dayTitle });
  };

  const handleAddBookingComplete = (result: {
    actionId: DeckAddBookingActionId;
    label: string;
  }) => {
    if (!addBookingPanel) return;
    setAddedByDay((prev) =>
      appendAddedBookingToDay(prev, addBookingPanel.dayId, resolveTimelineDay(addBookingPanel.dayId), {
        label: result.label,
        actionId: result.actionId,
      }),
    );
    showToast(`${content.addedBookingToast} ${addBookingPanel.dayTitle}`);
    setAddBookingPanel(null);
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
      const match = findTimelineDay(displayTimeline, calendarMonthIndex, day);
      setSelectedTimelineDayId(match?.id ?? null);
      if (match) {
        scrollToTimelineDay(match.id);
        return;
      }
      const monthName = CALENDAR_MONTHS[calendarMonthIndex]?.label.split(" ")[0] ?? "";
      showToast(`No bookings scheduled for ${day} ${monthName}`);
    },
    [calendarMonthIndex, displayTimeline, isDeckVariant, scrollToTimelineDay, showToast],
  );

  const deckCalendarBookingDays = isDeckVariant
    ? deckBookingDaysFromTimeline(displayTimeline, calendarMonthIndex)
    : [];

  function selectMonth(index: number) {
    const nextDay = clampCalendarDay(index, calendarDay);
    setCalendarMonthIndex(index);
    setCalendarDay(nextDay);
    setMonthMenuOpen(false);
    if (isDeckVariant) {
      const match = findTimelineDay(displayTimeline, index, nextDay);
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

      <div className="relative flex min-w-0 flex-1">
        <main
          className={`relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F4F6F8] ${isMobileEmbed ? SALTMINE_DECK_MAIN_PAD_MOBILE_CLASS : SALTMINE_DECK_MAIN_PAD_CLASS}`}
        >
          <div
            className={
              isConferenceGridView
                ? "mb-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                : isBookingsView && !deckCustomMainContent
                  ? "mb-1.5 flex flex-col gap-2"
                  : `mb-1 flex items-center gap-2 ${
                      isFindSpaceView || isBookingGridView ? "justify-between" : "justify-between"
                    }`
            }
          >
            <div className={isBookingsView && !deckCustomMainContent ? "min-w-0" : "min-w-0"}>
              <h1
                className={`m-0 font-extrabold tracking-[-0.035em] ${isMobileEmbed ? "text-[12px] leading-[14px]" : "text-[14px] leading-4"}`}
                style={{ color: SALTMINE.text }}
              >
                {deckCustomHeaderTitle ??
                  (isTeamsView
                    ? content.teamsPageTitle
                    : isFindSpaceView
                      ? content.findSpacePageTitle
                      : isInboxView
                        ? content.inboxPageTitle
                        : isBookingGridView
                          ? content.bookingGridPageTitle
                          : isConferenceGridView
                            ? content.conferenceGridPageTitle
                            : content.pageTitle)}
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
              deckCustomMainContent ? null : (
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
              )
            ) : null}
          </div>

          {isBookingsView && viewMode === "Daily" && !deckCustomMainContent ? (
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
            ) : isBookingsView && deckCustomMainContent ? (
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
                {deckCustomMainContent}
              </div>
            ) : (
            <div
              ref={isDeckVariant && viewMode === "Daily" ? timelineScrollRef : undefined}
              className={
                isDeckVariant
                  ? viewMode === "Monthly"
                    ? "flex h-full min-h-0 flex-col overflow-hidden"
                    : `no-scrollbar h-full min-h-0 ${SALTMINE_DECK_TIMELINE_GAP_CLASS} overflow-y-auto overscroll-y-contain`
                  : `no-scrollbar h-full ${SALTMINE_DECK_TIMELINE_GAP_CLASS} overflow-y-auto overscroll-contain`
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
                  displayTimeline.map((day, index) => {
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
                          workLocationLabel={day.workLocationLabel}
                          lastMinute={day.lastMinute}
                          presenceMode={day.presenceMode}
                          occupancyHighlight={day.occupancyHighlight}
                          filterEmptyMessage={
                            day.isToday &&
                            day.bookings.length > 0 &&
                            filteredBookings.length === 0
                              ? "No bookings match this filter"
                              : undefined
                          }
                          onView={() => {
                            setSelectedBookingId(null);
                            setAddBookingPanel(null);
                            setPresencePanelDayId((current) =>
                              current === day.id ? null : day.id,
                            );
                          }}
                          onAddBooking={() => handleAddBooking(day.id, day.title)}
                          onBookingAction={(label, bookingId) =>
                            onDeckBookingAction?.(label, bookingId) ??
                            showToast(`${label} — demo`)
                          }
                          onBookingSelect={(bookingId) => {
                            setPresencePanelDayId(null);
                            setAddBookingPanel(null);
                            setSelectedBookingId((current) =>
                              current === bookingId ? null : bookingId,
                            );
                          }}
                          onExternalLink={() => showToast(content.externalLinkToast)}
                          onLastMinuteWaitlist={openWaitlistDetails}
                          onLastMinuteAlternative={(label) =>
                            onLastMinuteAlternative?.(label) ??
                            showToast(`Booked ${label} — demo`)
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
                        bookings={addedByDay[day.id]?.bookings ?? []}
                        isToday={index === 0}
                        lastMinute={addedByDay[day.id]?.lastMinute}
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
                        onBookingAction={(label, bookingId) =>
                          onDeckBookingAction?.(label, bookingId) ??
                          showToast(`${label} — demo`)
                        }
                        onExternalLink={() =>
                          showToast(content.externalLinkToast)
                        }
                        onLastMinuteWaitlist={openWaitlistDetails}
                        onLastMinuteAlternative={(label) =>
                          onLastMinuteAlternative?.(label) ??
                          showToast(`Booked ${label} — demo`)
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
                      const timelineDay = findTimelineDay(
                        displayTimeline,
                        calendarMonthIndex,
                        day,
                      );
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
          <SaltmineMiniCalendar
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

        {isBookingsView &&
        deckCustomOverlay &&
        supportsAddBookingFlow &&
        !addBookingPanel &&
        deckCustomOverlayPlacement !== "center" ? (
            <SaltmineDashboardSideOverlay
              ariaLabel={deckCustomOverlayLabel ?? "Panel"}
              width={ADD_BOOKING_RAIL_WIDTH}
              onClose={() => deckCustomOverlayOnClose?.() ?? showToast("Demo panel")}
            >
              {deckCustomOverlay}
            </SaltmineDashboardSideOverlay>
        ) : null}

        {isBookingsView && addBookingPanel && supportsAddBookingFlow ? (
          <SaltmineDashboardSideOverlay
            ariaLabel={content.addBookingPanelLabel}
            width={ADD_BOOKING_RAIL_WIDTH}
            onClose={() => setAddBookingPanel(null)}
          >
            <DeckAddBookingPanel
              dayTitle={addBookingPanel.dayTitle}
              firstTime={!isDeckVariant && !hasAnyAddedBooking}
              onClose={() => setAddBookingPanel(null)}
              onComplete={handleAddBookingComplete}
            />
          </SaltmineDashboardSideOverlay>
        ) : null}

        {isBookingsView && selectedBookingDetail && isDeckVariant && !isMobileEmbed ? (
          <SaltmineDashboardSideOverlay
            ariaLabel={content.bookingDetailPanelLabel}
            width={DASHBOARD_RAIL_WIDTH}
            onClose={() => setSelectedBookingId(null)}
          >
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
          </SaltmineDashboardSideOverlay>
        ) : null}

        {isBookingsView && presencePanelDay && isDeckVariant && !isMobileEmbed ? (
          <SaltmineDashboardSideOverlay
            ariaLabel={content.officePresencePanelLabel}
            width={DASHBOARD_RAIL_WIDTH}
            onClose={() => setPresencePanelDayId(null)}
          >
            <p
              className={`mb-1.5 px-0.5 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
              style={{ color: SALTMINE.textMuted }}
            >
              {content.officePresencePanelLabel}
            </p>
            <OfficePresencePanel
              officeName={OFFICE_PRESENCE_OFFICE_NAME}
              teamName={deckTeamName}
              dayTitle={presencePanelDay.title}
              summary={presencePanelSummary}
              people={presencePanelPeople}
              showSummary={false}
              onClose={() => setPresencePanelDayId(null)}
              onFloorPlan={() => {
                showToast(
                  `${content.officePresenceFloorPlanToast} ${OFFICE_PRESENCE_OFFICE_NAME}`,
                );
                setPresencePanelDayId(null);
              }}
            />
          </SaltmineDashboardSideOverlay>
        ) : null}

        {isInboxView && inboxDetailOpen && !isMobileEmbed ? (
          <aside
            className="flex shrink-0 flex-col border-l bg-white px-3 py-3"
            style={{
              width: INBOX_DETAIL_RAIL_WIDTH,
              borderColor: HAIRLINE,
            }}
            aria-label={content.inboxDetailPanelLabel}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
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

      {isBookingsView &&
      deckCustomOverlay &&
      supportsAddBookingFlow &&
      !addBookingPanel &&
      deckCustomOverlayPlacement === "center" ? (
        <SaltmineDashboardCenterDialog
          ariaLabel={deckCustomOverlayLabel ?? "Dialog"}
          onClose={() => deckCustomOverlayOnClose?.() ?? showToast("Demo panel")}
        >
          {deckCustomOverlay}
        </SaltmineDashboardCenterDialog>
      ) : null}

      {isBookingsView &&
      waitlistDetailsOpen &&
      !deckCustomOverlay &&
      supportsAddBookingFlow ? (
        <SaltmineDashboardCenterDialog
          ariaLabel="Waitlist"
          onClose={() => setWaitlistDetailsOpen(false)}
        >
          <WaitlistQueueDetailsDialogFlow close={() => setWaitlistDetailsOpen(false)} />
        </SaltmineDashboardCenterDialog>
      ) : null}

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
