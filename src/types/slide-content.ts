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
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  align?: "left" | "center" | "right";
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

export type SlideLayout = "default" | "stints-three-column" | "iphone-home";

/** One slide — each block is a separate sibling in the layout. */
export interface SlideDefinition {
  id: string;
  label: string;
  backgroundColor?: string;
  align?: "left" | "center";
  /** Tailwind gap class between blocks — default `gap-20` (80px). */
  blockGap?: "gap-10" | "gap-20";
  /** Extra classes on the padded slide layout wrapper (e.g. `text-white` on dark slides). */
  className?: string;
  /** Full-bleed layout variant — bypasses default padded block stack. */
  layout?: SlideLayout;
  /** Override default deck frame size (1200×720) for portrait or custom panels. */
  frameSize?: { width: number; height: number };
  blocks: SlideBlock[];
}
