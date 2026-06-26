"use client";

import Image from "next/image";
import {
  isSlideScopedEmbedVariant,
  SlideScopedEmbed,
} from "@/components/slider/slide-embeds/slide-embed-registry";
import {
  SaltmineDashboardSlideCard,
  SaltmineSignInCard,
} from "@/components/slider/saltmine-sign-in-card";
import type { HorizontalSplitSlideContent, SplitSlideHalfContent } from "@/types/slide-content";

const DEFAULT_HORIZONTAL_SPLIT: HorizontalSplitSlideContent = {
  topColor: "#ffffff",
  bottomColor: "#ffffff",
  showDivider: true,
};

const MOCKUP_FRAME_WIDTH = 880;
const MOCKUP_FRAME_HEIGHT = 530;
const COMPACT_MOCKUP_SCALE = 0.36;
const FULL_MOCKUP_SCALE = 0.58;

interface HorizontalSplitSlideLayoutProps {
  split?: HorizontalSplitSlideContent;
}

function SlideTitleBody({
  title,
  body,
  align = "center",
  compact = false,
  bodyPadding,
  titleFontSize,
}: {
  title?: string;
  body?: string;
  align?: "left" | "center";
  compact?: boolean;
  bodyPadding?: number;
  titleFontSize?: number;
}) {
  if (!title && !body) return null;

  const alignClass =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`mx-auto flex w-full max-w-4xl flex-col ${compact ? "gap-2" : "gap-4"} ${alignClass}`}>
      {title ? (
        <p
          className={`index-slide-about-body m-0 w-full !font-semibold !leading-tight ${align === "center" ? "text-center" : ""}`}
          style={{ fontSize: titleFontSize ?? (compact ? 15 : 20) }}
        >
          {title}
        </p>
      ) : null}
      {body ? (
        <p
          className={`index-slide-about-body m-0 !leading-[1.55] text-black/72 ${compact ? "line-clamp-3 w-[70%] max-w-[33.6rem]" : "w-full max-w-3xl"} ${align === "center" ? "mx-auto text-center" : ""}`}
          style={{
            fontSize: compact ? 14 : 17,
            ...(bodyPadding != null ? { padding: bodyPadding } : null),
          }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function SplitHalfPlaceholder({
  half,
  compact = false,
}: {
  half: SplitSlideHalfContent;
  compact?: boolean;
}) {
  const frameClass =
    half.placeholderClassName ??
    "relative min-h-0 w-full flex-1 overflow-hidden rounded-[12px] border border-black/10 bg-white shadow-[0_4px_16px_rgba(28,37,46,0.08)]";

  if (isSlideScopedEmbedVariant(half.placeholderVariant)) {
    return (
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <SlideScopedEmbed variant={half.placeholderVariant} />
      </div>
    );
  }

  if (half.placeholderVariant === "sign-in") {
    return (
      <div className={frameClass}>
        <SaltmineSignInCard />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: MOCKUP_FRAME_WIDTH,
          height: MOCKUP_FRAME_HEIGHT,
          transform: `scale(${compact ? COMPACT_MOCKUP_SCALE : FULL_MOCKUP_SCALE})`,
        }}
      >
        <SaltmineDashboardSlideCard
          preset="deck"
          initialActiveNav={half.dashboardInitialNav ?? "bookings"}
          initialViewMode={half.dashboardInitialViewMode}
        />
      </div>
    </div>
  );
}

function SplitHalfCell({
  half,
  className = "px-[50px] py-10",
  textAlign = "center",
  compact = false,
}: {
  half: SplitSlideHalfContent;
  className?: string;
  textAlign?: "left" | "center";
  compact?: boolean;
}) {
  const alignClass =
    textAlign === "left" ? "items-start text-left" : "items-center text-center";
  const hasPlaceholder = half.placeholder;
  const justifyClass = hasPlaceholder ? "justify-start" : "justify-center";

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col gap-2 overflow-hidden ${justifyClass} ${alignClass} ${className}`}
      style={{ backgroundColor: half.color }}
      data-cursor-surface="light"
    >
      {half.backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${half.backgroundImage.src}")` }}
          role="img"
          aria-label={half.backgroundImage.alt}
        />
      ) : null}
      <div
        className={`relative z-[1] flex min-h-0 w-full flex-1 flex-col gap-2 ${justifyClass} ${alignClass}`}
      >
      {half.title || half.body ? (
        <SlideTitleBody
          title={half.title}
          body={half.body}
          align={textAlign}
          compact={compact}
        />
      ) : half.text ? (
        <p className="index-slide-about-body m-0 text-[24px] font-normal leading-snug tracking-tight text-black antialiased">
          {half.text}
        </p>
      ) : null}
      {half.placeholder ? (
        <SplitHalfPlaceholder half={half} compact={compact} />
      ) : half.image ? (
        <div className="relative mt-4 w-full max-w-[520px]">
          <Image
            src={half.image.src}
            alt={half.image.alt}
            width={half.image.width ?? 1040}
            height={half.image.height ?? 600}
            className="block h-auto w-full"
          />
        </div>
      ) : null}
      </div>
    </div>
  );
}

