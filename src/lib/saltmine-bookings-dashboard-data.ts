/**
 * Interactive dummy data for the bookings dashboard mockup.
 */

export const BOOKING_TYPE_OPTIONS = [
  "Show all",
  "Desk",
  "Meeting room",
  "Parking",
] as const;

export const TEAM_OPTIONS = [
  "Add a team!",
  "London Design",
  "Product",
  "Engineering",
] as const;

export const WORK_LOCATION_OPTIONS = [
  "Remote",
  "Office",
  "St Mary Axe",
  "Hybrid",
] as const;

export const LANGUAGE_OPTIONS = ["English", "Hindi", "French"] as const;

export const LOCALE_OPTIONS = [
  { label: "India", flag: "🇮🇳" },
  { label: "United Kingdom", flag: "🇬🇧" },
  { label: "Singapore", flag: "🇸🇬" },
] as const;

export const SEARCH_ITEMS = [
  "My bookings",
  "Find a space",
  "Inbox",
  "My teams",
  "Booking grid",
  "Conference grid",
  "Desk 4B — Floor 21",
  "Focus room — St Mary Axe",
  "Sarah Chen",
  "James Okonkwo",
] as const;

export const COWORKERS_IN_OFFICE = [
  { initials: "SC", name: "Sarah Chen", color: "#006FEC" },
  { initials: "JO", name: "James Okonkwo", color: "#4D9BF7" },
] as const;

export const WEEKLY_DUMMY = [
  { day: "Mon 30", location: "Remote", bookings: 0 },
  { day: "Tue 31", location: "Remote", bookings: 0 },
  { day: "Wed 1", location: "Office", bookings: 1 },
  { day: "Thu 2", location: "Hybrid", bookings: 1 },
  { day: "Fri 3", location: "Remote", bookings: 0 },
] as const;

export const MONTHLY_DUMMY = {
  totalBookings: 3,
  daysInOffice: 4,
  highlight: "Busiest week: 3–7 Feb",
} as const;

export const CALENDAR_MONTHS = [
  {
    label: "January 2026",
    weeks: [
      [null, null, null, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31, null],
    ],
  },
  {
    label: "February 2026",
    weeks: [
      [null, null, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, null, null, null, null, null],
    ],
  },
  {
    label: "March 2026",
    weeks: [
      [null, null, null, null, null, 1, 2],
      [3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30],
    ],
  },
] as const;

export type DayId = "today" | "tomorrow";

export interface DashboardDayState {
  id: DayId;
  title: string;
  weatherLabel: string;
  weatherIcon: "cloud" | "sun";
  officeName: string;
  occupancy: string;
  coworkers: readonly { initials: string; color: string }[];
}

export const INITIAL_DAYS: DashboardDayState[] = [
  {
    id: "today",
    title: "Today—Mon 30 Jan",
    weatherLabel: "14°",
    weatherIcon: "cloud",
    officeName: "St Mary Axe",
    occupancy: "No-one's in!",
    coworkers: [],
  },
  {
    id: "tomorrow",
    title: "Tomorrow—Tue 31 Jan",
    weatherLabel: "12°",
    weatherIcon: "sun",
    officeName: "St Mary Axe",
    occupancy: "No-one's in!",
    coworkers: [],
  },
];
