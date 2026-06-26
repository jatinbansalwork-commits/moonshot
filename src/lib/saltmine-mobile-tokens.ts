import { FOCUS_RING, TARGET_HIT_AREA } from "@/lib/a11y";
import {
  SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT,
  SALTMINE_MOBILE_STATUS_BAR_HEIGHT,
} from "@/lib/saltmine-mobile-nav";

/**
 * Saltmine mobile app design tokens — 360×780 frame.
 * Typography and spacing tuned for native-feeling mobile readability (Notion / Linear density).
 */
export const SALTMINE_MOBILE_FRAME = {
  width: 360,
  height: 780,
} as const;

export const SALTMINE_MOBILE_SPACING = {
  /** Horizontal page padding — 16px */
  pageX: 16,
  /** Gap between major sections — 16px */
  sectionGap: 16,
  /** Card inner padding — 14px horizontal, 12px vertical */
  cardPadX: 14,
  cardPadY: 12,
  /** Gap between list items — 12px */
  listGap: 12,
  /** Extra safe area above bottom nav + home indicator */
  safeBottomExtra: 24,
  /** Sheet horizontal padding */
  sheetX: 16,
} as const;

/** Scrollable content clearance above bottom tab bar + home indicator. */
export const SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING =
  SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT + SALTMINE_MOBILE_SPACING.safeBottomExtra;

/** FAB sits above tab bar with comfortable margin. */
export const SALTMINE_MOBILE_FAB_BOTTOM_OFFSET =
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING + 4;

export const SALTMINE_MOBILE_COMPONENT = {
  iconButton: 44,
  fab: 56,
  tabBar: SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT,
  statusBar: SALTMINE_MOBILE_STATUS_BAR_HEIGHT,
  filterRow: 44,
  chip: 32,
  segmented: 40,
  headerAvatar: 32,
  cardRadius: 16,
  sheetRadius: 20,
} as const;

export const SALTMINE_MOBILE_ICON = {
  stroke: 1.75,
  sm: 16,
  md: 18,
  lg: 20,
} as const;

// ── Layout class constants ───────────────────────────────────────────────────

export const SALTMINE_MOBILE_PAGE_X_CLASS = "px-4";
export const SALTMINE_MOBILE_CONTENT_X_CLASS = "px-4";

export const SALTMINE_MOBILE_PAGE_HEADER_CLASS =
  `shrink-0 bg-white ${SALTMINE_MOBILE_PAGE_X_CLASS} pb-3 pt-2`;

/** White header strip on canvas pages — matches bookings sticky chrome. */
export const SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS =
  `shrink-0 border-b bg-white ${SALTMINE_MOBILE_PAGE_X_CLASS} pb-3 pt-2`;

export const SALTMINE_MOBILE_PAGE_HEADER_ON_CANVAS_CLASS =
  SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS;

// ── Typography class constants ─────────────────────────────────────────────────

export const SALTMINE_MOBILE_PAGE_TITLE_CLASS =
  "m-0 text-[22px] font-extrabold leading-7 tracking-[-0.03em]";

export const SALTMINE_MOBILE_SECTION_TITLE_CLASS =
  "m-0 text-[16px] font-bold leading-[22px] tracking-[-0.02em]";

export const SALTMINE_MOBILE_CARD_TITLE_CLASS =
  "text-[15px] font-bold leading-5 tracking-[-0.02em]";

export const SALTMINE_MOBILE_BODY_CLASS = "text-[14px] font-medium leading-5";

export const SALTMINE_MOBILE_SECONDARY_CLASS = "text-[13px] font-medium leading-[18px]";

export const SALTMINE_MOBILE_CAPTION_CLASS = "text-[12px] font-medium leading-4";

export const SALTMINE_MOBILE_BUTTON_LABEL_CLASS =
  "text-[14px] font-semibold leading-[18px]";

export const SALTMINE_MOBILE_TAB_LABEL_CLASS =
  "max-w-full truncate text-[11px] font-semibold leading-4";

export const SALTMINE_MOBILE_CARD_BORDER_COLOR = "rgba(145, 158, 171, 0.24)";

export const SALTMINE_MOBILE_OUTLINE_BUTTON_CLASS =
  `inline-flex min-h-11 items-center justify-center rounded-[10px] border px-3 ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} leading-none`;

export const SALTMINE_MOBILE_SEGMENTED_CONTROL_CLASS =
  "flex gap-1 rounded-[12px] p-1";

export const SALTMINE_MOBILE_OVERLAY_TITLE_CLASS =
  "m-0 text-[15px] font-bold tracking-[-0.02em]";

export const SALTMINE_MOBILE_FILTER_LABEL_CLASS =
  "m-0 mb-1.5 px-0.5 text-[12px] font-medium";

export const SALTMINE_MOBILE_MENU_ITEM_CLASS =
  "text-[14px] font-medium";

// ── Component class constants ──────────────────────────────────────────────────

export const SALTMINE_MOBILE_ICON_BUTTON_CLASS =
  `${TARGET_HIT_AREA} rounded-full hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`;

export const SALTMINE_MOBILE_CARD_CLASS =
  "rounded-[16px] border bg-white shadow-[0_1px_2px_rgba(28,37,46,0.05)]";

export const SALTMINE_MOBILE_CARD_PAD_CLASS = "px-3.5 py-3";

export const SALTMINE_MOBILE_LIST_GAP_CLASS = "space-y-3";

export const SALTMINE_MOBILE_FAB_CLASS =
  `inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(0,111,236,0.35)] transition-transform duration-150 active:scale-95 ${FOCUS_RING}`;

export const SALTMINE_MOBILE_CHIP_CLASS =
  "inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[12px] font-medium tabular-nums leading-none";

export const SALTMINE_MOBILE_FILTER_TRIGGER_CLASS =
  `flex min-h-11 w-full items-center gap-2.5 rounded-[12px] border px-3 text-left transition-colors ${FOCUS_RING}`;

export const SALTMINE_MOBILE_SEGMENTED_TAB_CLASS =
  `min-h-11 flex-1 rounded-[10px] px-2.5 text-[13px] font-semibold leading-none transition-colors ${FOCUS_RING}`;

export const SALTMINE_MOBILE_OVERLAY_HEADER_CLASS =
  "flex shrink-0 items-center gap-1 border-b px-2 py-2";

export const SALTMINE_MOBILE_SHEET_CLASS =
  "relative rounded-t-[20px] bg-white px-4 pb-6 pt-3 shadow-[0_-8px_32px_rgba(28,37,46,0.12)]";

/** Matches web preview frame canvas (`#EEF2F6`). */
export const SALTMINE_MOBILE_CANVAS_BG = "#EEF2F6";

/** Extra scroll clearance so the last card clears the FAB. */
export const SALTMINE_MOBILE_FAB_SCROLL_CLEARANCE = 72;

/** Press feedback — honour reduced motion in components via `useReducedMotion`. */
export const SALTMINE_MOBILE_PRESS_CLASS =
  "transition-[transform,opacity,background-color] duration-150 active:scale-[0.98]";

export const SALTMINE_MOBILE_STICKY_CHROME_CLASS =
  "sticky top-0 z-10 shrink-0 border-b bg-white";

/** Hide scrollbars while keeping touch / wheel scroll — pair with overflow-auto/y. */
export const SALTMINE_MOBILE_SCROLL_Y_CLASS =
  "no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain";

export const SALTMINE_MOBILE_SCROLL_CLASS =
  "no-scrollbar min-h-0 overflow-auto overscroll-contain";
