/**
 * Populated My bookings data for slide 19 (Booking Timeline).
 * Does not affect the onboarding empty-state dashboard.
 */

import { createDeckBookingFromAddFlow } from "@/lib/saltmine-last-minute-booking";

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
  "Create a team…",
] as const;

export const DECK_FILTER_DEFAULTS = {
  "booking-type": "Show all",
  team: DECK_TEAM_OPTIONS[0],
} as const;

export const DECK_OFFICE_PRESENCE = {
  officeName: "St Mary Axe",
  workLocation: "St Mary Axe",
} as const;

export interface DeckOfficeAvatar {
  initials: string;
  color: string;
  teamId: string;
  memberId: string;
}

export const DECK_OFFICE_AVATARS: readonly DeckOfficeAvatar[] = [
  { initials: "P", color: "#006FEC", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jw" },
  { initials: "G", color: "#006FEC", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "sc" },
  { initials: "A", color: "#4D9BF7", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "am" },
  { initials: "N", color: "#22C55E", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "ch" },
  { initials: "S", color: "#F59E0B", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "dr" },
  { initials: "J", color: "#637381", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "ww" },
  { initials: "K", color: "#14B8A6", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "bs" },
  { initials: "V", color: "#EC4899", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jj" },
  { initials: "M", color: "#4D9BF7", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "jo" },
  { initials: "O", color: "#8B5CF6", teamId: SALTMINE_PROJECT_SYNC.id, memberId: "af" },
  { initials: "R", color: "#1C252E", teamId: "design-team", memberId: "jb" },
  { initials: "A", color: "#4D9BF7", teamId: "design-team", memberId: "am" },
  { initials: "N", color: "#22C55E", teamId: "design-team", memberId: "ch" },
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
  action: DeckBookingAction;
  attendees?: readonly DeckBookingAttendee[];
  /** Optional status line under the title row (e.g. waitlist position). */
  statusNote?: string;
}

export type DeckBookingAction = "check-out" | "check-in" | "withdraw";

/** Resource bookings users can release before arrival — not timed meetings. */
const WITHDRAWABLE_RESOURCE_KINDS = new Set<DeckBookingKind>(["desk", "parking"]);

/**
 * Primary card action by lifecycle: active → check out;
 * upcoming desk/parking/cab → withdraw (release hold, not check in).
 */
export function resolveDeckBookingAction(booking: DeckBookingItem): DeckBookingAction {
  if (booking.status === "active") return "check-out";
  if (
    booking.status === "upcoming" &&
    WITHDRAWABLE_RESOURCE_KINDS.has(booking.kind)
  ) {
    return "withdraw";
  }
  return booking.action;
}

export function deckBookingActionLabel(action: DeckBookingAction): string {
  if (action === "check-out") return "Check out";
  if (action === "withdraw") return "Withdraw";
  return "Check in";
}

export function deckBookingActionStyle(action: DeckBookingAction): {
  backgroundColor: string;
  color: string;
  borderColor: string;
} {
  if (action === "check-out") {
    return {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      color: "#DC2626",
      borderColor: "rgba(239, 68, 68, 0.24)",
    };
  }
  if (action === "withdraw") {
    return {
      backgroundColor: "rgba(145, 158, 171, 0.08)",
      color: "#637381",
      borderColor: "rgba(145, 158, 171, 0.32)",
    };
  }
  return {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    color: "#D97706",
    borderColor: "rgba(245, 158, 11, 0.28)",
  };
}

export interface DeckLastMinuteAlternative {
  kind: "desk" | "parking" | "meeting";
  label: string;
  detail: string;
}

export interface DeckLastMinuteContext {
  waitlist?: {
    resource: string;
    position: number;
    estRelease: string;
  };
  alternatives: readonly DeckLastMinuteAlternative[];
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
  /** Override work-location badge (defaults to office). */
  workLocationLabel?: string;
  /** Last-minute lane — waitlist and alternatives on My bookings. */
  lastMinute?: DeckLastMinuteContext;
  /** Uses a single ghost avatar in the presence strip. */
  presenceMode?: "team" | "ghost";
  /** Replaces the team count label (e.g. “Best day for the office!”). */
  occupancyHighlight?: string;
}

const DESIGN_REVIEW_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "P", color: "#006FEC", status: "accepted" },
  { letter: "G", color: "#006FEC", status: "accepted" },
  { letter: "A", color: "#4D9BF7", status: "accepted" },
  { letter: "N", color: "#22C55E", status: "accepted" },
  { letter: "S", color: "#F59E0B", status: "accepted" },
  { letter: "J", color: "#637381", status: "accepted" },
];

