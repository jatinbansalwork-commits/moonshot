"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

/** Design reference: /assets/kalash-promo-strip-reference.png */
const PROMO_BADGE_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Component%203.svg";

/** Visible badge width — matches SVG artboard (154×32) */
const PROMO_BADGE_WIDTH_PX = 154;

const PROMO_LETTER_SPACING = "0.2px";

function PromoPhrase() {
  return <>Buy above ₹1000 and get 3% extra gold</>;
}

const MARQUEE_SEGMENTS_PER_HALF = 4;

const MARQUEE_TEXT_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap text-[14px] font-medium leading-none";

function PromoMarqueeSeparator() {
  return (
    <span
      className="inline-flex shrink-0 px-3"
      style={{ color: KALASH_VIEW.color.text }}
      aria-hidden
    >
      |
    </span>
  );
}

function PromoMarqueeSegment() {
  return (
    <>
      <PromoPhrase />
      <PromoMarqueeSeparator />
    </>
  );
}

function PromoMarqueeHalf() {
  return (
    <span
      className={MARQUEE_TEXT_CLASS}
      style={{
        letterSpacing: PROMO_LETTER_SPACING,
        color: KALASH_VIEW.color.text,
      }}
    >
      {Array.from({ length: MARQUEE_SEGMENTS_PER_HALF }, (_, index) => (
        <PromoMarqueeSegment key={index} />
      ))}
    </span>
  );
}

function PromoMarqueeTrack() {
  return (
    <div className="flex w-max animate-promo-marquee will-change-transform">
      <PromoMarqueeHalf />
      <PromoMarqueeHalf aria-hidden />
    </div>
  );
}

/** Fixed kalash Exclusive badge with scrolling promo copy behind it. */
export function PromoStrip() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative h-8 w-full overflow-hidden bg-white">
      <div className="absolute top-0 bottom-0 left-0 z-0 w-full overflow-hidden">
        {reducedMotion ? (
          <div className="flex h-full items-center justify-start">
            <span
              className="whitespace-nowrap text-[14px] font-medium leading-none"
              style={{
                letterSpacing: PROMO_LETTER_SPACING,
                color: KALASH_VIEW.color.text,
              }}
            >
              <PromoPhrase />
            </span>
          </div>
        ) : (
          <div className="flex h-full items-center">
            <PromoMarqueeTrack />
          </div>
        )}
      </div>

      {/* Opaque mask — blocks marquee from showing through SVG transparent edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 bg-white"
        style={{ width: PROMO_BADGE_WIDTH_PX }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 overflow-hidden bg-white"
        style={{ width: PROMO_BADGE_WIDTH_PX }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROMO_BADGE_SRC}
          alt=""
          width={PROMO_BADGE_WIDTH_PX}
          height={32}
          className="block h-8 w-full shrink-0 object-cover object-left"
        />
      </div>
    </div>
  );
}
