"use client";

import type { ReactNode } from "react";
import {
  DECK_EYEBROW,
  DECK_PRODUCT_FRAME,
  DECK_PRODUCT_STAGE_GLOW,
  type DeckPresentation,
} from "@/lib/deck-presentation";

interface DeckSectionLabelProps {
  children: ReactNode;
}

export function DeckSectionLabel({ children }: DeckSectionLabelProps) {
  return <p className={DECK_EYEBROW}>{children}</p>;
}

interface DeckProductStageProps {
  children: ReactNode;
  className?: string;
  frameClassName?: string;
}

/** Elevates a product screenshot without modifying the product UI inside. */
export function DeckProductStage({
  children,
  className = "",
  frameClassName,
}: DeckProductStageProps) {
  return (
    <div className={`relative mx-auto w-full ${className}`.trim()}>
      <div className={DECK_PRODUCT_STAGE_GLOW} aria-hidden />
      <div className={frameClassName ?? DECK_PRODUCT_FRAME}>{children}</div>
    </div>
  );
}

interface DeckPresentationHeaderProps {
  presentation?: DeckPresentation;
}

export function DeckPresentationHeader({
  presentation,
}: DeckPresentationHeaderProps) {
  if (!presentation?.sectionLabel) return null;

  return <DeckSectionLabel>{presentation.sectionLabel}</DeckSectionLabel>;
}
