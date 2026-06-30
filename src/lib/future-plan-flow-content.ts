/** UX copy and journey metadata for future-plan deck flows (slides 39–45). */

export type FuturePlanFlowId =
  | "last-minute"
  | "safety-booking"
  | "cab-booking"
  | "false-booking"
  | "recurring"
  | "commute"
  | "waitlist";

export interface FuturePlanMetric {
  label: string;
  value: string;
  tone?: "neutral" | "brand" | "warning" | "success" | "danger";
}

export interface FuturePlanStepCopy {
  id: string;
  breadcrumb: string;
  stepLabel: string;
  title: string;
  body: string;
  entryContext?: string;
  metrics?: FuturePlanMetric[];
  primaryCta?: string;
  secondaryCta?: string;
}

export interface FuturePlanFlowCopy {
  id: FuturePlanFlowId;
  featureName: string;
  deckHeading: string;
  deckBody: string;
  successTitle: string;
  successBody: string;
  successSummary: string[];
  steps: FuturePlanStepCopy[];
}

export const FUTURE_PLAN_FLOWS: Record<FuturePlanFlowId, FuturePlanFlowCopy> = {
  "last-minute": {
    id: "last-minute",
    featureName: "Last-minute plan",
    deckHeading: "Last-minute lane",
    deckBody:
      "See what you can still book today — desk, room, parking, or cab — with a waitlist and honest options when the office is full.",
    successTitle: "You are set for today",
    successBody: "Pod B is booked and your pod knows you are inbound before 10:00.",
    successSummary: [
      "Meeting room · Pod B · 09:30–12:00",
      "Waitlist · Desk 4B · position #2",
      "Teammates notified · Design pod",
    ],
    steps: [
      {
        id: "entry",
        breadcrumb: "Entry",
        stepLabel: "Step 1 of 4",
        title: "Coming in today?",
        body: "You opened the last-minute lane from today's timeline — we will rank what you can still book before your first meeting.",
        entryContext: "My bookings › Today › Coming in today?",
        metrics: [
          { label: "First meeting", value: "09:30", tone: "brand" },
          { label: "Window closes", value: "10:00", tone: "warning" },
          { label: "Office load", value: "94%", tone: "danger" },
        ],
        primaryCta: "See what is left",
      },
      {
        id: "inventory",
        breadcrumb: "Availability",
        stepLabel: "Step 2 of 4",
        title: "What is still possible",
        body: "Desk and parking are full. Pod B has one slot left — cab fleet is at capacity for your window.",
        metrics: [
          { label: "Desks", value: "0 free", tone: "danger" },
          { label: "Pods", value: "1 left", tone: "warning" },
          { label: "Parking", value: "0 bays", tone: "danger" },
        ],
        primaryCta: "Book Pod B",
        secondaryCta: "Join desk waitlist",
      },
      {
        id: "waitlist",
        breadcrumb: "Waitlist",
        stepLabel: "Step 3 of 4",
        title: "Join the desk waitlist",
        body: "You are #2 for Desk 4B. We will auto-assign if someone releases or misses check-in — Pod B stays held meanwhile.",
        metrics: [
          { label: "Queue", value: "#2", tone: "brand" },
          { label: "Est. release", value: "09:45", tone: "warning" },
          { label: "Fair queue", value: "On", tone: "success" },
        ],
        primaryCta: "Confirm waitlist",
        secondaryCta: "Notify teammates",
      },
      {
        id: "confirm",
        breadcrumb: "Confirm",
        stepLabel: "Step 4 of 4",
        title: "Confirm your day plan",
        body: "Review Pod B, waitlist position, and let Design pod know you are inbound — all before the 10:00 window closes.",
        metrics: [
          { label: "Pod B", value: "Held", tone: "success" },
          { label: "Desk waitlist", value: "#2", tone: "brand" },
          { label: "Notify pod", value: "Ready", tone: "neutral" },
        ],
        primaryCta: "Confirm day plan",
      },
    ],
  },
  "safety-booking": {
    id: "safety-booking",
    featureName: "Safety booking",
    deckHeading: "Safety booking",
    deckBody:
      "Check-in window for desk and linked cab — auto-release both if you do not confirm, with a strike pattern that protects honest planners.",
    successTitle: "Checked in — trip secured",
    successBody: "Desk 4B and your 08:15 cab are confirmed until 18:00. Your reliability score stays good.",
    successSummary: [
      "Desk 4B · Floor 3 · checked in 08:52",
      "Cab pickup 08:15 · corporate account",
      "Auto-release cancelled",
      "Reliability score · Good",
    ],
    steps: [
      {
        id: "reminder",
        breadcrumb: "Reminder",
        stepLabel: "Step 1 of 4",
        title: "Check in to keep your trip",
        body: "You booked Desk 4B and cab pickup at 08:15. Confirm by 09:30 or both return to the pool for same-day planners.",
        entryContext: "Inbox › Check-in reminder · Desk 4B",
        metrics: [
          { label: "Check-in by", value: "09:30", tone: "warning" },
          { label: "Time left", value: "38 min", tone: "brand" },
          { label: "Hold type", value: "Safety", tone: "neutral" },
        ],
        primaryCta: "Check in now",
        secondaryCta: "Release early",
      },
      {
        id: "checkin",
        breadcrumb: "Check in",
        stepLabel: "Step 2 of 4",
        title: "Confirm you are on your way",
        body: "One tap confirms intent. We will not release your desk or cancel your cab while you are in transit.",
        metrics: [
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "ETA", value: "~09:10", tone: "success" },
          { label: "Strikes", value: "2 of 3", tone: "warning" },
        ],
        primaryCta: "Confirm arrival",
      },
      {
        id: "strikes",
        breadcrumb: "Reliability",
        stepLabel: "Step 3 of 4",
        title: "Your reliability profile",
        body: "Two missed check-ins in 90 days. Release early when plans change to earn priority — one more miss triggers a 7-day hold.",
        metrics: [
          { label: "Score", value: "Good", tone: "success" },
          { label: "Early releases", value: "3", tone: "brand" },
          { label: "Next strike", value: "7-day hold", tone: "danger" },
        ],
        primaryCta: "Continue check-in",
      },
      {
        id: "done",
        breadcrumb: "Confirmed",
        stepLabel: "Step 4 of 4",
        title: "Desk and cab held until end of day",
        body: "Check-in recorded. Auto-release is off — your cab and desk stay linked unless you release them.",
        metrics: [
          { label: "Status", value: "Checked in", tone: "success" },
          { label: "Valid until", value: "18:00", tone: "neutral" },
          { label: "Waitlist", value: "Notified", tone: "brand" },
        ],
        primaryCta: "Finish",
      },
    ],
  },
  "cab-booking": {
    id: "cab-booking",
    featureName: "Move",
    deckHeading: "Move in Sync",
    deckBody:
      "Book your desk and a Move office cab in one flow — pickup time suggested from your commute and first meeting.",
    successTitle: "Day plan confirmed",
    successBody: "Desk and Move pickup are on your timeline — one receipt, one cancellation path.",
    successSummary: [
      "Desk 4B · Floor 3",
      "Move pickup 08:15 · office fleet",
    ],
    steps: [
      {
        id: "desk",
        breadcrumb: "Desk",
        stepLabel: "Step 1 of 3",
        title: "Choose your desk",
        body: "You started Add booking from today — pick a desk, then add a Move pickup in the same panel.",
        entryContext: "My bookings › Today › Add booking",
        metrics: [
          { label: "Floor", value: "3", tone: "neutral" },
          { label: "Desks free", value: "6", tone: "success" },
          { label: "First meeting", value: "09:30", tone: "brand" },
        ],
        primaryCta: "Select Desk 4B",
      },
      {
        id: "cab",
        breadcrumb: "Move",
        stepLabel: "Step 2 of 3",
        title: "Add Move pickup",
        body: "Suggested 08:15 matches your commute and first meeting. Office fleet and policy checks passed.",
        metrics: [
          { label: "Pickup", value: "08:15", tone: "brand" },
          { label: "Route", value: "Home → HQ", tone: "neutral" },
          { label: "Fleet", value: "Move", tone: "success" },
        ],
        primaryCta: "Select pickup time",
      },
      {
        id: "confirm",
        breadcrumb: "Confirm",
        stepLabel: "Step 3 of 3",
        title: "One confirmation",
        body: "Desk and Move pickup stay linked — cancel or change your desk and the pickup updates too.",
        metrics: [
          { label: "Items", value: "2", tone: "brand" },
          { label: "ETA office", value: "09:05", tone: "success" },
          { label: "Policy", value: "Passed", tone: "success" },
        ],
        primaryCta: "Confirm all",
      },
    ],
  },
  "false-booking": {
    id: "false-booking",
    featureName: "Desk check",
    deckHeading: "Desk check",
    deckBody:
      "Calendar went remote — desk on tentative hold with auto-release. Release the desk or confirm you are still coming in.",
    successTitle: "Desk released",
    successBody: "Desk 4B is back in the pool — a colleague on the waitlist has been offered it.",
    successSummary: [
      "Desk 4B · released",
      "Trigger · stand-up moved remote",
      "Waitlist · colleague notified",
    ],
    steps: [
      {
        id: "signal",
        breadcrumb: "Signal",
        stepLabel: "Step 1 of 3",
        title: "Still coming in?",
        body: "Your 10:00 stand-up moved to remote — we no longer assume you need a desk all day. Desk 4B is on a tentative hold.",
        entryContext: "My bookings › Calendar change",
        metrics: [
          { label: "Trigger", value: "Stand-up → Remote", tone: "brand" },
          { label: "Hold", value: "Tentative", tone: "warning" },
          { label: "Auto-release", value: "3h 20m", tone: "warning" },
        ],
        primaryCta: "Release desk",
        secondaryCta: "I'm still coming in",
      },
      {
        id: "confirm",
        breadcrumb: "Confirm",
        stepLabel: "Step 2 of 3",
        title: "Release Desk 4B?",
        body: "Someone on the waitlist can use it. You earn +1 priority for an honest release.",
        metrics: [
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Hold", value: "Tentative", tone: "warning" },
          { label: "Waitlist", value: "1 person", tone: "neutral" },
        ],
        primaryCta: "Confirm release",
        secondaryCta: "Back",
      },
      {
        id: "released",
        breadcrumb: "Released",
        stepLabel: "Step 3 of 3",
        title: "Desk released",
        body: "Desk 4B is back in the pool — a colleague on the waitlist has been offered it.",
        metrics: [
          { label: "Released", value: "Yes", tone: "success" },
          { label: "Priority", value: "+1", tone: "brand" },
          { label: "Waitlist", value: "Notified", tone: "success" },
        ],
        primaryCta: "Done",
      },
    ],
  },
  recurring: {
    id: "recurring",
    featureName: "Repeat booking",
    deckHeading: "Repeat weekly",
    deckBody:
      "Pattern picker for desk and parking — skip holidays, edit one week, pause when OOO is detected on calendar.",
    successTitle: "Series saved",
    successBody: "Every Tuesday and Thursday until 31 Aug — holidays and your OOO week skipped automatically.",
    successSummary: [
      "Desk 4B · Tue & Thu",
      "Parking B2-14 · linked",
      "12 occurrences · 1 skipped (bank holiday)",
    ],
    steps: [
      {
        id: "pattern",
        breadcrumb: "Pattern",
        stepLabel: "Step 1 of 4",
        title: "Set your weekly rhythm",
        body: "You opened Repeat booking from Desk 4B — pick the days you usually come in.",
        entryContext: "My bookings › Desk 4B › Repeat weekly",
        metrics: [
          { label: "Days", value: "Tue, Thu", tone: "brand" },
          { label: "Skip holidays", value: "On", tone: "success" },
          { label: "Skip OOO", value: "On", tone: "success" },
        ],
        primaryCta: "Next",
      },
      {
        id: "resources",
        breadcrumb: "Resources",
        stepLabel: "Step 2 of 4",
        title: "Link desk and parking",
        body: "Same desk each week — add parking on the same pattern or book desk only.",
        metrics: [
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Parking", value: "B2-14", tone: "neutral" },
          { label: "Team day", value: "Optional", tone: "neutral" },
        ],
        primaryCta: "Link parking",
      },
      {
        id: "preview",
        breadcrumb: "Preview",
        stepLabel: "Step 3 of 4",
        title: "Preview the series",
        body: "Tue 8 Jul skipped — bank holiday. OOO 14–18 Jul pauses the series without cancelling future Tuesdays.",
        metrics: [
          { label: "Occurrences", value: "12", tone: "brand" },
          { label: "Skipped", value: "1", tone: "warning" },
          { label: "Ends", value: "31 Aug", tone: "neutral" },
        ],
        primaryCta: "Review",
      },
      {
        id: "save",
        breadcrumb: "Save",
        stepLabel: "Step 4 of 4",
        title: "Save the series",
        body: "Edit one week anytime — changes do not cancel the whole series unless you choose to.",
        metrics: [
          { label: "Pattern", value: "Tue/Thu", tone: "brand" },
          { label: "Resources", value: "2", tone: "success" },
          { label: "Notifications", value: "Weekly", tone: "neutral" },
        ],
        primaryCta: "Save series",
      },
    ],
  },
  commute: {
    id: "commute",
    featureName: "Plan your day",
    deckHeading: "Commute sync",
    deckBody:
      "Office vs remote recommendation from live traffic and calendar density — after desk and parking are already booked.",
    successTitle: "Remote morning set",
    successBody:
      "You will be on time for 09:30. Desk and bay released — we will suggest office again if your afternoon clears.",
    successSummary: [
      "Remote · until 13:00",
      "Desk + parking · released",
      "Teammates · can book freed space",
    ],
    steps: [
      {
        id: "signal",
        breadcrumb: "Signals",
        stepLabel: "Step 1 of 4",
        title: "Should you come in?",
        body: "You are booked for today — we compared live commute time against your 09:30 first call.",
        entryContext: "My bookings › Plan your day",
        metrics: [
          { label: "Commute", value: "75 min", tone: "warning" },
          { label: "Meetings AM", value: "3", tone: "brand" },
          { label: "First call", value: "09:30", tone: "neutral" },
        ],
        primaryCta: "See recommendation",
      },
      {
        id: "compare",
        breadcrumb: "Compare",
        stepLabel: "Step 2 of 4",
        title: "Office vs remote",
        body: "Office arrival ~10:15 misses your first meeting. Remote keeps you on time — office afternoon still possible.",
        metrics: [
          { label: "Office ETA", value: "10:15", tone: "danger" },
          { label: "Remote", value: "On time", tone: "success" },
          { label: "Site", value: "HQ only", tone: "neutral" },
        ],
        primaryCta: "Work remote AM",
        secondaryCta: "Keep my desk",
      },
      {
        id: "travel",
        breadcrumb: "Travel",
        stepLabel: "Step 3 of 4",
        title: "Travel detail",
        body: "If you choose office later, cab pickup at 08:15 is ready — policy check passed.",
        metrics: [
          { label: "Leave by", value: "08:45", tone: "warning" },
          { label: "Cab", value: "Optional", tone: "brand" },
          { label: "Slip alert", value: "On", tone: "success" },
        ],
        primaryCta: "Set remote AM",
      },
      {
        id: "set",
        breadcrumb: "Confirm",
        stepLabel: "Step 4 of 4",
        title: "Confirm your day shape",
        body: "Remote until lunch — we will nudge if an afternoon in-office window opens.",
        metrics: [
          { label: "Mode", value: "Remote AM", tone: "success" },
          { label: "Desk", value: "Not held", tone: "neutral" },
          { label: "ETA alert", value: "10:00", tone: "brand" },
        ],
        primaryCta: "Confirm plan",
      },
    ],
  },
  waitlist: {
    id: "waitlist",
    featureName: "Waitlist",
    deckHeading: "Waitlist and smart release",
    deckBody:
      "Fair queue for a preferred desk — auto-assign when a no-show clears, with alternatives while you wait.",
    successTitle: "Desk 4B assigned",
    successBody: "Accepted from the queue — missed check-in cleared at 09:35. Hot-desk fallback released.",
    successSummary: [
      "Desk 4B · Floor 3 · from waitlist",
      "Queue wait · 47 min",
      "Auto-release · 09:35",
    ],
    steps: [
      {
        id: "join",
        breadcrumb: "Join",
        stepLabel: "Step 1 of 4",
        title: "Join the waitlist",
        body: "Desk 4B is your preferred spot — join the queue and we will offer alternatives while you wait.",
        entryContext: "Booking grid › Desk 4B › Join waitlist",
        metrics: [
          { label: "Desk", value: "4B", tone: "brand" },
          { label: "Status", value: "Taken", tone: "danger" },
          { label: "Queue", value: "3 people", tone: "warning" },
        ],
        primaryCta: "Join waitlist",
      },
      {
        id: "queue",
        breadcrumb: "Queue",
        stepLabel: "Step 2 of 4",
        title: "Your place in line",
        body: "You are #2 — fair queue, not first to refresh. Pod C is a fallback while you wait.",
        metrics: [
          { label: "Position", value: "#2", tone: "brand" },
          { label: "Ahead", value: "1 person", tone: "neutral" },
          { label: "Fallback", value: "Pod C", tone: "success" },
        ],
        primaryCta: "Book fallback",
        secondaryCta: "Stay in queue",
      },
      {
        id: "offer",
        breadcrumb: "Offer",
        stepLabel: "Step 3 of 4",
        title: "Desk freed — your turn",
        body: "Desk missed check-in. Auto-assign in 4:58 unless you decline — nearby hot-desks still available.",
        metrics: [
          { label: "Source", value: "Auto-release", tone: "warning" },
          { label: "Timer", value: "4:58", tone: "brand" },
          { label: "Desk", value: "4B", tone: "success" },
        ],
        primaryCta: "Accept desk",
        secondaryCta: "Stay on waitlist",
      },
      {
        id: "assigned",
        breadcrumb: "Assigned",
        stepLabel: "Step 4 of 4",
        title: "Desk confirmed",
        body: "Desk 4B is on your timeline. Fallback booking released — no double booking.",
        metrics: [
          { label: "Desk", value: "4B", tone: "success" },
          { label: "Wait", value: "47 min", tone: "neutral" },
          { label: "Fallback", value: "Released", tone: "brand" },
        ],
        primaryCta: "View booking",
      },
    ],
  },
};
