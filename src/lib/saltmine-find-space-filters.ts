/**
 * Find a space filter state and floor-plan result computation.
 */

import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
import {
  FLOOR_PODS,
  MEETING_TABLES,
  type FloorPod,
  type MeetingTable,
  type PodDesk,
} from "@/lib/saltmine-find-space-data";

export type FindSpaceFilterId =
  | "where"
  | "type"
  | "attributes"
  | "when"
  | "start"
  | "end"
  | "team"
  | "results";

export interface FindSpaceFilterDefinition {
  id: FindSpaceFilterId;
  label: string;
  options: readonly string[];
  defaultValue: string;
}

export const FIND_SPACE_FILTER_DEFINITIONS: readonly FindSpaceFilterDefinition[] = [
  {
    id: "where",
    label: "Where?",
    options: ["Floor 21, St Mary Axe", "Floor 20, St Mary Axe", "Floor 19, St Mary Axe"],
    defaultValue: "Floor 21, St Mary Axe",
  },
  {
    id: "type",
    label: "Type?",
    options: ["Show all", "Desk", "Meeting room", "Car park"],
    defaultValue: "Show all",
  },
  {
    id: "attributes",
    label: "Attributes",
    options: ["None", "Dual monitor", "Standing desk", "Near window"],
    defaultValue: "None",
  },
  {
    id: "when",
    label: "When?",
    options: ["Wed 1 Feb", "Thu 2 Feb", "Fri 3 Feb"],
    defaultValue: "Wed 1 Feb",
  },
  {
    id: "start",
    label: "Start",
    options: ["Now", "9:00 AM", "12:00 PM", "2:00 PM"],
    defaultValue: "Now",
  },
  {
    id: "end",
    label: "End",
    options: ["5:30 PM", "3:00 PM", "6:00 PM", "All day"],
    defaultValue: "5:30 PM",
  },
  {
    id: "team",
    label: "Show team?",
    options: ["None", SALTMINE_PROJECT_SYNC.name, "Design Team"],
    defaultValue: SALTMINE_PROJECT_SYNC.name,
  },
  {
    id: "results",
    label: "Results",
    options: ["Floor", "List"],
    defaultValue: "Floor",
  },
] as const;

export const FIND_SPACE_PRIMARY_FILTER_IDS = ["where", "type", "when"] as const;
export const FIND_SPACE_SECONDARY_FILTER_IDS = [
  "attributes",
  "start",
  "end",
  "team",
] as const;

export type FindSpaceFilterValues = Record<FindSpaceFilterId, string>;

export const FIND_SPACE_DEFAULT_FILTER_VALUES: FindSpaceFilterValues =
  FIND_SPACE_FILTER_DEFINITIONS.reduce(
    (acc, filter) => {
      acc[filter.id] = filter.defaultValue;
      return acc;
    },
    {} as FindSpaceFilterValues,
  );

export type DisplayDeskStatus = PodDesk["status"] | "unavailable";

export interface DisplayDesk extends PodDesk {
  displayStatus: DisplayDeskStatus;
  highlighted: boolean;
  matches: boolean;
}

export interface DisplayPod {
  id: string;
  label: string;
  zone: FloorPod["zone"];
  desks: DisplayDesk[];
  visible: boolean;
}

export interface DisplayMeetingTable {
  table: MeetingTable;
  visible: boolean;
  available: boolean;
  matches: boolean;
}

export interface FindSpaceFloorPlanResult {
  pods: DisplayPod[];
  meetingTables: DisplayMeetingTable[];
  matchingCount: number;
  matchingSpaces: string[];
  viewMode: "floor" | "list";
}

const PROJECT_SYNC_LETTERS = new Set(["J", "S", "A", "C", "D", "W", "M", "K", "B", "R"]);
const DESIGN_TEAM_LETTERS = new Set(["J", "A", "C", "D", "W"]);

function isOnTeam(
  letter: string | undefined,
  team: string,
  checkedFloorLetters?: ReadonlySet<string>,
): boolean {
  if (!letter) return false;
  if (checkedFloorLetters && checkedFloorLetters.size > 0) {
    return checkedFloorLetters.has(letter);
  }
  if (team === SALTMINE_PROJECT_SYNC.name) return PROJECT_SYNC_LETTERS.has(letter);
  if (team === "Design Team") return DESIGN_TEAM_LETTERS.has(letter);
  return false;
}

function deskMatchesAttribute(desk: PodDesk, attribute: string): boolean {
  if (attribute === "None") return true;
  return desk.attributes?.includes(attribute) ?? false;
}

