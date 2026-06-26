import type { ExampleBentoSlideContent } from "@/types/slide-content";
import { DECK_SECTION_LABEL } from "@/lib/deck-presentation";

const DEFAULT_EXAMPLE_BENTO: ExampleBentoSlideContent = {
  eyebrow: "A typical example:",
  statement:
    "Someone would come in hoping to sync with a teammate, only to discover they were working from home or sitting on another floor.",
  topQuestion: "Simple questions like “Where’s my team sitting today?”",
  bottomQuestion: "“Which space should I book?”",
  colors: {
    main: "#FFF5D6",
    topRight: "#E8EDFF",
    bottomRight: "#F3E8FF",
  },
};

interface SaltmineExampleSlideLayoutProps {
  content?: ExampleBentoSlideContent;
}

/** Example / learned bento — presentation layer only. */
export function SaltmineExampleSlideLayout({
  content = DEFAULT_EXAMPLE_BENTO,
}: SaltmineExampleSlideLayoutProps) {
  const colors = { ...DEFAULT_EXAMPLE_BENTO.colors, ...content.colors };

  return (
    <div
      className="grid h-full w-full select-none grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-7 bg-[#F2F0F6] p-14 text-black antialiased index-slide-about-body"
      data-cursor-surface="light"
    >
      <div
        className="flex min-h-0 flex-col rounded-[28px] p-9 text-left shadow-[0_16px_48px_rgba(28,37,46,0.07)]"
        style={{ backgroundColor: colors.main }}
      >
        <p className={DECK_SECTION_LABEL}>{content.eyebrow}</p>
        <p className="index-slide-about-body m-0 mt-5 max-w-[34rem] text-[38px] font-semibold leading-[1.12] tracking-[-0.025em]">
          {content.statement}
        </p>
      </div>

      <div className="flex min-h-0 flex-col gap-6">
        <div
          className="flex min-h-0 flex-1 flex-col rounded-[28px] p-8 text-left shadow-[0_12px_40px_rgba(28,37,46,0.06)]"
          style={{ backgroundColor: colors.topRight }}
        >
          <p className="index-slide-about-body m-0 text-[26px] font-normal leading-[1.35] tracking-tight">
            {content.topQuestion}
          </p>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col rounded-[28px] p-8 text-left shadow-[0_12px_40px_rgba(28,37,46,0.06)]"
          style={{ backgroundColor: colors.bottomRight }}
        >
          <p className="index-slide-about-body m-0 text-[26px] font-normal leading-[1.35] tracking-tight">
            {content.bottomQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}
