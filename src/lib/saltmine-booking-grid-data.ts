/**
 * Dummy data for the booking grid view (meeting-room day schedule).
 */

import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";

export interface BookingGridRoom {
  id: string;
  label: string;
  capacity: number;
}

export interface BookingGridBlock {
  id: string;
  roomId: string;
  title: string;
  /** Minutes from 9:00 AM. Ignored when allDay is true. */
  start: number;
  end: number;
  organizer: string;
  extraAttendees?: number;
  videoLink?: boolean;
  allDay?: boolean;
  description?: string;
  attendees?: readonly string[];
}

export interface BookingGridSchedule {
  floor: string;
  office: string;
  rooms: readonly BookingGridRoom[];
  blocks: readonly BookingGridBlock[];
}

export const BOOKING_GRID_LOCATION_OPTIONS = [
  "Floor 21, St Mary Axe",
  "Floor 20, St Mary Axe",
  "Floor 19, St Mary Axe",
] as const;

export const BOOKING_GRID_TYPE_OPTIONS = [
  "Meeting room",
  "Desk",
  "Car park",
  "Show all",
] as const;

export const BOOKING_GRID_DISPLAY_OPTIONS = [
  "Day, vertical",
  "Day, horizontal",
  "Week",
] as const;

export const BOOKING_GRID_TIMEZONE = "GMT";
export const BOOKING_GRID_OFFICE = "St Mary Axe";
export const BOOKING_GRID_FLOOR = "Floor 21";

/** Fixed pixel width for each room column — enables horizontal scroll on narrow viewports. */
export const ROOM_COLUMN_WIDTH = 100;

/** Demo baseline: Mon 30 Jan (dayOffset 0 = today). */
const BOOKING_GRID_BASELINE = new Date(2024, 0, 30);

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function getBookingGridDateParts(dayOffset: number): {
  year: number;
  month: number;
  day: number;
} {
  const date = new Date(BOOKING_GRID_BASELINE);
  date.setDate(date.getDate() + dayOffset);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

export function bookingGridDayOffsetFromDate(
  year: number,
  month: number,
  day: number,
): number {
  const target = new Date(year, month, day, 12);
  const base = new Date(BOOKING_GRID_BASELINE);
  base.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - base.getTime()) / 86_400_000);
}

export function formatBookingGridMonthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/** Monday-start weeks for the mini calendar popover. */
export function buildBookingGridCalendarWeeks(
  year: number,
  month: number,
): (number | null)[][] {
  const weeks: (number | null)[][] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  let day = 1;
  let week: (number | null)[] = Array.from({ length: firstWeekday }, () => null);

  while (day <= daysInMonth) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    day += 1;
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

const ROOM_CAPACITIES = [8, 8, 10, 6, 6, 6, 8, 10, 6, 8] as const;

export const BOOKING_GRID_DATE_LABEL = getBookingGridDateLabel(0);

/** Hour labels down the left column (9 AM through 3 PM). */
export const BOOKING_GRID_HOUR_LABELS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
] as const;

export const BOOKING_GRID_START_HOUR = 9;
export const BOOKING_GRID_END_HOUR = 16;
export const BOOKING_GRID_NOW = { hour: 10, minute: 19 };

function parseFloorFromLocation(location: string): number {
  const match = /Floor (\d+)/.exec(location);
  return match ? Number.parseInt(match[1], 10) : 21;
}

function buildRooms(floor: number): readonly BookingGridRoom[] {
  return ROOM_CAPACITIES.map((capacity, index) => {
    const num = String(index + 1).padStart(2, "0");
    return {
      id: `mr${num}`,
      label: `Meeting Room ${floor}-MR${num}`,
      capacity,
    };
  });
}

function dayPatternIndex(dayOffset: number): number {
  return ((dayOffset % 3) + 3) % 3;
}

