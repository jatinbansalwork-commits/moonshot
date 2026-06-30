import {
  DECK_FILTER_DEFAULTS,
  DECK_OFFICE_PRESENCE,
  SALTMINE_PROJECT_SYNC,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import type { SlideDashboardScreenConfig } from "@/lib/slide-screens/types";

const OFFICE = DECK_OFFICE_PRESENCE.officeName;
const TEAM = SALTMINE_PROJECT_SYNC.id;

function todayRow(
  bookings: DeckTimelineDay["bookings"],
  extra?: Partial<DeckTimelineDay>,
): DeckTimelineDay {
  return {
    id: "today",
    title: "Today—Mon 30 Jan",
    calendar: { monthIndex: 0, day: 30 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    isToday: true,
    workLocationLabel: "Home",
    bookings,
    ...extra,
  };
}

function tomorrowRow(): DeckTimelineDay {
  return {
    id: "tomorrow",
    title: "Tomorrow—Tue 31 Jan",
    calendar: { monthIndex: 0, day: 31 },
    weatherLabel: "12°",
    weatherIcon: "sun",
    bookings: [],
  };
}

function thursdayRow(): DeckTimelineDay {
  return {
    id: "thu-2",
    title: "Thu 2 Feb",
    calendar: { monthIndex: 1, day: 2 },
    weatherLabel: "13°",
    weatherIcon: "cloud",
    bookings: [],
  };
}

function recurringDeskInstance(id: string): DeckTimelineDay["bookings"][number] {
  return {
    id,
    kind: "desk",
    title: "Desk 4B",
    time: "All day",
    duration: "All day",
    location: OFFICE,
    floor: "Floor 3",
    status: "upcoming",
    teamId: TEAM,
    action: "withdraw",
    statusNote: "Series · Tue & Thu",
  };
}

/** Slide 41 — desk booked; Move pickup missing from trip. */
export const SLIDE_41_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  todayRow([
    {
      id: "desk-cab",
      kind: "desk",
      title: "Desk 4B",
      time: "All day",
      duration: "Confirmed · Floor 3",
      location: OFFICE,
      floor: "Floor 3",
      status: "upcoming",
      teamId: TEAM,
      action: "check-in",
      statusNote: "Add Move to complete your trip",
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
      teamId: TEAM,
      action: "check-in",
    },
  ]),
  tomorrowRow(),
];

export function timelineAfterCabAdded(days: readonly DeckTimelineDay[]): readonly DeckTimelineDay[] {
  return days.map((day) =>
    day.id !== "today"
      ? day
      : {
          ...day,
          bookings: day.bookings.map((b) =>
            b.id === "desk-cab"
              ? { ...b, statusNote: "Move pickup 08:15 · office fleet" }
              : b,
          ),
        },
  );
}

/** Slide 42 — stand-up flipped remote → desk downgrades to tentative hold. */
export const SLIDE_42_DESK_ID = "desk-soft";

export const SLIDE_42_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  todayRow([
    {
      id: SLIDE_42_DESK_ID,
      kind: "desk",
      title: "Desk 4B",
      time: "All day",
      duration: "Tentative hold",
      location: OFFICE,
      floor: "Floor 3",
      status: "upcoming",
      teamId: TEAM,
      action: "withdraw",
      statusNote: "Stand-up is remote — still coming in?",
    },
    {
      id: "meeting-standup",
      kind: "meeting",
      title: "Team stand-up",
      time: "10:00 AM",
      duration: "30m",
      location: "Remote",
      floor: "—",
      status: "upcoming",
      teamId: TEAM,
      action: "check-in",
    },
  ]),
  tomorrowRow(),
];

export function timelineAfterDeskReleased(days: readonly DeckTimelineDay[]): readonly DeckTimelineDay[] {
  return days.map((day) =>
    day.id !== "today"
      ? day
      : { ...day, bookings: day.bookings.filter((b) => b.id !== SLIDE_42_DESK_ID) },
  );
}

/** Slide 43 — single desk ready to repeat weekly. */
export const SLIDE_43_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  todayRow([
    {
      id: "desk-repeat",
      kind: "desk",
      title: "Desk 4B",
      time: "All day",
      duration: "All day",
      location: OFFICE,
      floor: "Floor 3",
      status: "upcoming",
      teamId: TEAM,
      action: "check-in",
      statusNote: "Tap Repeat to set Tue & Thu pattern",
    },
  ]),
  tomorrowRow(),
  thursdayRow(),
];

export function timelineAfterRecurringSaved(days: readonly DeckTimelineDay[]): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id === "today") {
      return {
        ...day,
        bookings: day.bookings.map((booking) =>
          booking.id === "desk-repeat"
            ? {
                ...booking,
                statusNote: "Repeats Tue & Thu until 31 Aug · holidays skipped",
              }
            : booking,
        ),
      };
    }

    if (day.id === "tomorrow") {
      return {
        ...day,
        bookings: [...day.bookings, recurringDeskInstance("desk-repeat-tue-31")],
      };
    }

    if (day.id === "thu-2") {
      return {
        ...day,
        bookings: [...day.bookings, recurringDeskInstance("desk-repeat-thu-2")],
      };
    }

    return day;
  });
}

