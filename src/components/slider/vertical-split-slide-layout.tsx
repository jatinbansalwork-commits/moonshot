import Image from "next/image";
import { SaltmineVisionCard } from "@/components/slider/saltmine-vision-card";
import type { VerticalSplitSlideContent } from "@/types/slide-content";

const DEFAULT_VERTICAL_SPLIT: VerticalSplitSlideContent = {
  leftColor: "#ffffff",
  rightColor: "#ffffff",
  showDivider: true,
};

interface VerticalSplitSlideLayoutProps {
  split?: VerticalSplitSlideContent;
}

/** Equal vertical halves — optional column colours and centre divider. */
export function VerticalSplitSlideLayout({
  split = DEFAULT_VERTICAL_SPLIT,
}: VerticalSplitSlideLayoutProps) {
  return (
    <div className="relative grid h-full w-full select-none grid-cols-2 text-black antialiased">
      <div
        className="flex h-full min-h-0 flex-col items-center overflow-visible px-10 pt-10 pb-0 text-center"
        style={{ backgroundColor: split.leftColor }}
        data-cursor-surface="light"
      >
        {split.leftText ? (
          <p className="index-slide-about-body m-0 mt-8 text-[22px] font-medium leading-snug tracking-tight text-black antialiased">
            {split.leftText}
          </p>
        ) : null}
        {split.leftImage ? (
          <div className="relative mt-auto w-[115.5%] max-w-[601px]">
            <Image
              src={split.leftImage.src}
              alt={split.leftImage.alt}
              width={1201}
              height={924}
              className="block h-auto w-full"
            />
          </div>
        ) : null}
      </div>
      <div
        className="flex h-full min-h-0 flex-col items-center overflow-visible px-[50px] pt-20 pb-0 text-center"
        style={{ backgroundColor: split.rightColor }}
        data-cursor-surface="light"
      >
        {split.rightText ? (
          <p className="index-slide-about-body m-0 text-[22px] font-medium leading-snug tracking-tight text-black antialiased">
            {split.rightText}
          </p>
        ) : null}
        {split.rightImage ? (
          <div className="relative mt-auto w-[127%] max-w-[661px]">
            <Image
              src={split.rightImage.src}
              alt={split.rightImage.alt}
              width={1321}
              height={1016}
              className="block h-auto w-full"
            />
          </div>
        ) : null}
      </div>
      {split.visionCardText ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[50px]">
          <SaltmineVisionCard>
            <p className="index-slide-about-body m-0 text-[20px] font-medium leading-snug tracking-tight antialiased">
              {split.visionCardText}
            </p>
          </SaltmineVisionCard>
        </div>
      ) : null}
      {split.showDivider !== false ? (
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-black/15"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