function blocksForDay(dayOffset: number): readonly BookingGridBlock[] {
  const pattern = dayPatternIndex(dayOffset);

  if (pattern === 0) {
    return [
      {
        id: "all-day-mr03",
        roomId: "mr03",
        title: "Q2 Accounts – EMEA",
        start: 0,
        end: 0,
        organizer: "Vikram Reddy",
        allDay: true,
        description: "Regional accounts review for the Q2 EMEA pipeline.",
        attendees: ["Vikram Reddy", "Kavya Iyer", "Sanjay Menon", "Neha Gupta"],
      },
      {
        id: "mr01-product-strategy",
        roomId: "mr01",
        title: "Product Strategy",
        start: 0,
        end: 120,
        organizer: "Sanjay Menon",
        description: "Align roadmap priorities ahead of the next release cycle.",
        attendees: ["Sanjay Menon", "Priya Verma", "Vikram Reddy"],
      },
      {
        id: "mr01-sprint-planning",
        roomId: "mr01",
        title: "Sprint planning",
        start: 120,
        end: 180,
        organizer: "Vikram Reddy",
        description: "Scope user stories and capacity for the upcoming sprint.",
        attendees: ["Vikram Reddy", "Ananya Rao", "Arjun Mehta"],
      },
      {
        id: "mr02-interview",
        roomId: "mr02",
        title: "Interview",
        start: 0,
        end: 90,
        organizer: "Priya Verma",
        description: "Product designer candidate — portfolio review and team fit.",
        attendees: ["Priya Verma", "Sneha Kapoor"],
      },
      {
        id: "mr02-debrief",
        roomId: "mr02",
        title: "Candidate debrief",
        start: 90,
        end: 120,
        organizer: "Sneha Kapoor",
        description: "Compare notes and decide on next steps for the candidate.",
        attendees: ["Sneha Kapoor", "Priya Verma"],
      },
      {
        id: "mr03-instant",
        roomId: "mr03",
        title: "Instant Meeting",
        start: 60,
        end: 105,
        organizer: "Neha Gupta",
        videoLink: true,
        description: "Ad-hoc sync on launch blockers with remote stakeholders.",
        attendees: ["Neha Gupta", "Vikram Reddy", "Sanjay Menon"],
      },
      {
        id: "mr04-kickoff",
        roomId: "mr04",
        title: "Web App Kick-off",
        start: 120,
        end: 210,
        organizer: "Kavya Iyer",
        extraAttendees: 4,
        description: "Kick off the web app workstream and confirm delivery milestones.",
        attendees: [
          "Kavya Iyer",
          "Vikram Reddy",
          "Ananya Rao",
          "Arjun Mehta",
          "Amit Singh",
        ],
      },
      {
        id: "mr05-design-review",
        roomId: "mr05",
        title: "Design Review",
        start: 90,
        end: 150,
        organizer: "Ananya Rao",
        videoLink: true,
        description: "Review updated flows for the booking grid and inbox views.",
        attendees: ["Ananya Rao", "Priya Verma", "Neha Gupta"],
      },
      {
        id: "mr06-standup",
        roomId: "mr06",
        title: "Stand-up",
        start: 30,
        end: 60,
        organizer: "Arjun Mehta",
        videoLink: true,
        description: "Daily project sync for the London design squad.",
        attendees: ["Arjun Mehta", "Vikram Reddy", "Amit Singh"],
      },
      {
        id: "mr06-one-to-one",
        roomId: "mr06",
        title: "1:1",
        start: 150,
        end: 210,
        organizer: "Amit Singh",
        description: "Fortnightly check-in on priorities and development goals.",
        attendees: ["Amit Singh", "Arjun Mehta"],
      },
      {
        id: "mr07-client-demo",
        roomId: "mr07",
        title: "Client demo",
        start: 60,
        end: 120,
        organizer: "Rohan Nair",
        videoLink: true,
        description: "Walkthrough of the workspace booking flow for enterprise stakeholders.",
        attendees: ["Rohan Nair", "Priya Verma", "Sanjay Menon"],
      },
      {
        id: "mr08-research-share",
        roomId: "mr08",
        title: "Research share-out",
        start: 0,
        end: 60,
        organizer: "Sneha Kapoor",
        description: "Present findings from the hybrid attendance study.",
        attendees: ["Sneha Kapoor", "Ananya Rao", "Neha Gupta"],
      },
      {
        id: "mr09-budget-review",
        roomId: "mr09",
        title: "Budget review",
        start: 120,
        end: 180,
        organizer: SALTMINE_DEMO_USER.name,
        description: "Review Q2 facilities spend and headcount forecasts.",
        attendees: [SALTMINE_DEMO_USER.name, "Vikram Reddy", "Kavya Iyer"],
      },
      {
        id: "mr10-ops-sync",
        roomId: "mr10",
        title: "Ops sync",
        start: 30,
        end: 90,
        organizer: "Amit Singh",
        description: "Coordinate room availability and signage for the floor refresh.",
        attendees: ["Amit Singh", "Arjun Mehta", "Rohan Nair"],
      },
    ];
  }

  if (pattern === 1) {
    return [
      {
        id: "prev-mr01-retro",
        roomId: "mr01",
        title: "Sprint retro",
        start: 90,
        end: 150,
        organizer: "Arjun Mehta",
        description: "Reflect on delivery blockers from the last sprint.",
        attendees: ["Arjun Mehta", "Vikram Reddy", "Ananya Rao"],
      },
      {
        id: "prev-mr02-hiring",
        roomId: "mr02",
        title: "Hiring panel",
        start: 0,
        end: 120,
        organizer: "Priya Verma",
        description: "Panel interview for a senior product designer role.",
        attendees: ["Priya Verma", "Sneha Kapoor", "Sanjay Menon"],
      },
      {
        id: "prev-mr04-workshop",
        roomId: "mr04",
        title: "Journey mapping",
        start: 60,
        end: 180,
        organizer: "Ananya Rao",
        videoLink: true,
        description: "Map the end-to-end booking journey with cross-functional partners.",
        attendees: ["Ananya Rao", "Neha Gupta", "Kavya Iyer"],
      },
      {
        id: "prev-mr05-legal",
        roomId: "mr05",
        title: "Legal review",
        start: 0,
        end: 60,
        organizer: "Sanjay Menon",
        description: "Review data retention clauses for the new tenant agreement.",
        attendees: ["Sanjay Menon", SALTMINE_DEMO_USER.name],
      },
      {
        id: "prev-mr07-training",
        roomId: "mr07",
        title: "Onboarding training",
        start: 120,
        end: 210,
        organizer: "Kavya Iyer",
        extraAttendees: 6,
        description: "Introduce new hires to Saltmine workspace tools.",
        attendees: ["Kavya Iyer", "Amit Singh", "Rohan Nair"],
      },
      {
        id: "prev-mr08-standup",
        roomId: "mr08",
        title: "Design stand-up",
        start: 30,
        end: 60,
        organizer: "Sneha Kapoor",
        videoLink: true,
        description: "Quick sync on in-flight design tasks.",
        attendees: ["Sneha Kapoor", "Ananya Rao", "Priya Verma"],
      },
      {
        id: "prev-all-day-mr10",
        roomId: "mr10",
        title: "Floor maintenance",
        start: 0,
        end: 0,
        organizer: "Amit Singh",
        allDay: true,
        description: "AV equipment upgrade — room unavailable for bookings.",
        attendees: ["Amit Singh", "Rohan Nair"],
      },
    ];
  }

  return [
    {
      id: "next-mr01-planning",
      roomId: "mr01",
      title: "Quarterly planning",
      start: 0,
      end: 90,
      organizer: "Vikram Reddy",
      description: "Set objectives for the next product quarter.",
      attendees: ["Vikram Reddy", "Sanjay Menon", SALTMINE_DEMO_USER.name],
    },
    {
      id: "next-mr03-vendor",
      roomId: "mr03",
      title: "Vendor call",
      start: 60,
      end: 120,
      organizer: "Neha Gupta",
      videoLink: true,
      description: "Discuss badge reader integration timelines with the vendor.",
      attendees: ["Neha Gupta", "Amit Singh"],
    },
    {
      id: "next-mr05-usability",
      roomId: "mr05",
      title: "Usability testing",
      start: 90,
      end: 180,
      organizer: "Priya Verma",
      description: "Observe participants booking desks and meeting rooms.",
      attendees: ["Priya Verma", "Sneha Kapoor", "Ananya Rao"],
    },
    {
      id: "next-mr06-sync",
      roomId: "mr06",
      title: "Engineering sync",
      start: 0,
      end: 60,
      organizer: "Arjun Mehta",
      videoLink: true,
      description: "Align API contracts for the calendar integration.",
      attendees: ["Arjun Mehta", "Amit Singh", "Vikram Reddy"],
    },
    {
      id: "next-mr07-board",
      roomId: "mr07",
      title: "Board prep",
      start: 120,
      end: 210,
      organizer: SALTMINE_DEMO_USER.name,
      extraAttendees: 3,
      description: "Prepare slides for the executive workspace review.",
      attendees: [SALTMINE_DEMO_USER.name, "Sanjay Menon", "Kavya Iyer"],
    },
    {
      id: "next-mr09-all-hands",
      roomId: "mr09",
      title: "All-hands rehearsal",
      start: 30,
      end: 90,
      organizer: "Rohan Nair",
      videoLink: true,
      description: "Run through AV and seating for tomorrow's town hall.",
      attendees: ["Rohan Nair", "Neha Gupta", "Priya Verma"],
    },
    {
      id: "next-all-day-mr02",
      roomId: "mr02",
      title: "Leadership offsite",
      start: 0,
      end: 0,
      organizer: "Sanjay Menon",
      allDay: true,
      description: "Reserved for the ELT strategy session.",
      attendees: ["Sanjay Menon", SALTMINE_DEMO_USER.name, "Vikram Reddy"],
    },
  ];
}

