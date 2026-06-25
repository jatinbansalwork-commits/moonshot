"use client";

import { FOCUS_RING, TARGET_HIT_AREA } from "@/lib/a11y";
import { formatSlideText } from "@/lib/text-case";
import type { SlideListBlock } from "@/types/slide-content";

interface IndexSlideListProps {
  block: SlideListBlock;
  onGoToSlide?: (index: number) => void;
}

export function IndexSlideList({ block, onGoToSlide }: IndexSlideListProps) {
  return (
    <ul className="index-slide-list m-0 flex w-full list-none flex-col gap-3 p-0">
      {block.items.map((item) => {
        const label = formatSlideText({
          id: item.id,
          type: "title",
          text: item.label,
          textCase: "preserve",
        });
        const rowClass = "index-slide-row group w-full text-left";

        return (
          <li key={item.id}>
            {item.slideIndex !== undefined ? (
              <button
                type="button"
                onClick={() => onGoToSlide?.(item.slideIndex!)}
                className={`${rowClass} ${TARGET_HIT_AREA} ${FOCUS_RING}`}
              >
                <span className="index-slide-row__title">{label}</span>
              </button>
            ) : (
              <div className={rowClass}>
                <span className="index-slide-row__title">{label}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
