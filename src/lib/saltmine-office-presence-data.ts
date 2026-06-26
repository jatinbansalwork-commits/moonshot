/**
 * Who's-in-the-office data for the My bookings “View” popup.
 */

import {
  DECK_OFFICE_PRESENCE,
  resolveTeamNameFromFilter,
  SALTMINE_PROJECT_SYNC,
  type DeckTimelineDay,
} from "@/lib/saltmine-deck-bookings-data";
import { MY_TEAMS_DUMMY, type TeamMember } from "@/lib/saltmine-teams-data";

export interface OfficePresencePerson {
  id: string;
  name: string;
  initials: string;
  color: string;
  location: string;
  locationKind: "desk" | "meeting" | "parking";
}

const FALLBACK_LOCATIONS = [
  "Desk 21.P3.2",
  "Desk 21.P3.4",
  "Desk 21.P2.8",
  "Meeting Room 21.12",
  "Focus Pod 21.05",
  "Car Park B2.113",
] as const;

function teamMembersForFilter(teamFilter: string): TeamMember[] {
  if (teamFilter.includes("Create a team")) return [];
  if (teamFilter.includes("Design Team")) {
    return MY_TEAMS_DUMMY.find((team) => team.id === "design-team")?.members ?? [];
  }
  return (
    MY_TEAMS_DUMMY.find((team) => team.id === SALTMINE_PROJECT_SYNC.id)?.members ?? []
  );
}

function locationKindFromBooking(
  kind: "parking" | "desk" | "meeting",
): OfficePresencePerson["locationKind"] {
  if (kind === "parking") return "parking";
  if (kind === "meeting") return "meeting";
  return "desk";
}

export function officePresencePeople(
  teamFilter: string,
  day: DeckTimelineDay,
): OfficePresencePerson[] {
  if (day.presenceMode === "ghost") {
    const booking = day.bookings[0];
    return [
      {
        id: "solo",
        name: "Just you today",
        initials: "👻",
        color: "#94A3B8",
        location: booking?.location ?? "Floor 21",
        locationKind: booking ? locationKindFromBooking(booking.kind) : "desk",
      },
    ];
  }

  const members = teamMembersForFilter(teamFilter);
  if (members.length === 0) return [];

  const headcount = day.occupancyHighlight ? members.length : Math.min(10, members.length);

  return members.slice(0, headcount).map((member, index) => {
    const booking = day.bookings[index % Math.max(day.bookings.length, 1)];
    const location =
      booking?.location ?? FALLBACK_LOCATIONS[index % FALLBACK_LOCATIONS.length];
    const locationKind = booking
      ? locationKindFromBooking(booking.kind)
      : index % 3 === 2
        ? "meeting"
        : "desk";

    return {
      id: member.id,
      name: member.name,
      initials: member.initials,
      color: member.color,
      location,
      locationKind,
    };
  });
}

export function officePresenceSummary(
  teamFilter: string,
  day: DeckTimelineDay,
  people: readonly OfficePresencePerson[],
): string {
  if (people.length === 0) return "No-one's in!";
  if (day.presenceMode === "ghost") return "Quiet day in the office";
  if (day.occupancyHighlight) return day.occupancyHighlight;
  const teamName = resolveTeamNameFromFilter(teamFilter);
  return `${people.length} from ${teamName} in`;
}

export const OFFICE_PRESENCE_OFFICE_NAME = DECK_OFFICE_PRESENCE.officeName;
