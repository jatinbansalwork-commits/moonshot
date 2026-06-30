import {
  getSaltmineSlideScreenPath,
  SALTMINE_SLIDE_SCREENS,
  type SaltmineSlideScreenEntry,
} from "@/lib/saltmine-slide-screens";
import { FUTURE_PLAN_SLIDES } from "@/lib/slide-content/future-slides";

export interface SaltmineDevFlow {
  id: string;
  label: string;
  description: string;
  /** Omit for deck-only concept slides (no isolated dev preview). */
  devPath?: string;
  /** Deck slide id for `/?slide=N` deep links. */
  deckSlideId?: string;
  screenFile?: string;
  configFile?: string;
  tags?: readonly string[];
}

export interface SaltmineDevFlowGroup {
  id: string;
  title: string;
  description: string;
  flows: readonly SaltmineDevFlow[];
}

const DECK_SLIDE_ID_BY_SLUG: Record<string, string> = {
  "17": "slide-17",
  "18": "slide-18",
  "19": "slide-19",
  "21": "slide-21",
  "22": "slide-22",
  "23": "slide-23",
  "25-mobile": "slide-25-mobile",
  "20-deck-day": "slide-20",
  "20-pod-cluster": "slide-20",
  "20-team-list": "slide-20",
  "39": "slide-39",
  "40": "slide-40",
  "41": "slide-41",
  "44": "slide-44",
  "45": "slide-45",
};

const FLOW_DESCRIPTIONS: Record<string, string> = {
  "17":
    "Sign-in → welcome → default location → team → theme → empty My bookings. First-time add booking opens as an overlay.",
  "18": "Populated My bookings with sidebar navigation — core tasks surfaced from the nav.",
  "19": "Daily booking timeline with desk, parking, and meeting cards. Overlay panels for add booking, details, and who's in.",
  "20-deck-day": "Office presence row on the daily timeline — avatars, occupancy, and View action.",
  "20-pod-cluster": "Floor plan pod cluster — colleague bookings on the plan.",
  "20-team-list": "Team filter list for presence and bookings.",
  "21": "Booking grid — desk availability by floor with date navigation.",
  "22": "Conference grid — room blocks, filters, and booking detail popovers.",
  "23": "Inbox — notifications list with detail overlay and optional popup stack.",
  "25-mobile":
    "Full mobile shell: onboarding, bookings, help, and hub menu.",
  "39": "Same-day lane — desk, room, parking, cab ranked with honest alternatives.",
  "40": "Check-in window for desk and linked cab — auto-release and strike pattern for repeat no-shows.",
  "41": "Move office cab pickup in add booking alongside desk — one confirmation path.",
  "44": "Office vs remote from commute time and calendar density.",
  "45": "Fair waitlist queue with auto-assign when no-show bookings clear.",
};

const FLOW_TAGS: Record<string, readonly string[]> = {
  "17": ["Journey", "Onboarding", "Add booking"],
  "18": ["Desktop", "Bookings"],
  "19": ["Desktop", "Bookings", "Overlays"],
  "21": ["Desktop", "Grid"],
  "22": ["Desktop", "Grid"],
  "23": ["Desktop", "Inbox"],
  "25-mobile": ["Journey", "Mobile"],
  "39": ["Future plan", "Desktop"],
  "40": ["Future plan", "Desktop"],
  "41": ["Future plan", "Desktop", "Add booking"],
  "44": ["Future plan", "Desktop"],
  "45": ["Future plan", "Desktop", "Inbox"],
};

function entryToFlow(entry: SaltmineSlideScreenEntry): SaltmineDevFlow {
  return {
    id: entry.slug,
    label: entry.label,
    description: FLOW_DESCRIPTIONS[entry.slug] ?? entry.label,
    devPath: getSaltmineSlideScreenPath(entry.slug),
    deckSlideId: DECK_SLIDE_ID_BY_SLUG[entry.slug],
    screenFile: entry.screenFile,
    configFile: entry.configFile,
    tags: FLOW_TAGS[entry.slug],
  };
}

const JOURNEY_SLUGS = new Set(["17", "25-mobile"]);
const COMPONENT_SLUGS = new Set(["20-deck-day", "20-pod-cluster", "20-team-list"]);
const DESKTOP_SLUGS = new Set(["18", "19", "21", "22", "23"]);

export const SALTMINE_OVERLAY_FLOWS: readonly SaltmineDevFlow[] = [
  {
    id: "overlay-add-booking",
    label: "Add booking",
    description:
      "Menu → pick resource → confirm → processing → success or conflict error. Desk, parking, meeting room, or team day.",
    devPath: getSaltmineSlideScreenPath("17"),
    deckSlideId: "slide-17",
    tags: ["Overlay", "Bookings"],
  },
  {
    id: "overlay-booking-detail",
    label: "Booking detail",
    description: "Tap a desk or meeting card on the timeline to open the detail overlay.",
    devPath: getSaltmineSlideScreenPath("19"),
    deckSlideId: "slide-19",
    tags: ["Overlay", "Bookings"],
  },
  {
    id: "overlay-whos-in",
    label: "Who's in",
    description: "View on a day row opens the office presence overlay with floor plan CTA.",
    devPath: getSaltmineSlideScreenPath("19"),
    deckSlideId: "slide-19",
    tags: ["Overlay", "Presence"],
  },
  {
    id: "overlay-inbox-detail",
    label: "Inbox detail",
    description: "Select a notification to open the detail overlay — accept, decline, or act.",
    devPath: getSaltmineSlideScreenPath("23"),
    deckSlideId: "slide-23",
    tags: ["Overlay", "Inbox"],
  },
] as const;

