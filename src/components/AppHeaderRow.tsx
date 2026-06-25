"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";
import {
  KALASH_RING_TEAL,
} from "@/components/slider/kalash/kalash-tokens";

const PROFILE_AVATAR_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Group%201244829521.svg";
const LIVE_LOTTIE_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/icon%20live.json";

const RING_SPIN_TRANSITION = {
  repeat: Infinity,
  duration: 8,
  ease: "linear" as const,
};

interface AppHeaderRowProps {
  priceLabel?: string;
  price?: string;
  onAvatarClick?: () => void;
}

function LiveIndicator() {
  const reducedMotion = useReducedMotion();
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(LIVE_LOTTIE_SRC)
      .then((response) => response.json())
      .then((data: object) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!animationData) {
    return <div className="size-9 shrink-0" aria-hidden />;
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center" aria-label="Live">
      <Lottie
        animationData={animationData}
        loop={!reducedMotion}
        autoplay={!reducedMotion}
        className="size-full"
      />
    </div>
  );
}

function HeaderAvatar({ onClick }: { onClick?: () => void }) {
  const reducedMotion = useReducedMotion();

  const avatar = (
    <div className="relative size-[46.2px] shrink-0" aria-label="Profile">
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={RING_SPIN_TRANSITION}
      >
        <svg viewBox="0 0 48 48" className="size-full">
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="none"
            stroke={KALASH_RING_TEAL}
            strokeWidth="2.4"
            strokeDasharray="11 7"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <div className="absolute inset-[5.5px] z-10 overflow-hidden rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE_AVATAR_SRC}
          alt=""
          className="size-full object-cover"
        />
      </div>
    </div>
  );

  if (!onClick) return avatar;

  return (
    <button
      type="button"
      className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0"
      aria-label="Open flashback story"
      onClick={onClick}
    >
      {avatar}
    </button>
  );
}

const HEADER_BELL_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-bell.svg";
const HEADER_TROPHY_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-solar_cup-star-bold.svg";

function HeaderIconSlot({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center" role="img" aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-6 object-contain" />
    </div>
  );
}

function HeaderIconPill() {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200/40 bg-white px-2.5 py-[9px]">
      <HeaderIconSlot src={HEADER_BELL_ICON} label="Notifications" />
      <HeaderIconSlot src={HEADER_TROPHY_ICON} label="Rewards" />
    </div>
  );
}

function LivePricingPill({
  priceLabel,
  price,
}: {
  priceLabel: string;
  price: string;
}) {
  const { color } = KALASH_VIEW;

  return (
    <div className="flex shrink-0 items-center gap-0 rounded-full border border-neutral-200/40 bg-white py-0.5 pl-1.5 pr-2.5">
      <LiveIndicator />

      <div className="flex flex-col justify-center gap-0 pt-[2.5px] pb-[1.5px]">
        <p
          className="whitespace-nowrap text-[10px] font-normal leading-[12px] tracking-tight"
          style={{ color: color.label }}
        >
          {priceLabel}
        </p>
        <p
          className="whitespace-nowrap text-[12px] font-bold leading-tight tracking-tight"
          style={{ color: color.text }}
        >
          {price}
        </p>
      </div>
    </div>
  );
}

/** Top header row — avatar (left) + live pricing pill (right). */
export function AppHeaderRow({
  priceLabel = "Gold Buy Price",
  price = "Dropped",
  onAvatarClick,
}: AppHeaderRowProps) {
  return (
    <div
      className="flex w-full select-none pt-12"
      style={{
        minHeight: KALASH_VIEW.space.headerHeight,
        paddingInline: KALASH_VIEW.space.headerGutterX,
      }}
    >
      <div className="flex w-full items-center justify-between pb-3 pt-4">
        <HeaderAvatar onClick={onAvatarClick} />
        <div className="flex shrink-0 items-center gap-1.5">
          <LivePricingPill priceLabel={priceLabel} price={price} />
          <HeaderIconPill />
        </div>
      </div>
    </div>
  );
}
