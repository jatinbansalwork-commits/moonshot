/**
 * Populated My bookings data for slide 18 (Navigation: You are here).
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
  attendees?: readonly { letter: string; color: string }[];
}

export const DECK_TODAY_BOOKINGS: readonly DeckBookingItem[] = [
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
    attendees: [
      { letter: "J", color: "#006FEC" },
      { letter: "S", color: "#4D9BF7" },
      { letter: "A", color: "#637381" },
      { letter: "C", color: "#22C55E" },
      { letter: "D", color: "#F59E0B" },
      { letter: "W", color: "#8B5CF6" },
    ],
  },
];

export const DECK_DAY_TITLES = {
  today: "Today—Mon 30 Jan",
  tomorrow: "Tomorrow—Tue 31 Jan",
} as const;

/** Calendar defaults for the deck variant (Mon 30 Jan). */
export const DECK_CALENDAR = {
  monthIndex: 0,
  selectedDay: 30,
  bookingDays: [30] as readonly number[],
} as const;

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
      .slice(0, 6);
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
