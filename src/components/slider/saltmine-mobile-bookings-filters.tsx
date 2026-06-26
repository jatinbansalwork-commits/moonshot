"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Bookmark, ChevronDown, Users } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_BOOKING_TYPE_OPTIONS,
  DECK_TEAM_OPTIONS,
} from "@/lib/saltmine-deck-bookings-data";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CARD_PAD_CLASS,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_FILTER_LABEL_CLASS,
  SALTMINE_MOBILE_FILTER_TRIGGER_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_LIST_GAP_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
  SALTMINE_MOBILE_SEGMENTED_TAB_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import {
  filterBookingsByKind,
  findDeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import {
  SALTMINE,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const SURFACE_INSET = SALTMINE_SURFACE_INSET;

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [active, onClose, ref]);
}

function MobileFilterMenu({
  id,
  options,
  value,
  onSelect,
  onClose,
}: {
  id: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <ul
      id={id}
      role="listbox"
      className="no-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[200px] overflow-y-auto overscroll-contain rounded-lg border bg-white py-1 shadow-lg"
      style={{ borderColor: "rgba(145, 158, 171, 0.24)" }}
    >
      {options.map((option) => (
        <li key={option} role="none">
          <button
            type="button"
            role="option"
            aria-selected={option === value}
            onClick={() => {
              onSelect(option);
              onClose();
            }}
            className={`w-full px-3 py-2.5 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} ${FOCUS_RING}`}
            style={{
              color: option === value ? SALTMINE.primary : SALTMINE.text,
              fontWeight: option === value ? 700 : 500,
              backgroundColor: option === value ? "rgba(0, 111, 236, 0.06)" : "transparent",
            }}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  );
}

function MobileFilterSelect({
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
      <p className={SALTMINE_MOBILE_FILTER_LABEL_CLASS} style={{ color: SALTMINE.textMuted }}>
        {label}
      </p>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${filterId}-menu` : undefined}
        onClick={onToggle}
        className={`${SALTMINE_MOBILE_FILTER_TRIGGER_CLASS} ${SALTMINE_MOBILE_PRESS_CLASS}`}
        style={{
          backgroundColor: open ? "#FFFFFF" : SALTMINE.neutral,
          color: SALTMINE.text,
          borderColor: open ? "rgba(0, 111, 236, 0.32)" : "transparent",
          boxShadow: open ? "0 0 0 3px rgba(0, 111, 236, 0.12)" : SURFACE_INSET,
        }}
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: SALTMINE.accentSolid, color: SALTMINE.primary }}
        >
          <FilterIcon className="h-3.5 w-3.5" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
        </span>
        <span className={`min-w-0 flex-1 truncate ${SALTMINE_MOBILE_SECONDARY_CLASS} font-semibold`}>
          {value}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={SALTMINE_MOBILE_ICON.stroke}
          aria-hidden
        />
      </button>
      {open ? (
        <MobileFilterMenu
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

export function SaltmineMobileBookingsFilters({
  bookingType,
  team,
  onBookingTypeChange,
  onTeamChange,
}: {
  bookingType: string;
  team: string;
  onBookingTypeChange: (value: string) => void;
  onTeamChange: (value: string) => void;
}) {
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  function handleSelect(id: string, value: string, onChange: (value: string) => void) {
    onChange(value);
    setOpenFilterId(null);
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex h-8 max-w-[48%] items-center truncate rounded-full px-2.5 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold`}
            style={{
              backgroundColor: SALTMINE.neutral,
              color: SALTMINE.textSecondary,
            }}
          >
            {bookingType}
          </span>
          <span
            className={`inline-flex h-8 min-w-0 flex-1 items-center truncate rounded-full px-2.5 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold`}
            style={{
              backgroundColor: SALTMINE.neutral,
              color: SALTMINE.textSecondary,
            }}
          >
            {team}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`inline-flex h-11 shrink-0 items-center justify-center rounded-[10px] border px-3 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold ${SALTMINE_MOBILE_PRESS_CLASS} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(145, 158, 171, 0.28)",
            color: SALTMINE.primary,
            backgroundColor: "#FFFFFF",
          }}
        >
          Edit filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold`} style={{ color: SALTMINE.textMuted }}>
          Filters
        </p>
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setOpenFilterId(null);
          }}
          className={`${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold ${FOCUS_RING}`}
          style={{ color: SALTMINE.primary }}
        >
          Done
        </button>
      </div>
      <MobileFilterSelect
        filterId="booking-type"
        label={content.filters[0].label}
        value={bookingType}
        options={DECK_BOOKING_TYPE_OPTIONS}
        icon="bookmark"
        open={openFilterId === "booking-type"}
        onToggle={() =>
          setOpenFilterId((current) => (current === "booking-type" ? null : "booking-type"))
        }
        onSelect={(value) => handleSelect("booking-type", value, onBookingTypeChange)}
        onClose={() => setOpenFilterId(null)}
      />
      <MobileFilterSelect
        filterId="team"
        label={content.filters[1].label}
        value={team}
        options={DECK_TEAM_OPTIONS}
        icon="users"
        open={openFilterId === "team"}
        onToggle={() => setOpenFilterId((current) => (current === "team" ? null : "team"))}
        onSelect={(value) => handleSelect("team", value, onTeamChange)}
        onClose={() => setOpenFilterId(null)}
      />
    </div>
  );
}

