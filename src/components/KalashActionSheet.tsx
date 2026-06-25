"use client";

import { AnimatePresence, motion } from "framer-motion";
import { KALASH_TEAL } from "@/components/slider/kalash/kalash-tokens";
import { FOCUS_RING } from "@/lib/a11y";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

const ACTION_SHEET_ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Component%204.svg";
const ACTION_SHEET_ILLUSTRATION_HEIGHT_PX = 152;
/** ~half the illustration sits inside the white sheet. */
const ACTION_SHEET_ILLUSTRATION_OVERLAP_PX =
  ACTION_SHEET_ILLUSTRATION_HEIGHT_PX / 2;
const STREAK_BTC_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/bitocin.svg";
const STREAK_STAR_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/star.svg";
const STREAK_CHECK_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/check.svg";
const STREAK_CROSS_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/cross.svg";

const STREAK_DAY_COUNT = 7;
const STREAK_CIRCLE_SIZE_PX = 46;
const STREAK_CIRCLE_ICON_SIZE_PX = 46;
const STREAK_CIRCLE_SMALL_ICON_SIZE_PX = 24;
const STREAK_CIRCLE_GAP_PX = 4;
const STREAK_CIRCLE_BORDER_BY_DAY: Partial<Record<number, string>> = {
  4: "rgba(247, 147, 26, 0.4)",
  5: "rgba(53, 205, 72, 0.4)",
  6: "rgba(53, 205, 72, 0.4)",
  7: "rgba(247, 147, 26, 0.4)",
};
const STREAK_CIRCLE_ICON_BY_DAY: Partial<Record<number, string>> = {
  1: STREAK_CHECK_ICON_SRC,
  2: STREAK_CHECK_ICON_SRC,
  3: STREAK_CROSS_ICON_SRC,
  4: STREAK_BTC_ICON_SRC,
  7: STREAK_STAR_ICON_SRC,
};
const STREAK_EMPTY_CIRCLE_DAYS = new Set([5, 6]);
const STREAK_SMALL_ICON_DAYS = new Set([4, 7]);
const STREAK_BORDERLESS_DAYS = new Set([1, 2, 3]);
const STREAK_LABEL_COLOR_BY_DAY: Partial<Record<number, string>> = {
  1: "#1E1E1E",
  2: "#1E1E1E",
  3: "#FF5630",
  4: "#637381",
  5: "#637381",
  6: "#637381",
  7: "#637381",
};

function getStreakCircleBorderColor(dayNumber: number): string | undefined {
  return STREAK_CIRCLE_BORDER_BY_DAY[dayNumber];
}

function getStreakLabelColor(
  dayNumber: number,
  defaultColor: string,
): string {
  return STREAK_LABEL_COLOR_BY_DAY[dayNumber] ?? defaultColor;
}

function getStreakCircleIconSrc(dayNumber: number): string | undefined {
  return STREAK_CIRCLE_ICON_BY_DAY[dayNumber];
}

function getStreakCircleIconSizePx(dayNumber: number): number {
  return STREAK_SMALL_ICON_DAYS.has(dayNumber)
    ? STREAK_CIRCLE_SMALL_ICON_SIZE_PX
    : STREAK_CIRCLE_ICON_SIZE_PX;
}

interface KalashActionSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Bottom action sheet — illustration floats above the white panel. */
export function KalashActionSheet({ open, onClose }: KalashActionSheetProps) {
  const reducedMotion = useReducedMotion();
  const { space, color } = KALASH_VIEW;

  const sheetTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, damping: 32, stiffness: 340 };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
        >
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Daily Bonus streak reminder"
            className="relative z-10 flex w-full flex-col items-center pointer-events-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative z-10 flex justify-center"
              style={{ marginBottom: -ACTION_SHEET_ILLUSTRATION_OVERLAP_PX }}
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ACTION_SHEET_ILLUSTRATION_SRC}
                alt=""
                width={164}
                height={ACTION_SHEET_ILLUSTRATION_HEIGHT_PX}
                className="h-[152px] w-[164px] object-contain"
                draggable={false}
              />
            </div>

            <div
              className="w-full rounded-t-2xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.14)]"
              style={{ paddingBottom: space.safeAreaBottom }}
            >
              <div
                style={{ paddingTop: ACTION_SHEET_ILLUSTRATION_OVERLAP_PX }}
              >
              <div
                className="flex flex-col"
                style={{
                  paddingInline: space.headerGutterX,
                  paddingTop: space.sectionY,
                }}
              >
                <p
                  className="text-center text-[14px] font-normal leading-[20px]"
                  style={{ color: color.label, letterSpacing: "0.2px" }}
                >
                  Uh-Oh, you missed your chance at finishing the Daily Bonus
                  streak!
                </p>

                <div
                  className="flex justify-center"
                  style={{
                    marginTop: space.sectionY,
                    gap: STREAK_CIRCLE_GAP_PX,
                  }}
                  aria-hidden
                >
                  {Array.from({ length: STREAK_DAY_COUNT }, (_, index) => {
                    const dayNumber = index + 1;
                    const borderColor = getStreakCircleBorderColor(dayNumber);
                    const iconSrc = getStreakCircleIconSrc(dayNumber);
                    const iconSizePx = getStreakCircleIconSizePx(dayNumber);
                    const isBorderless = STREAK_BORDERLESS_DAYS.has(dayNumber);

                    return (
                    <div
                      key={index}
                      className="flex shrink-0 flex-col items-center"
                      style={{ width: STREAK_CIRCLE_SIZE_PX }}
                    >
                      <span
                        className="mb-1 text-center text-[12px] font-normal leading-[14px]"
                        style={{
                          color: getStreakLabelColor(dayNumber, color.label),
                          letterSpacing: "0.2px",
                        }}
                      >
                        {dayNumber}
                      </span>
                      <span
                        className={`flex items-center justify-center rounded-full text-[14px] font-medium leading-none ${
                          isBorderless
                            ? ""
                            : `border-2 ${
                                STREAK_SMALL_ICON_DAYS.has(dayNumber)
                                  ? "bg-white"
                                  : "bg-neutral-50"
                              } ${borderColor ? "" : "border-neutral-200"}`
                        }`}
                        style={{
                          width: STREAK_CIRCLE_SIZE_PX,
                          height: STREAK_CIRCLE_SIZE_PX,
                          color: color.label,
                          letterSpacing: "0.2px",
                          ...(!isBorderless && borderColor
                            ? { borderColor }
                            : {}),
                        }}
                      >
                        {iconSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={iconSrc}
                            alt=""
                            className="object-contain"
                            style={{
                              width: iconSizePx,
                              height: iconSizePx,
                            }}
                            aria-hidden
                            draggable={false}
                          />
                        ) : STREAK_EMPTY_CIRCLE_DAYS.has(dayNumber) ? null : (
                          dayNumber
                        )}
                      </span>
                    </div>
                    );
                  })}
                </div>

                <p
                  className="text-center text-[14px] font-normal leading-[20px]"
                  style={{
                    color: color.label,
                    letterSpacing: "0.2px",
                    marginTop: space.sectionY,
                  }}
                >
                  Continue on the journey to win rewards
                </p>

                <div style={{ marginTop: space.sectionY }}>
                  <button
                    type="button"
                    className={`flex h-14 w-full items-center justify-center rounded-full text-[16px] font-medium text-white ${FOCUS_RING}`}
                    style={{ backgroundColor: KALASH_TEAL }}
                    aria-disabled="true"
                  >
                    Save Now
                  </button>
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
