import type { SlideDefinition } from "@/types/slide-content";

export const slide18: SlideDefinition = {
  id: "slide-18",
  label: "Navigation: You are here",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-stretch pt-10 pb-12",
  contentClassName: "h-full",
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
    {
      id: "slide-18-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-18",
      alt: "My bookings as the default start screen with sidebar navigation",
      align: "center",
      wrapperClassName: "mt-auto w-full max-w-4xl",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
