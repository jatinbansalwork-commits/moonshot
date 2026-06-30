function readSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

/** `?slide=N` — jump the deck to a specific slide on load (0-based index). */
export function getDevSlideIndex(frameCount: number): number | null {
  const raw = readSearchParam("slide");
  if (raw === null) return null;

  const index = Number.parseInt(raw, 10);
  if (!Number.isFinite(index)) return null;

  return Math.min(Math.max(index, 0), frameCount - 1);
}