const Q2_SALES_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "P", color: "#006FEC", status: "accepted" },
  { letter: "G", color: "#006FEC", status: "declined" },
  { letter: "A", color: "#4D9BF7", status: "accepted" },
  { letter: "N", color: "#22C55E", status: "tentative" },
  { letter: "S", color: "#F59E0B", status: "accepted" },
  { letter: "J", color: "#637381", status: "declined" },
  { letter: "K", color: "#14B8A6", status: "accepted" },
];

const ACCOUNTS_SYNC_ATTENDEES: readonly DeckBookingAttendee[] = [
  { letter: "P", color: "#006FEC", status: "accepted" },
  { letter: "G", color: "#006FEC", status: "accepted" },
  { letter: "A", color: "#4D9BF7", status: "accepted" },
  { letter: "N", color: "#22C55E", status: "accepted" },
  { letter: "M", color: "#4D9BF7", status: "accepted" },
];

export const DECK_TIMELINE_DAYS: readonly DeckTimelineDay[] = [
  {
    id: "today",
    title: "Today—Mon 30 Jan",
    calendar: { monthIndex: 0, day: 30 },
    weatherLabel: "14°",
    weatherIcon: "cloud",
    isToday: true,
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
        action: "withdraw",
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
        action: "withdraw",
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

/** Resolve a calendar day against any timeline (e.g. future-plan slide state). */
export function findTimelineDay(
  timeline: readonly DeckTimelineDay[],
  monthIndex: number,
  day: number,
): DeckTimelineDay | undefined {
  return timeline.find(
    (entry) => entry.calendar.monthIndex === monthIndex && entry.calendar.day === day,
  );
}

/** Booking dots for the mini calendar from the active timeline. */
export function deckBookingDaysFromTimeline(
  timeline: readonly DeckTimelineDay[],
  monthIndex: number,
): readonly number[] {
  return timeline
    .filter((day) => day.calendar.monthIndex === monthIndex && day.bookings.length > 0)
    .map((day) => day.calendar.day);
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
  if (teamFilter.includes("Create a team")) return [];
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

/** Shorter occupancy line for mobile presence bar. */
export function teamOccupancyShortLabel(count: number, teamName: string): string {
  if (count === 0) return "No-one's in";
  return `${count} from ${teamName}`;
}

export function resolveTeamNameFromFilter(teamFilter: string): string {
  if (teamFilter.includes("Design Team")) return "Design Team";
  if (teamFilter.includes(SALTMINE_PROJECT_SYNC.name)) return SALTMINE_PROJECT_SYNC.name;
  return SALTMINE_PROJECT_SYNC.name;
}

/** Turn add-booking flow labels into timeline cards (onboarding / first booking). */
export function addedBookingLabelsToDeckItems(
  labels: readonly string[],
  dayId: string,
  day?: Pick<DeckTimelineDay, "isToday" | "calendar" | "id">,
): DeckBookingItem[] {
  const dayContext =
    day ??
    ({
      id: dayId,
      isToday: dayId === "today",
      calendar: {
        monthIndex: DECK_CALENDAR.monthIndex,
        day: dayId === "today" ? DECK_CALENDAR.todayDay : DECK_CALENDAR.todayDay + 1,
      },
    } satisfies Pick<DeckTimelineDay, "isToday" | "calendar" | "id">);

  return labels.map((label, index) =>
    createDeckBookingFromAddFlow({ label, dayId, day: dayContext, index }).booking,
  );
}
