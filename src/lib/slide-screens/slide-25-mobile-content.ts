/** Slide 25 mobile — copy isolated from shared dashboard content. */

import {
  saltminePresenceLead,
  saltmineBookingLocationLine,
} from "@/lib/saltmine-ui-copy";

export { saltmineBookingLocationLine };

export const SLIDE_25_MOBILE_ONBOARDING_BENEFITS = [
  { id: "desk", label: "Book desk", tint: "rgba(0, 111, 236, 0.1)", border: "rgba(0, 111, 236, 0.18)", icon: "#006FEC" },
  { id: "check-in", label: "Check in", tint: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", icon: "#15803D" },
  { id: "bookings", label: "My bookings", tint: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.22)", icon: "#B45309" },
] as const;

export function mobileFirstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? displayName;
}

export function mobileGreeting(displayName: string): string {
  return `Good morning, ${mobileFirstName(displayName)}`;
}

export function mobileBookingsSubtitle(
  dayLabel: string,
  bookingCount: number,
  displayName?: string,
  isToday = false,
): string {
  const noun = bookingCount === 1 ? "booking" : "bookings";
  const dayPart = isToday
    ? `Today · ${bookingCount} ${noun}`
    : `${dayLabel} · ${bookingCount} ${noun}`;
  if (!displayName) return dayPart;
  return `${mobileGreeting(displayName)} · ${dayPart}`;
}

export function mobileDayContextLabel(
  dayLabel: string,
  isToday: boolean,
  isTomorrow: boolean,
): string {
  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";
  return dayLabel;
}

export function mobilePresenceLead(count: number, teamName: string): string {
  return saltminePresenceLead(count, teamName);
}
