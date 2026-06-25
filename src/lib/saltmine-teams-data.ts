/**
 * Dummy data for the My teams dashboard view.
 */

import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  floorLetter: string;
}

export interface TeamGroup {
  id: string;
  name: string;
  members: TeamMember[];
}

const MEMBER_POOL: TeamMember[] = [
  { id: "jw", name: "Jenny Wilson", initials: "JW", color: "#006FEC", floorLetter: "J" },
  { id: "am", name: "Arlene McCoy", initials: "AM", color: "#4D9BF7", floorLetter: "A" },
  { id: "ww", name: "Wade Warren", initials: "WW", color: "#637381", floorLetter: "W" },
  { id: "ch", name: "Courtney Henry", initials: "CH", color: "#22C55E", floorLetter: "C" },
  { id: "dr", name: "Dianne Russell", initials: "DR", color: "#F59E0B", floorLetter: "D" },
  { id: "af", name: "Albert Flores", initials: "AF", color: "#8B5CF6", floorLetter: "K" },
  { id: "jj", name: "Jacob Jones", initials: "JJ", color: "#EC4899", floorLetter: "R" },
  { id: "bs", name: "Brooklyn Simmons", initials: "BS", color: "#14B8A6", floorLetter: "B" },
  { id: "sc", name: "Sarah Chen", initials: "SC", color: "#006FEC", floorLetter: "S" },
  { id: "jo", name: "James Okonkwo", initials: "JO", color: "#4D9BF7", floorLetter: "M" },
  { id: "jb", name: "Jatin Bansal", initials: "J", color: "#1C252E", floorLetter: "J" },
];

export const MY_TEAMS_DUMMY: TeamGroup[] = [
  {
    id: SALTMINE_PROJECT_SYNC.id,
    name: SALTMINE_PROJECT_SYNC.name,
    members: MEMBER_POOL.slice(0, 11),
  },
  {
    id: "design-team",
    name: "Design Team",
    members: [
      { id: "jb", name: "Jatin Bansal", initials: "J", color: "#1C252E", floorLetter: "J" },
      ...MEMBER_POOL.slice(1, 6),
    ],
  },
];

export function floorLettersForMemberIds(memberIds: ReadonlySet<string>): Set<string> {
  const letters = new Set<string>();
  for (const team of MY_TEAMS_DUMMY) {
    for (const member of team.members) {
      if (memberIds.has(member.id)) letters.add(member.floorLetter);
    }
  }
  return letters;
}

export const DEFAULT_CHECKED_MEMBER_IDS = new Set(
  MY_TEAMS_DUMMY.flatMap((team) => team.members.map((member) => member.id)),
);
