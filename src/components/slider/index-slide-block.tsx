"use client";

import Image from "next/image";
import { IndexSlideList } from "@/components/slider/index-slide-list";
import {
  isSlideScopedEmbedVariant,
  SlideScopedEmbed,
} from "@/components/slider/slide-embeds/slide-embed-registry";
import { OutcomeMetricsChartSlideEmbed } from "@/components/slider/outcome-metrics-chart-slide-embed";
import {
  SaltmineDashboardSlideCard,
  SaltmineSignInCard,
} from "@/components/slider/saltmine-sign-in-card";
import { SaltmineHelpSupportSlideEmbed } from "@/components/slider/saltmine-help-support-slide-embed";
import { ClipReveal } from "@/components/slider/clip-reveal";
import {
  IndexSlideBody,
  IndexSlideTitle,
} from "@/components/slider/index-slide-layout";
import type { SlideBlock } from "@/types/slide-content";
import { formatSlideText } from "@/lib/text-case";

interface IndexSlideBlockProps {
  block: SlideBlock;
  align?: "left" | "center";
  onGoToSlide?: (index: number) => void;
  slideIndex?: number;
}

function wrapReveal(
  content: React.ReactNode,
  reveal?: boolean,
  revealDelay?: number,
) {
  if (!reveal) return content;
  return <ClipReveal delay={revealDelay}>{content}</ClipReveal>;
}

export function IndexSlideBlock({
  block,
  align = "left",
  onGoToSlide,
  slideIndex,
}: IndexSlideBlockProps) {
  const textAlign = align === "center" ? "text-center" : "text-left";
  const blockClass =
    align === "center"
      ? `index-slide-block w-auto max-w-full ${textAlign}`
      : `index-slide-block w-full ${textAlign}`;

  let element: React.ReactNode;
  const text =
    block.type === "title" || block.type === "body"
      ? formatSlideText(block)
      : null;

  switch (block.type) {
    case "title":
      element = (
        <IndexSlideTitle
          as={block.as}
          typography={block.typography}
          className={[block.className, textAlign].filter(Boolean).join(" ")}
          fontSize={block.fontSize}
        >
          {wrapReveal(text, block.reveal, block.revealDelay)}
        </IndexSlideTitle>
      );
      break;
    case "body":
      element = (
        <IndexSlideBody
          as={block.as}
          typography={block.typography}
          className={[block.className, textAlign].filter(Boolean).join(" ")}
          fontSize={block.fontSize}
        >
          {wrapReveal(text, block.reveal, block.revealDelay)}
        </IndexSlideBody>
      );
      break;
    case "list":
      element = <IndexSlideList block={block} onGoToSlide={onGoToSlide} />;
      break;
    case "image": {
      const imageAlignClass =
        block.align === "right"
          ? "flex justify-end"
          : block.align === "center"
            ? "flex justify-center"
            : "";

      if (block.placeholder) {
        const placeholderFrameClass =
          block.className ??
          "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white";

        element = isSlideScopedEmbedVariant(block.placeholderVariant) ? (
          <SlideScopedEmbed
            variant={block.placeholderVariant}
            frameClassName={block.className}
          />
        ) : block.placeholderVariant === "sign-in" ? (
            <div className={placeholderFrameClass}>
              <SaltmineSignInCard />
            </div>
          ) : block.placeholderVariant === "help-support" ? (
            <div className={placeholderFrameClass}>
              <SaltmineHelpSupportSlideEmbed />
            </div>
          ) : block.placeholderVariant === "outcome-metrics" ? (
            <OutcomeMetricsChartSlideEmbed />
          ) : block.placeholderVariant === "dashboard" ? (
            <div className={placeholderFrameClass}>
              <SaltmineDashboardSlideCard
                preset="deck"
                initialActiveNav={block.dashboardInitialNav ?? "bookings"}
                showInboxNotificationPopup={block.dashboardShowInboxNotificationPopup}
              />
            </div>
          ) : (
            <div
              role="img"
              aria-label={block.alt}
              className={
                block.className ??
                "aspect-video w-full max-w-4xl rounded-[20px] bg-[#E8EDFF]"
              }
            />
          );
      } else {
        const isGif = block.src?.toLowerCase().endsWith(".gif") ?? false;
        const isSvg = block.src?.toLowerCase().endsWith(".svg") ?? false;
        element = (
          <Image
            src={block.src ?? ""}
            alt={block.alt}
            width={block.width ?? 1200}
            height={block.height ?? 720}
            unoptimized={isGif || isSvg}
            className={
              block.className ?? "h-auto w-full max-w-full object-contain"
            }
          />
        );
      }

      const imageBlockClass = [
        "index-slide-block w-full max-w-4xl",
        block.wrapperClassName,
        align === "center" ? "mx-auto text-center" : textAlign,
        imageAlignClass,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div data-slide-block={block.id} className={imageBlockClass}>
          {element}
        </div>
      );
    }
    default:
      return null;
  }

  return (
    <div data-slide-block={block.id} className={blockClass}>
      {element}
    </div>
  );
}
