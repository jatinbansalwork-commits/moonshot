import type { DeckAddBookingActionId } from "@/lib/saltmine-deck-add-booking-flow-data";
import {
  DECK_CALENDAR,
  DECK_OFFICE_PRESENCE,
  SALTMINE_PROJECT_SYNC,
  type DeckBookingItem,
  type DeckBookingKind,
  type DeckLastMinuteContext,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";

export interface DeckAddedDayBookings {
  bookings: DeckBookingItem[];
  lastMinute?: DeckLastMinuteContext;
}

export interface DeckAddBookingInput {
  label: string;
  actionId?: DeckAddBookingActionId;
}

const DEFAULT_LAST_MINUTE_ALTERNATIVES: DeckLastMinuteContext["alternatives"] = [
  {
    kind: "desk",
    label: "Hot-desk zone C",
    detail: "Floor 3 · 3 desks free now",
  },
  {
    kind: "parking",
    label: "Bay B2-22",
    detail: "Basement 2 · 2 min walk to lift",
  },
  {
    kind: "meeting",
    label: "Pod B",
    detail: "4 seats · 1 left until 12:00",
  },
];

export function isTimelineDayToday(
  day: Pick<DeckTimelineDay, "isToday" | "calendar" | "id">,
): boolean {
  if (day.isToday) return true;
  if (day.id === "today") return true;
  return (
    day.calendar.monthIndex === DECK_CALENDAR.todayMonthIndex &&
    day.calendar.day === DECK_CALENDAR.todayDay
  );
}

function parseBookingKind(
  label: string,
  actionId?: DeckAddBookingActionId,
): DeckBookingKind {
  if (actionId === "car-parking") return "parking";
  if (actionId === "meeting-space") return "meeting";
  if (actionId === "desk" || actionId === "team-day") return "desk";

  if (/^meeting/i.test(label)) return "meeting";
  if (/car park/i.test(label)) return "parking";
  return "desk";
}

function parseBookingTitle(label: string, kind: DeckBookingKind): string {
  if (kind === "meeting") return label.replace(/^Meeting — /i, "");
  if (kind === "desk" && /^team day/i.test(label)) {
    return label.replace(/^Team day — /i, "");
  }
  return label;
}

function createLastMinuteContext(title: string, kind: DeckBookingKind): DeckLastMinuteContext {
  const floor =
    kind === "parking" ? "Basement 2" : kind === "meeting" ? "Floor 3" : "Floor 3";

  return {
    waitlist: {
      resource: `${title} · ${floor}`,
      position: 2,
      estRelease: "09:45",
    },
    alternatives: DEFAULT_LAST_MINUTE_ALTERNATIVES,
  };
}

/** Build a timeline booking from an add-booking flow result. Today → waitlist lane. */
export function createDeckBookingFromAddFlow({
  label,
  actionId,
  dayId,
  day,
  index,
}: DeckAddBookingInput & {
  dayId: string;
  day: Pick<DeckTimelineDay, "isToday" | "calendar" | "id">;
  index: number;
}): { booking: DeckBookingItem; lastMinute?: DeckLastMinuteContext } {
  const kind = parseBookingKind(label, actionId);
  const title = parseBookingTitle(label, kind);
  const isToday = isTimelineDayToday(day);

  if (isToday) {
    const lastMinute = createLastMinuteContext(title, kind);
    return {
      booking: {
        id: `added-${dayId}-${index}`,
        kind,
        title,
        time: kind === "meeting" ? "10:00" : "All day",
        duration: "Waitlist · not assigned",
        location: DECK_OFFICE_PRESENCE.officeName,
        floor: kind === "parking" ? "Basement 2" : kind === "meeting" ? "Floor 3" : "Floor 21",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "withdraw",
        statusNote: "Waitlist #2 — auto-assign on release",
      },
      lastMinute,
    };
  }

  return {
    booking: {
      id: `added-${dayId}-${index}`,
      kind,
      title,
      time: kind === "meeting" ? "10:00" : "All day",
      duration: kind === "meeting" ? "1 hr" : "",
      location: DECK_OFFICE_PRESENCE.officeName,
      floor: kind === "parking" ? "Basement 2" : "Floor 21",
      status: "upcoming",
      teamId: SALTMINE_PROJECT_SYNC.id,
      action: kind === "meeting" ? "check-in" : "withdraw",
    },
  };
}

export function appendAddedBookingToDay(
  prev: Record<string, DeckAddedDayBookings>,
  dayId: string,
  day: Pick<DeckTimelineDay, "isToday" | "calendar" | "id">,
  input: DeckAddBookingInput,
): Record<string, DeckAddedDayBookings> {
  const index = prev[dayId]?.bookings.length ?? 0;
  const { booking, lastMinute } = createDeckBookingFromAddFlow({
    ...input,
    dayId,
    day,
    index,
  });
  const previous = prev[dayId];

  return {
    ...prev,
    [dayId]: {
      bookings: [...(previous?.bookings ?? []), booking],
      lastMinute: lastMinute ?? previous?.lastMinute,
    },
  };
}

export function mergeAddedBookingsIntoTimeline(
  days: readonly DeckTimelineDay[],
  added: Record<string, DeckAddedDayBookings>,
): DeckTimelineDay[] {
  return days.map((day) => {
    const patch = added[day.id];
    if (!patch) return day;

    return {
      ...day,
      bookings: [...day.bookings, ...patch.bookings],
      lastMinute: patch.lastMinute ?? day.lastMinute,
    };
  });
}

export function labelsToAddedDayBookings(
  labelsByDay: Record<string, readonly string[]>,
  resolveDay: (dayId: string) => Pick<DeckTimelineDay, "isToday" | "calendar" | "id">,
): Record<string, DeckAddedDayBookings> {
  const result: Record<string, DeckAddedDayBookings> = {};

  for (const [dayId, labels] of Object.entries(labelsByDay)) {
    const day = resolveDay(dayId);
    for (const label of labels) {
      Object.assign(result, appendAddedBookingToDay(result, dayId, day, { label }));
    }
  }

  return result;
}
