import type { SlideDefinition } from "@/types/slide-content";
import { SALTMINE_HELP_SUPPORT_MOBILE_FRAME_CLASS } from "@/components/slider/slide-embeds/slide-embed-registry";

export const slide25Mobile: SlideDefinition = {
  id: "slide-25-mobile",
  label: "Mobile app",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black",
  blocks: [
    {
      id: "slide-25-mobile-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-25-mobile",
      alt: "Saltmine mobile app with bookings, find a space, inbox, teams, and workspace tools",
      align: "center",
      wrapperClassName: "w-auto max-w-none flex justify-center",
      className: SALTMINE_HELP_SUPPORT_MOBILE_FRAME_CLASS,
    },
  ],
};
