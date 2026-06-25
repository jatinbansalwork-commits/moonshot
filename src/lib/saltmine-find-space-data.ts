/**
 * Dummy data for the Find a space floor plan (slide 18 deck view).
 */

/**
 * Floor plan reference artwork (optional static export).
 * Composable floor plan uses table-pod SVG units + pod clusters in the view.
 */
export const FIND_SPACE_FLOOR_PLAN = {
  src: "/assets/saltmine/find-a-space-floor-plan.png",
  alt: "Floor 21 desk map at St Mary Axe showing available and booked spaces",
  width: 575,
  height: 445,
} as const;

/** Pod desk cluster — Frame 50 export (central table + perimeter seats). */
export const FIND_SPACE_POD_TABLE = {
  src: "/assets/saltmine/pod-table.svg",
  alt: "",
  width: 119,
  height: 167,
} as const;

/** Meeting table unit (M-C*) — cropped from Frame 37 export. */
export const FIND_SPACE_TABLE_POD = {
  src: "/assets/saltmine/table-pod-unit.svg",
  alt: "",
  width: 132,
  height: 80,
} as const;

export interface MeetingTable {
  id: string;
  label: string;
  zone: "Design" | "Engineering";
  orientation: "horizontal" | "vertical";
}

export const MEETING_TABLES_NORTH: MeetingTable[] = [
  { id: "m-n10", label: "M-N10", zone: "Design", orientation: "vertical" },
  { id: "m-n11", label: "M-N11", zone: "Design", orientation: "vertical" },
];

export const MEETING_TABLES_CENTRAL: MeetingTable[] = [
  { id: "m-c1", label: "M-C1", zone: "Engineering", orientation: "horizontal" },
  { id: "m-c2", label: "M-C2", zone: "Engineering", orientation: "horizontal" },
  { id: "m-c3", label: "M-C3", zone: "Engineering", orientation: "horizontal" },
  { id: "m-c4", label: "M-C4", zone: "Engineering", orientation: "horizontal" },
  { id: "m-c5", label: "M-C5", zone: "Engineering", orientation: "horizontal" },
];

/** All bookable meeting tables on the floor plan. */
export const MEETING_TABLES: MeetingTable[] = [
  ...MEETING_TABLES_NORTH,
  ...MEETING_TABLES_CENTRAL,
];

export type DeskStatus = "available" | "occupied" | "empty";

export interface PodDesk {
  status: DeskStatus;
  occupantLetter?: string;
  occupantColor?: string;
  attributes?: readonly string[];
}

export interface FloorPod {
  id: string;
  label: string;
  zone: "Design" | "Engineering";
  /** Six seats around the pod table — top, right ×2, bottom, left ×2 (Frame 50). */
  desks: PodDesk[];
}

const pod = (
  id: string,
  label: string,
  zone: FloorPod["zone"],
  pattern: DeskStatus[],
  occupants: { letter: string; color: string }[] = [],
  deskAttributes: (readonly string[])[] = [],
): FloorPod => {
  let occupantIndex = 0;
  return {
    id,
    label,
    zone,
    desks: pattern.map((status, index) => {
      const attributes = deskAttributes[index];
      if (status !== "occupied") {
        return attributes?.length ? { status, attributes } : { status };
      }
      const person = occupants[occupantIndex++] ?? { letter: "J", color: "#006FEC" };
      return {
        status,
        occupantLetter: person.letter,
        occupantColor: person.color,
        ...(attributes?.length ? { attributes } : {}),
      };
    }),
  };
};

export const FLOOR_PODS: FloorPod[] = [
  pod("pod-1", "Pod 1", "Design", [
    "available",
    "occupied",
    "empty",
    "available",
    "occupied",
    "empty",
  ], [
    { letter: "S", color: "#4D9BF7" },
    { letter: "J", color: "#006FEC" },
  ], [
    ["Dual monitor"],
    [],
    [],
    ["Near window"],
    [],
    ["Standing desk"],
  ]),
  pod("pod-2", "Pod 2", "Design", [
    "available",
    "available",
    "occupied",
    "available",
    "occupied",
    "available",
  ], [
    { letter: "A", color: "#637381" },
    { letter: "C", color: "#22C55E" },
  ], [
    ["Near window"],
    ["Dual monitor"],
    [],
    ["Standing desk"],
    [],
    ["Dual monitor"],
  ]),
  pod("pod-3", "Pod 3", "Design", [
    "available",
    "available",
    "occupied",
    "occupied",
    "empty",
    "empty",
  ], [
    { letter: "D", color: "#F59E0B" },
    { letter: "W", color: "#8B5CF6" },
  ], [
    ["Standing desk"],
    ["Dual monitor"],
    [],
    [],
    ["Near window"],
    [],
  ]),
  pod("pod-4", "Pod 4", "Design", [
    "available",
    "occupied",
    "available",
    "available",
    "occupied",
    "available",
  ], [
    { letter: "M", color: "#0EA5E9" },
    { letter: "K", color: "#1C252E" },
  ], [
    ["Dual monitor"],
    [],
    ["Near window"],
    ["Near window"],
    [],
    ["Dual monitor"],
  ]),
];
