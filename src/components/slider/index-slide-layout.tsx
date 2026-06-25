import {
  INDEX_SLIDE_ABOUT_BODY,
  INDEX_SLIDE_ABOUT_TITLE_SIZE_PX,
  INDEX_SLIDE_DEFAULT_TITLE,
  INDEX_SLIDE_PARAGRAPH_SIZE_PX,
} from "@/lib/index-typography";

interface IndexSlideLayoutProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  blockGap?: "gap-10" | "gap-20";
}

export function IndexSlideLayout({
  children,
  className = "",
  align = "left",
  blockGap = "gap-20",
}: IndexSlideLayoutProps) {
  const contentAlign =
    align === "center" ? "items-center text-center" : "items-start text-left";

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
      {children}
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
