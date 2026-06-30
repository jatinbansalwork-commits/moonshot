import type { SlideDefinition } from "@/types/slide-content";

export const slide21: SlideDefinition = {
  id: "slide-21",
  label: "Booking grid",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-start justify-center pt-10",
  blocks: [
    {
      id: "slide-21-heading",
      type: "title",
      text: "Booking Grid",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-21-body",
      type: "body",
      text: "The booking grid shows the availability of workspaces across a single location. Click and drag on the grid to book a space; admins can drag and drop bookings to different spaces",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-21-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-21",
      alt: "Booking grid showing desk and meeting room availability",
      align: "center",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
