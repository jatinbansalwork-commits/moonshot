/** Corner badge: sequential deck position (1-based). */
export function getFrameDisplayNumber(_slideId: string, deckIndex: number): number {
  return deckIndex + 1;
}
