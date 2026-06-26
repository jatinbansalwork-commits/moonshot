import type { SlideDefinition } from "@/types/slide-content";

export const slide17: SlideDefinition = {
  id: "slide-17",
  label: "Onboarding experience",
  backgroundColor: "#F2F0F6",
  align: "center",
  blockGap: "gap-4",
  className: "text-black !items-stretch pt-10 pb-12",
  contentClassName: "h-full",
  blocks: [
    {
      id: "slide-17-heading",
      type: "title",
      text: "Onboarding experience",
      textCase: "preserve",
      fontSize: 20,
      className: "index-slide-about-body !font-bold !leading-snug",
    },
    {
      id: "slide-17-body",
      type: "body",
      text: "A simpler setup process: confirm your default office location, create your team (optional), and you're good to go",
      textCase: "preserve",
      fontSize: 17,
      className: "index-slide-about-body max-w-3xl !leading-snug",
    },
    {
      id: "slide-17-media",
      type: "image",
      placeholder: true,
      placeholderVariant: "slide-17",
      alt: "Sign in to your account screen",
      align: "center",
      wrapperClassName: "mt-auto w-full max-w-4xl",
      className:
        "mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]",
    },
  ],
};
