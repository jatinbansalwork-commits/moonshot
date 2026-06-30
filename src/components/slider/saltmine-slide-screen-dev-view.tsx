"use client";

import Link from "next/link";
import { DEFAULT_SLIDE_EMBED_FRAME_CLASS } from "@/components/slider/slide-embeds/slide-embed-registry";
import { renderSaltmineSlideScreen } from "@/components/slider/slide-screens/render-saltmine-slide-screen";
import {
  getSaltmineSlideScreenPath,
  SALTMINE_SLIDE_SCREENS,
  type SaltmineSlideScreenEntry,
} from "@/lib/saltmine-slide-screens";

const DASHBOARD_WIDTH = 880;
const DASHBOARD_HEIGHT = 530;

function SlideScreenPreview({ entry }: { entry: SaltmineSlideScreenEntry }) {
  const content = renderSaltmineSlideScreen(entry.variant);

  if (entry.framed) {
    const width = entry.frameSize?.width ?? DASHBOARD_WIDTH;
    const height = entry.frameSize?.height ?? DASHBOARD_HEIGHT;
    const frameClass = entry.frameClassName ?? DEFAULT_SLIDE_EMBED_FRAME_CLASS;

    return (
      <div className={frameClass} style={{ width, height }}>
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] w-full max-w-3xl items-center justify-center rounded-[20px] border border-black/10 bg-white p-8 shadow-[0_8px_32px_rgba(28,37,46,0.08)]">
      {content}
    </div>
  );
}

export function SaltmineSlideScreenDevView({ entry }: { entry: SaltmineSlideScreenEntry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#EEF2F6] p-8">
      <div className="flex max-w-3xl flex-col items-center gap-2 text-center">
        <p className="m-0 text-[13px] font-medium text-[#637381]">
          Dev preview — slide {entry.slug}
        </p>
        <p className="m-0 text-[15px] font-semibold text-[#1C252E]">{entry.label}</p>
        <p className="m-0 text-[12px] text-[#637381]">
          Edit{" "}
          <code className="rounded-md border border-[#DFE3E8] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#1C252E]">
            {entry.screenFile}
          </code>
          {entry.configFile ? (
            <>
              {" "}
              and{" "}
              <code className="rounded-md border border-[#DFE3E8] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#1C252E]">
                {entry.configFile}
              </code>
            </>
          ) : null}
        </p>
        <Link
          href="/dev/saltmine"
          className="text-[12px] font-medium text-[#006FEC] underline-offset-2 hover:underline"
        >
          All Saltmine flows
        </Link>
      </div>
      <SlideScreenPreview entry={entry} />
    </div>
  );
}

export function SaltmineSlideScreenIndexDevView() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-[#EEF2F6] p-8">
      <div>
        <Link
          href="/dev/saltmine"
          className="text-[12px] font-medium text-[#006FEC] underline-offset-2 hover:underline"
        >
          ← All Saltmine flows
        </Link>
        <h1 className="m-0 mt-3 text-xl font-bold text-[#1C252E]">Saltmine slide screens</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#637381]">
          Each screen is isolated under{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-[11px]">slide-screens/</code> so
          edits to one slide do not affect others.
        </p>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {SALTMINE_SLIDE_SCREENS.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={getSaltmineSlideScreenPath(entry.slug)}
              className="flex items-center justify-between rounded-xl border border-[#DFE3E8] bg-white px-4 py-3 text-[#1C252E] shadow-sm transition-colors hover:border-[#006FEC]/30 hover:bg-[#F4F8FF]"
            >
              <span className="font-semibold">{entry.label}</span>
              <span className="text-[12px] text-[#637381]">Slide {entry.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
