/**
 * Dashboard mockup content — edit copy and demo data here.
 * Preview at: http://localhost:3000/dev/saltmine-dashboard
 */

import {
  BOOKING_TYPE_OPTIONS,
  TEAM_OPTIONS,
} from "@/lib/saltmine-bookings-dashboard-data";

export type DashboardNavIcon =
  | "bookings"
  | "search"
  | "inbox"
  | "teams"
  | "grid"
  | "conference"
  | "help"
  | "status"
  | "locale"
  | "language";

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: DashboardNavIcon;
  localeFlag?: string;
}

export interface DashboardFilter {
  id: string;
  label: string;
  icon: "bookmark" | "users";
  options: readonly string[];
  defaultValue: string;
}

export const SALTMINE_BOOKINGS_DASHBOARD_CONTENT = {
  brandName: "saltmine",
  brandLogoSrc: "/assets/saltmine-logo.png",

  defaultDisplayName: "Jatin Bansal",

  searchPlaceholder: "Search…",
  searchEmptyLabel: "No matches — try a space, person, or page",

  pageTitle: "My bookings",

  inboxPageTitle: "Inbox",
  inboxShowLabel: "Show",
  inboxFilterLabel: "Filter",
  inboxEmptyLabel: "No notifications match these filters",
  inboxMenuToast: "Notification options would open here",
  inboxDetailEmptyLabel: "Select a notification to see details",
  inboxDetailFieldsLabel: "Details",
  inboxDetailPanelLabel: "Update details",
  inboxDetailCloseLabel: "Close details",
  inboxAcceptToast: "Invite accepted",
  inboxDeclineToast: "Invite declined",

  findSpacePageTitle: "Find a space",
  findSpaceMoreFilters: "More filters",
  findSpaceClearFilters: "Clear filters",
  findSpacePanHint: "Scroll to pan",
  findSpaceBookDemo: "Book {desk} — demo",
  findSpaceLegendAvailable: "Available",
  findSpaceLegendTeam: "Team",
  findSpaceLegendBooked: "Booked",
  findSpaceViewFloor: "Floor",
  findSpaceViewList: "List",
  findSpaceEmptyLabel: "No spaces match these filters.",
  repeatDeskLabel: "Repeat desk",
  repeatDeskCta: "Repeat yesterday's desk",
  tomorrowEmptyLabel: "Nothing booked yet",

  teamsPageTitle: "My teams",
  teamsMemberLabel: "members",
  teamsHelperCopy: "Selected members appear on the floor plan.",
  teamsSelectAll: "All",
  teamsSelectNone: "None",
  teamsMenuToast: "Team options would open here",
  teamsRemoveToast: "Removed from team",
  teamsUndoRemove: "Removed from team — Undo",

  navSectionWorkspace: "Workspace",
  navSectionSupport: "Support",

  filterBarLabel: "Filters",

  viewModes: ["Daily", "Weekly", "Monthly"] as const,
  defaultViewMode: "Daily" as const,

  filters: [
    {
      id: "booking-type",
      label: "Filter by booking type",
      icon: "bookmark",
      options: BOOKING_TYPE_OPTIONS,
      defaultValue: BOOKING_TYPE_OPTIONS[0],
    },
    {
      id: "team",
      label: "Show who's in",
      icon: "users",
      options: TEAM_OPTIONS,
      defaultValue: TEAM_OPTIONS[0],
    },
  ] satisfies DashboardFilter[],

  primaryNav: [
    { id: "bookings", label: "My bookings", icon: "bookings" },
    { id: "find-space", label: "Find a space", icon: "search" },
    { id: "inbox", label: "Inbox", icon: "inbox" },
    { id: "teams", label: "My teams", icon: "teams" },
    { id: "booking-grid", label: "Booking grid", icon: "grid" },
    { id: "conference-grid", label: "Conference grid", icon: "conference" },
  ] satisfies DashboardNavItem[],

  secondaryNav: [
    { id: "help", label: "Help & support", icon: "help" },
    { id: "status", label: "System status", icon: "status" },
    { id: "locale", label: "India", icon: "locale", localeFlag: "🇮🇳" },
    { id: "language", label: "Language", icon: "language" },
  ] satisfies DashboardNavItem[],

  viewButtonLabel: "View",
  addBookingLabel: "Add booking",
  addedBookingToast: "Booking added for",

  calendar: {
    defaultMonthIndex: 1,
    selectedDay: 10,
  },

  helpButtonLabel: "Need help?",
  helpToast: "Support chat would open here",

  viewDetailToast: "Opening office view for",
  externalLinkToast: "Opening day in calendar",

  officePresenceEyebrow: "Who's in",
  officePresencePanelLabel: "Who's in",
  officePresenceTitle: "At {office}",
  officePresenceCloseLabel: "Close who's in panel",
  officePresenceEmptyLabel: "No-one from this team is in the office today.",
  officePresenceFloorPlanCta: "View on floor plan",
  officePresenceFloorPlanToast: "Opening floor plan for",

  bookingDetailPanelLabel: "Booking details",
  bookingDetailOpenLabel: "Open booking details for",
  bookingDetailCloseLabel: "Close booking details",
  bookingDetailMapLabel: "View on map",
  bookingDetailShareLabel: "Share booking",
  bookingDetailMapToast: "Opening map for",
  bookingDetailShareToast: "Share sheet would open for",

  monthlyTodayLabel: "Today",
  monthlyCalendarOpenLabel: "Open monthly calendar for",

  dashboardNextLabel: "Next",
  dashboardCompleteToast: "You're all set — welcome to your workspace",
} as const;
