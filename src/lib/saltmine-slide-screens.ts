import type { SlideScopedEmbedVariant } from "@/types/slide-content";

export interface SaltmineSlideScreenEntry {
  slug: string;
  variant: SlideScopedEmbedVariant;
  label: string;
  screenFile: string;
  configFile?: string;
  /** Full 880×530 frame in dev preview (matches deck mockup slides). */
  framed?: boolean;
  /** Override dev preview / embed frame size (e.g. mobile 360×780). */
  frameSize?: { width: number; height: number };
  /** Tailwind frame class when `frameSize` is not used. */
  frameClassName?: string;
}

/** Isolated Saltmine product screens — one entry per editable surface (slides 17–23, 25-mobile). */
export const SALTMINE_SLIDE_SCREENS: readonly SaltmineSlideScreenEntry[] = [
  {
    slug: "17",
    variant: "slide-17",
    label: "Onboarding",
    screenFile: "src/components/slider/slide-screens/slide-17-screen.tsx",
    configFile: "src/lib/slide-screens/slide-17-config.ts",
    framed: true,
  },
  {
    slug: "18",
    variant: "slide-18",
    label: "My bookings hub",
    screenFile: "src/components/slider/slide-screens/slide-18-screen.tsx",
    configFile: "src/lib/slide-screens/slide-18-config.ts",
    framed: true,
  },
  {
    slug: "19",
    variant: "slide-19",
    label: "Booking timeline",
    screenFile: "src/components/slider/slide-screens/slide-19-screen.tsx",
    configFile: "src/lib/slide-screens/slide-19-config.ts",
    framed: true,
  },
  {
    slug: "20-deck-day",
    variant: "slide-20-deck-day",
    label: "Office presence — timeline",
    screenFile: "src/components/slider/slide-screens/slide-20-deck-day-screen.tsx",
    framed: false,
  },
  {
    slug: "20-pod-cluster",
    variant: "slide-20-pod-cluster",
    label: "Office presence — floor plan",
    screenFile: "src/components/slider/slide-screens/slide-20-pod-cluster-screen.tsx",
    framed: false,
  },
  {
    slug: "20-team-list",
    variant: "slide-20-team-list",
    label: "Office presence — team filter",
    screenFile: "src/components/slider/slide-screens/slide-20-team-list-screen.tsx",
    framed: false,
  },
  {
    slug: "21",
    variant: "slide-21",
    label: "Booking grid",
    screenFile: "src/components/slider/slide-screens/slide-21-screen.tsx",
    configFile: "src/lib/slide-screens/slide-21-config.ts",
    framed: true,
  },
  {
    slug: "22",
    variant: "slide-22",
    label: "Conference grid",
    screenFile: "src/components/slider/slide-screens/slide-22-screen.tsx",
    configFile: "src/lib/slide-screens/slide-22-config.ts",
    framed: true,
  },
  {
    slug: "23",
    variant: "slide-23",
    label: "Inbox",
    screenFile: "src/components/slider/slide-screens/slide-23-screen.tsx",
    configFile: "src/lib/slide-screens/slide-23-config.ts",
    framed: true,
  },
  {
    slug: "25-mobile",
    variant: "slide-25-mobile",
    label: "Mobile app",
    screenFile: "src/components/slider/slide-screens/slide-25-mobile-screen.tsx",
    configFile: "src/lib/slide-screens/slide-25-mobile-config.ts",
    framed: true,
    frameSize: { width: 360, height: 780 },
    frameClassName:
      "mx-auto max-w-full overflow-hidden rounded-[28px] border-[5px] border-[#1C252E] bg-white shadow-[0_12px_40px_rgba(28,37,46,0.14)]",
  },
  {
    slug: "39",
    variant: "slide-39",
    label: "Future — last-minute lane & waitlist",
    screenFile: "src/components/slider/slide-screens/slide-39-screen.tsx",
    framed: true,
  },
  {
    slug: "40",
    variant: "slide-40",
    label: "Future — safety booking",
    screenFile: "src/components/slider/slide-screens/slide-40-screen.tsx",
    framed: true,
  },
  {
    slug: "41",
    variant: "slide-41",
    label: "Future — Move in Sync",
    screenFile: "src/components/slider/slide-screens/slide-41-screen.tsx",
    framed: true,
  },
  {
    slug: "44",
    variant: "slide-44",
    label: "Future — commute sync",
    screenFile: "src/components/slider/slide-screens/slide-44-screen.tsx",
    framed: true,
  },
  {
    slug: "45",
    variant: "slide-45",
    label: "Future — waitlist",
    screenFile: "src/components/slider/slide-screens/slide-45-screen.tsx",
    framed: true,
  },
] as const;

const SCREEN_BY_SLUG = Object.fromEntries(
  SALTMINE_SLIDE_SCREENS.map((entry) => [entry.slug, entry]),
) as Record<string, SaltmineSlideScreenEntry>;

export function getSaltmineSlideScreen(slug: string): SaltmineSlideScreenEntry | undefined {
  return SCREEN_BY_SLUG[slug];
}

export function getSaltmineSlideScreenPath(slug: string): string {
  return `/dev/saltmine-slide/${slug}`;
}
