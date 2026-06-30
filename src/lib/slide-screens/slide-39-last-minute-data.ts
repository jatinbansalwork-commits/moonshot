import {
  DECK_OFFICE_PRESENCE,
  SALTMINE_PROJECT_SYNC,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";

/** Slide 39 — last-minute lane on My bookings: not checked in, waitlist, alternatives. */
export const SLIDE_39_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  {
    id: "today",
    title: "Today—Mon 30 Jan",
    calendar: { monthIndex: 0, day: 30 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    isToday: true,
    workLocationLabel: "Home",
    lastMinute: {
      waitlist: {
        resource: "Desk 4B · Floor 3",
        position: 2,
        estRelease: "09:45",
      },
      alternatives: [
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
      ],
    },
    bookings: [
      {
        id: "desk-waitlist",
        kind: "desk",
        title: "Desk 4B",
        time: "All day",
        duration: "Waitlist · not assigned",
        location: DECK_OFFICE_PRESENCE.officeName,
        floor: "Floor 3",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "withdraw",
        statusNote: "Waitlist #2 — auto-assign on release",
      },
      {
        id: "meeting-pod",
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
