"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Pencil,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  CONFERENCE_GRID_ACCESS_OPTIONS,
  CONFERENCE_GRID_CAPACITY_OPTIONS,
  CONFERENCE_GRID_COUNTRY_OPTIONS,
  CONFERENCE_GRID_DATE_LABEL,
  CONFERENCE_GRID_FLOOR_OPTIONS,
  CONFERENCE_GRID_LOCATION_OPTIONS,
  CONFERENCE_GRID_PRESETS,
  CONFERENCE_GRID_REGIONS,
  CONFERENCE_GRID_TAG_OPTIONS,
  CONFERENCE_GRID_WORKSPACE_OPTIONS,
  conferenceGridNowOffsetMinutes,
  formatConferenceGridNowLabel,
  formatConferenceGridTimeRange,
  type ConferenceGridBooking,
  type ConferenceGridRegion,
  type ConferenceGridRoom,
} from "@/lib/saltmine-conference-grid-data";
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
const POPUP_SHADOW = "0 12px 32px rgba(28, 37, 46, 0.14), 0 4px 12px rgba(28, 37, 46, 0.08)";
const POPUP_WIDTH = 196;
const HOUR_WIDTH = 52;
const HOUR_ROW_HEIGHT = 18;
const ROW_HEIGHT = 26;
const ROOM_LABEL_WIDTH = 108;
const BOOKING_BLOCK_BG = "#E8E0F4";
const BOOKING_BLOCK_BORDER = "rgba(91, 33, 182, 0.28)";
const HATCHED_BG =
  "repeating-linear-gradient(-45deg, #F4F6F8 0, #F4F6F8 3px, #E8ECF0 3px, #E8ECF0 4px)";

type FilterKey =
  | "country"
  | "location"
  | "floor"
  | "workspace"
  | "capacity"
  | "tags"
  | "access"
  | "preset";

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