/** Equal horizontal halves — bottom row can nest a 50/50 vertical split. */
export function HorizontalSplitSlideLayout({
  split = DEFAULT_HORIZONTAL_SPLIT,
}: HorizontalSplitSlideLayoutProps) {
  const bottomVertical = split.bottomVerticalSplit;

  return (
    <div className="relative grid h-full w-full select-none grid-rows-2 text-black antialiased">
      <div
        className="flex h-full min-h-0 flex-col items-center justify-start gap-2 overflow-hidden px-14 pt-12 pb-5 text-center"
        style={{ backgroundColor: split.topColor }}
        data-cursor-surface="light"
      >
        {split.topTitle || split.topBody ? (
          <SlideTitleBody
            title={split.topTitle}
            body={split.topBody}
            align="center"
            compact
            titleFontSize={split.topTitleFontSize}
            bodyPadding={split.topBodyPadding}
          />
        ) : split.topText ? (
          <p className="index-slide-about-body m-0 mx-auto max-w-4xl text-center text-[24px] font-normal leading-snug tracking-tight">
            {split.topText}
          </p>
        ) : null}
        {split.topPlaceholderVariant ? (
          <SlideScopedEmbed variant={split.topPlaceholderVariant} />
        ) : split.topShowDeckDaySection ? (
          <SlideScopedEmbed variant="slide-20-deck-day" />
        ) : null}
        {split.topTitleBelowEmbed || split.topBodyBelowEmbed ? (
          <SlideTitleBody
            title={split.topTitleBelowEmbed}
            body={split.topBodyBelowEmbed}
            align="center"
            compact
          />
        ) : split.topRepeatTitleBodyBelowEmbed && (split.topTitle || split.topBody) ? (
          <SlideTitleBody title={split.topTitle} body={split.topBody} align="center" />
        ) : null}
        {split.topImage ? (
          <div className="relative mt-4 w-full max-w-[520px]">
            <Image
              src={split.topImage.src}
              alt={split.topImage.alt}
              width={split.topImage.width ?? 1040}
              height={split.topImage.height ?? 600}
              className="block h-auto w-full"
            />
          </div>
        ) : null}
      </div>

      {bottomVertical ? (
        <div className="relative grid h-full min-h-0 grid-cols-2">
          <SplitHalfCell
            half={bottomVertical.left}
            className="px-6 py-6"
            textAlign="center"
            compact
          />
          <SplitHalfCell
            half={bottomVertical.right}
            className="px-6 py-6"
            textAlign="center"
            compact
          />
          {bottomVertical.showDivider !== false ? (
            <div
              className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-black/15"
              aria-hidden
            />
          ) : null}
        </div>
      ) : (
        <SplitHalfCell
          half={{
            color: split.bottomColor,
            text: split.bottomText,
            image: split.bottomImage,
          }}
        />
      )}

      {split.showDivider !== false ? (
        <div
          className="pointer-events-none absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-black/15"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
