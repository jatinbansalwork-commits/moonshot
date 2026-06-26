/**
 * Dummy data for the conference grid view (multi-region meeting schedule).
 */

import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";

export interface ConferenceGridBooking {
  id: string;
  title: string;
  /** Minutes from the region's first hour label. */
  start: number;
  end: number;
  /** Why the room is booked — shown in the detail popover. */
  useCase: string;
  organizer: string;
  attendees?: readonly string[];
  videoLink?: boolean;
}

export interface ConferenceGridRoom {
  id: string;
  label: string;
  bookings: readonly ConferenceGridBooking[];
  /** Minutes from day start when hatched unavailable zone begins (e.g. early close). */
  unavailableFrom?: number;
}

export interface ConferenceGridRegion {
  id: string;
  country: string;
  timezone: string;
  address: string;
  hourLabels: readonly string[];
  /** 24h hour of first column. */
  dayStartHour: number;
  nowHour: number;
  nowMinute: number;
  rooms: readonly ConferenceGridRoom[];
}

export const CONFERENCE_GRID_DATE_LABEL = "Today — Mon 30 Jan";
export const CONFERENCE_GRID_SHORT_DATE_LABEL = "Mon 30 Jan";

export const CONFERENCE_GRID_PRESETS = [
  "ELT Summit",
  "Project Sync global",
  "Q2 planning",
] as const;

export const CONFERENCE_GRID_COUNTRY_OPTIONS = [
  "All countries",
  "United Kingdom",
  "France",
  "India",
] as const;

export const CONFERENCE_GRID_LOCATION_OPTIONS = [
  "All locations",
  "30 St Mary Axe",
  "13 Rue du Dr Lanceaux",
  "91 Cybercity",
] as const;

export const CONFERENCE_GRID_FLOOR_OPTIONS = ["All", "Floor 21", "Floor 20", "Basement"] as const;

export const CONFERENCE_GRID_WORKSPACE_OPTIONS = [
  "Meeting room",
  "Desk",
  "Show all",
] as const;

export const CONFERENCE_GRID_CAPACITY_OPTIONS = ["6", "4", "8", "10", "Any"] as const;

export const CONFERENCE_GRID_TAG_OPTIONS = ["1", "None", "VC", "Executive"] as const;

export const CONFERENCE_GRID_ACCESS_OPTIONS = [
  "Self-bookable",
  "Request only",
  "Show all",
] as const;

/** Total minutes spanned by one hour column. */
export const CONFERENCE_GRID_HOUR_MINUTES = 60;

