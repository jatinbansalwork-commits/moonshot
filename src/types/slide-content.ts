export type SlideTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type TextCase = "title" | "sentence" | "segment-title" | "preserve";

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
  align?: "left" | "center" | "right";
  /** Render a 16:9 placeholder frame instead of loading `src`. */
  placeholder?: boolean;
  placeholderVariant?: "sign-in" | "dashboard";
  /** Initial sidebar item when `placeholderVariant` is `dashboard`. */
  dashboardInitialNav?: string;
}

export interface SlideListItem {
  id: string;
  label: string;
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
  | "iphone-home"
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
  placeholderVariant?: "sign-in" | "dashboard";
  dashboardInitialNav?: string;
  dashboardInitialViewMode?: "Daily" | "Weekly" | "Monthly";
  placeholderClassName?: string;
}

/** Colours for `horizontal-split` layout rows. */
export interface HorizontalSplitSlideContent {
  topColor: string;
  bottomColor: string;
  showDivider?: boolean;
  topText?: string;
  topTitle?: string;
  topBody?: string;
  topImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
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

/** One slide — each block is a separate sibling in the layout. */
export interface SlideDefinition {
  id: string;
  label: string;
  backgroundColor?: string;
  align?: "left" | "center";
  /** Tailwind gap class between blocks — default `gap-20` (80px). */
  blockGap?: "gap-4" | "gap-6" | "gap-10" | "gap-20";
  /** Extra classes on the padded slide layout wrapper (e.g. `text-white` on dark slides). */
  className?: string;
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
