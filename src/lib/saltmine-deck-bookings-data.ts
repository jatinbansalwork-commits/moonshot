/**
 * Populated My bookings data for slide 19 (Booking Timeline).
 * Does not affect the onboarding empty-state dashboard.
 */

/** Single source of truth for the primary team name across dashboard views. */
export const SALTMINE_PROJECT_SYNC = {
  id: "project-sync",
  name: "Project Sync",
} as const;

export const DECK_BOOKING_TYPE_OPTIONS = [
  "Show all",
  "Desk",
  "Car park",
  "Meeting room",
] as const;

export const DECK_TEAM_OPTIONS = [
  `${SALTMINE_PROJECT_SYNC.name} – Show all`,
  "Design Team – Show all",
  "Add a team!",
] as const;

export const DECK_FILTER_DEFAULTS = {
  "booking-type": "Show all",
  team: DECK_TEAM_OPTIONS[0],
} as const;

export const DECK_OFFICE_PRESENCE = {
  officeName: "St Mary Axe",
  commuteLabel: "45m",
  workLocation: "St Mary Axe",
} as const;

export interface DeckOfficeAvatar {
  initials: string;
  color: string;
  teamId: string;
  memberId: string;
}

export const DECK_OFFICE_AVATARS: readonly DeckOfficeAvatar[] = [
  { initials: "J", color: "#006FEC", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jw" },
  { initials: "S", color: "#4D9BF7", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "sc" },
  { initials: "A", color: "#637381", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "am" },
  { initials: "C", color: "#22C55E", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "ch" },
  { initials: "D", color: "#F59E0B", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "dr" },
  { initials: "W", color: "#8B5CF6", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "ww" },
  { initials: "B", color: "#EC4899", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "bs" },
  { initials: "R", color: "#14B8A6", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jj" },
  { initials: "M", color: "#0EA5E9", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jo" },
  { initials: "K", color: "#1C252E", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "af" },
  { initials: "J", color: "#1C252E", teamId: "design-team", memberId: "jb" },
  { initials: "A", color: "#637381", teamId: "design-team", memberId: "am" },
  { initials: "C", color: "#22C55E", teamId: "design-team", memberId: "ch" },
];

export type DeckBookingKind = "parking" | "desk" | "meeting";
export type DeckBookingStatus = "active" | "upcoming" | "completed";
export type DeckAttendeeStatus = "accepted" | "declined" | "tentative";

export interface DeckBookingAttendee {
  letter: string;
  color: string;
  status?: DeckAttendeeStatus;
}

export interface DeckBookingItem {
  id: string;
  kind: DeckBookingKind;
  title: string;
  time: string;
  duration: string;
  location: string;
  floor: string;
  status: DeckBookingStatus;
  teamId: string;
  action: "check-out" | "check-in";
  attendees?: readonly DeckBookingAttendee[];
}

export type DeckWeatherIcon = "cloud" | "sun" | "rain";

export interface DeckTimelineDay {
  id: string;
  title: string;
  /** Maps this row to the mini calendar (month index in `CALENDAR_MONTHS`). */
  calendar: { monthIndex: number; day: number };
  weatherLabel: string;
  weatherIcon: DeckWeatherIcon;
  bookings: readonly DeckBookingItem[];
  isToday?: boolean;
  showCommutePill?: boolean;
  /** Uses a single ghost avatar in the presence strip. */
  presenceMode?: "team" | "ghost";
  /** Replaces the team count label (e.g. “Best day for the office!”). */
  occupancyHighlight?: string;
  emptyState?: "repeat-desk";
}

const DESIGN_REVIEW_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "J", color: "#006FEC", status: "accepted" },
  { letter: "S", color: "#4D9BF7", status: "accepted" },
  { letter: "A", color: "#637381", status: "accepted" },
  { letter: "C", color: "#22C55E", status: "accepted" },
  { letter: "D", color: "#F59E0B", status: "accepted" },
  { letter: "W", color: "#8B5CF6", status: "accepted" },
];

const Q2_SALES_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "J", color: "#006FEC", status: "accepted" },
  { letter: "S", color: "#4D9BF7", status: "declined" },
  { letter: "A", color: "#637381", status: "accepted" },
  { letter: "C", color: "#22C55E", status: "tentative" },
  { letter: "D", color: "#F59E0B", status: "accepted" },
  { letter: "W", color: "#8B5CF6", status: "declined" },
  { letter: "B", color: "#EC4899", status: "accepted" },
];

