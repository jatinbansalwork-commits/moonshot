import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { GoldIcon } from "@/components/GoldIcon";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

const BTC_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/BTC.svg";

interface AssetCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subValue: string;
}

const assetData: AssetCardProps[] = [
  {
    icon: (
      <div className="relative flex size-10 shrink-0 items-center justify-center">
        <GoldIcon className="size-10" />
      </div>
    ),
    title: "Gold in locker",
    value: "1.02 gm",
    subValue: "₹6,100",
  },
  {
    icon: (
      <div className="relative flex size-10 shrink-0 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BTC_ICON}
          alt=""
          className="size-10 object-contain"
          aria-hidden
        />
      </div>
    ),
    title: "BTC Rewards",
    value: "0.000086",
    subValue: "₹77.4",
  },
];

function AssetCard({
  icon,
  title,
  value,
  subValue,
  className = "",
}: AssetCardProps & { className?: string }) {
  const { color } = KALASH_VIEW;

  return (
    <div className={`flex min-w-0 items-center gap-3 px-4 ${className}`.trim()}>
      <div className="shrink-0">{icon}</div>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p
            className="truncate text-[14px] font-normal leading-[20px] tracking-tight"
            style={{ color: color.label, fontSize: 14 }}
          >
            {title}
          </p>
          <p
            className="truncate text-[16px] font-semibold leading-[24px]"
            style={{ color: color.text, fontSize: 16 }}
          >
            {value}
          </p>
          <p
            className="truncate text-[15px] font-medium leading-[20px] tracking-tight"
            style={{ color: color.label, fontSize: 15 }}
          >
            {subValue}
          </p>
        </div>
        <ChevronRight
          className="size-3.5 shrink-0"
          style={{ color: color.text }}
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Dual-column gold / BTC holdings metrics row. */
export function AssetMetricsGrid() {
  return (
    <div
      className="grid w-full grid-cols-2 items-center bg-white"
      style={{ paddingTop: KALASH_VIEW.space.sectionY }}
    >
      {assetData.map((asset, index) => (
        <AssetCard
          key={asset.title}
          {...asset}
          className={index === 0 ? "border-r border-neutral-100/80" : ""}
        />
      ))}
    </div>
  );
}