export function getBookingGridDateLabel(dayOffset: number): string {
  const date = new Date(BOOKING_GRID_BASELINE);
  date.setDate(date.getDate() + dayOffset);

  const weekday = WEEKDAY_SHORT[date.getDay()];
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  const datePart = `${weekday} ${day} ${month}`;

  let prefix: string;
  if (dayOffset === 0) prefix = "Today";
  else if (dayOffset === -1) prefix = "Yesterday";
  else if (dayOffset === 1) prefix = "Tomorrow";
  else prefix = datePart;

  if (dayOffset === 0 || dayOffset === -1 || dayOffset === 1) {
    return `${prefix} - 9:01 AM, ${datePart}`;
  }
  return `9:01 AM, ${datePart}`;
}

export function getBookingGridSchedule({
  dayOffset,
  location,
}: {
  dayOffset: number;
  location: string;
}): BookingGridSchedule {
  const floorNumber = parseFloorFromLocation(location);
  const floor = `Floor ${floorNumber}`;

  return {
    floor,
    office: BOOKING_GRID_OFFICE,
    rooms: buildRooms(floorNumber),
    blocks: blocksForDay(dayOffset),
  };
}

/** @deprecated Use getBookingGridSchedule — kept for backwards compatibility. */
export const BOOKING_GRID_ROOMS: readonly BookingGridRoom[] = buildRooms(21);

/** @deprecated Use getBookingGridSchedule — kept for backwards compatibility. */
export const BOOKING_GRID_BLOCKS: readonly BookingGridBlock[] = blocksForDay(0);

export function formatBookingGridTimeRange(start: number, end: number): string {
  const format = (minutesFromNine: number) => {
    const totalMinutes = BOOKING_GRID_START_HOUR * 60 + minutesFromNine;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    if (minute === 0) return `${hour12}:00 ${period}`;
    return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  };

  return `${format(start)} – ${format(end)}`;
}

export function bookingGridNowOffsetMinutes(hourHeight: number): number {
  const { hour, minute } = BOOKING_GRID_NOW;
  const hoursFromStart = hour - BOOKING_GRID_START_HOUR;
  return hoursFromStart * hourHeight + (minute / 60) * hourHeight;
}

export function formatBookingGridNowLabel(): string {
  const { hour, minute } = BOOKING_GRID_NOW;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}
