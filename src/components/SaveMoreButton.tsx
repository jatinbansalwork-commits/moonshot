import { KALASH_TEAL } from "@/components/slider/kalash/kalash-tokens";
import { FOCUS_RING } from "@/lib/a11y";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

/** Primary Save More CTA — pill with subtle shimmer. */
export function SaveMoreButton() {
  return (
    <div
      style={{
        paddingTop: KALASH_VIEW.space.sectionY,
        paddingInline: KALASH_VIEW.space.headerGutterX,
      }}
    >
      <button
        type="button"
        className={`save-more-shimmer relative flex h-[56px] w-full items-center justify-center overflow-hidden rounded-full text-[17px] font-medium text-white ${FOCUS_RING}`}
        style={{ backgroundColor: KALASH_TEAL }}
      >
        <span className="relative z-10">Save More</span>
      </button>
    </div>
  );
}
