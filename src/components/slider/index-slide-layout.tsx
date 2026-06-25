import {
  INDEX_SLIDE_ABOUT_BODY,
  INDEX_SLIDE_ABOUT_TITLE_SIZE_PX,
  INDEX_SLIDE_DEFAULT_TITLE,
  INDEX_SLIDE_PARAGRAPH_SIZE_PX,
} from "@/lib/index-typography";
import type { SlideCoverImage } from "@/types/slide-content";

interface IndexSlideLayoutProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  blockGap?: "gap-4" | "gap-6" | "gap-10" | "gap-20";
  coverImage?: SlideCoverImage;
}

export function IndexSlideLayout({
  children,
  className = "",
  align = "left",
  blockGap = "gap-20",
  coverImage,
}: IndexSlideLayoutProps) {
  const contentAlign =
    align === "center" ? "items-center text-center" : "items-start text-left";

  if (coverImage) {
    const fullBleedRight = coverImage.fullBleedRight ?? false;

    return (
      <div
        className={`relative flex h-full w-full items-stretch ${fullBleedRight ? "py-[50px] pl-[50px] pr-0" : "p-[50px]"} ${className || "text-black"}`}
      >
        <div
          className={`grid h-full w-full grid-cols-2 gap-0 ${fullBleedRight ? "items-stretch" : "items-center"}`}
        >
          <div
            className={`relative z-10 flex flex-col ${blockGap} ${contentAlign} ${fullBleedRight ? "justify-center" : ""}`}
          >
            {children}
          </div>
          <div
            role="img"
            aria-label={coverImage.alt}
            className={
              coverImage.className ??
              (fullBleedRight
                ? `h-full w-full bg-no-repeat bg-right ${coverImage.heightExtra ? "" : "bg-contain"}`
                : "h-full w-full max-h-[min(520px,70vh)] bg-contain bg-center bg-no-repeat")
            }
            style={{
              backgroundImage: `url("${coverImage.src}")`,
              ...(coverImage.heightExtra
                ? {
                    backgroundSize: `auto calc(100% + ${coverImage.heightExtra}px)`,
                    backgroundPosition: "right center",
                  }
                : undefined),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center p-[50px] ${className || "text-black"}`}
    >
      <div
        className={`mx-auto flex w-full max-w-4xl flex-col ${blockGap} ${contentAlign}`}
      >
        {children}
      </div>
    </div>
  );
}

type IndexSlideTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

interface IndexSlideTextProps {
  children: React.ReactNode;
  as?: IndexSlideTextTag;
  typography?: string;
  className?: string;
  fontSize?: number;
}

function renderMultilineText(children: React.ReactNode) {
  if (typeof children !== "string" || !children.includes("\n")) {
    return children;
  }

  const lines = children.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

export function IndexSlideTitle({
  children,
  as = "h3",
  typography,
  className = "",
  fontSize = INDEX_SLIDE_ABOUT_TITLE_SIZE_PX,
}: IndexSlideTextProps) {
  const Tag = as;
  const baseTypography = typography ?? INDEX_SLIDE_DEFAULT_TITLE;

  return (
    <Tag
      className={`${baseTypography} ${className}`.trim()}
      style={{ fontSize }}
    >
      {renderMultilineText(children)}
    </Tag>
  );
}

export function IndexSlideBody({
  children,
  as = "p",
  className = "",
  fontSize = INDEX_SLIDE_PARAGRAPH_SIZE_PX,
}: IndexSlideTextProps) {
  const Tag = as;

  return (
    <Tag
      className={`${INDEX_SLIDE_ABOUT_BODY} ${className}`}
      style={{ fontSize }}
    >
      {children}
    </Tag>
  );
}