function ConferenceGridFilterMenu({
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

function ConferenceGridFilterField({
  filterId,
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onSelect,
  className = "min-w-0",
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
        className={`flex h-[26px] w-full items-center gap-0.5 rounded-md border-0 px-1.5 text-left ${TEXT_XS} font-semibold ${FOCUS_RING}`}
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
        <ConferenceGridFilterMenu
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

export function ConferenceGridDateNav({
  onPrev,
  onNext,
  onCalendar,
}: {
  onPrev: () => void;
  onNext: () => void;
  onCalendar: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        aria-label="Previous day"
        onClick={onPrev}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <ChevronLeft className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
      <span
        className={`max-w-[130px] truncate px-0.5 font-semibold tabular-nums ${TEXT_XS}`}
        style={{ color: SALTMINE.text }}
      >
        {CONFERENCE_GRID_DATE_LABEL}
      </span>
      <button
        type="button"
        aria-label="Next day"
        onClick={onNext}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <ChevronRight className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Open calendar"
        onClick={onCalendar}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <Calendar className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
    </div>
  );
}

export function ConferenceGridNewGridButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-6 shrink-0 items-center justify-center rounded-[6px] px-2 font-bold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
      style={{
        backgroundColor: SALTMINE.primary,
        color: "#FFFFFF",
      }}
    >
      {content.conferenceGridNewGridLabel}
    </button>
  );
}

type ConferenceGridPopupAnchor = {
  top: number;
  left: number;
};

type SelectedConferenceBooking = {
  booking: ConferenceGridBooking;
  region: ConferenceGridRegion;
  room: ConferenceGridRoom;
  anchor: ConferenceGridPopupAnchor;
};

function ConferenceGridBookingPopup({
  booking,
  region,
  room,
  anchor,
  onClose,
  showToast,
}: {
  booking: ConferenceGridBooking;
  region: ConferenceGridRegion;
  room: ConferenceGridRoom;
  anchor: ConferenceGridPopupAnchor;
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

  const whenLabel = formatConferenceGridTimeRange(region, booking.start, booking.end);
  const whereLabel = `${room.label}, ${region.address}, ${region.country}`;
  const attendees = booking.attendees?.join(", ") ?? booking.organizer;

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${content.bookingDetailPanelLabel}: ${booking.title}`}
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
              {booking.title}
            </p>
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
            {content.conferenceGridPopupUseCaseLabel}
          </dt>
          <dd className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {booking.useCase}
          </dd>
        </div>
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
            {booking.organizer}
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
        {booking.videoLink ? (
          <button
            type="button"
            onClick={() => {
              showToast(`${content.bookingGridPopupJoinToast} ${booking.title}`);
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
            showToast(`${content.bookingGridPopupEditToast}: ${booking.title}`);
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
            showToast(`${content.bookingGridPopupCheckInToast}: ${booking.title}`);
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

function ConferenceGridBookingBlock({
  booking,
  selected,
  onSelect,
}: {
  booking: ConferenceGridBooking;
  selected: boolean;
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const left = (booking.start / 60) * HOUR_WIDTH;
  const width = Math.max(((booking.end - booking.start) / 60) * HOUR_WIDTH - 4, 28);

  return (
    <button
      type="button"
      aria-label={`${content.bookingDetailOpenLabel} ${booking.title}`}
      aria-expanded={selected}
      onClick={onSelect}
      className={`absolute top-0.5 overflow-hidden rounded-[3px] border px-1 py-0.5 text-left transition-shadow duration-150 hover:opacity-90 ${FOCUS_RING}`}
      style={{
        left,
        width,
        height: ROW_HEIGHT - 4,
        backgroundColor: BOOKING_BLOCK_BG,
        borderColor: selected ? SALTMINE.primary : BOOKING_BLOCK_BORDER,
        boxShadow: selected ? "0 0 0 2px rgba(0, 111, 236, 0.28)" : undefined,
      }}
      title={`${booking.title} — ${booking.useCase}`}
    >
      <span
        className={`block truncate font-bold ${TEXT_MICRO}`}
        style={{ color: SALTMINE.text }}
      >
        {booking.title}
      </span>
    </button>
  );
}

function ConferenceGridRoomRow({
  room,
  totalWidth,
  selectedBookingId,
  onBookingSelect,
}: {
  room: ConferenceGridRoom;
  totalWidth: number;
  selectedBookingId: string | null;
  onBookingSelect: (
    booking: ConferenceGridBooking,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}) {
  return (
    <div
      className="relative flex border-b"
      style={{ height: ROW_HEIGHT, borderColor: HAIRLINE }}
    >
      <div
        className="sticky left-0 z-10 shrink-0 border-r bg-white px-1 py-0.5"
        style={{ width: ROOM_LABEL_WIDTH, borderColor: HAIRLINE }}
      >
        <span className="flex min-w-0 items-center gap-0.5" title={room.label}>
          <FileText
            className="h-2.5 w-2.5 shrink-0"
            strokeWidth={ICON_STROKE}
            style={{ color: SALTMINE.textMuted }}
            aria-hidden
          />
          <span
            className={`truncate font-medium ${TEXT_MICRO}`}
            style={{ color: SALTMINE.text }}
          >
            {room.label}
          </span>
        </span>
      </div>
      <div className="relative min-w-0 flex-1" style={{ width: totalWidth }}>
        {room.unavailableFrom != null ? (
          <div
            className="pointer-events-none absolute bottom-0 top-0"
            style={{
              left: (room.unavailableFrom / 60) * HOUR_WIDTH,
              right: 0,
              background: HATCHED_BG,
            }}
            aria-hidden
          />
        ) : null}
        {room.bookings.map((booking) => (
          <ConferenceGridBookingBlock
            key={booking.id}
            booking={booking}
            selected={selectedBookingId === booking.id}
            onSelect={(event) => onBookingSelect(booking, event)}
          />
        ))}
      </div>
    </div>
  );
}

function ConferenceGridRegionSection({
  region,
  selectedBookingId,
  onBookingSelect,
}: {
  region: ConferenceGridRegion;
  selectedBookingId: string | null;
  onBookingSelect: (
    booking: ConferenceGridBooking,
    room: ConferenceGridRoom,
    region: ConferenceGridRegion,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const totalWidth = region.hourLabels.length * HOUR_WIDTH;
  const nowOffset = conferenceGridNowOffsetMinutes(region, HOUR_WIDTH);
  const nowLabel = formatConferenceGridNowLabel(region);
  const panelId = `conference-grid-panel-${region.id}`;

  return (
    <section className="border-b last:border-b-0" style={{ borderColor: HAIRLINE }}>
      <div
        className="flex items-center gap-1 border-b px-1.5 py-1"
        style={{ borderColor: HAIRLINE, backgroundColor: "#FAFBFC" }}
      >
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${region.country}`}
          onClick={() => setExpanded((open) => !open)}
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ChevronDown
            className={`h-2.5 w-2.5 transition-transform duration-150 ${expanded ? "" : "-rotate-90"}`}
            strokeWidth={ICON_STROKE}
            aria-hidden
          />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-0.5">
          <span className={`shrink-0 font-bold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            {region.country}
          </span>
          <span className={`shrink-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }} aria-hidden>
            ·
          </span>
          <span
            className={`shrink-0 font-medium ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {region.timezone}
          </span>
          <span className={`shrink-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }} aria-hidden>
            ·
          </span>
          <span
            className={`min-w-0 truncate font-medium ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textSecondary }}
          >
            {region.address}
          </span>
        </div>
      </div>

      {expanded ? (
        <div
          id={panelId}
          className="flex"
          style={{ minWidth: ROOM_LABEL_WIDTH + totalWidth }}
        >
          <div
            className="sticky left-0 z-10 flex shrink-0 items-end border-r bg-[#FAFBFC] px-1 pb-0.5"
            style={{
              width: ROOM_LABEL_WIDTH,
              height: HOUR_ROW_HEIGHT,
              borderColor: HAIRLINE,
            }}
          >
            <span className={`font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
              {content.conferenceGridRoomColumnLabel}
            </span>
          </div>
          <div className="relative min-w-0 flex-1">
            <div
              className="flex border-b"
              style={{ borderColor: HAIRLINE, minHeight: HOUR_ROW_HEIGHT }}
            >
              {region.hourLabels.map((label) => (
                <div
                  key={`${region.id}-${label}`}
                  className="flex shrink-0 items-center justify-center border-r px-0.5 py-0.5 last:border-r-0"
                  style={{ width: HOUR_WIDTH, borderColor: HAIRLINE }}
                >
                  <span
                    className={`font-medium tabular-nums ${TEXT_MICRO}`}
                    style={{ color: SALTMINE.textMuted }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative">
              {region.rooms.map((room) => (
                <ConferenceGridRoomRow
                  key={room.id}
                  room={room}
                  totalWidth={totalWidth}
                  selectedBookingId={selectedBookingId}
                  onBookingSelect={(booking, event) =>
                    onBookingSelect(booking, room, region, event)
                  }
                />
              ))}
            </div>

            <span
              className={`pointer-events-none absolute z-30 rounded-[3px] px-0.5 py-px font-bold leading-none ${TEXT_MICRO}`}
              style={{
                left: nowOffset,
                top: HOUR_ROW_HEIGHT + 2,
                transform: "translateX(-50%)",
                color: "#FFFFFF",
                backgroundColor: "#EF4444",
              }}
              aria-hidden
            >
              {nowLabel}
            </span>
            <div
              className="pointer-events-none absolute bottom-0 z-20 w-px"
              style={{
                left: nowOffset,
                top: 0,
                backgroundColor: "#EF4444",
              }}
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function ConferenceGridMainView({
  showToast,
  compact = false,
}: {
  showToast: (message: string) => void;
  compact?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const popupLayerRef = useRef<HTMLDivElement>(null);
  const [preset, setPreset] = useState<string>(CONFERENCE_GRID_PRESETS[0]);
  const [country, setCountry] = useState<string>(CONFERENCE_GRID_COUNTRY_OPTIONS[0]);
  const [location, setLocation] = useState<string>(CONFERENCE_GRID_LOCATION_OPTIONS[0]);
  const [floor, setFloor] = useState<string>(CONFERENCE_GRID_FLOOR_OPTIONS[0]);
  const [workspace, setWorkspace] = useState<string>(CONFERENCE_GRID_WORKSPACE_OPTIONS[0]);
  const [capacity, setCapacity] = useState<string>(CONFERENCE_GRID_CAPACITY_OPTIONS[0]);
  const [tags, setTags] = useState<string>(CONFERENCE_GRID_TAG_OPTIONS[0]);
  const [access, setAccess] = useState<string>(CONFERENCE_GRID_ACCESS_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<SelectedConferenceBooking | null>(
    null,
  );

  useClickOutside(popupLayerRef, () => setSelectedBooking(null), selectedBooking != null);

  const openBookingPopup = (
    booking: ConferenceGridBooking,
    room: ConferenceGridRoom,
    region: ConferenceGridRegion,
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
      booking,
      room,
      region,
      anchor: { top, left },
    });
  };

  const filterFields: {
    key: FilterKey;
    label: string;
    value: string;
    options: readonly string[];
    onSelect: (value: string) => void;
    className?: string;
  }[] = [
    {
      key: "country",
      label: content.conferenceGridCountryLabel,
      value: country,
      options: CONFERENCE_GRID_COUNTRY_OPTIONS,
      onSelect: setCountry,
    },
    {
      key: "location",
      label: content.conferenceGridLocationLabel,
      value: location,
      options: CONFERENCE_GRID_LOCATION_OPTIONS,
      onSelect: setLocation,
    },
    {
      key: "floor",
      label: content.conferenceGridFloorLabel,
      value: floor,
      options: CONFERENCE_GRID_FLOOR_OPTIONS,
      onSelect: setFloor,
    },
    {
      key: "workspace",
      label: content.conferenceGridWorkspaceLabel,
      value: workspace,
      options: CONFERENCE_GRID_WORKSPACE_OPTIONS,
      onSelect: setWorkspace,
    },
    {
      key: "capacity",
      label: content.conferenceGridCapacityLabel,
      value: capacity,
      options: CONFERENCE_GRID_CAPACITY_OPTIONS,
      onSelect: setCapacity,
    },
    {
      key: "tags",
      label: content.conferenceGridTagsLabel,
      value: tags,
      options: CONFERENCE_GRID_TAG_OPTIONS,
      onSelect: setTags,
    },
    {
      key: "access",
      label: content.conferenceGridAccessLabel,
      value: access,
      options: CONFERENCE_GRID_ACCESS_OPTIONS,
      onSelect: setAccess,
    },
  ];

  const primaryFilters = filterFields.slice(0, 4);
  const secondaryFilters = filterFields.slice(4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="mb-1 shrink-0 rounded-[8px] border bg-white p-1.5"
        style={{ borderColor: HAIRLINE }}
      >
        <div
          className="mb-1.5 flex items-end gap-1 border-b pb-1.5"
          style={{ borderColor: "rgba(145, 158, 171, 0.16)" }}
        >
          <ConferenceGridFilterField
            filterId="conference-grid-preset"
            label={content.conferenceGridActiveGridLabel}
            value={preset}
            options={CONFERENCE_GRID_PRESETS}
            open={openFilter === "preset"}
            onToggle={() =>
              setOpenFilter((current) => (current === "preset" ? null : "preset"))
            }
            onClose={() => setOpenFilter(null)}
            onSelect={(value) => {
              setPreset(value);
              setSaveEnabled(true);
            }}
            className="min-w-0 flex-1"
          />
          <button
            type="button"
            aria-label="Edit active grid"
            onClick={() => showToast("Edit grid — demo")}
            className={`inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <Pencil className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
          <button
            type="button"
            aria-label="Delete active grid"
            onClick={() => showToast("Delete grid — demo")}
            className={`inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <Trash2 className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
          <button
            type="button"
            disabled={!saveEnabled}
            onClick={() => {
              setSaveEnabled(false);
              showToast(content.conferenceGridSaveChangesToast);
            }}
            className={`inline-flex h-[26px] shrink-0 items-center justify-center rounded-[6px] border px-2 font-semibold leading-none disabled:cursor-not-allowed disabled:opacity-40 ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: HAIRLINE,
              color: saveEnabled ? SALTMINE.primary : SALTMINE.textSecondary,
              backgroundColor: saveEnabled ? "rgba(0, 111, 236, 0.06)" : "#FFFFFF",
            }}
          >
            {content.conferenceGridSaveChangesLabel}
          </button>
        </div>

        <div className={`grid gap-1 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
          {primaryFilters.map((field) => (
            <ConferenceGridFilterField
              key={field.key}
              filterId={`conference-grid-${field.key}`}
              label={field.label}
              value={field.value}
              options={field.options}
              open={openFilter === field.key}
              onToggle={() =>
                setOpenFilter((current) => (current === field.key ? null : field.key))
              }
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                field.onSelect(value);
                setSaveEnabled(true);
              }}
            />
          ))}
        </div>

        <div className="mt-1 flex items-end gap-1">
          {secondaryFilters.map((field) => (
            <ConferenceGridFilterField
              key={field.key}
              filterId={`conference-grid-${field.key}`}
              label={field.label}
              value={field.value}
              options={field.options}
              open={openFilter === field.key}
              onToggle={() =>
                setOpenFilter((current) => (current === field.key ? null : field.key))
              }
              onClose={() => setOpenFilter(null)}
              onSelect={(value) => {
                field.onSelect(value);
                setSaveEnabled(true);
              }}
              className="min-w-0 flex-1"
            />
          ))}
          <div className="flex shrink-0 items-end gap-1">
            {saveEnabled ? (
              <span
                className={`mb-1 hidden max-w-[72px] truncate font-medium sm:inline ${TEXT_MICRO}`}
                style={{ color: SALTMINE.textMuted }}
              >
                {content.conferenceGridUnsavedChangesLabel}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setSaveEnabled(false);
                showToast(content.conferenceGridUpdateGridToast);
              }}
              className={`inline-flex h-[26px] shrink-0 items-center justify-center rounded-[6px] border px-2 font-bold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{
                borderColor: "rgba(0, 111, 236, 0.24)",
                color: SALTMINE.primary,
                backgroundColor: "rgba(0, 111, 236, 0.06)",
              }}
            >
              {content.conferenceGridUpdateGridLabel}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar relative min-h-0 flex-1 overflow-auto rounded-[8px] border bg-white"
        style={{ borderColor: HAIRLINE }}
        role="region"
        aria-label="Conference grid schedule"
      >
        {CONFERENCE_GRID_REGIONS.map((region) => (
          <ConferenceGridRegionSection
            key={region.id}
            region={region}
            selectedBookingId={selectedBooking?.booking.id ?? null}
            onBookingSelect={openBookingPopup}
          />
        ))}

        {selectedBooking ? (
          <div ref={popupLayerRef} className="pointer-events-none absolute inset-0 z-30">
            <div className="pointer-events-auto">
              <ConferenceGridBookingPopup
                booking={selectedBooking.booking}
                region={selectedBooking.region}
                room={selectedBooking.room}
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
