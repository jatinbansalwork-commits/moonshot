import type { SlideDefinition } from "@/types/slide-content";

export const slide19: SlideDefinition = {
  id: "slide-19",
  label: "Booking timeline",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-stretch pt-10 pb-12",
  contentClassName: "h-full",
  blocks: [
    {
      id: "slide-19-heading",
      type: "title",
      text: "The Booking Timeline",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-19-body",
      type: "body",
      text: "The timeline gives a time-sensitive, actionable overview of who, what, where and when",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-19-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-19",
      alt: "My bookings timeline with today and tomorrow reservations",
      align: "center",
      wrapperClassName: "mt-auto w-full max-w-4xl",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
