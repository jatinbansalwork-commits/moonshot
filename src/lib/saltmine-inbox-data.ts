/**
 * Inbox notification demo data — slide 18.
 */

export type InboxNotificationKind = "arrival" | "invite" | "check-in" | "booking";

export interface InboxNotificationField {
  label: string;
  value: string;
}

export interface InboxNotification {
  id: string;
  kind: InboxNotificationKind;
  title: string;
  subtitle: string;
  unread: boolean;
  typeLabel: string;
  detailSummary: string;
  detailFields: readonly InboxNotificationField[];
  primaryAction?: string;
  secondaryAction?: string;
  avatar?: {
    initials: string;
    color: string;
    name?: string;
  };
}

export const INBOX_SHOW_OPTIONS = ["Latest", "Archive"] as const;
export const INBOX_FILTER_OPTIONS = [
  "Show all",
  "Invites",
  "Check-ins",
  "Bookings",
] as const;

export const INBOX_NOTIFICATIONS: readonly InboxNotification[] = [
  {
    id: "arrival-dw",
    kind: "arrival",
    typeLabel: "Arrival",
    title: "Daniel Waters is here",
    subtitle: "Design Review • 14:00",
    unread: true,
    detailSummary:
      "Daniel Waters has checked in on Floor 21 for your Design Review meeting.",
    detailFields: [
      { label: "When", value: "Today, 14:00" },
      { label: "Where", value: "Meeting Room 21.12" },
      { label: "Office", value: "St Mary Axe" },
      { label: "Meeting", value: "Design Review" },
    ],
    primaryAction: "Open meeting",
    avatar: { initials: "DW", color: "#637381", name: "Daniel Waters" },
  },
  {
    id: "invite-team-day-1",
    kind: "invite",
    typeLabel: "Invite",
    title: "Invite to \"Team day\"",
    subtitle: "Mon 6 Mar",
    unread: true,
    detailSummary:
      "Sarah Chen invited you to join Project Sync for an in-office team day.",
    detailFields: [
      { label: "Event", value: "Team day" },
      { label: "Date", value: "Mon 6 Mar" },
      { label: "Office", value: "St Mary Axe, Floor 21" },
      { label: "Invited by", value: "Sarah Chen" },
    ],
    primaryAction: "Accept",
    secondaryAction: "Decline",
    avatar: { initials: "S", color: "#4D9BF7", name: "Sarah Chen" },
  },
  {
    id: "check-in-parking",
    kind: "check-in",
    typeLabel: "Check-in",
    title: "Checked in",
    subtitle: "Car Parking B2.117",
    unread: false,
    detailSummary: "You checked in to your reserved parking space this morning.",
    detailFields: [
      { label: "Space", value: "Car Parking B2.117" },
      { label: "Checked in", value: "09:02 AM" },
      { label: "Location", value: "Basement 2" },
      { label: "Duration", value: "All day" },
    ],
    primaryAction: "View on floor plan",
  },
  {
    id: "check-in-desk",
    kind: "check-in",
    typeLabel: "Check-in",
    title: "Checked in",
    subtitle: "Desk 21.P2.8",
    unread: false,
    detailSummary: "You are checked in at your desk for the rest of the day.",
    detailFields: [
      { label: "Desk", value: "21.P2.8" },
      { label: "Checked in", value: "09:04 AM" },
      { label: "Floor", value: "Floor 21" },
      { label: "Office", value: "St Mary Axe" },
    ],
    primaryAction: "View on floor plan",
  },
  {
    id: "booking-desk",
    kind: "booking",
    typeLabel: "Booking",
    title: "You booked Desk 21.P8.1",
    subtitle: "Mon 6 Mar",
    unread: false,
    detailSummary: "Your desk booking is confirmed for Monday at St Mary Axe.",
    detailFields: [
      { label: "Desk", value: "21.P8.1" },
      { label: "Date", value: "Mon 6 Mar" },
      { label: "Time", value: "09:00 AM – All day" },
      { label: "Floor", value: "Floor 21" },
    ],
    primaryAction: "View booking",
  },
  {
    id: "invite-team-day-2",
    kind: "invite",
    typeLabel: "Invite",
    title: "Invite to \"Team day\"",
    subtitle: "Thu 9 Mar",
    unread: true,
    detailSummary:
      "Arlene McCoy invited you to join Design Team for an in-office team day.",
    detailFields: [
      { label: "Event", value: "Team day" },
      { label: "Date", value: "Thu 9 Mar" },
      { label: "Office", value: "St Mary Axe, Floor 21" },
      { label: "Invited by", value: "Arlene McCoy" },
    ],
    primaryAction: "Accept",
    secondaryAction: "Decline",
    avatar: { initials: "A", color: "#22C55E", name: "Arlene McCoy" },
  },
];

export function getInboxNotificationById(id: string | null): InboxNotification | null {
  if (!id) return null;
  return INBOX_NOTIFICATIONS.find((item) => item.id === id) ?? null;
}

export function filterInboxNotifications(
  notifications: readonly InboxNotification[],
  show: string,
  filter: string,
): InboxNotification[] {
  let items = [...notifications];

  if (show === "Archive") {
    items = items.filter((item) => !item.unread);
  }

  if (filter === "Invites") {
    items = items.filter((item) => item.kind === "invite" || item.kind === "arrival");
  } else if (filter === "Check-ins") {
    items = items.filter((item) => item.kind === "check-in");
  } else if (filter === "Bookings") {
    items = items.filter((item) => item.kind === "booking");
  }

  return items;
}