function isDeskBookableForTime(desk: PodDesk, filters: FindSpaceFilterValues): boolean {
  if (desk.status !== "available" && desk.status !== "empty") return false;

  if (filters.when !== "Wed 1 Feb") {
    return desk.status === "empty" || (desk.attributes?.includes("Near window") ?? false);
  }

  if (filters.start === "2:00 PM") {
    return desk.status === "empty" || (desk.attributes?.length ?? 0) > 0;
  }

  if (filters.end === "3:00 PM") {
    return desk.status === "empty" || (desk.attributes?.includes("Dual monitor") ?? false);
  }

  return true;
}

function isMeetingAvailable(filters: FindSpaceFilterValues, index: number): boolean {
  if (filters.where !== "Floor 21, St Mary Axe") return false;
  if (filters.when !== "Wed 1 Feb") return index % 2 === 0;
  if (filters.end === "3:00 PM") return index < 3;
  return true;
}

function showDesks(filters: FindSpaceFilterValues): boolean {
  return filters.type === "Desk" || filters.type === "Show all";
}

function showMeetings(filters: FindSpaceFilterValues): boolean {
  return filters.type === "Meeting room" || filters.type === "Show all";
}

function podVisibleOnFloor(pod: FloorPod, where: string): boolean {
  if (where === "Floor 21, St Mary Axe") return true;
  if (where === "Floor 20, St Mary Axe") return pod.zone === "Design";
  return pod.zone === "Engineering";
}

export function computeFindSpaceFloorPlan(
  filters: FindSpaceFilterValues,
  pods: FloorPod[] = FLOOR_PODS,
  meetingTables: MeetingTable[] = MEETING_TABLES,
  checkedFloorLetters?: ReadonlySet<string>,
): FindSpaceFloorPlanResult {
  const teamFilter = filters.team;
  const showTeam = teamFilter !== "None";
  const desksEnabled = showDesks(filters);
  const meetingsEnabled = showMeetings(filters);
  const matchingSpaces: string[] = [];

  const displayPods: DisplayPod[] = pods.map((pod) => {
    const visible = desksEnabled && podVisibleOnFloor(pod, filters.where);

    const desks: DisplayDesk[] = pod.desks.map((desk, index) => {
      const attributeMatch = deskMatchesAttribute(desk, filters.attributes);
      const highlighted =
        showTeam &&
        desk.status === "occupied" &&
        isOnTeam(desk.occupantLetter, teamFilter, checkedFloorLetters);

      let displayStatus: DisplayDeskStatus = desk.status;
      let matches = false;

      if (!visible || !attributeMatch) {
        displayStatus = "unavailable";
      } else if (desk.status === "available" || desk.status === "empty") {
        const timeOk = isDeskBookableForTime(desk, filters);
        if (timeOk) {
          matches = true;
          matchingSpaces.push(`${pod.label} · Desk ${index + 1}`);
          if (desk.status === "empty") displayStatus = "available";
        } else {
          displayStatus = "unavailable";
        }
      } else if (desk.status === "occupied" && highlighted) {
        displayStatus = "occupied";
      }

      return {
        ...desk,
        displayStatus,
        highlighted,
        matches,
      };
    });

    return {
      id: pod.id,
      label: pod.label,
      zone: pod.zone,
      desks,
      visible,
    };
  });

  const displayMeetings: DisplayMeetingTable[] = meetingTables.map((table, index) => {
    const visible = meetingsEnabled && filters.where === "Floor 21, St Mary Axe";
    const available = visible && isMeetingAvailable(filters, index);
    if (available) matchingSpaces.push(table.label);
    return {
      table,
      visible,
      available,
      matches: available,
    };
  });

  if (filters.type === "Car park") {
    return {
      pods: displayPods.map((pod) => ({ ...pod, visible: false })),
      meetingTables: displayMeetings.map((entry) => ({ ...entry, visible: false, matches: false })),
      matchingCount: 0,
      matchingSpaces: [],
      viewMode: filters.results === "List" ? "list" : "floor",
    };
  }

  const deskMatches = displayPods.flatMap((pod) =>
    pod.desks.filter((desk) => desk.matches),
  ).length;
  const meetingMatches = displayMeetings.filter((entry) => entry.matches).length;
  const matchingCount = deskMatches + meetingMatches;

  return {
    pods: displayPods,
    meetingTables: displayMeetings,
    matchingCount,
    matchingSpaces,
    viewMode: filters.results === "List" ? "list" : "floor",
  };
}
