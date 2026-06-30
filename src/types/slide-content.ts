export type SlideTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type TextCase = "title" | "sentence" | "segment-title" | "preserve";

export type SlideScopedEmbedVariant =
  | "slide-17"
  | "slide-18"
  | "slide-19"
  | "slide-20-deck-day"
  | "slide-20-pod-cluster"
  | "slide-20-team-list"
  | "slide-21"
  | "slide-22"
  | "slide-23"
  | "slide-24"
  | "slide-25-mobile"
  | "slide-39"
  | "slide-40"
  | "slide-41"
  | "slide-44"
  | "slide-45";

export type SlidePlaceholderVariant =
  | SlideScopedEmbedVariant
  | "sign-in"
  | "dashboard"
  | "pod-cluster"
  | "team-list"
  | "help-support"
  | "outcome-metrics";

interface SlideBlockBase {
  /** Stable id — one block, one element in the DOM. */
  id: string;
}

export interface SlideTitleBlock extends SlideBlockBase {
  type: "title";
  text: string;
  as?: SlideTextTag;
  fontSize?: number;
  /** Replaces default title typography classes when set. */
  typography?: string;
  /** Casing applied at render — inferred from block type/length when omitted. */
  textCase?: TextCase;
  className?: string;
  reveal?: boolean;
  revealDelay?: number;
}

export interface SlideBodyBlock extends SlideBlockBase {
  type: "body";
  text: string;
  as?: SlideTextTag;
  fontSize?: number;
  /** Replaces default body typography classes when set. */
  typography?: string;
  /** Casing applied at render — inferred from block type/length when omitted. */
  textCase?: TextCase;
  className?: string;
  reveal?: boolean;
  revealDelay?: number;
}

export interface SlideImageBlock extends SlideBlockBase {
  type: "image";
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Extra classes on the image block wrapper (e.g. `mt-auto` to pin embeds to the slide bottom). */
  wrapperClassName?: string;
  align?: "left" | "center" | "right";
  /** Render a 16:9 placeholder frame instead of loading `src`. */
  placeholder?: boolean;
  placeholderVariant?: SlidePlaceholderVariant;
  /** Initial sidebar item when `placeholderVariant` is `dashboard`. */
  dashboardInitialNav?: string;
  /** Floating mobile notification stack on inbox view (deck slides). */
  dashboardShowInboxNotificationPopup?: boolean;
}

export interface SlideListItem {
  id: string;
  label: string;
  /** Prefer `slideId` — resolved at render time from the deck. */
  slideId?: string;
  slideIndex?: number;
}

export interface SlideListBlock extends SlideBlockBase {
  type: "list";
  items: SlideListItem[];
}

export type SlideBlock =
  | SlideTitleBlock
  | SlideBodyBlock
  | SlideImageBlock
  | SlideListBlock;

export type SlideLayout =
  | "default"
  | "stints-three-column"
  | "saltmine-sync"
  | "saltmine-bento"
  | "vertical-split"
  | "horizontal-split"
  | "saltmine-problem"
  | "saltmine-example";

/** Half content for nested splits. */
export interface SplitSlideHalfContent {
  color: string;
  text?: string;
  title?: string;
  body?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Embedded Saltmine mockup frame (matches index slide image blocks). */
  placeholder?: boolean;
  placeholderVariant?: SlidePlaceholderVariant;
  dashboardInitialNav?: string;
  dashboardShowInboxNotificationPopup?: boolean;
  dashboardInitialViewMode?: "Daily" | "Weekly" | "Monthly";
  placeholderClassName?: string;
  /** Full-bleed cell background image. */
  backgroundImage?: {
    src: string;
    alt: string;
  };
}

