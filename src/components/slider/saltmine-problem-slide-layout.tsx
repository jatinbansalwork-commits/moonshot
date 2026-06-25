import { DEFAULT_PROBLEM_SPLIT } from "@/lib/slide-content/problem-split-defaults";
import type { ProblemSplitSlideContent } from "@/types/slide-content";

interface SaltmineProblemSlideLayoutProps {
  content?: ProblemSplitSlideContent;
  backgroundColor?: string;
}

/** Saltmine problem / solution split layout. */
export function SaltmineProblemSlideLayout({
  content = DEFAULT_PROBLEM_SPLIT,
  backgroundColor = "#F2F0F6",
}: SaltmineProblemSlideLayoutProps) {
  const showRightColumn = content.showRightColumn !== false;

  return (
    <div
      className={`relative grid h-full w-full select-none text-black antialiased ${showRightColumn ? "grid-cols-2" : "grid-cols-1"}`}
      style={{ backgroundColor }}
    >
      <div
        className="flex min-h-0 flex-col justify-center px-[50px] py-[50px] text-left"
        data-cursor-surface="light"
      >
        <div className="flex flex-col gap-0">
          <p className="index-slide-about-title m-0 text-[24px] font-normal leading-snug tracking-tight">
            {content.leftLabel}
          </p>
          <p
            className={`index-slide-about-body m-0 ${content.leftStatementMaxWidth ?? "max-w-xl"} text-[52px] font-normal leading-snug tracking-tight`}
          >
            {content.leftStatement}
          </p>
          {content.leftLabelBelow ? (
            <p className="index-slide-about-body m-0 mt-[12px] max-w-xl text-[18px] font-normal leading-snug tracking-tight">
              {content.leftLabelBelow}
            </p>
          ) : null}
        </div>
      </div>

      {showRightColumn ? (
        <div
          className="flex min-h-0 flex-col justify-center px-[50px] py-[50px] text-left"
          data-cursor-surface="light"
        >
          <div className="flex flex-col gap-0">
            <p
              className={`index-slide-about-title m-0 text-[24px] leading-snug tracking-tight ${content.rightLabelBold ? "font-bold" : "font-normal"}`}
            >
              {content.rightLabel}
            </p>
            <ul className="index-slide-about-body m-0 mt-10 list-disc space-y-[12px] pl-6 text-[24px] font-normal leading-snug tracking-tight">
              {content.rightBullets?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {showRightColumn ? (
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-black"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
