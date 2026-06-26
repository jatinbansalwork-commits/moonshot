/**
 * Monthly calendar chip data for the deck My bookings mockup.
 */

import {
  DECK_TIMELINE_DAYS,
  findDeckTimelineDay,
  type DeckBookingItem,
  type DeckBookingKind,
} from "@/lib/saltmine-deck-bookings-data";
import { CALENDAR_MONTHS } from "@/lib/saltmine-bookings-dashboard-data";

export interface DeckMonthlyBookingChip {
  id: string;
  kind: DeckBookingKind;
  timeLabel: string;
  title: string;
  duration?: string;
  location?: string;
  attendeeCount?: number;
  status?: DeckBookingItem["status"];
  recurring?: boolean;
}

const RECURRING_MONDAY_TEMPLATE: readonly DeckMonthlyBookingChip[] = [
  {
    id: "recurring-parking",
    kind: "parking",
    timeLabel: "09:00",
    title: "Car Park B2.113",
    duration: "All day",
    location: "Basement 2",
    status: "active",
  },
  {
    id: "recurring-desk",
    kind: "desk",
    timeLabel: "09:00",
    title: "Desk 21.P3.2",
    duration: "All day",
    location: "Floor 21",
    status: "active",
  },
  {
    id: "recurring-design-review",
    kind: "meeting",
    timeLabel: "10:30",
    title: "Design Review",
    duration: "1h",
    location: "Meeting Room 21.12",
    attendeeCount: 6,
    status: "upcoming",
    recurring: true,
  },
];

function formatChipTime(time: string): string {
  return time.replace(/\s*(AM|PM)$/i, "").trim();
}

function truncateTitle(title: string, max = 14): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1).trim()}…`;
}

function chipDetailParts(chip: {
  duration?: string;
  location?: string;
  attendeeCount?: number;
}): string[] {
  const parts: string[] = [];
  if (chip.duration) parts.push(chip.duration);
  if (chip.location) parts.push(chip.location);
  if (chip.attendeeCount) parts.push(`${chip.attendeeCount} attendees`);
  return parts;
}

function bookingToChip(booking: DeckBookingItem): DeckMonthlyBookingChip {
  return {
    id: booking.id,
    kind: booking.kind,
    timeLabel: formatChipTime(booking.time),
    title:
      booking.kind === "meeting"
        ? truncateTitle(booking.title)
        : booking.title,
    duration: booking.duration,
    location:
      booking.kind === "meeting"
        ? booking.location
        : booking.floor ?? booking.location,
    attendeeCount: booking.attendees?.length,
    status: booking.status,
    recurring: booking.id === "meeting-design",
  };
}

export function deckMonthlyChipTooltip(chip: DeckMonthlyBookingChip): string {
  const statusLabel =
    chip.status === "active"
      ? "Checked in"
      : chip.status === "upcoming"
        ? "Up next"
        : chip.status === "completed"
          ? "Completed"
          : undefined;

  return [chip.timeLabel, chip.title, ...chipDetailParts(chip), statusLabel]
    .filter(Boolean)
    .join(" · ");
}

function isMondayInMonth(monthIndex: number, day: number): boolean {
  const month = CALENDAR_MONTHS[monthIndex];
  if (!month) return false;
  return month.weeks.some((week) => week[0] === day);
}

export function deckMonthlyBookingsForDay(
  monthIndex: number,
  day: number,
): readonly DeckMonthlyBookingChip[] {
  const timelineDay = findDeckTimelineDay(monthIndex, day);
  if (timelineDay && timelineDay.bookings.length > 0) {
    return timelineDay.bookings.map(bookingToChip);
  }

  if (isMondayInMonth(monthIndex, day)) {
    return RECURRING_MONDAY_TEMPLATE;
  }

  return [];
}

export function deckMonthlyWeekLabel(monthIndex: number, mondayDay: number): string | null {
  const month = CALENDAR_MONTHS[monthIndex];
  if (!month) return null;
  const weekRowIndex = month.weeks.findIndex((week) => week[0] === mondayDay);
  if (weekRowIndex < 0) return null;
  return `W${weekRowIndex + 4}`;
}

export const DECK_MONTHLY_DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const DECK_MONTHLY_DEFAULT_MONTH_INDEX = DECK_TIMELINE_DAYS[0]?.calendar.monthIndex ?? 0;

export const DECK_MONTHLY_TODAY = {
  monthIndex: DECK_TIMELINE_DAYS[0]?.calendar.monthIndex ?? 0,
  day: DECK_TIMELINE_DAYS[0]?.calendar.day ?? 30,
} as const;
