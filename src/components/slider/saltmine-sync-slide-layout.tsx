import { SaltmineVisionCard } from "@/components/slider/saltmine-vision-card";

const SYNC_PAIN_POINTS = [
  "Visibility",
  "Quick coordination",
  "Easy access to help",
] as const;

/** Slide 7 — Saltmine Sync opportunity split layout. */
export function SaltmineSyncSlideLayout() {
  return (
    <div className="grid h-full w-full select-none grid-cols-2 text-black antialiased">
      <div
        className="flex flex-col items-start justify-center bg-[#F2F0F6] px-14 text-left"
        data-cursor-surface="light"
      >
        <div className="flex w-full flex-col items-start gap-0 text-left">
          <span className="block self-start text-[64px] leading-none" aria-hidden>
            👀
          </span>
          <h2 className="index-slide-about-body m-0 w-full max-w-md self-start text-left text-[44px] font-normal leading-[1.05] tracking-tight antialiased">
            How Sync comes into picture?
          </h2>
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col">
        <div
          className="relative flex min-h-0 flex-1 basis-0 flex-col items-center justify-center bg-[#AECDFF] px-10 py-10 text-center"
          data-cursor-surface="light"
        >
          <p className="index-slide-about-body m-0 max-w-md text-[22.4px] font-normal leading-snug tracking-tight antialiased">
            Hybrid work culture were slowing down because
          </p>
          <ul className="m-0 mt-5 flex w-full max-w-[320px] list-none flex-col gap-4 p-0">
            {SYNC_PAIN_POINTS.map((label) => (
              <li key={label}>
                <span className="index-slide-about-body block rounded-full bg-white px-8 py-4 text-[20px] font-medium leading-none tracking-tight antialiased">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative flex min-h-0 flex-1 basis-0 flex-col items-center bg-[#B8D9B8] px-10 py-10 text-center"
          data-cursor-surface="light"
        >
          <div className="flex shrink-0 flex-col items-center gap-0 text-center">
            <span
              className="-mt-7 text-[56px] leading-none"
              aria-hidden
            >
              👑
            </span>
            <p className="index-slide-about-body m-0 text-[22.4px] font-normal leading-snug tracking-tight antialiased">
              Huge opportunity for Saltmine
            </p>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <SaltmineVisionCard>
              <p className="index-slide-about-body m-0 text-[20px] font-medium leading-snug tracking-tight antialiased">
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
