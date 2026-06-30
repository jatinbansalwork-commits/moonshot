import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";

export type DeckAddBookingActionId =
  (typeof SALTMINE_BOOKINGS_DASHBOARD_CONTENT.addBookingMenuItems)[number]["id"];

export interface DeckAddBookingFlowOption {
  id: string;
  label: string;
  meta: string;
  available: boolean;
  /** When true, confirm step simulates a server-side booking conflict. */
  simulateFailure?: boolean;
  unavailableReason?: string;
}

export interface DeckAddBookingFlowConfig {
  pickTitle: string;
  confirmTitle: string;
  options: DeckAddBookingFlowOption[];
}

export const DECK_ADD_BOOKING_FLOW: Record<DeckAddBookingActionId, DeckAddBookingFlowConfig> =
  {
    desk: {
      pickTitle: "Pick a desk",
      confirmTitle: "Confirm desk",
      options: [
        {
          id: "desk-p32",
          label: "Desk 21.P3.2",
          meta: "Design pod · All day",
          available: true,
        },
        {
          id: "desk-e14",
          label: "Desk 21.E1.4",
          meta: "Engineering · Window seat",
          available: true,
          simulateFailure: true,
        },
        {
          id: "desk-n21",
          label: "Desk 21.N2.1",
          meta: "Quiet zone",
          available: false,
          unavailableReason: "Booked until 17:00",
        },
      ],
    },
    "car-parking": {
      pickTitle: "Pick a bay",
      confirmTitle: "Confirm parking",
      options: [
        {
          id: "park-b2113",
          label: "Car Park B2.113",
          meta: "Basement 2 · EV charger",
          available: true,
        },
        {
          id: "park-b2108",
          label: "Car Park B2.108",
          meta: "Basement 2 · Standard",
          available: true,
        },
        {
          id: "park-b2041",
          label: "Car Park B2.041",
          meta: "Basement 2 · Compact",
          available: false,
          unavailableReason: "Reserved for visitors",
        },
      ],
    },
    "meeting-space": {
      pickTitle: "Pick a room",
      confirmTitle: "Confirm room",
      options: [
        {
          id: "room-conf-a",
          label: "Conf Room A",
          meta: "10 seats · Floor 21",
          available: true,
        },
        {
          id: "room-m-c2",
          label: "M-C2",
          meta: "6 seats · Engineering",
          available: true,
          simulateFailure: true,
        },
        {
          id: "room-board",
          label: "Boardroom 3",
          meta: "18 seats · Floor 22",
          available: false,
          unavailableReason: "Maintenance until 14:00",
        },
      ],
    },
    "team-day": {
      pickTitle: "Pick a team",
      confirmTitle: "Confirm team day",
      options: [
        {
          id: "team-design",
          label: "London Design",
          meta: "8 members · Floor 21",
          available: true,
        },
        {
          id: "team-product",
          label: "Product",
          meta: "12 members · Floor 21",
          available: true,
        },
        {
          id: "team-sales",
          label: "Sales",
          meta: "6 members · Floor 20",
          available: false,
          unavailableReason: "Team day already scheduled",
        },
      ],
    },
  };

export function getDeckAddBookingResultLabel(
  actionId: DeckAddBookingActionId,
  optionLabel: string,
): string {
  switch (actionId) {
    case "desk":
      return optionLabel;
    case "car-parking":
      return optionLabel;
    case "meeting-space":
      return `Meeting — ${optionLabel}`;
    case "team-day":
      return `Team day — ${optionLabel}`;
    default:
      return optionLabel;
  }
}
