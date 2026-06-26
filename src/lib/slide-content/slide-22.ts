import type { SlideDefinition } from "@/types/slide-content";

export const slide22: SlideDefinition = {
  id: "slide-22",
  label: "Conference grid",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-start justify-center pt-10",
  blocks: [
    {
      id: "slide-22-heading",
      type: "title",
      text: "Conference grid",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-22-body",
      type: "body",
      text: "The conference grid shows available meeting space across location and/or time zones. Create a conference call in a few clicks",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-22-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-22",
      alt: "Conference grid showing meeting room availability across United Kingdom, France, and India",
      align: "center",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