/** Colours for `horizontal-split` layout rows. */
export interface HorizontalSplitSlideContent {
  topColor: string;
  bottomColor: string;
  showDivider?: boolean;
  topText?: string;
  topTitle?: string;
  topBody?: string;
  /** Override top-band title font size (px). */
  topTitleFontSize?: number;
  /** Padding (px) on the top-band body paragraph. */
  topBodyPadding?: number;
  topImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Render a scaled office-presence row below the top title and body. */
  topShowDeckDaySection?: boolean;
  /** Slide-scoped embed in the top band (preferred over `topShowDeckDaySection`). */
  topPlaceholderVariant?: SlideScopedEmbedVariant;
  /** Repeat the top title and body below the deck day section embed. */
  topRepeatTitleBodyBelowEmbed?: boolean;
  /** Custom title and body below the deck day section embed. */
  topTitleBelowEmbed?: string;
  topBodyBelowEmbed?: string;
  bottomText?: string;
  bottomImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Split the bottom row into equal left/right columns. */
  bottomVerticalSplit?: {
    left: SplitSlideHalfContent;
    right: SplitSlideHalfContent;
    showDivider?: boolean;
  };
}

/** Colours for `vertical-split` layout columns. */
export interface VerticalSplitSlideContent {
  leftColor: string;
  rightColor: string;
  showDivider?: boolean;
  leftText?: string;
  rightText?: string;
  visionCardText?: string;
  leftImage?: {
    src: string;
    alt: string;
  };
  rightImage?: {
    src: string;
    alt: string;
  };
}

export interface SlideCoverImage {
  src: string;
  alt: string;
  className?: string;
  /** Fill column height and pin artwork to the slide's right edge. */
  fullBleedRight?: boolean;
  /** Extra rendered height for the cover artwork (px), added to column height. */
  heightExtra?: number;
}

/** Copy for `saltmine-example` bento layout. */
export interface ExampleBentoSlideContent {
  eyebrow: string;
  statement: string;
  topQuestion: string;
  bottomQuestion: string;
  colors?: {
    main?: string;
    topRight?: string;
    bottomRight?: string;
  };
}

/** Copy for `saltmine-problem` split slides. */
export interface ProblemSplitSlideContent {
  leftLabel: string;
  /** Optional line rendered below `leftStatement` (body copy). */
  leftLabelBelow?: string;
  leftStatement: string;
  /** Tailwind max-width class for `leftStatement` — default `max-w-xl`. */
  leftStatementMaxWidth?: string;
  rightLabel?: string;
  rightLabelBold?: boolean;
  rightBullets?: string[];
  showRightColumn?: boolean;
}

import type { DeckPresentation } from "@/lib/deck-presentation";

/** One slide — each block is a separate sibling in the layout. */
export interface SlideDefinition {
  id: string;
  label: string;
  backgroundColor?: string;
  align?: "left" | "center";
  /** Tailwind gap class between blocks — default `gap-20` (80px). */
  blockGap?: "gap-2" | "gap-3" | "gap-4" | "gap-6" | "gap-8" | "gap-10" | "gap-20";
  /** Extra classes on the padded slide layout wrapper (e.g. `text-white` on dark slides). */
  className?: string;
  /** Extra classes on the inner block stack (e.g. `h-full` to fill the slide height). */
  contentClassName?: string;
  /** Presentation rhythm — typography, spacing, and staging (not product UI). */
  presentation?: DeckPresentation;
  /** Optional hero artwork shown beside the text column. */
  coverImage?: SlideCoverImage;
  /** Full-bleed layout variant — bypasses default padded block stack. */
  layout?: SlideLayout;
  /** Copy overrides for `saltmine-problem` layout. */
  problemSplit?: ProblemSplitSlideContent;
  /** Row colours for `horizontal-split` layout. */
  horizontalSplit?: HorizontalSplitSlideContent;
  /** Column colours for `vertical-split` layout. */
  verticalSplit?: VerticalSplitSlideContent;
  /** Copy for `saltmine-example` layout. */
  exampleBento?: ExampleBentoSlideContent;
  /** Override default deck frame size (1200×720) for portrait or custom panels. */
  frameSize?: { width: number; height: number };
  blocks: SlideBlock[];
}
