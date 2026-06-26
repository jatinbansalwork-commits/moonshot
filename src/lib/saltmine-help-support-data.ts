/**
 * Demo data for slide 24 — Help & Support embed (isolated from shared dashboard).
 */

export const HELP_SUPPORT_CHAT_PROMPTS = [
  "How do I book a desk?",
  "Where is my team today?",
  "Check in to my parking space",
] as const;

export const HELP_SUPPORT_RECENT_SEARCHES = ["jatin", "desk.p6.4", "neha"] as const;

export const HELP_SUPPORT_POPULAR_TOPICS = [
  "What's new",
  "Video tutorials",
  "Finding workspaces",
  "Sharing on Slack",
] as const;

export interface HelpSupportCategory {
  id: string;
  title: string;
  description: string;
}

export const HELP_SUPPORT_CATEGORIES: readonly HelpSupportCategory[] = [
  {
    id: "get-started",
    title: "Get started",
    description:
      "Everything admins & employees need to know to get started & get to work",
  },
  {
    id: "employees",
    title: "Employees",
    description:
      "Booking workspaces, creating teams, introducing the new inbox and notification types",
  },
  {
    id: "administrators",
    title: "Administrators",
    description: "Accessing the web apps, locations, resource management and users",
  },
  {
    id: "hardware",
    title: "Hardware",
    description:
      "Importing, activating & pairing screens and sensors in the workplace",
  },
  {
    id: "reporting",
    title: "Reporting",
    description:
      "Filtering resource utilisation data, exporting formats and interrogating data",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description:
      "What to do when things don't go as expected — resources, tutorials, articles",
  },
];