const FUTURE_UI_SLUG_BY_DECK_ID: Record<string, string> = {
  "slide-39": "39",
  "slide-40": "40",
  "slide-41": "41",
  "slide-44": "44",
  "slide-45": "45",
};

const FUTURE_PLAN_DESCRIPTIONS: Record<string, string> = {
  "slide-31": "Chapter opener — roadmap concepts not in the current product demo.",
  "slide-32": "Same-day office plan, last-minute window, and waitlist when desk, room, parking, or cab are full.",
  "slide-33": "No-shows and last-minute cancels — protect honest planners; desk and cab hold together.",
  "slide-34": "Book a Move office cab in the same flow as your desk — no separate travel app.",
  "slide-37": "Suggest office vs remote from calendar density and realistic travel time.",
  "slide-38": "Waitlist for preferred resources; notify when missed check-ins clear desks.",
  "slide-39": "Same-day lane — desk, room, parking, cab ranked with honest alternatives.",
  "slide-40": "Check-in window for desk and linked cab — auto-release and strike pattern for repeat no-shows.",
  "slide-41": "Move office cab pickup in add booking alongside desk — one confirmation path.",
  "slide-44": "Office vs remote from commute time and calendar density.",
  "slide-45": "Fair waitlist queue with auto-assign when no-show bookings clear.",
};

export const SALTMINE_FUTURE_PLAN_FLOWS: readonly SaltmineDevFlow[] = FUTURE_PLAN_SLIDES.map(
  (slide) => {
    const uiSlug = FUTURE_UI_SLUG_BY_DECK_ID[slide.id];
    const screenEntry = uiSlug
      ? SALTMINE_SLIDE_SCREENS.find((entry) => entry.slug === uiSlug)
      : undefined;

    return {
      id: slide.id,
      label: slide.label,
      description: FUTURE_PLAN_DESCRIPTIONS[slide.id] ?? slide.label,
      deckSlideId: slide.id,
      devPath: uiSlug ? getSaltmineSlideScreenPath(uiSlug) : undefined,
      screenFile: screenEntry?.screenFile,
      tags: uiSlug
        ? (FLOW_TAGS[uiSlug] ?? (["Future plan", "Desktop"] as const))
        : (["Future plan", "Deck only"] as const),
    };
  },
);

export const SALTMINE_DEV_FLOW_GROUPS: readonly SaltmineDevFlowGroup[] = [
  {
    id: "journeys",
    title: "End-to-end journeys",
    description: "Full flows a new user walks through — desktop onboarding and mobile app.",
    flows: SALTMINE_SLIDE_SCREENS.filter((entry) => JOURNEY_SLUGS.has(entry.slug)).map(
      entryToFlow,
    ),
  },
  {
    id: "desktop",
    title: "Desktop workspace",
    description:
      "Isolated 880×530 dashboard surfaces — each slide has its own screen file and config.",
    flows: SALTMINE_SLIDE_SCREENS.filter((entry) => DESKTOP_SLUGS.has(entry.slug)).map(
      entryToFlow,
    ),
  },
  {
    id: "components",
    title: "Office presence components",
    description: "Component crops used on the Office Presence deck slide.",
    flows: SALTMINE_SLIDE_SCREENS.filter((entry) => COMPONENT_SLUGS.has(entry.slug)).map(
      entryToFlow,
    ),
  },
  {
    id: "overlays",
    title: "Overlay panels",
    description:
      "Right-rail flows that open over the dashboard with a scrim — test inside the linked dev preview.",
    flows: SALTMINE_OVERLAY_FLOWS,
  },
  {
    id: "future-plan",
    title: "Future plan — deck concepts",
    description:
      "Problem/solution slides appended after the main Saltmine flow — not wired into the product demo.",
    flows: SALTMINE_FUTURE_PLAN_FLOWS,
  },
] as const;

export const SALTMINE_DEV_UTILITIES: readonly {
  label: string;
  description: string;
  href: string;
  file?: string;
}[] = [
  {
    label: "Dashboard copy & strings",
    description: "All user-visible Saltmine dashboard text, menu labels, and toast copy.",
    href: "/dev/saltmine-dashboard",
    file: "src/lib/saltmine-bookings-dashboard-content.ts",
  },
  {
    label: "Add booking flow data",
    description: "Desk, parking, room, and team day options plus simulated conflicts.",
    file: "src/lib/saltmine-deck-add-booking-flow-data.ts",
    href: getSaltmineSlideScreenPath("17"),
  },
] as const;