/** Slide 44 — desk + parking booked; backend commute signal nudges remote AM. */
export const SLIDE_44_DESK_ID = "desk-commute";
export const SLIDE_44_PARKING_ID = "parking-commute";

export const SLIDE_44_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  todayRow(
    [
      {
        id: SLIDE_44_DESK_ID,
        kind: "desk",
        title: "Desk 21.P3.2",
        time: "All day",
        duration: "Confirmed · Floor 21",
        location: OFFICE,
        floor: "Floor 21",
        status: "upcoming",
        teamId: TEAM,
        action: "withdraw",
      },
      {
        id: SLIDE_44_PARKING_ID,
        kind: "parking",
        title: "Car Park B2.113",
        time: "All day",
        duration: "Linked to desk",
        location: OFFICE,
        floor: "Basement 2",
        status: "upcoming",
        teamId: TEAM,
        action: "withdraw",
      },
      {
        id: "meeting-1",
        kind: "meeting",
        title: "Design sync",
        time: "09:30 AM",
        duration: "45m",
        location: "Pod B",
        floor: "Floor 3",
        status: "upcoming",
        teamId: TEAM,
        action: "check-in",
      },
      {
        id: "meeting-2",
        kind: "meeting",
        title: "Sprint planning",
        time: "11:00 AM",
        duration: "1h",
        location: "Remote",
        floor: "—",
        status: "upcoming",
        teamId: TEAM,
        action: "check-in",
      },
      {
        id: "meeting-3",
        kind: "meeting",
        title: "1:1",
        time: "14:00 PM",
        duration: "30m",
        location: "Pod A",
        floor: "Floor 3",
        status: "upcoming",
        teamId: TEAM,
        action: "check-in",
      },
    ],
    { workLocationLabel: OFFICE },
  ),
  tomorrowRow(),
];

export function timelineAfterRemoteAm(days: readonly DeckTimelineDay[]): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;
    return {
      ...day,
      workLocationLabel: "Home · remote AM",
      bookings: day.bookings.filter(
        (booking) =>
          booking.id !== SLIDE_44_DESK_ID && booking.id !== SLIDE_44_PARKING_ID,
      ),
    };
  });
}

export function timelineAfterKeepCommuteDesk(
  days: readonly DeckTimelineDay[],
): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;
    return {
      ...day,
      bookings: day.bookings.map((booking) => {
        if (booking.id === SLIDE_44_DESK_ID) {
          return {
            ...booking,
            statusNote: "ETA 10:15 — join 09:30 from Teams",
          };
        }
        if (booking.id === SLIDE_44_PARKING_ID) {
          return {
            ...booking,
            statusNote: "Bay held · late arrival OK until 11:00",
          };
        }
        return booking;
      }),
    };
  });
}

/** Slide 45 — waitlist offer after auto-release. */
export const SLIDE_45_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  todayRow(
    [
      {
        id: "desk-waitlist-offer",
        kind: "desk",
        title: "Desk 4B",
        time: "All day",
        duration: "Waitlist · offer pending",
        location: OFFICE,
        floor: "Floor 3",
        status: "upcoming",
        teamId: TEAM,
        action: "withdraw",
        statusNote: "Auto-release · accept within 5 min",
      },
    ],
    {
      lastMinute: {
        waitlist: {
          resource: "Desk 4B · Floor 3",
          position: 2,
          estRelease: "Now",
        },
        alternatives: [
          {
            kind: "desk",
            label: "Hot-desk zone C",
            detail: "Floor 3 · fallback held",
          },
        ],
      },
    },
  ),
  tomorrowRow(),
];

export function timelineAfterWaitlistAccepted(days: readonly DeckTimelineDay[]): readonly DeckTimelineDay[] {
  return days.map((day) => {
    if (day.id !== "today") return day;
    return {
      ...day,
      lastMinute: undefined,
      bookings: day.bookings.map((b) =>
        b.id === "desk-waitlist-offer"
          ? {
              ...b,
              duration: "All day · assigned from waitlist",
              action: "check-in" as const,
              statusNote: "Accepted · check in when you arrive",
            }
          : b,
      ),
    };
  });
}

export function buildFuturePlanScreenConfig(
  timeline: readonly DeckTimelineDay[],
): SlideDashboardScreenConfig {
  return {
    displayName: SALTMINE_DEMO_USER.name,
    variant: "deck",
    initialActiveNav: "bookings",
    initialFilterValues: { ...DECK_FILTER_DEFAULTS },
    deckTimelineDays: timeline,
    disabledNavIds: [
      "find-space",
      "inbox",
      "teams",
      "booking-grid",
      "conference-grid",
      "help",
    ],
  };
}
