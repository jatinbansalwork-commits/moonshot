/**
 * Reference artboard placement for Find a space floor plan (575×445 export).
 * Positions are percentages of the artboard — scales with the canvas container.
 */

export const FLOOR_PLAN_ARTBOARD = {
  width: 575,
  height: 445,
} as const;

export interface ArtboardSlot {
  /** Distance from artboard left edge (%) */
  left: number;
  /** Distance from artboard top edge (%) */
  top: number;
  /** Width as % of artboard */
  width: number;
  /** Height as % of artboard */
  height: number;
  /** Rotate asset in degrees (meeting tables on the right column) */
  rotate?: number;
}

/** Pod 1–4 — Frame 50, top row */
export const POD_SLOTS: readonly ArtboardSlot[] = [
  { left: 5, top: 14, width: 19.5, height: 36 },
  { left: 27, top: 14, width: 19.5, height: 36 },
  { left: 49, top: 14, width: 19.5, height: 36 },
  { left: 71, top: 14, width: 19.5, height: 36 },
];

/** M-N meeting tables — Frame 37, Design column (right) */
export const MEETING_NORTH_SLOTS: readonly ArtboardSlot[] = [
  { left: 81, top: 12, width: 11, height: 28, rotate: -90 },
  { left: 81, top: 41, width: 11, height: 28, rotate: -90 },
];

/** M-C meeting tables — Frame 37, Engineering row (bottom) */
export const MEETING_CENTRAL_SLOTS: readonly ArtboardSlot[] = [
  { left: 5, top: 72, width: 17, height: 16 },
  { left: 22, top: 72, width: 17, height: 16 },
  { left: 39, top: 72, width: 17, height: 16 },
  { left: 56, top: 72, width: 17, height: 16 },
  { left: 73, top: 72, width: 17, height: 16 },
];

export const ZONE_LABEL_SLOTS = {
  design: { left: 66, top: 28 },
  engineering: { left: 58, top: 62 },
} as const;

/** Pod ids rendered on the default floor plan (matches reference). */
export const DISPLAY_POD_IDS = ["pod-1", "pod-2", "pod-3", "pod-4"] as const;
