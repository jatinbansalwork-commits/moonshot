import Image from "next/image";
import { StintsLogoStack } from "@/components/slider/stints-logo-stack";

const STINTS_SLIDE_IMAGE = "/assets/stints/stints-slide-full.png";
const STINTS_STARTED_IMAGE =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/WhatsApp%20Image%202026-06-24%20at%201.51.34%20PM.jpeg";
const STINTS_CISCO_IMAGE =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/group1.png";

function StintsColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="index-slide-type index-slide-about-title m-0 min-h-[44px] max-w-[280px] shrink-0 text-center text-xl font-normal leading-snug tracking-tight text-black">
      {children}
    </h3>
  );
}

function StintsColumnCrop({
  alt,
  align,
  src = STINTS_SLIDE_IMAGE,
  crop = true,
}: {
  alt: string;
  align: "left" | "right";
  src?: string;
  crop?: boolean;
}) {
  if (!crop) {
    return (
      <div className="relative w-[243px] max-w-[81%] shrink-0 overflow-hidden rounded-[16px]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1600}
          className="block h-auto w-full"
          priority
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-0 w-full max-w-[300px] flex-1 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={3600}
        height={2025}
        className={`absolute top-[-6%] h-auto w-[300%] max-w-none ${
          align === "left"
            ? "left-0"
            : "left-auto right-0 -translate-x-[66.666%]"
        }`}
        priority
      />
    </div>
  );
}

const STINTS_COLUMN_CLASS =
  "flex min-h-0 flex-col items-center justify-start gap-6 overflow-hidden px-8 pt-12 pb-8";

export function ManifestStintsLayout() {
  return (
    <div className="grid h-full w-full select-none grid-cols-3 bg-white antialiased text-black">
      <div
        className={`relative bg-[#e9ff00] ${STINTS_COLUMN_CLASS}`}
        data-cursor-surface="light"
      >
        <StintsColumnHeading>Started from here</StintsColumnHeading>
        <StintsColumnCrop
          alt="Google Maps mobile mockup showing Karnal navigation"
          align="left"
          src={STINTS_STARTED_IMAGE}
          crop={false}
        />
      </div>

      <div
        className={`bg-white ${STINTS_COLUMN_CLASS}`}
        data-cursor-surface="light"
      >
        <StintsColumnHeading>Few notable stints...</StintsColumnHeading>
        <StintsLogoStack />
      </div>

      <div
        className={`relative bg-[#b57cff] ${STINTS_COLUMN_CLASS}`}
        data-cursor-surface="light"
      >
        <StintsColumnHeading>
          Recently Product Designer at Cisco
        </StintsColumnHeading>
        <StintsColumnCrop
          alt="Cisco collaboration UI with chat and video tiles"
          align="right"
          src={STINTS_CISCO_IMAGE}
          crop={false}
        />
      </div>
    </div>
  );
}
