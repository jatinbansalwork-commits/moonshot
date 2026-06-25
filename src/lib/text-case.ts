import type { SlideBodyBlock, SlideTitleBlock, TextCase } from "@/types/slide-content";

export type { TextCase };

const TITLE_CASE_SMALL_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "for",
  "nor",
  "on",
  "at",
  "to",
  "from",
  "by",
  "in",
  "of",
  "as",
  "vs",
  "via",
]);

type TextBlock = SlideTitleBlock | SlideBodyBlock;

function capitalizeFirstLetter(text: string): string {
  return text.replace(/^(\s*[^a-zA-Z]*)([a-zA-Z])/, (_, prefix, letter) => {
    return `${prefix}${letter.toUpperCase()}`;
  });
}

function normalizeWord(word: string): string {
  const match = word.match(/^([^a-zA-Z]*)([a-zA-Z])(.*)$/);
  if (!match) return word;

  const [, lead, first, rest] = match;
  return `${lead}${first.toUpperCase()}${rest.toLowerCase()}`;
}

/** Title Case — capitalizes major words; keeps articles/prepositions lowercase mid-phrase. */
export function toTitleCase(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return text;

  return words
    .map((word, index) => {
      const bare = word.replace(/[^a-zA-Z].*$/, "").toLowerCase();
      const isSmallWord =
        index > 0 &&
        index < words.length - 1 &&
        TITLE_CASE_SMALL_WORDS.has(bare);

      if (isSmallWord) {
        return word.replace(/[a-zA-Z]/g, (char) => char.toLowerCase());
      }

      return normalizeWord(word);
    })
    .join(" ");
}

/** Sentence case — first letter (after optional punctuation) and each new sentence. */
export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  let result = capitalizeFirstLetter(lower);

  result = result.replace(/([.!?]\s+)([a-z])/g, (_, boundary, letter) => {
    return `${boundary}${letter.toUpperCase()}`;
  });

  return result;
}

/** Title case per ` | ` segment — for credential / metadata lines. */
export function toSegmentTitleCase(text: string): string {
  return text
    .split(" | ")
    .map((segment) => toTitleCase(segment.trim()))
    .join(" | ");
}

function inferTextCase(block: TextBlock): TextCase {
  if (block.type === "title") {
    if (block.text.length > 48 || /[.!?]/.test(block.text)) {
      return "sentence";
    }
    return "title";
  }

  if (block.text.includes(" | ")) {
    return "segment-title";
  }

  return "sentence";
}

/** Normalize slide copy — fixes casing even when source text is typed inconsistently. */
export function formatSlideText(block: TextBlock): string {
  const mode = block.textCase ?? inferTextCase(block);

  switch (mode) {
    case "preserve":
      return block.text;
    case "title":
      return toTitleCase(block.text);
    case "segment-title":
      return toSegmentTitleCase(block.text);
    case "sentence":
      return toSentenceCase(block.text);
  }
}
