"use client";

import { useState } from "react";
import { KALASH_TEAL } from "@/components/slider/kalash/kalash-tokens";
import { FOCUS_RING } from "@/lib/a11y";
import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

const ICONS = {
  home: {
    active:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Home.svg",
    inactive:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Home.svg",
  },
  dashboard: {
    active:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Dashboard1.svg",
    inactive:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Dashboard1.svg",
  },
  transaction: {
    active:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/trnasction.svg",
    inactive:
      "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/trnasction.svg",
  },
} as const;

type TabId = keyof typeof ICONS;

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "transaction", label: "Transaction" },
];

function TabIcon({ src, isActive }: { src: string; isActive: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={24}
      height={24}
      className="size-6 shrink-0 object-contain transition-opacity duration-150"
      style={{ opacity: isActive ? 1 : 0.45 }}
      aria-hidden
    />
  );
}

/** Kalash bottom tab bar — Home, Dashboard, Transaction. */
export function AppBottomNav() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const inactiveColor = KALASH_VIEW.color.label;

  return (
    <div
      className="border-t border-neutral-200/40 bg-white"
      style={{ height: KALASH_VIEW.space.bottomNavHeight }}
    >
      <div className="flex h-full items-center justify-around px-2 pt-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const labelColor = isActive ? KALASH_TEAL : inactiveColor;
          const iconSrc = isActive
            ? ICONS[tab.id].active
            : ICONS[tab.id].inactive;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-transform duration-100 active:scale-95 ${FOCUS_RING}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              <TabIcon src={iconSrc} isActive={isActive} />
              <span
                className={`truncate text-[14px] leading-none transition-colors duration-150 ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
                style={{ color: labelColor, letterSpacing: "0.2px" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
