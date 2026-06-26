import { SaltmineVisionCard } from "@/components/slider/saltmine-vision-card";
import { DeckPresentationHeader } from "@/components/slider/deck-presentation-chrome";
import type { DeckPresentation } from "@/lib/deck-presentation";

const SYNC_PAIN_POINTS = [
  "Visibility",
  "Quick coordination",
  "Easy access to help",
] as const;

/** Slide 7 — Saltmine Sync opportunity split layout. */
export function SaltmineSyncSlideLayout({
  presentation,
}: {
  presentation?: DeckPresentation;
}) {
  return (
    <div className="grid h-full w-full select-none grid-cols-2 text-black antialiased">
      <div
        className="flex flex-col items-start justify-center bg-[#F2F0F6] px-14 py-14 text-left"
        data-cursor-surface="light"
      >
        <div className="flex w-full max-w-md flex-col items-start gap-5 text-left">
          <DeckPresentationHeader presentation={presentation} />
          <span className="block text-[56px] leading-none" aria-hidden>
            👀
          </span>
          <h2 className="index-slide-about-body m-0 w-full text-left text-[46px] font-semibold leading-[1.06] tracking-[-0.03em] antialiased">
            How Sync comes into picture?
          </h2>
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col">
        <div
          className="relative flex min-h-0 flex-1 basis-0 flex-col items-center justify-center bg-[#AECDFF] px-12 py-12 text-center"
          data-cursor-surface="light"
        >
          <p className="index-slide-about-body m-0 max-w-sm text-[20px] font-normal leading-[1.5] tracking-tight text-black/80 antialiased">
            Hybrid work culture were slowing down because
          </p>
          <ul className="m-0 mt-6 flex w-full max-w-[300px] list-none flex-col gap-3 p-0">
            {SYNC_PAIN_POINTS.map((label) => (
              <li key={label}>
                <span className="index-slide-about-body block rounded-full bg-white/95 px-7 py-3.5 text-[18px] font-medium leading-none tracking-tight shadow-[0_8px_24px_rgba(28,37,46,0.08)] antialiased">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative flex min-h-0 flex-1 basis-0 flex-col items-center bg-[#B8D9B8] px-12 py-12 text-center"
          data-cursor-surface="light"
        >
          <div className="flex shrink-0 flex-col items-center gap-1 text-center">
            <span className="-mt-6 text-[52px] leading-none" aria-hidden>
              👑
            </span>
            <p className="index-slide-about-body m-0 text-[20px] font-medium leading-snug tracking-tight antialiased">
              Huge opportunity for Saltmine
            </p>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <SaltmineVisionCard>
              <p className="index-slide-about-body m-0 text-[18px] font-medium leading-[1.45] tracking-tight antialiased">
                Direction that could add value into Saltmine&apos;s long-term
                product vision
              </p>
            </SaltmineVisionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
