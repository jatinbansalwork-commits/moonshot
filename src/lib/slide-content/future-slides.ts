import type { SlideDefinition } from "@/types/slide-content";
import { INDEX_SLIDE_DEFAULT_TITLE } from "@/lib/index-typography";
import { FUTURE_UI_SLIDE_BY_CONCEPT } from "@/lib/slide-content/future-ui-slides";

const FUTURE_BG = "#EEF2F8";

/** Future roadmap concept slides — problem/solution pairs before each UI mock. */
export const FUTURE_PLAN_CONCEPT_SLIDES: SlideDefinition[] = [
  {
    id: "slide-31",
    label: "Future plan",
    backgroundColor: FUTURE_BG,
    presentation: { rhythm: "hero", sectionLabel: "Future plan" },
    align: "center",
    blockGap: "gap-8",
    blocks: [
      {
        id: "slide-31-title",
        type: "title",
        text: "What we are thinking about next",
        textCase: "preserve",
        fontSize: 52,
        typography: INDEX_SLIDE_DEFAULT_TITLE,
        className: "index-slide-about-body !font-normal !leading-snug",
      },
      {
        id: "slide-31-body",
        type: "body",
        text: "Ideas we are exploring next — booking on the day, fair rules, and smarter commute choices. Not in the product demo yet.",
        textCase: "preserve",
        fontSize: 22,
        className: "index-slide-about-body max-w-3xl !leading-snug text-[#637381]",
      },
    ],
  },
  {
    id: "slide-32",
    label: "Last-minute plan",
    backgroundColor: "#F2F0F6",
    presentation: { rhythm: "narrative", sectionLabel: "Future plan" },
    layout: "saltmine-problem",
    problemSplit: {
      leftLabel: "The problem",
      leftStatement: "You decide to come in today — but the office is already full.",
      leftLabelBelow:
        "No desk, no room, no parking, no cab — and no queue when plans change on the morning.",
      leftStatementMaxWidth: "max-w-lg",
      rightLabel: "A last-minute lane could offer:",
      rightLabelBold: true,
      rightBullets: [
        "Space held for people booking on the day — not only planners who booked ahead",
        "A short window to grab a freed desk before you arrive",
        "One screen showing desk, room, parking, and cab — what is still open",
        "A waitlist when full — we tell you when someone cancels or does not show up",
        "A clear “nothing left” with options — another site, work from home, or try tomorrow",
        "Tell your team you are on your way so they can make room",
      ],
    },
    blocks: [],
  },
  {
    id: "slide-33",
    label: "No-show bookings",
    backgroundColor: "#F2F0F6",
    presentation: { rhythm: "narrative", sectionLabel: "Future plan" },
    layout: "saltmine-problem",
    problemSplit: {
      leftLabel: "Unfair waste",
      leftStatement: "Booked a desk — but never came in. Cancelled five minutes before start.",
      leftLabelBelow:
        "No-shows waste desks and cabs — and hurt people who book honestly and cancel when plans change.",
      leftStatementMaxWidth: "max-w-lg",
      rightLabel: "Safety booking could mean:",
      rightLabelBold: true,
      rightBullets: [
        "A check-in window — desk and cab stay held until you say you are on your way",
        "Auto-release desk and cancel cab if you do not check in",
        "A warning system for repeat no-shows — soft limits before hard blocks",
        "Extra credit for people who release early when plans change",
      ],
    },
    blocks: [],
  },
  {
    id: "slide-34",
    label: "Move office cab",
    backgroundColor: "#F2F0F6",
    presentation: { rhythm: "narrative", sectionLabel: "Future plan" },
    layout: "saltmine-problem",
    problemSplit: {
      leftLabel: "Split apps",
      leftStatement: "Desk booked in Sync. Move cab booked in another app.",
      leftLabelBelow:
        "Move is the office cab service — if you do not drive, that trip should live in the same place as your desk.",
      leftStatementMaxWidth: "max-w-lg",
      rightLabel: "Move in Sync:",
      rightLabelBold: true,
      rightBullets: [
        "Book a Move pickup when you book your desk — one confirmation",
        "Suggested pickup time based on your commute and first meeting",
        "Office fleet and company policy checked before you confirm",
        "Change or cancel Move when your desk booking moves or cancels",
      ],
    },
    blocks: [],
  },
  {
    id: "slide-37",
    label: "Commute-aware planning",
    backgroundColor: "#F2F0F6",
    presentation: { rhythm: "narrative", sectionLabel: "Future plan" },
    layout: "saltmine-problem",
    problemSplit: {
      leftLabel: "Travel blind spot",
      leftStatement: "You booked a desk — but the trip does not fit your first meeting.",
      leftLabelBelow:
        "Office days go wrong when travel time and delays are ignored until it is too late.",
      leftStatementMaxWidth: "max-w-lg",
      rightLabel: "Commute help:",
      rightLabelBold: true,
      rightBullets: [
        "Suggest office or home based on your calendar and travel time",
        "Show which site you can reach before you book a desk",
        "Link cab or parking to a realistic arrival time",
        "Warn your team if you are running late — before the meeting starts",
      ],
    },
    blocks: [],
  },
  {
    id: "slide-38",
    label: "Waitlist and smart release",
    backgroundColor: "#F2F0F6",
    presentation: { rhythm: "narrative", sectionLabel: "Future plan" },
    layout: "saltmine-problem",
    problemSplit: {
      leftLabel: "Fully booked",
      leftStatement: "Your desk is taken — you give up or book somewhere you do not want.",
      leftLabelBelow:
        "Without a waitlist, a freed desk never reaches the person who wanted it an hour ago.",
      leftStatementMaxWidth: "max-w-lg",
      rightLabel: "Waitlist and release:",
      rightLabelBold: true,
      rightBullets: [
        "Join a waitlist for desk, room, or parking — get it when someone cancels",
        "Get notified when a missed check-in frees a desk",
        "See nearby options while you wait — another floor, pod, or hot desk",
        "A fair queue — not whoever refreshes the page first",
      ],
    },
    blocks: [],
  },
];

/** Concept then UI — interleaved after slide 31 opener (slides 32→39, 33→40, 34→41, 37→44, 38→45). */
export const FUTURE_PLAN_SLIDES: SlideDefinition[] = FUTURE_PLAN_CONCEPT_SLIDES.flatMap(
  (slide) => {
    const ui = FUTURE_UI_SLIDE_BY_CONCEPT[slide.id];
    return ui ? [slide, ui] : [slide];
  },
);
