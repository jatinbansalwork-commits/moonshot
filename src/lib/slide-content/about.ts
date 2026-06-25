import type { SlideDefinition } from "@/types/slide-content";
import { INDEX_SLIDE_ABOUT_BODY_SIZE_PX, INDEX_SLIDE_ABOUT_TITLE } from "@/lib/index-typography";

export const aboutSlide: SlideDefinition = {
  id: "about",
  label: "About me",
  blockGap: "gap-10",
  blocks: [
    {
      id: "about-title",
      type: "title",
      text: "About me",
      fontSize: 24,
      typography: INDEX_SLIDE_ABOUT_TITLE,
      textCase: "sentence",
    },
    {
      id: "about-experience",
      type: "body",
      text: "I have 9+ years of experience in designing products and 6+ years of experience in crafting micro-interactions, design systems, and end-to-end products for organisations that operate at scale.",
      fontSize: INDEX_SLIDE_ABOUT_BODY_SIZE_PX,
      className: "index-slide-about-body",
    },
    {
      id: "about-office-hours",
      type: "title",
      text: "& if you're looking for me during office hours, I'm probably sitting next to the front-end team — making sure every pixel lands just right.",
      as: "h6",
      fontSize: 24,
      className: "font-normal",
    },
  ],
};
