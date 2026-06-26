export type FlashbackStoryHero =
  | { kind: "retro-text"; text: string }
  | { kind: "stat"; text: string };

export interface FlashbackStoryImage {
  src: string;
  alt: string;
  className?: string;
  /** Span the full story width, ignoring horizontal content padding. */
  fullWidth?: boolean;
}

export interface FlashbackStory {
  id: string;
  greeting: string;
  greetingFontSize?: number;
  greetingLineHeight?: number;
  hero?: FlashbackStoryHero;
  /** Subtitle copy rendered above the hero stat. */
  subtitleAboveHero?: string;
  /** Line breaks supported via `\n`. */
  subtitle: string;
  image?: FlashbackStoryImage;
  /** Pin copy below the progress bar instead of vertically centering. */
  layout?: "center" | "below-timer";
}

/** Space from overlay top to the bottom of the progress segments. */
export const STORY_TIMER_BOTTOM_OFFSET_PX = 104;
export const STORY_TEXT_AFTER_TIMER_GAP_PX = 40;

const GOLDEN_TARGET_STORY_COPY = {
  greeting: "You achieve golden target in 2024",
  greetingFontSize: 24,
  greetingLineHeight: 36,
  layout: "below-timer" as const,
  subtitle: "Talk about some serious investing this year right?",
} as const;

export const FLASHBACK_STORIES: FlashbackStory[] = [
  {
    id: "intro",
    greeting: "Hello!",
    hero: { kind: "retro-text", text: "2024" },
    subtitle: "is almost over.\nLet's rewind to the biggest highlights!",
  },
  {
    id: "total-saved",
    ...GOLDEN_TARGET_STORY_COPY,
    image: {
      src: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/target1.svg",
      alt: "Golden target achievement illustration",
      fullWidth: true,
    },
  },
  {
    id: "save-streak",
    ...GOLDEN_TARGET_STORY_COPY,
  },
  {
    id: "gold-added",
    ...GOLDEN_TARGET_STORY_COPY,
    greeting: "1.0232 gm",
    subtitle: "Gold Invested",
  },
  {
    id: "btc-rewards",
    ...GOLDEN_TARGET_STORY_COPY,
  },
  {
    id: "community-rank",
    ...GOLDEN_TARGET_STORY_COPY,
  },
];

export const FLASHBACK_STORY_COUNT = FLASHBACK_STORIES.length;
