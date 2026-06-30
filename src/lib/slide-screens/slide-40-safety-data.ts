import {
  DECK_OFFICE_PRESENCE,
  SALTMINE_PROJECT_SYNC,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";

export const SLIDE_40_CHECK_IN_BY = "09:30";
export const SLIDE_40_TIME_LEFT = "38 min";

export const SLIDE_40_LATE_TIME_OPTIONS = ["10:00", "10:30", "11:00"] as const;

/** Slide 40 — safety hold on My bookings; user still at home, not checked in. */
export const SLIDE_40_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  {
    id: "today",
    title: "Today—Mon 30 Jan",
    calendar: { monthIndex: 0, day: 30 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    isToday: true,
    workLocationLabel: "Home",
    bookings: [
      {
        id: "desk-safety",
        kind: "desk",
        title: "Desk 4B",
        time: "All day",
        duration: "Safety hold · not checked in",
        location: DECK_OFFICE_PRESENCE.officeName,
        floor: "Floor 3",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
        statusNote: `Cab 08:15 linked · check in by ${SLIDE_40_CHECK_IN_BY} or trip auto-releases`,
      },
      {
        id: "meeting-design",
        kind: "meeting",
        title: "Design sync",
        time: "09:30 AM",
        duration: "45m",
        location: "Pod B",
        floor: "Floor 3",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
      },
    ],
  },
  {
    id: "tomorrow",
    title: "Tomorrow—Tue 31 Jan",
    calendar: { monthIndex: 0, day: 31 },
    weatherLabel: "12°",
    weatherIcon: "sun",
    bookings: [],
  },
];

export function timelineAfterLateExtension(
  days: readonly DeckTimelineDay[],
  newCheckInBy: string,
): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;

    return {
      ...day,
      bookings: day.bookings.map((booking) =>
        booking.id === "desk-safety"
          ? {
              ...booking,
              duration: "Safety hold · running late",
              statusNote: `Check in by ${newCheckInBy} · arrival updated`,
            }
          : booking,
      ),
    };
  });
}

export function timelineAfterEarlyRelease(
  days: readonly DeckTimelineDay[],
): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;

    return {
      ...day,
      bookings: day.bookings.filter((booking) => booking.id !== "desk-safety"),
    };
  });
}

export function timelineAfterSafetyCheckIn(
  days: readonly DeckTimelineDay[],
): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;

    return {
      ...day,
      bookings: day.bookings.map((booking) =>
        booking.id === "desk-safety"
          ? {
              ...booking,
              duration: "All day · checked in",
              status: "active" as const,
              action: "check-out" as const,
              statusNote: undefined,
            }
          : booking,
      ),
    };
  });
}
