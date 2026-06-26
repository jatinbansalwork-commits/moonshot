import { DEFAULT_PROBLEM_SPLIT } from "@/lib/slide-content/problem-split-defaults";
import { DECK_SECTION_LABEL } from "@/lib/deck-presentation";
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
        className={`flex min-h-0 flex-col justify-center px-14 py-14 ${showRightColumn ? "text-left" : "items-center text-center"}`}
        data-cursor-surface="light"
      >
        <div
          className={`flex flex-col gap-4 ${showRightColumn ? "max-w-3xl" : "max-w-4xl items-center"}`}
        >
          <p className={DECK_SECTION_LABEL}>{content.leftLabel}</p>
          <p
            className={`index-slide-about-body m-0 ${content.leftStatementMaxWidth ?? "max-w-xl"} ${showRightColumn ? "text-[48px]" : "text-center text-[56px]"} font-normal leading-[1.08] tracking-[-0.025em]`}
          >
            {content.leftStatement}
          </p>
          {content.leftLabelBelow ? (
            <p className={`index-slide-about-body m-0 max-w-xl text-[17px] font-normal leading-[1.55] text-black/68 ${showRightColumn ? "" : "text-center"}`}>
              {content.leftLabelBelow}
            </p>
          ) : null}
        </div>
      </div>

      {showRightColumn ? (
        <div
          className="flex min-h-0 flex-col justify-center px-14 py-14 text-left"
          data-cursor-surface="light"
        >
          <div className="flex max-w-md flex-col gap-8">
            <p
              className={`index-slide-about-title m-0 text-[22px] leading-snug tracking-tight ${content.rightLabelBold ? "font-semibold" : "font-normal"}`}
            >
              {content.rightLabel}
            </p>
            <ul className="index-slide-about-body m-0 list-none space-y-5 p-0 text-[20px] font-normal leading-[1.45] tracking-tight text-black/85">
              {content.rightBullets?.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-black/70" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {showRightColumn ? (
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-black/10"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
