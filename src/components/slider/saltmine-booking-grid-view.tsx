"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, MapPin, Users, Video, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  BOOKING_GRID_DISPLAY_OPTIONS,
  BOOKING_GRID_END_HOUR,
  BOOKING_GRID_HOUR_LABELS,
  BOOKING_GRID_LOCATION_OPTIONS,
  BOOKING_GRID_NOW,
  BOOKING_GRID_START_HOUR,
  BOOKING_GRID_TIMEZONE,
  BOOKING_GRID_TYPE_OPTIONS,
  ROOM_COLUMN_WIDTH,
  bookingGridDayOffsetFromDate,
  bookingGridNowOffsetMinutes,
  buildBookingGridCalendarWeeks,
  formatBookingGridMonthLabel,
  formatBookingGridNowLabel,
  formatBookingGridTimeRange,
  getBookingGridDateLabel,
  getBookingGridDateParts,
  getBookingGridSchedule,
  type BookingGridBlock,
  type BookingGridRoom,
} from "@/lib/saltmine-booking-grid-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
  SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const MENU_SHADOW = "0 8px 24px rgba(28, 37, 46, 0.12), 0 2px 6px rgba(28, 37, 46, 0.06)";
const HOUR_HEIGHT = 32;
const ALL_DAY_HEIGHT = 22;
const HEADER_HEIGHT = 34;
const TIME_COLUMN_WIDTH = 44;
const BOOKING_BLOCK_BG = "#EDE8F5";
const BOOKING_BLOCK_BORDER = "rgba(124, 58, 237, 0.16)";

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [enabled, onClose, ref]);
}

