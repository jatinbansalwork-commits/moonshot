/**
 * Deck presentation tokens — storytelling layer only (not product UI).
 */

export const DECK_CANVAS = "#F2F0F6";

export const DECK_PAD = 56;

export const DECK_RADIUS_LG = 24;
export const DECK_RADIUS_MD = 20;

export const DECK_EYEBROW =
  "index-slide-about-title m-0 text-[11px] font-normal uppercase tracking-[0.16em] text-black/45";

export const DECK_SECTION_LABEL =
  "index-slide-about-title m-0 text-[11px] font-normal uppercase tracking-[0.14em] text-black/40";

export const DECK_HEADLINE_HERO =
  "index-slide-about-body m-0 font-semibold tracking-[-0.03em] text-black";

export const DECK_HEADLINE_PRODUCT =
  "index-slide-about-body m-0 text-[28px] font-semibold leading-[1.12] tracking-[-0.025em] text-black";

export const DECK_BODY_PRODUCT =
  "index-slide-about-body m-0 max-w-md text-[15px] leading-[1.6] text-black/68";

export const DECK_STATEMENT =
  "index-slide-about-body m-0 max-w-4xl text-center font-normal leading-[1.15] tracking-[-0.02em] text-black";

export const DECK_PRODUCT_FRAME =
  "mx-auto h-[500px] w-[860px] max-w-full overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_28px_90px_-20px_rgba(28,37,46,0.22),0_0_0_1px_rgba(0,0,0,0.04)]";

export const DECK_PRODUCT_STAGE_GLOW =
  "pointer-events-none absolute -inset-x-6 -bottom-4 top-6 rounded-[32px] bg-gradient-to-b from-black/[0.03] via-transparent to-transparent";

export type DeckRhythm =
  | "hero"
  | "statement"
  | "framework"
  | "metrics"
  | "narrative"
  | "product"
  | "quote"
  | "outcome"
  | "learned";

export interface DeckPresentation {
  rhythm?: DeckRhythm;
  /** Small caps label rendered above slide content */
  sectionLabel?: string;
}

export const DECK_RHYTHM_SHELL: Record<DeckRhythm, string> = {
  hero: "text-black !items-center !justify-center px-14 py-12",
  statement: "text-black !items-center !justify-center px-16 py-14",
  framework: "text-black",
  metrics: "text-black",
  narrative: "text-black !items-start !justify-center px-14 py-12",
  product: "text-black !items-stretch !justify-between px-14 py-11",
  quote: "text-black !items-center !justify-center px-20 py-16",
  outcome: "text-black !items-stretch !justify-between px-14 py-11",
  learned: "text-black",
};

export const DECK_RHYTHM_CONTENT: Record<DeckRhythm, string> = {
  hero: "max-w-2xl gap-8",
  statement: "max-w-4xl gap-10 items-center text-center",
  framework: "",
  metrics: "",
  narrative: "max-w-3xl gap-6",
  product: "h-full max-w-xl gap-2.5 items-center text-center",
  quote: "max-w-3xl gap-8 items-center text-center",
  outcome: "h-full max-w-2xl gap-3 items-center text-center",
  learned: "",
};

export const DECK_PRODUCT_SLIDE_PRESENTATION: DeckPresentation = {
  rhythm: "product",
};