export function SaltmineMobileViewModeToggle({
  value,
  onChange,
}: {
  value: "Daily" | "Weekly" | "Monthly";
  onChange: (mode: "Daily" | "Weekly" | "Monthly") => void;
}) {
  const modes = content.viewModes;

  return (
    <div
      className="flex gap-1 rounded-[12px] p-1"
      style={{
        borderColor: "rgba(145, 158, 171, 0.2)",
        backgroundColor: "rgba(145, 158, 171, 0.06)",
      }}
      role="tablist"
      aria-label="Calendar view"
    >
      {modes.map((mode) => {
        const selected = value === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(mode)}
            className={SALTMINE_MOBILE_SEGMENTED_TAB_CLASS}
            style={{
              color: selected ? SALTMINE.primaryDark : SALTMINE.textSecondary,
              backgroundColor: selected ? "#FFFFFF" : "transparent",
              boxShadow: selected ? "0 1px 2px rgba(28, 37, 46, 0.06)" : undefined,
            }}
          >
            {mode}
          </button>
        );
      })}
    </div>
  );
}

export function SaltmineMobileWeeklyView({
  bookingTypeFilter,
  selected,
  onSelectDay,
}: {
  bookingTypeFilter: string;
  selected: { monthIndex: number; day: number };
  onSelectDay: (monthIndex: number, day: number) => void;
}) {
  const weekDays = [
    { weekday: "Mon", day: 30, monthIndex: 0 },
    { weekday: "Tue", day: 31, monthIndex: 0 },
    { weekday: "Wed", day: 1, monthIndex: 1 },
    { weekday: "Thu", day: 2, monthIndex: 1 },
    { weekday: "Fri", day: 3, monthIndex: 1 },
    { weekday: "Sat", day: 4, monthIndex: 1 },
    { weekday: "Sun", day: 5, monthIndex: 1 },
  ] as const;

  return (
    <div className={SALTMINE_MOBILE_LIST_GAP_CLASS} aria-label="Weekly bookings">
      {weekDays.map((item) => {
        const timelineDay = findDeckTimelineDay(item.monthIndex, item.day);
        const bookings = timelineDay
          ? filterBookingsByKind(timelineDay.bookings, bookingTypeFilter)
          : [];
        const isSelected =
          selected.monthIndex === item.monthIndex && selected.day === item.day;

        return (
          <button
            key={`${item.monthIndex}-${item.day}`}
            type="button"
            onClick={() => onSelectDay(item.monthIndex, item.day)}
            className={`${SALTMINE_MOBILE_CARD_CLASS} ${SALTMINE_MOBILE_CARD_PAD_CLASS} w-full text-left ${SALTMINE_MOBILE_PRESS_CLASS} ${FOCUS_RING}`}
            style={{
              borderColor: isSelected ? "rgba(0, 111, 236, 0.35)" : "rgba(145, 158, 171, 0.28)",
              backgroundColor: isSelected ? "rgba(0, 111, 236, 0.04)" : "#FFFFFF",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`m-0 ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`} style={{ color: SALTMINE.text }}>
                  {item.weekday} {item.day}
                </p>
                <p className={`m-0 mt-1 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textMuted }}>
                  {bookings.length === 0
                    ? "No bookings"
                    : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`}
                </p>
              </div>
              {bookings[0] ? (
                <span
                  className={`max-w-[52%] truncate ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold`}
                  style={{ color: SALTMINE.textSecondary }}
                >
                  {bookings[0].title}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function SaltmineMobileWeeklyPlaceholder() {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed px-4 py-8 text-center"
      style={{ borderColor: "rgba(145, 158, 171, 0.35)", backgroundColor: "rgba(145, 158, 171, 0.04)" }}
      aria-label="Weekly view preview"
    >
      <p className={`m-0 ${SALTMINE_MOBILE_BODY_CLASS} font-semibold`} style={{ color: SALTMINE.textMuted }}>
        Weekly view
      </p>
      <p className={`m-0 ${SALTMINE_MOBILE_CAPTION_CLASS}`} style={{ color: SALTMINE.textMuted }}>
        Switch to Daily for the full demo
      </p>
    </div>
  );
}
