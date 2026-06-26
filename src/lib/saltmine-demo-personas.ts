/**
 * Demo personas for Saltmine deck mockups (slides 17–24).
 * Single source of truth for names shown in product UI.
 */

export const SALTMINE_DEMO_USER = {
  id: "jb",
  name: "Jatin Bansal",
  initials: "JB",
  email: "jatin.bansal@saltmine.io",
  floorLetter: "J",
} as const;

export interface SaltmineDemoMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  floorLetter: string;
}

/** Full member roster — ids are stable for avatars and floor-plan letters. */
export const SALTMINE_DEMO_MEMBERS: readonly SaltmineDemoMember[] = [
  { id: "jw", name: "Priya Verma", initials: "PV", color: "#006FEC", floorLetter: "P" },
  { id: "am", name: "Amit Singh", initials: "AS", color: "#4D9BF7", floorLetter: "A" },
  { id: "ww", name: "Arjun Mehta", initials: "AM", color: "#637381", floorLetter: "J" },
  { id: "ch", name: "Ananya Rao", initials: "AR", color: "#22C55E", floorLetter: "N" },
  { id: "dr", name: "Sneha Kapoor", initials: "SK", color: "#F59E0B", floorLetter: "S" },
  { id: "af", name: "Rohan Nair", initials: "RN", color: "#8B5CF6", floorLetter: "O" },
  { id: "jj", name: "Vikram Reddy", initials: "VR", color: "#EC4899", floorLetter: "V" },
  { id: "bs", name: "Kavya Iyer", initials: "KI", color: "#14B8A6", floorLetter: "K" },
  { id: "sc", name: "Neha Gupta", initials: "NG", color: "#006FEC", floorLetter: "G" },
  { id: "jo", name: "Sanjay Menon", initials: "SM", color: "#4D9BF7", floorLetter: "M" },
  {
    id: SALTMINE_DEMO_USER.id,
    name: SALTMINE_DEMO_USER.name,
    initials: SALTMINE_DEMO_USER.initials,
    color: "#1C252E",
    floorLetter: SALTMINE_DEMO_USER.floorLetter,
  },
];

export const SALTMINE_DEMO_MEMBER_BY_ID = Object.fromEntries(
  SALTMINE_DEMO_MEMBERS.map((member) => [member.id, member]),
) as Record<string, SaltmineDemoMember>;

export function getSaltmineDemoMemberName(memberId?: string): string | undefined {
  if (!memberId) return undefined;
  return SALTMINE_DEMO_MEMBER_BY_ID[memberId]?.name;
}
