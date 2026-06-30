import {
  Bell,
  CalendarDays,
  LampDesk,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SALTMINE_MOBILE_TABS = [
  { id: "bookings", label: "My bookings", icon: CalendarDays },
  { id: "find", label: "Find a space", icon: LampDesk, disabled: true },
  { id: "inbox", label: "Inbox", icon: Bell, disabled: true },
  { id: "teams", label: "My teams", icon: Users, disabled: true },
] as const;

export type SaltmineMobileTabId = (typeof SALTMINE_MOBILE_TABS)[number]["id"];

/** Hide bottom tab bar when a single tab would be pointless chrome. */
export const SALTMINE_MOBILE_TAB_BAR_VISIBLE = SALTMINE_MOBILE_TABS.length > 1;

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

export function isSaltmineMobileTabDisabled(tabId: SaltmineMobileTabId): boolean {
  const tab = SALTMINE_MOBILE_TAB_BY_ID[tabId];
  return "disabled" in tab && tab.disabled === true;
}

/** Comfortable tap targets for bottom tab bar (44px min per tab). */
export const SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT = 56;
export const SALTMINE_MOBILE_STATUS_BAR_HEIGHT = 28;

export type SaltmineMobileBookingsViewMode = "Daily" | "Weekly" | "Monthly";

export const SALTMINE_MOBILE_BOOKINGS_VIEW_MODES = [
  "Daily",
  "Weekly",
  "Monthly",
] as const satisfies readonly SaltmineMobileBookingsViewMode[];
