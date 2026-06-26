"use client";

import Image from "next/image";
import { Check, Heart } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { FIND_SPACE_POD_TABLE } from "@/lib/saltmine-find-space-data";
import type { DisplayDesk, DisplayPod } from "@/lib/saltmine-find-space-filters";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const TEXT_MICRO = "text-[7px] leading-[10px]";

export const POD_SEAT_POSITIONS: { x: number; y: number }[] = [
  { x: 50, y: 6.5 },
  { x: 90, y: 35 },
  { x: 90, y: 64 },
  { x: 50, y: 92.5 },
  { x: 9, y: 64 },
  { x: 9, y: 35 },
];

export function DeskMarker({
  desk,
  size = 10,
  pulse = false,
  selected = false,
  reducedMotion = false,
}: {
  desk: DisplayDesk;
  size?: number;
  pulse?: boolean;
  selected?: boolean;
  reducedMotion?: boolean;
}) {
  if (desk.displayStatus === "unavailable") return null;

  const checkSize = Math.round(size * 0.6);
  const pulseClass = pulse && !reducedMotion ? "animate-pulse" : "";

  if (desk.displayStatus === "available") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-[#22C55E] text-white ring-2 ring-transparent ${pulseClass} ${selected ? "ring-[#006FEC]" : ""}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {desk.highlighted ? (
          <Heart style={{ width: checkSize, height: checkSize }} strokeWidth={2.5} fill="white" />
        ) : (
          <Check style={{ width: checkSize, height: checkSize }} strokeWidth={3} />
        )}
      </span>
    );
  }

  if (desk.displayStatus === "occupied") {
    return (
      <SaltmineDeckAvatar
        letter={desk.occupantLetter ?? "?"}
        size={size}
        color={desk.occupantColor ?? "#637381"}
        className={`${desk.highlighted ? "ring-2 ring-[rgba(0,111,236,0.35)]" : ""} ${pulseClass} ${selected ? "ring-2 ring-[#006FEC]" : ""}`}
      />
    );
  }

  return null;
}

export function PodCluster({
  pod,
  pulseKey,
  selectedDeskId,
  reducedMotion,
  onSeatClick,
  interactive = true,
  markerBase = 9,
}: {
  pod: DisplayPod;
  pulseKey: number;
  selectedDeskId: string | null;
  reducedMotion: boolean;
  onSeatClick: (deskId: string, label: string) => void;
  interactive?: boolean;
  markerBase?: number;
}) {
  if (!pod.visible) return null;

  return (
    <div className="flex h-full w-full min-h-0 flex-col items-center" aria-label={pod.label}>
      <p
        className={`m-0 mb-px shrink-0 font-semibold ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {pod.label}
      </p>
      <div className="relative min-h-0 w-full flex-1 p-[5%]">
        <Image
          src={FIND_SPACE_POD_TABLE.src}
          alt=""
          width={FIND_SPACE_POD_TABLE.width}
          height={FIND_SPACE_POD_TABLE.height}
          aria-hidden
          className="block h-full w-full object-contain object-center"
        />
        {pod.desks.map((desk, index) => {
          const pos = POD_SEAT_POSITIONS[index];
          if (!pos) return null;
          const markerSize =
            desk.displayStatus === "occupied" ? markerBase * 2 : Math.round(markerBase * 1.75);
          const deskId = `${pod.id}-seat-${index}`;
          const deskLabel = `${pod.label} · Desk ${index + 1}`;
          const seatInteractive = interactive && desk.displayStatus !== "unavailable";
          const title =
            desk.displayStatus === "available"
              ? `${deskLabel} — available`
              : desk.displayStatus === "occupied"
                ? `${deskLabel} — ${desk.occupantLetter ?? "booked"}`
                : deskLabel;

          return (
            <div
              key={deskId}
              className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {seatInteractive ? (
                <button
                  type="button"
                  title={title}
                  aria-label={title}
                  onClick={() => onSeatClick(deskId, deskLabel)}
                  className={`rounded-full transition-transform duration-150 hover:scale-110 active:scale-95 ${FOCUS_RING}`}
                >
                  <DeskMarker
                    desk={desk}
                    size={markerSize}
                    pulse={desk.matches}
                    selected={selectedDeskId === deskId}
                    reducedMotion={reducedMotion}
                    key={`${deskId}-${pulseKey}`}
                  />
                </button>
              ) : (
                <DeskMarker desk={desk} size={markerSize} reducedMotion={reducedMotion} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
