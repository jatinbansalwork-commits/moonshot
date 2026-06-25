import type { SlideDefinition } from "@/types/slide-content";

export const slide18: SlideDefinition = {
  id: "slide-18",
  label: "Navigation: You are here",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-center justify-center",
  blocks: [
    {
      id: "slide-18-heading",
      type: "title",
      text: "Navigation: You are here",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-18-body",
      type: "body",
      text: "My bookings is the start screen for all users — core tasks are directly accessible from the navigation",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
  ],
};
