import type { SlideDefinition } from "@/types/slide-content";

export const slide25: SlideDefinition = {
  id: "slide-25",
  label: "Outcome",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-stretch pt-10 pb-12",
  contentClassName: "h-full",
  blocks: [
    {
      id: "slide-25-heading",
      type: "title",
      text: "Outcome",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-25-body",
      type: "body",
      text: "More work was needed to complete this design. It was fun to work on this concept, and the result we found was amazing.",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-25-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "outcome-metrics",
      alt: "Outcome metrics showing 25% increase in user confidence, 96% SUS score, and 40% increase in clarity",
      align: "center",
      wrapperClassName: "mt-auto",
    },
  ],
};
