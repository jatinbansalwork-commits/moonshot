import type { SlideDefinition } from "@/types/slide-content";

export const slide19: SlideDefinition = {
  id: "slide-19",
  label: "The Booking Timeline",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-start justify-center pt-10",
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
      placeholderVariant: "dashboard",
      dashboardInitialNav: "bookings",
      alt: "My bookings timeline with today and tomorrow reservations",
      align: "center",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
