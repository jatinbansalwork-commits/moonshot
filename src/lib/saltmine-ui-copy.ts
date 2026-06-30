/**
 * Single source for repeated Saltmine product copy (presence, greetings).
 */

export function saltminePresenceLead(count: number, teamName: string): string {
  if (count === 0) return `No-one from ${teamName} in yet`;
  return `${count} in office · ${teamName}`;
}

/** Desktop timeline presence row — shorter, pairs with avatar stack. */
export function saltminePresenceRowLabel(
  count: number,
  teamName: string,
  highlight?: string,
): string {
  if (highlight) return highlight;
  if (count === 0) return "No-one's in";
  return `${count} from ${teamName}`;
}

export function saltmineBookingLocationLine(booking: {
  duration?: string;
  location: string;
  floor?: string;
  time?: string;
}): string {
  const parts = [booking.time, booking.duration, booking.location, booking.floor].filter(Boolean);
  return parts.join(" · ");
}
