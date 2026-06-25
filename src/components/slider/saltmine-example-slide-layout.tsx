import type { ExampleBentoSlideContent } from "@/types/slide-content";

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

/** Slide 13 — example scenario with stacked question panels. */
export function SaltmineExampleSlideLayout({
  content = DEFAULT_EXAMPLE_BENTO,
}: SaltmineExampleSlideLayoutProps) {
  const colors = { ...DEFAULT_EXAMPLE_BENTO.colors, ...content.colors };

  return (
    <div
      className="grid h-full w-full select-none grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-6 bg-white p-[50px] text-black antialiased index-slide-about-body"
      data-cursor-surface="light"
    >
      <div
        className="flex min-h-0 flex-col rounded-[28px] p-8 text-left"
        style={{ backgroundColor: colors.main }}
      >
        <p className="index-slide-about-body m-0 text-[18px] font-normal leading-snug tracking-tight">
          {content.eyebrow}
        </p>
        <p className="index-slide-about-body m-0 mt-6 max-w-[34rem] text-[40px] font-medium leading-snug tracking-tight">
          {content.statement}
        </p>
      </div>

      <div className="flex min-h-0 flex-col gap-6">
        <div
          className="flex min-h-0 flex-1 flex-col rounded-[28px] p-8 text-left"
          style={{ backgroundColor: colors.topRight }}
        >
          <p className="index-slide-about-body m-0 text-[28px] font-normal leading-snug tracking-tight">
            {content.topQuestion}
          </p>
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col rounded-[28px] p-8 text-left"
          style={{ backgroundColor: colors.bottomRight }}
        >
          <p className="index-slide-about-body m-0 text-[28px] font-normal leading-snug tracking-tight">
            {content.bottomQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}
