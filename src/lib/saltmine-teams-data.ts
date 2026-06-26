/**
 * Dummy data for the My teams dashboard view.
 */

import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_DEMO_MEMBERS } from "@/lib/saltmine-demo-personas";

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

const MEMBER_POOL: TeamMember[] = SALTMINE_DEMO_MEMBERS.map((member) => ({ ...member }));

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
      MEMBER_POOL.find((member) => member.id === "jb")!,
      ...MEMBER_POOL.filter((member) => member.id !== "jb").slice(0, 5),
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
