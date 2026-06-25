/** Numeric suffix from ids like `slide-17`; null for hero, about, index, etc. */
export function getSlideNumberFromId(slideId: string): number | null {
  const match = /^slide-(\d+)$/.exec(slideId);
  return match ? Number(match[1]) : null;
}

/** Corner badge: use slide id number when present, otherwise deck position (1-based). */
export function getFrameDisplayNumber(slideId: string, deckIndex: number): number {
  return getSlideNumberFromId(slideId) ?? deckIndex + 1;
}
