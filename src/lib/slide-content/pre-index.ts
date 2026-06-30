import type { SlideDefinition } from "@/types/slide-content";
import {
  INDEX_SLIDE_ABOUT_BODY_SIZE_PX,
  INDEX_SLIDE_ABOUT_TITLE,
} from "@/lib/index-typography";

/** Favourite quote slide — matches About slide layout and typography. */
export const preIndexSlide: SlideDefinition = {
  id: "slide-4",
  label: "Favourite quote",
  blockGap: "gap-10",
  blocks: [
    {
      id: "slide-4-title",
      type: "title",
      text: "My favourite quote",
      fontSize: 24,
      typography: INDEX_SLIDE_ABOUT_TITLE,
      textCase: "sentence",
    },
    {
      id: "slide-4-quote",
      type: "body",
      text: "If I had asked people what they wanted, they would have said faster horses.",
      fontSize: INDEX_SLIDE_ABOUT_BODY_SIZE_PX,
      className: "index-slide-about-body",
      textCase: "preserve",
    },
    {
      id: "slide-4-attribution",
      type: "title",
      text: "Henry Ford",
      as: "h6",
      fontSize: 24,
      className: "font-normal",
      textCase: "preserve",
    },
    {
      id: "slide-4-car",
      type: "image",
      src: "/assets/slide-4-ford-car.png",
      alt: "Vintage Ford automobile",
      width: 434,
      height: 235,
      className: "h-[200px] w-auto object-contain",
      align: "right",
    },
  ],
};
