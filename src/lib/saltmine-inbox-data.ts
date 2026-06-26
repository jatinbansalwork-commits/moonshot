/**
 * Inbox notification demo data — slide 23.
 */

import { SALTMINE_DEMO_USER, getSaltmineDemoMemberName } from "@/lib/saltmine-demo-personas";

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
  /** Mobile inbox list — relative timestamp label (e.g. "5m ago"). */
  relativeTime?: string;
  avatar?: {
    initials: string;
    color: string;
    name?: string;
    memberId?: string;
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
    title: "Arjun Mehta is here",
    subtitle: "Design Review • 14:00",
    unread: true,
    detailSummary:
      "Arjun Mehta has checked in on Floor 21 for your Design Review meeting.",
    detailFields: [
      { label: "When", value: "Today, 14:00" },
      { label: "Where", value: "Meeting Room 21.12" },
      { label: "Office", value: "St Mary Axe" },
      { label: "Meeting", value: "Design Review" },
    ],
    primaryAction: "Open meeting",
    relativeTime: "5m ago",
    avatar: { initials: "A", color: "#637381", name: "Arjun Mehta", memberId: "ww" },
  },
  {
    id: "invite-team-day-1",
    kind: "invite",
    typeLabel: "Invite",
    title: "Invite to \"Team day\"",
    subtitle: "Mon 6 Mar",
    unread: true,
    detailSummary:
      "Neha Gupta invited you to join Project Sync for an in-office team day.",
    detailFields: [
      { label: "Event", value: "Team day" },
      { label: "Date", value: "Mon 6 Mar" },
      { label: "Office", value: "St Mary Axe, Floor 21" },
      { label: "Invited by", value: "Neha Gupta" },
    ],
    primaryAction: "Accept",
    secondaryAction: "Decline",
    relativeTime: "10m ago",
    avatar: { initials: "N", color: "#4D9BF7", name: "Neha Gupta", memberId: "sc" },
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
    relativeTime: "1h ago",
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
    relativeTime: "1h ago",
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
    avatar: {
      initials: "R",
      color: "#4D9BF7",
      name: SALTMINE_DEMO_USER.name,
      memberId: SALTMINE_DEMO_USER.id,
    },
  },
  {
    id: "invite-team-day-2",
    kind: "invite",
    typeLabel: "Invite",
    title: "Invite to \"Team day\"",
    subtitle: "Thu 9 Mar",
    unread: true,
    detailSummary:
      "Amit Singh invited you to join Design Team for an in-office team day.",
    detailFields: [
      { label: "Event", value: "Team day" },
      { label: "Date", value: "Thu 9 Mar" },
      { label: "Office", value: "St Mary Axe, Floor 21" },
      { label: "Invited by", value: "Amit Singh" },
    ],
    primaryAction: "Accept",
    secondaryAction: "Decline",
    avatar: { initials: "A", color: "#22C55E", name: "Amit Singh", memberId: "am" },
  },
];

export const INBOX_NOTIFICATION_POPUP_TIME = "10:21";
export const INBOX_NOTIFICATION_POPUP_FEATURED_ID = "booking-desk";

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

/** Resolve display name for inbox avatars when only memberId is stored. */
export function inboxAvatarName(memberId?: string, fallback?: string): string | undefined {
  return getSaltmineDemoMemberName(memberId) ?? fallback;
}
