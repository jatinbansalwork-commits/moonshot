import {
  IPHONE_SCREEN_RADIUS_PX,
  KALASH_MOBILE_HEIGHT,
  KALASH_MOBILE_WIDTH,
} from "@/components/slider/kalash-mobile-prototype-shell";

/** Kalash home view — layout & surface tokens (iPhone 17 viewport). */
export const KALASH_VIEW = {
  viewport: {
    width: KALASH_MOBILE_WIDTH,
    height: KALASH_MOBILE_HEIGHT,
    screenRadiusPx: IPHONE_SCREEN_RADIUS_PX,
  },
  color: {
    canvas: "#ffffff",
    sectionMuted: "#ffffff",
    label: "#637381",
    text: "#212B36",
    trustBar: "#e0fbf1",
    trustBarText: "#064e3b",
    promoBannerBg: "#fff7ed",
  },
  space: {
    /** Inside text stacks (title → value → sub-value) */
    tight: 4,
    gutterX: 16,
    headerGutterX: 16,
    /** Standard section break */
    sectionY: 24,
    /** Major break (promo strip → hero) */
    sectionMajor: 32,
    stackGap: 24,
    bottomNavHeight: 72,
    headerHeight: 100,
    safeAreaBottom: 34,
    columnPaddingX: 12,
  },
  border: {
    subtle: "border border-neutral-200/40",
  },
  type: {
    label: "whitespace-nowrap text-[11px] font-normal leading-[13px] tracking-tight text-[#8E8E8E]",
    metric: "whitespace-nowrap text-[13px] font-bold leading-tight tracking-tight text-[#1E1E1E]",
  },
} as const;
