import Image from "next/image";

const STINTS_LOGOS_IMAGE =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/Group%201244830018.png";

export function StintsLogoStack() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <Image
        src={STINTS_LOGOS_IMAGE}
        alt="Cisco, Saltmine, Fresh Prints, piggy, open, and drivezy logos"
        width={480}
        height={914}
        className="block h-auto w-[240px] max-w-full"
        priority
      />
    </div>
  );
}
