import {
  Bell,
  CalendarDays,
  LampDesk,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SALTMINE_MOBILE_TABS = [
  { id: "bookings", label: "My bookings", icon: CalendarDays },
  { id: "find", label: "Find a space", icon: LampDesk },
  { id: "inbox", label: "Inbox", icon: Bell },
  { id: "teams", label: "My teams", icon: Users },
] as const;

export type SaltmineMobileTabId = (typeof SALTMINE_MOBILE_TABS)[number]["id"];

/** Secondary flows reachable from the hub / profile menu (desktop sidebar parity). */
export type SaltmineMobileOverlayRoute =
  | "booking-grid"
  | "conference-grid"
  | "help"
  | "profile";

export const SALTMINE_MOBILE_HUB_ITEMS: readonly {
  id: SaltmineMobileOverlayRoute;
  label: string;
}[] = [
  { id: "booking-grid", label: "Booking grid" },
  { id: "conference-grid", label: "Conference grid" },
  { id: "help", label: "Help & support" },
  { id: "profile", label: "Profile & settings" },
];

export const SALTMINE_MOBILE_TAB_BY_ID = Object.fromEntries(
  SALTMINE_MOBILE_TABS.map((tab) => [tab.id, tab]),
) as Record<SaltmineMobileTabId, (typeof SALTMINE_MOBILE_TABS)[number] & { icon: LucideIcon }>;

/** Comfortable tap targets for bottom tab bar (44px min per tab). */
export const SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT = 56;
export const SALTMINE_MOBILE_STATUS_BAR_HEIGHT = 28;

export type SaltmineMobileBookingsViewMode = "Daily" | "Weekly" | "Monthly";

export const SALTMINE_MOBILE_BOOKINGS_VIEW_MODES = [
  "Daily",
  "Weekly",
  "Monthly",
] as const satisfies readonly SaltmineMobileBookingsViewMode[];