const ACCOUNTS_SYNC_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "J", color: "#006FEC", status: "accepted" },
  { letter: "S", color: "#4D9BF7", status: "accepted" },
  { letter: "A", color: "#637381", status: "accepted" },
  { letter: "C", color: "#22C55E", status: "accepted" },
  { letter: "M", color: "#0EA5E9", status: "accepted" },
];

export const DECK_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  {
    id: "today",
    title: "Today—Mon 30 Jan",
    calendar: { monthIndex: 0, day: 30 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    isToday: true,
    showCommutePill: true,
    bookings: [
      {
        id: "parking-b2",
        kind: "parking",
        title: "Car Park B2.113",
        time: "09:00 AM",
        duration: "All day",
        location: "Basement 2",
        floor: "Basement 2",
        status: "active",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-out",
      },
      {
        id: "desk-21",
        kind: "desk",
        title: "Desk 21.P3.2",
        time: "09:00 AM",
        duration: "All day",
        location: "Floor 21",
        floor: "Floor 21",
        status: "active",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-out",
      },
      {
        id: "meeting-design",
        kind: "meeting",
        title: "Design Review",
        time: "10:30 AM",
        duration: "1h",
        location: "Meeting Room 21.12",
        floor: "Floor 21",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
        attendees: DESIGN_REVIEW_ATTENDEES,
      },
    ],
  },
  {
    id: "tomorrow",
    title: "Tomorrow—Tue 31 Jan",
    calendar: { monthIndex: 0, day: 31 },
    weatherLabel: "12°",
    weatherIcon: "sun",
    bookings: [
      {
        id: "meeting-q2",
        kind: "meeting",
        title: "Q2 Sales Review",
        time: "11:30 AM",
        duration: "1h 30m",
        location: "Teams",
        floor: "Virtual",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
        attendees: Q2_SALES_ATTENDEES,
      },
    ],
  },
  {
    id: "wed-1",
    title: "Wed 1 Feb",
    calendar: { monthIndex: 1, day: 1 },
    weatherLabel: "14°",
    weatherIcon: "rain",
    presenceMode: "ghost",
    bookings: [
      {
        id: "meeting-aipac",
        kind: "meeting",
        title: "Accounts Sync – AIPAC",
        time: "12:30 PM",
        duration: "1h 30m",
        location: "Teams",
        floor: "Virtual",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
        attendees: ACCOUNTS_SYNC_ATTENDEES,
      },
    ],
  },
  {
    id: "thu-2",
    title: "Thu 2 Feb",
    calendar: { monthIndex: 1, day: 2 },
    weatherLabel: "13°",
    weatherIcon: "cloud",
    bookings: [],
    emptyState: "repeat-desk",
  },
  {
    id: "sat-4",
    title: "Sat 4 Feb",
    calendar: { monthIndex: 1, day: 4 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    bookings: [],
  },
  {
    id: "sun-5",
    title: "Sun 5 Feb",
    calendar: { monthIndex: 1, day: 5 },
    weatherLabel: "11°",
    weatherIcon: "sun",
    bookings: [],
  },
  {
    id: "mon-6",
    title: "Mon 6 Feb",
    calendar: { monthIndex: 1, day: 6 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    occupancyHighlight: "👍 Best day for the office!",
    bookings: [
      {
        id: "parking-b2-mon",
        kind: "parking",
        title: "Car Park B2.113",
        time: "09:00 AM",
        duration: "All day",
        location: "Basement 2",
        floor: "Basement 2",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
      },
      {
        id: "desk-21-mon",
        kind: "desk",
        title: "Desk 21.P3.2",
        time: "09:00 AM",
        duration: "All day",
        location: "Floor 21",
        floor: "Floor 21",
        status: "upcoming",
        teamId: SALTMINE_PROJECT_SYNC.id,
        action: "check-in",
      },
    ],
  },
];

/** @deprecated Use `DECK_TIMELINE_DAYS[0].bookings` */
export const DECK_TODAY_BOOKINGS = DECK_TIMELINE_DAYS[0].bookings;

export const DECK_DAY_TITLES = {
  today: DECK_TIMELINE_DAYS[0].title,
  tomorrow: DECK_TIMELINE_DAYS[1].title,
} as const;

/** Calendar defaults for the deck variant (Mon 30 Jan). */
export const DECK_CALENDAR = {
  monthIndex: 0,
  selectedDay: 30,
  todayMonthIndex: 0,
  todayDay: 30,
} as const;

export function findDeckTimelineDay(
  monthIndex: number,
  day: number,
): DeckTimelineDay | undefined {
  return DECK_TIMELINE_DAYS.find(
    (entry) => entry.calendar.monthIndex === monthIndex && entry.calendar.day === day,
  );
}

/** Days in a month that appear on the booking timeline (for calendar dots). */
export function deckTimelineDaysForMonth(monthIndex: number): readonly number[] {
  return DECK_TIMELINE_DAYS.filter((entry) => entry.calendar.monthIndex === monthIndex).map(
    (entry) => entry.calendar.day,
  );
}

/** Days in a month that have at least one booking (solid dot emphasis). */
export function deckBookingDaysForMonth(monthIndex: number): readonly number[] {
  return DECK_TIMELINE_DAYS.filter(
    (entry) => entry.calendar.monthIndex === monthIndex && entry.bookings.length > 0,
  ).map((entry) => entry.calendar.day);
}

export function deckDayDateBadge(day: DeckTimelineDay): { weekday: string; dayNumber: string } {
  const match = day.title.match(/—(\w{3})\s+(\d+)/);
  return {
    weekday: match?.[1] ?? "Mon",
    dayNumber: match?.[2] ?? String(day.calendar.day),
  };
}

export function findDeckBooking(
  bookingId: string,
): { day: DeckTimelineDay; booking: DeckBookingItem } | null {
  for (const day of DECK_TIMELINE_DAYS) {
    const booking = day.bookings.find((entry) => entry.id === bookingId);
    if (booking) return { day, booking };
  }
  return null;
}

const KIND_TO_FILTER_LABEL: Record<DeckBookingKind, string> = {
  parking: "Car park",
  desk: "Desk",
  meeting: "Meeting room",
};

export function filterBookingsByKind(
  bookings: readonly DeckBookingItem[],
  kindFilter: string,
): DeckBookingItem[] {
  if (kindFilter === "Show all") return [...bookings];
  return bookings.filter((booking) => KIND_TO_FILTER_LABEL[booking.kind] === kindFilter);
}

export function filterAvatarsByTeam(
  avatars: readonly DeckOfficeAvatar[],
  teamFilter: string,
): DeckOfficeAvatar[] {
  if (teamFilter.includes("Add a team")) return [];
  if (teamFilter.includes("Design Team")) {
    return avatars.filter((avatar) => avatar.teamId === "design-team");
  }
  if (teamFilter.includes(SALTMINE_PROJECT_SYNC.name)) {
    return avatars
      .filter((avatar) => avatar.teamId === SALTMINE_PROJECT_SYNC.id)
      .slice(0, 10);
  }
  return [...avatars];
}

export function teamOccupancyLabel(count: number, teamName: string): string {
  if (count === 0) return "No-one's in!";
  return `${count} from ${teamName} in`;
}

export function resolveTeamNameFromFilter(teamFilter: string): string {
  if (teamFilter.includes("Design Team")) return "Design Team";
  if (teamFilter.includes(SALTMINE_PROJECT_SYNC.name)) return SALTMINE_PROJECT_SYNC.name;
  return SALTMINE_PROJECT_SYNC.name;
}
