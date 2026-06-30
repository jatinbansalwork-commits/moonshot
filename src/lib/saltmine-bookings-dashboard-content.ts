/**
 * Dashboard mockup content — edit copy and demo data here.
 * Preview at: http://localhost:3000/dev/saltmine
 */

import {
  BOOKING_TYPE_OPTIONS,
  TEAM_OPTIONS,
} from "@/lib/saltmine-bookings-dashboard-data";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";

export type DashboardNavIcon =
  | "bookings"
  | "search"
  | "inbox"
  | "teams"
  | "grid"
  | "conference"
  | "help"
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

  defaultDisplayName: SALTMINE_DEMO_USER.name,

  searchPlaceholder: "Search bookings, people, or spaces…",
  searchEmptyLabel: "No matches — try a space, person, or page",

  pageTitle: "My bookings",

  inboxPageTitle: "Inbox",
  inboxMobilePageTitle: "Inbox",
  inboxShowLabel: "Show",
  inboxFilterLabel: "Filter",
  inboxEmptyLabel: "No notifications match these filters — try Show all",
  inboxMenuToast: "Notification options would open here",
  inboxDetailEmptyLabel: "Select a notification to see details",
  inboxDetailFieldsLabel: "Details",
  inboxDetailPanelLabel: "Update details",
  inboxDetailCloseLabel: "Close details",
  inboxAcceptToast: "Invite accepted",
  inboxDeclineToast: "Invite declined",
  inboxNotificationPopupLabel: "Mobile notifications",
  inboxNotificationPopupLatestLabel: "Latest",
  inboxNotificationPopupBookingsLabel: "Your bookings",
  inboxNotificationPopupBookingsToast: "Opening your bookings",
  inboxNotificationOpenLabel: "Open notification",

  findSpacePageTitle: "Find a space",
  findSpaceMobileFiltersCta: "Select your filters",
  findSpaceFavoritesLabel: "Favorites",
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

  bookingGridPageTitle: "Booking grid",
  bookingGridLocationLabel: "Your default location",
  bookingGridTypeLabel: "Type",
  bookingGridDisplayLabel: "Display options",
  bookingGridAllDayLabel: "All day",
  bookingGridPopupWhenLabel: "When",
  bookingGridPopupWhereLabel: "Where",
  bookingGridPopupOrganiserLabel: "Organiser",
  bookingGridPopupAttendeesLabel: "Attendees",
  bookingGridPopupJoinLabel: "Join meeting",
  bookingGridPopupEditLabel: "Edit booking",
  bookingGridPopupCheckInLabel: "Check in",
  bookingGridPopupCloseLabel: "Close booking details",
  bookingGridPopupAllDayValue: "All day",
  bookingGridPopupJoinToast: "Opening video meeting for",
  bookingGridPopupEditToast: "Edit booking — demo",
  bookingGridPopupCheckInToast: "Checked in — demo",

  conferenceGridPageTitle: "Conference grid",
  conferenceGridActiveGridLabel: "Active grid",
  conferenceGridNewGridLabel: "New grid",
  conferenceGridSaveChangesLabel: "Save changes",
  conferenceGridSaveChangesToast: "Grid changes saved",
  conferenceGridUpdateGridLabel: "Update grid",
  conferenceGridUpdateGridToast: "Grid updated",
  conferenceGridCountryLabel: "Country",
  conferenceGridLocationLabel: "Location",
  conferenceGridFloorLabel: "Floor",
  conferenceGridWorkspaceLabel: "Workspace type",
  conferenceGridCapacityLabel: "Capacity",
  conferenceGridTagsLabel: "Tags",
  conferenceGridAccessLabel: "Booking access",
  conferenceGridRoomColumnLabel: "Room",
  conferenceGridUnsavedChangesLabel: "Unsaved changes",
  conferenceGridPopupUseCaseLabel: "Use case",

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
    { id: "locale", label: "India", icon: "locale", localeFlag: "🇮🇳" },
    { id: "language", label: "Language", icon: "language" },
  ] satisfies DashboardNavItem[],

  viewButtonLabel: "View",
  addBookingLabel: "Add booking",
  addBookingPanelLabel: "Add booking",
  addBookingPanelHint: "Choose what you want to book for this day.",
  addBookingFirstTimeTitle: "Your first booking",
  addBookingFirstTimeBody:
    "Pick a desk, meeting room, parking bay, or team day — we'll add it to your timeline for this day.",
  addBookingFirstTimeCta: "Get started",
  addBookingFirstTimeSuccessBody:
    "You're booked in. Your reservation now appears on today's timeline.",
  addBookingMenuCloseLabel: "Close add booking menu",
  addBookingMenuItems: [
    { id: "team-day", label: "Create a team day" },
    { id: "car-parking", label: "Find car parking" },
    { id: "meeting-space", label: "Find a meeting space" },
    { id: "desk", label: "Find a desk" },
  ],
  addBookingResultLabels: {
    "team-day": "Team day — Floor 21",
    "car-parking": "Car Park B2.113",
    "meeting-space": "Meeting — Conf Room A",
    desk: "Desk — Floor 21",
  },
  addBookingFlowBackLabel: "Back",
  addBookingFlowConfirmLabel: "Confirm booking",
  addBookingFlowProcessingLabel: "Booking…",
  addBookingFlowSuccessTitle: "Booking confirmed",
  addBookingFlowSuccessBody: "Added to your timeline.",
  addBookingFlowSuccessDoneLabel: "Done",
  addBookingFlowErrorTitle: "Could not complete booking",
  addBookingFlowErrorBody:
    "This space was just taken. Pick another option or try again in a moment.",
  addBookingFlowRetryLabel: "Try another",
  addBookingFlowStepLabel: "Step {current} of {total}",
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