export const CONFERENCE_GRID_REGIONS: readonly ConferenceGridRegion[] = [
  {
    id: "uk",
    country: "United Kingdom",
    timezone: "GMT",
    address: "30 St Mary Axe",
    dayStartHour: 9,
    nowHour: 10,
    nowMinute: 19,
    hourLabels: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ],
    rooms: [
      {
        id: "uk-mr01a",
        label: "21-MR01 · North",
        bookings: [
          {
            id: "uk-b1",
            title: "Product Strategy",
            start: 0,
            end: 120,
            useCase:
              "Align roadmap priorities and release scope for the ELT summit working session.",
            organizer: "Sanjay Menon",
            attendees: ["Sanjay Menon", "Priya Verma", "Vikram Reddy"],
          },
          {
            id: "uk-b2",
            title: "Q2 Forecast",
            start: 240,
            end: 330,
            useCase: "Review regional pipeline assumptions before the quarterly board read-out.",
            organizer: "Vikram Reddy",
            attendees: ["Vikram Reddy", "Kavya Iyer", SALTMINE_DEMO_USER.name],
            videoLink: true,
          },
        ],
      },
      {
        id: "uk-mr01b",
        label: "21-MR01 · South",
        bookings: [
          {
            id: "uk-b3",
            title: "Instant Meeting",
            start: 60,
            end: 105,
            useCase: "Ad-hoc sync on launch blockers with the London product squad.",
            organizer: "Neha Gupta",
            attendees: ["Neha Gupta", "Arjun Mehta"],
            videoLink: true,
          },
        ],
      },
    ],
  },
  {
    id: "fr",
    country: "France",
    timezone: "W. Europe Standard Time",
    address: "13 Rue du Dr Lanceaux",
    dayStartHour: 10,
    nowHour: 11,
    nowMinute: 19,
    hourLabels: [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
    ],
    rooms: [
      {
        id: "fr-garnier",
        label: "Salle Garnier",
        bookings: [
          {
            id: "fr-b1",
            title: "Planification des sprints",
            start: 0,
            end: 90,
            useCase: "Scope user stories and capacity for the Paris design squad's next sprint.",
            organizer: "Ananya Rao",
            attendees: ["Ananya Rao", "Sneha Kapoor", "Priya Verma"],
          },
        ],
        unavailableFrom: 450,
      },
      {
        id: "fr-haussmann",
        label: "Salle Haussmann",
        bookings: [
          {
            id: "fr-b2",
            title: "Tests utilisateurs",
            start: 60,
            end: 150,
            useCase: "Observe participants completing the desk-booking journey on mobile.",
            organizer: "Sneha Kapoor",
            attendees: ["Sneha Kapoor", "Ananya Rao"],
          },
          {
            id: "fr-b3",
            title: "Discuter avec BH",
            start: 180,
            end: 240,
            useCase: "Executive check-in on hybrid attendance metrics for the EU rollout.",
            organizer: "Sanjay Menon",
            attendees: ["Sanjay Menon", SALTMINE_DEMO_USER.name],
          },
        ],
        unavailableFrom: 450,
      },
      {
        id: "fr-dutemps",
        label: "Salle Dutemps",
        bookings: [
          {
            id: "fr-b4",
            title: "Sprint 4",
            start: 120,
            end: 210,
            useCase: "Finalise acceptance criteria and delivery dates for sprint four.",
            organizer: "Arjun Mehta",
            attendees: ["Arjun Mehta", "Vikram Reddy", "Amit Singh"],
          },
        ],
        unavailableFrom: 450,
      },
    ],
  },
  {
    id: "in",
    country: "India",
    timezone: "India Standard Time",
    address: "91 Cybercity",
    dayStartHour: 14,
    nowHour: 15,
    nowMinute: 39,
    hourLabels: [
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
      "10:00 PM",
    ],
    rooms: [
      {
        id: "in-vc8",
        label: "India VC Room 8",
        bookings: [
          {
            id: "in-b1",
            title: "Demo — Screens",
            start: 30,
            end: 120,
            useCase: "Walk stakeholders through updated conference grid flows and filter presets.",
            organizer: "Rohan Nair",
            attendees: ["Rohan Nair", "Priya Verma", "Neha Gupta"],
            videoLink: true,
          },
        ],
        unavailableFrom: 240,
      },
      {
        id: "in-vc9",
        label: "India VC Room 9",
        bookings: [
          {
            id: "in-b2",
            title: "Sprintplanung",
            start: 90,
            end: 180,
            useCase: "Cross-region planning sync with the Gurgaon engineering team.",
            organizer: "Amit Singh",
            attendees: ["Amit Singh", "Arjun Mehta", "Vikram Reddy"],
            videoLink: true,
          },
        ],
        unavailableFrom: 240,
      },
      {
        id: "in-vc12",
        label: "India VC Room 12",
        bookings: [],
        unavailableFrom: 240,
      },
      {
        id: "in-vc17",
        label: "India VC Room 17",
        bookings: [
          {
            id: "in-b3",
            title: "Regression Testing",
            start: 150,
            end: 240,
            useCase: "Validate booking grid and inbox flows before the enterprise pilot go-live.",
            organizer: "Kavya Iyer",
            attendees: ["Kavya Iyer", "Amit Singh", "Rohan Nair"],
          },
        ],
        unavailableFrom: 240,
      },
    ],
  },
];

export function formatConferenceGridTimeRange(
  region: ConferenceGridRegion,
  start: number,
  end: number,
): string {
  const format = (minutesFromStart: number) => {
    const totalMinutes = region.dayStartHour * 60 + minutesFromStart;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    if (minute === 0) return `${hour12}:00 ${period}`;
    return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  };

  return `${format(start)} – ${format(end)}`;
}

export function formatConferenceGridNowLabel(region: ConferenceGridRegion): string {
  const { nowHour, nowMinute } = region;
  const period = nowHour >= 12 ? "PM" : "AM";
  const hour12 = nowHour % 12 || 12;
  return `${hour12}:${String(nowMinute).padStart(2, "0")} ${period}`;
}

export function conferenceGridNowOffsetMinutes(
  region: ConferenceGridRegion,
  hourWidth: number,
): number {
  const hoursFromStart = region.nowHour - region.dayStartHour;
  return hoursFromStart * hourWidth + (region.nowMinute / 60) * hourWidth;
}

export function conferenceGridTotalMinutes(region: ConferenceGridRegion): number {
  return region.hourLabels.length * CONFERENCE_GRID_HOUR_MINUTES;
}
