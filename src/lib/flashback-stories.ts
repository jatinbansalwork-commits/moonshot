export type FlashbackStoryHero =
  | { kind: "retro-text"; text: string }
  | { kind: "stat"; text: string };

export interface FlashbackStory {
  id: string;
  greeting: string;
  hero: FlashbackStoryHero;
  /** Line breaks supported via `\n`. */
  subtitle: string;
}

export const FLASHBACK_STORIES: FlashbackStory[] = [
  {
    id: "intro",
    greeting: "Hello!",
    hero: { kind: "retro-text", text: "2024" },
    subtitle: "is almost over.\nLet's rewind to the biggest highlights!",
  },
  {
    id: "total-saved",
    greeting: "You saved",
    hero: { kind: "stat", text: "₹12,450" },
    subtitle: "in digital gold this year.\nEvery rupee moved you closer.",
  },
  {
    id: "save-streak",
    greeting: "Your longest streak",
    hero: { kind: "stat", text: "21 days" },
    subtitle: "of saving without a miss.\nDiscipline turned into momentum.",
  },
  {
    id: "gold-added",
    greeting: "Gold added",
    hero: { kind: "stat", text: "4.2 gm" },
    subtitle: "landed in your locker.\n24K gold, hallmarked and secure.",
  },
  {
    id: "btc-rewards",
    greeting: "BTC rewards",
    hero: { kind: "stat", text: "0.0024" },
    subtitle: "collected from daily bonuses.\nSmall wins stacked up fast.",
  },
  {
    id: "community-rank",
    greeting: "You ranked in the",
    hero: { kind: "retro-text", text: "Top 8%" },
    subtitle: "of Kalash savers nationwide.\nYou showed up all year.",
  },
];

export const FLASHBACK_STORY_COUNT = FLASHBACK_STORIES.length;
