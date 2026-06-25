import { HERO_SLIDE_BG, SITE_NAME } from "@/lib/constants";
import {
  INDEX_SLIDE_HERO_SIZE_PX,
  INDEX_SLIDE_HERO_SUBTITLE,
  INDEX_SLIDE_HERO_SUBTITLE_SIZE_PX,
} from "@/lib/index-typography";
import type { SlideDefinition } from "@/types/slide-content";

export const heroSlide: SlideDefinition = {
  id: "hero",
  label: SITE_NAME,
  backgroundColor: HERO_SLIDE_BG,
  align: "center",
  blocks: [
    {
      id: "hero-title",
      type: "title",
      text: "Moonshot",
      as: "h1",
      fontSize: INDEX_SLIDE_HERO_SIZE_PX,
    },
    {
      id: "hero-subtitle",
      type: "body",
      text: "Jatin Bansal | Product Designer | Cisco Security",
      as: "h3",
      fontSize: INDEX_SLIDE_HERO_SUBTITLE_SIZE_PX,
      className: `${INDEX_SLIDE_HERO_SUBTITLE} font-normal`,
    },
  ],
};