function BookingGridFilterMenu({
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
      className="no-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-[1] max-h-[120px] overflow-y-auto rounded-lg border bg-white py-0.5 shadow-lg"
      style={{
        borderColor: HAIRLINE,
        boxShadow: MENU_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      }}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <li key={option} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
              className={`flex w-full items-center gap-1 px-2 py-1 text-left ${TEXT_XS} ${FOCUS_RING}`}
              style={{
                color: selected ? SALTMINE.primary : SALTMINE.text,
                fontWeight: selected ? 700 : 500,
                backgroundColor: selected ? "rgba(0, 111, 236, 0.06)" : "transparent",
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

function BookingGridFilterField({
  filterId,
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onSelect,
  className = "min-w-0 flex-1",
}: {
  filterId: string;
  label: string;
  value: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose, open);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <p
        className={`mb-0.5 truncate px-0.5 font-medium ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${filterId}-menu` : undefined}
        aria-label={`${label} ${value}`}
        onClick={onToggle}
        className={`flex h-[28px] w-full items-center gap-0.5 rounded-md border-0 px-1.5 text-left ${TEXT_XS} font-semibold ${FOCUS_RING}`}
        style={{
          color: SALTMINE.text,
          backgroundColor: open ? SALTMINE_ONBOARDING.color.canvas : SALTMINE.neutral,
          boxShadow: open ? "0 0 0 3px rgba(0, 111, 236, 0.12)" : SALTMINE_SURFACE_INSET,
        }}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-2.5 w-2.5 shrink-0 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
      </button>
      {open ? (
        <BookingGridFilterMenu
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

function BookingGridCalendarPopover({
  dayOffset,
  onSelectDay,
  onClose,
}: {
  dayOffset: number;
  onSelectDay: (offset: number) => void;
  onClose: () => void;
}) {
  const selected = getBookingGridDateParts(dayOffset);
  const [viewYear, setViewYear] = useState(selected.year);
  const [viewMonth, setViewMonth] = useState(selected.month);
  const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const weekendIndexes = new Set([5, 6]);
  const weeks = useMemo(
    () => buildBookingGridCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  useEffect(() => {
    setViewYear(selected.year);
    setViewMonth(selected.month);
  }, [selected.year, selected.month]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  return (
    <div
      role="dialog"
      aria-label="Choose a date"
      className="absolute right-0 top-[calc(100%+6px)] z-50 w-[168px] rounded-[10px] border bg-white p-2 shadow-lg"
      style={{
        borderColor: HAIRLINE,
        boxShadow: MENU_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label="Previous month"
          onClick={goPrevMonth}
          className={`inline-flex h-5 w-5 items-center justify-center rounded-[5px] transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ChevronLeft className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
        <span
          className={`min-w-0 flex-1 truncate text-center font-bold ${TEXT_2XS}`}
          style={{ color: SALTMINE.text }}
        >
          {formatBookingGridMonthLabel(viewYear, viewMonth)}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={goNextMonth}
          className={`inline-flex h-5 w-5 items-center justify-center rounded-[5px] transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ChevronRight className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      </div>

      <div
        className="mb-0.5 grid grid-cols-7 justify-items-center border-b pb-0.5"
        style={{ borderColor: "rgba(145, 158, 171, 0.16)" }}
      >
        {weekdayLabels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="flex h-3.5 w-[18px] items-center justify-center text-[6px] font-bold uppercase leading-none tracking-[0.08em]"
            style={{
              color: weekendIndexes.has(index)
                ? "rgba(145, 158, 171, 0.65)"
                : SALTMINE.textMuted,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-y-0.5 pt-0.5">
        {weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (date === null) {
              return (
                <span
                  key={`empty-${weekIndex}-${dayIndex}`}
                  className="h-[18px] w-[18px]"
                  aria-hidden
                />
              );
            }

            const offset = bookingGridDayOffsetFromDate(viewYear, viewMonth, date);
            const isSelected =
              selected.year === viewYear &&
              selected.month === viewMonth &&
              selected.day === date;
            const isToday = offset === 0;

            return (
              <button
                key={`${viewYear}-${viewMonth}-${date}`}
                type="button"
                aria-label={`${date} ${formatBookingGridMonthLabel(viewYear, viewMonth)}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDay(offset)}
                className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full font-semibold tabular-nums ${TEXT_MICRO} ${FOCUS_RING}`}
                style={{
                  color: isSelected ? "#FFFFFF" : isToday ? SALTMINE.primary : SALTMINE.text,
                  backgroundColor: isSelected ? SALTMINE.primary : "transparent",
                  boxShadow: isToday && !isSelected ? `inset 0 0 0 1px ${SALTMINE.primary}` : undefined,
                }}
              >
                {date}
              </button>
            );
          }),
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelectDay(0)}
        className={`mt-1.5 flex h-5 w-full items-center justify-center rounded-[6px] border font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
        style={{
          borderColor: HAIRLINE,
          color: SALTMINE.textSecondary,
          backgroundColor: "white",
        }}
      >
        {content.monthlyTodayLabel}
      </button>
    </div>
  );
}

export function BookingGridDateNav({
  dayOffset,
  onDayOffsetChange,
}: {
  dayOffset: number;
  onDayOffsetChange: (offset: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dateLabel = getBookingGridDateLabel(dayOffset);

  useClickOutside(containerRef, () => setCalendarOpen(false), calendarOpen);

  useEffect(() => {
    if (!calendarOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCalendarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calendarOpen]);

  return (
    <div ref={containerRef} className="relative flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        aria-label="Previous day"
        onClick={() => {
          setCalendarOpen(false);
          onDayOffsetChange(dayOffset - 1);
        }}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <ChevronLeft className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
      <span
        className={`max-w-[150px] truncate px-0.5 font-semibold tabular-nums ${TEXT_XS}`}
        style={{ color: SALTMINE.text }}
      >
        {dateLabel}
      </span>
      <button
        type="button"
        aria-label="Next day"
        onClick={() => {
          setCalendarOpen(false);
          onDayOffsetChange(dayOffset + 1);
        }}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <ChevronRight className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
      <div className="relative">
        <button
          type="button"
          aria-label="Open calendar"
          aria-expanded={calendarOpen}
          aria-haspopup="dialog"
          onClick={() => setCalendarOpen((open) => !open)}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{
            color: calendarOpen ? SALTMINE.primary : SALTMINE.textMuted,
            backgroundColor: calendarOpen ? "rgba(0, 111, 236, 0.08)" : "transparent",
          }}
        >
          <Calendar className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
        {calendarOpen ? (
          <BookingGridCalendarPopover
            dayOffset={dayOffset}
            onSelectDay={(offset) => {
              onDayOffsetChange(offset);
              setCalendarOpen(false);
            }}
            onClose={() => setCalendarOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
}

const POPUP_SHADOW = "0 12px 32px rgba(28, 37, 46, 0.14), 0 4px 12px rgba(28, 37, 46, 0.08)";
const POPUP_WIDTH = 196;

type BookingGridPopupAnchor = {
  top: number;
  left: number;
};

function BookingGridBookingPopup({
  block,
  room,
  floor,
  office,
  anchor,
  onClose,
  showToast,
}: {
  block: BookingGridBlock;
  room: BookingGridRoom;
  floor: string;
  office: string;
  anchor: BookingGridPopupAnchor;
  onClose: () => void;
  showToast: (message: string) => void;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    popupRef.current?.focus();
  }, []);

  const whenLabel = block.allDay
    ? content.bookingGridPopupAllDayValue
    : formatBookingGridTimeRange(block.start, block.end);
  const whereLabel = `${room.label}, ${floor}, ${office}`;
  const attendees =
    block.attendees?.join(", ") ??
    (block.extraAttendees
      ? `${block.organizer} +${block.extraAttendees}`
      : block.organizer);

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${content.bookingDetailPanelLabel}: ${block.title}`}
      tabIndex={-1}
      className="absolute z-30 overflow-hidden rounded-[10px] border bg-white outline-none"
      style={{
        top: anchor.top,
        left: anchor.left,
        width: POPUP_WIDTH,
        borderColor: HAIRLINE,
        boxShadow: POPUP_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      }}
    >
      <div className="border-b px-2 py-1.5" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p
              className={`m-0 font-bold tracking-[-0.02em] ${TEXT_XS}`}
              style={{ color: SALTMINE.text }}
            >
              {block.title}
            </p>
            {block.description ? (
              <p className={`m-0 mt-0.5 ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
                {block.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={content.bookingGridPopupCloseLabel}
            onClick={onClose}
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <X className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} />
          </button>
        </div>
      </div>

      <dl className="m-0 space-y-1 px-2 py-1.5">
        <div>
          <dt className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {content.bookingGridPopupWhenLabel}
          </dt>
          <dd className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {whenLabel}
          </dd>
        </div>
        <div>
          <dt className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {content.bookingGridPopupWhereLabel}
          </dt>
          <dd
            className={`m-0 inline-flex items-start gap-0.5 font-semibold ${TEXT_2XS}`}
            style={{ color: SALTMINE.text }}
          >
            <MapPin
              className="mt-px h-2 w-2 shrink-0"
              strokeWidth={ICON_STROKE}
              style={{ color: SALTMINE.textMuted }}
              aria-hidden
            />
            <span>{whereLabel}</span>
          </dd>
        </div>
        <div>
          <dt className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {content.bookingGridPopupOrganiserLabel}
          </dt>
          <dd className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {block.organizer}
          </dd>
        </div>
        <div>
          <dt className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {content.bookingGridPopupAttendeesLabel}
          </dt>
          <dd className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {attendees}
          </dd>
        </div>
      </dl>

      <div
        className="flex flex-wrap items-center gap-1 border-t px-2 py-1.5"
        style={{ borderColor: HAIRLINE }}
      >
        {block.videoLink ? (
          <button
            type="button"
            onClick={() => {
              showToast(`${content.bookingGridPopupJoinToast} ${block.title}`);
              onClose();
            }}
            className={`inline-flex h-6 items-center gap-0.5 rounded-md border px-1.5 font-bold ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              color: "#7C3AED",
              borderColor: "rgba(124, 58, 237, 0.24)",
              backgroundColor: "rgba(124, 58, 237, 0.08)",
            }}
          >
            <Video className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
            {content.bookingGridPopupJoinLabel}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            showToast(`${content.bookingGridPopupEditToast}: ${block.title}`);
            onClose();
          }}
          className={`inline-flex h-6 items-center rounded-md px-1.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{ color: SALTMINE.primary }}
        >
          {content.bookingGridPopupEditLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            showToast(`${content.bookingGridPopupCheckInToast}: ${block.title}`);
            onClose();
          }}
          className={`inline-flex h-6 items-center rounded-md border px-1.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{
            color: "#D97706",
            borderColor: "rgba(245, 158, 11, 0.28)",
            backgroundColor: "rgba(245, 158, 11, 0.12)",
          }}
        >
          {content.bookingGridPopupCheckInLabel}
        </button>
      </div>
    </div>
  );
}

function BookingGridBlockCard({
  block,
  selected,
  onSelect,
}: {
  block: BookingGridBlock;
  selected: boolean;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${content.bookingDetailOpenLabel} ${block.title}`}
      aria-expanded={selected}
      onClick={onSelect}
      className={`absolute inset-x-0.5 overflow-hidden rounded-[4px] border px-1 py-0.5 text-left transition-shadow ${FOCUS_RING}`}
      style={{
        top: 2,
        bottom: 2,
        backgroundColor: BOOKING_BLOCK_BG,
        borderColor: selected ? SALTMINE.primary : BOOKING_BLOCK_BORDER,
        boxShadow: selected ? "0 0 0 2px rgba(0, 111, 236, 0.28)" : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-0.5">
        <p
          className={`m-0 truncate font-bold ${TEXT_2XS}`}
          style={{ color: SALTMINE.text }}
        >
          {block.title}
        </p>
        {block.videoLink ? (
          <Video
            className="h-2.5 w-2.5 shrink-0"
            strokeWidth={ICON_STROKE}
            style={{ color: "#7C3AED" }}
            aria-hidden
          />
        ) : null}
      </div>
      <p className={`m-0 truncate ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        {formatBookingGridTimeRange(block.start, block.end)}
      </p>
      <p className={`m-0 truncate font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
        {block.organizer}
        {block.extraAttendees ? ` +${block.extraAttendees}` : ""}
      </p>
    </button>
  );
}

function BookingGridAllDayBlock({
  block,
  selected,
  onSelect,
}: {
  block: BookingGridBlock;
  selected: boolean;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${content.bookingDetailOpenLabel} ${block.title}`}
      aria-expanded={selected}
      onClick={onSelect}
      className={`mx-0.5 w-[calc(100%-4px)] overflow-hidden rounded-[4px] border px-1 py-0.5 text-left transition-shadow ${FOCUS_RING}`}
      style={{
        backgroundColor: BOOKING_BLOCK_BG,
        borderColor: selected ? SALTMINE.primary : BOOKING_BLOCK_BORDER,
        boxShadow: selected ? "0 0 0 2px rgba(0, 111, 236, 0.28)" : undefined,
      }}
    >
      <p className={`m-0 truncate font-bold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
        {block.title}
      </p>
      <p className={`m-0 truncate ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
        {block.organizer}
      </p>
    </button>
  );
}

export function BookingGridMainView({
  dayOffset = 0,
  showToast,
}: {
  dayOffset?: number;
  showToast: (message: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const popupLayerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<string>(BOOKING_GRID_LOCATION_OPTIONS[0]);
  const [type, setType] = useState<string>(BOOKING_GRID_TYPE_OPTIONS[0]);
  const [display, setDisplay] = useState<string>(BOOKING_GRID_DISPLAY_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<"location" | "type" | "display" | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<{
    block: BookingGridBlock;
    room: BookingGridRoom;
    anchor: BookingGridPopupAnchor;
  } | null>(null);

  useClickOutside(popupLayerRef, () => setSelectedBooking(null), selectedBooking != null);

  const schedule = useMemo(
    () => getBookingGridSchedule({ dayOffset, location }),
    [dayOffset, location],
  );
  const { rooms, blocks, floor, office } = schedule;

  useEffect(() => {
    setSelectedBooking(null);
  }, [dayOffset, location]);

  const gridMinWidth = TIME_COLUMN_WIDTH + rooms.length * ROOM_COLUMN_WIDTH;
  const roomColumnTemplate = `repeat(${rooms.length}, ${ROOM_COLUMN_WIDTH}px)`;

  const openBookingPopup = (
    block: BookingGridBlock,
    room: BookingGridRoom,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const scrollRect = scroll.getBoundingClientRect();
    const targetRect = event.currentTarget.getBoundingClientRect();
    const top = targetRect.bottom - scrollRect.top + scroll.scrollTop + 4;
    const rawLeft = targetRect.left - scrollRect.left + scroll.scrollLeft;
    const maxLeft = Math.max(scroll.clientWidth - POPUP_WIDTH - 8, 8);
    const left = Math.min(Math.max(rawLeft, 8), maxLeft);

    setSelectedBooking({
      block,
      room,
      anchor: { top, left },
    });
  };

  const timedBlocks = useMemo(
    () => blocks.filter((block) => !block.allDay),
    [blocks],
  );
  const allDayBlocks = useMemo(
    () => blocks.filter((block) => block.allDay),
    [blocks],
  );

  const blocksByRoom = useMemo(() => {
    const map = new Map<string, BookingGridBlock[]>();
    for (const room of rooms) {
      map.set(room.id, timedBlocks.filter((block) => block.roomId === room.id));
    }
    return map;
  }, [rooms, timedBlocks]);

  const allDayByRoom = useMemo(() => {
    const map = new Map<string, BookingGridBlock>();
    for (const block of allDayBlocks) {
      map.set(block.roomId, block);
    }
    return map;
  }, [allDayBlocks]);

  const nowOffset =
    dayOffset === 0 &&
    BOOKING_GRID_NOW.hour >= BOOKING_GRID_START_HOUR &&
    BOOKING_GRID_NOW.hour < BOOKING_GRID_END_HOUR
      ? bookingGridNowOffsetMinutes(HOUR_HEIGHT)
      : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-1 flex shrink-0 gap-1.5">
        <BookingGridFilterField
          filterId="booking-grid-location"
          label={content.bookingGridLocationLabel}
          value={location}
          options={BOOKING_GRID_LOCATION_OPTIONS}
          open={openFilter === "location"}
          onToggle={() =>
            setOpenFilter((current) => (current === "location" ? null : "location"))
          }
          onClose={() => setOpenFilter(null)}
          onSelect={(value) => {
            setLocation(value);
            showToast(`${content.bookingGridLocationLabel}: ${value}`);
          }}
        />
        <BookingGridFilterField
          filterId="booking-grid-type"
          label={content.bookingGridTypeLabel}
          value={type}
          options={BOOKING_GRID_TYPE_OPTIONS}
          open={openFilter === "type"}
          onToggle={() => setOpenFilter((current) => (current === "type" ? null : "type"))}
          onClose={() => setOpenFilter(null)}
          onSelect={(value) => {
            setType(value);
            showToast(`${content.bookingGridTypeLabel}: ${value}`);
          }}
        />
        <BookingGridFilterField
          filterId="booking-grid-display"
          label={content.bookingGridDisplayLabel}
          value={display}
          options={BOOKING_GRID_DISPLAY_OPTIONS}
          open={openFilter === "display"}
          onToggle={() =>
            setOpenFilter((current) => (current === "display" ? null : "display"))
          }
          onClose={() => setOpenFilter(null)}
          onSelect={(value) => {
            setDisplay(value);
            showToast(`${content.bookingGridDisplayLabel}: ${value}`);
          }}
          className="min-w-0 flex-1 sm:max-w-[120px] sm:shrink-0 sm:flex-none"
        />
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar relative min-h-0 flex-1 overflow-auto rounded-[8px] border bg-white"
        style={{ borderColor: HAIRLINE }}
        role="region"
        aria-label="Meeting room booking schedule"
      >
        <div style={{ minWidth: gridMinWidth }}>
          <div
            className="grid border-b"
            style={{
              gridTemplateColumns: `${TIME_COLUMN_WIDTH}px ${roomColumnTemplate}`,
              borderColor: HAIRLINE,
              minHeight: HEADER_HEIGHT,
            }}
          >
            <div
              className="sticky left-0 z-20 flex items-center gap-0.5 border-r bg-white px-1"
              style={{ borderColor: HAIRLINE }}
            >
              <span className={`font-semibold ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
                {BOOKING_GRID_TIMEZONE}
              </span>
              <ChevronDown className="h-2 w-2 opacity-60" strokeWidth={ICON_STROKE} aria-hidden />
            </div>
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border-r px-1 py-1 last:border-r-0"
                style={{
                  borderColor: HAIRLINE,
                  backgroundColor: "#FAFBFC",
                  width: ROOM_COLUMN_WIDTH,
                }}
              >
                <p
                  className={`m-0 truncate font-bold ${TEXT_2XS}`}
                  style={{ color: SALTMINE.text }}
                >
                  {room.label}
                </p>
                <p
                  className={`m-0 inline-flex items-center gap-0.5 truncate ${TEXT_MICRO}`}
                  style={{ color: SALTMINE.textMuted }}
                >
                  <Users className="h-2 w-2 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                  {room.capacity} persons
                </p>
              </div>
            ))}
          </div>

          <div
            className="grid border-b"
            style={{
              gridTemplateColumns: `${TIME_COLUMN_WIDTH}px ${roomColumnTemplate}`,
              borderColor: HAIRLINE,
              minHeight: ALL_DAY_HEIGHT,
            }}
          >
            <div
              className="sticky left-0 z-20 flex items-center border-r bg-white px-1"
              style={{ borderColor: HAIRLINE }}
            >
              <span className={`font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
                {content.bookingGridAllDayLabel}
              </span>
            </div>
            {rooms.map((room) => {
              const block = allDayByRoom.get(room.id);
              return (
                <div
                  key={`all-day-${room.id}`}
                  className="flex items-center border-r py-0.5 last:border-r-0"
                  style={{ borderColor: HAIRLINE, width: ROOM_COLUMN_WIDTH }}
                >
                  {block ? (
                    <BookingGridAllDayBlock
                      block={block}
                      selected={selectedBooking?.block.id === block.id}
                      onSelect={(event) => openBookingPopup(block, room, event)}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="relative">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `${TIME_COLUMN_WIDTH}px ${roomColumnTemplate}`,
              }}
            >
              <div className="sticky left-0 z-20 border-r bg-white" style={{ borderColor: HAIRLINE }}>
                {BOOKING_GRID_HOUR_LABELS.map((label) => (
                  <div
                    key={label}
                    className="relative border-b px-1 pt-0.5"
                    style={{ height: HOUR_HEIGHT, borderColor: HAIRLINE }}
                  >
                    <span
                      className={`font-medium tabular-nums ${TEXT_MICRO}`}
                      style={{ color: SALTMINE.textMuted }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
                {nowOffset != null ? (
                  <span
                    className={`absolute left-1 -translate-y-1/2 font-bold tabular-nums ${TEXT_MICRO}`}
                    style={{ top: nowOffset, color: "#EF4444" }}
                  >
                    {formatBookingGridNowLabel()}
                  </span>
                ) : null}
              </div>

              {rooms.map((room) => (
                <div
                  key={`timeline-${room.id}`}
                  className="relative border-r last:border-r-0"
                  style={{ borderColor: HAIRLINE, width: ROOM_COLUMN_WIDTH }}
                >
                  {BOOKING_GRID_HOUR_LABELS.map((label) => (
                    <div
                      key={`${room.id}-${label}`}
                      className="border-b"
                      style={{ height: HOUR_HEIGHT, borderColor: HAIRLINE }}
                      aria-hidden
                    />
                  ))}

                  {(blocksByRoom.get(room.id) ?? []).map((block) => {
                    const top = (block.start / 60) * HOUR_HEIGHT;
                    const height = Math.max(((block.end - block.start) / 60) * HOUR_HEIGHT - 4, 20);
                    return (
                      <div
                        key={block.id}
                        className="absolute inset-x-0"
                        style={{ top, height }}
                      >
                        <BookingGridBlockCard
                          block={block}
                          selected={selectedBooking?.block.id === block.id}
                          onSelect={(event) => openBookingPopup(block, room, event)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {nowOffset != null ? (
              <div
                className="pointer-events-none absolute right-0 z-10"
                style={{
                  top: nowOffset,
                  left: TIME_COLUMN_WIDTH,
                  height: 1,
                  backgroundColor: "#EF4444",
                }}
                aria-hidden
              />
            ) : null}
          </div>
        </div>

        {selectedBooking ? (
          <div ref={popupLayerRef} className="pointer-events-none absolute inset-0 z-30">
            <div className="pointer-events-auto">
              <BookingGridBookingPopup
                block={selectedBooking.block}
                room={selectedBooking.room}
                floor={floor}
                office={office}
                anchor={selectedBooking.anchor}
                onClose={() => setSelectedBooking(null)}
                showToast={showToast}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
