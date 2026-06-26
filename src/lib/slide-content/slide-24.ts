import type { SlideDefinition } from "@/types/slide-content";

export const slide24: SlideDefinition = {
  id: "slide-24",
  label: "Help & Support",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-start justify-center pt-10",
  blocks: [
    {
      id: "slide-24-heading",
      type: "title",
      text: "Help & Support",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-24-body",
      type: "body",
      text: "Help is available from the navigation and the chatbot. Type '/' anywhere to search for anything.",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-24-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-24",
      alt: "Help and support centre with search, popular topics, and category guides",
      align: "center",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
