"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING, TARGET_HIT_AREA } from "@/lib/a11y";

type DockNavItem =
  | { kind: "avatar"; src: string; label: string; slideIndex?: number }
  | { kind: "logo"; src: string; label: string; slideIndex?: number }
  | { kind: "icon"; icon: LucideIcon; label: string; slideIndex?: number };

const FULL_DOCK_NAV_ITEMS: DockNavItem[] = [
  { kind: "avatar", src: "/assets/jb-avatar.png", label: "JB", slideIndex: 0 },
  { kind: "icon", icon: Menu, label: "Index", slideIndex: 4 },
  { kind: "logo", src: "/assets/saltmine-logo.png", label: "Saltmine", slideIndex: 5 },
  { kind: "logo", src: "/assets/kalash-logo.png", label: "Kalash", slideIndex: 27 },
  { kind: "icon", icon: Inbox, label: "FreshPrints" },
];

const PRIMARY_DOCK_NAV_ITEMS: DockNavItem[] = [];

export type UtilityDockNavPreset = "full" | "primary" | "nav-only";

const DOCK_NAV_PRESETS: Record<UtilityDockNavPreset, DockNavItem[]> = {
  full: FULL_DOCK_NAV_ITEMS,
  primary: PRIMARY_DOCK_NAV_ITEMS,
  "nav-only": [],
};

interface FloatingUtilityDockProps {
  dockId: string;
  ariaLabel?: string;
  navPreset?: UtilityDockNavPreset;
  showPrevious?: boolean;
  showNext?: boolean;
  onGoToSlide?: (index: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

function DockNavButton({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors duration-200 hover:text-white ${TARGET_HIT_AREA} ${FOCUS_RING}`}
    >
      {children}
    </button>
  );
}

export function FloatingUtilityDock({
  dockId,
  ariaLabel,
  navPreset = "full",
  showPrevious = true,
  showNext = true,
  onGoToSlide,
  onPrevious,
  onNext,
}: FloatingUtilityDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navItems = DOCK_NAV_PRESETS[navPreset];

  return (
    <nav
      id={dockId}
      data-dock-id={dockId}
      aria-label={ariaLabel ?? "Utility dock"}
      className="relative flex shrink-0 items-center gap-3 rounded-full border border-neutral-900/80 bg-black px-4 py-3 shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
    >
        {showPrevious ? (
          <DockNavButton ariaLabel="Previous slide" onClick={onPrevious}>
            <ChevronLeft className="h-5 w-5 stroke-[2]" aria-hidden />
          </DockNavButton>
        ) : null}

        {navItems.map((item, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={`${dockId}-${item.label}-${index}`}
              type="button"
              aria-label={
                item.slideIndex !== undefined
                  ? `${item.label}, go to slide ${item.slideIndex + 1}`
                  : item.label
              }
              onClick={() => {
                if (item.slideIndex !== undefined) {
                  onGoToSlide?.(item.slideIndex);
                }
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors duration-200 hover:text-white ${item.kind === "avatar" ? "overflow-hidden p-0" : ""} ${isHovered && item.kind === "logo" ? "bg-white/10" : ""} ${TARGET_HIT_AREA} ${FOCUS_RING}`}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 whitespace-nowrap rounded-xl bg-black px-4 py-2 font-sans text-xs font-medium tracking-wide text-white shadow-2xl"
                    role="tooltip"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {isHovered && (item.kind === "icon" || item.kind === "logo") && (
                <motion.span
                  layoutId={`dockHoverMask-${dockId}-${index}`}
                  className="absolute inset-0 z-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {item.kind === "avatar" ? (
                // Native img — local static asset; avoids Next/Image optimizer blank states in preview.
                <img
                  src={item.src}
                  alt=""
                  width={40}
                  height={40}
                  className="relative z-10 h-full w-full rounded-full object-cover"
                  decoding="async"
                  draggable={false}
                />
              ) : item.kind === "logo" ? (
                <>
                  <span
                    aria-hidden
                    className={`relative z-10 h-[22px] w-[22px] bg-current transition-opacity duration-200 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-mode:luminance] ${
                      isHovered ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      maskImage: `url(${item.src})`,
                      WebkitMaskImage: `url(${item.src})`,
                    }}
                  />
                  <img
                    src={item.src}
                    alt=""
                    width={22}
                    height={22}
                    aria-hidden
                    className={`absolute left-1/2 top-1/2 z-10 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-200 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    decoding="async"
                    draggable={false}
                  />
                </>
              ) : (
                <item.icon
                  className="relative z-10 h-[19px] w-[19px] stroke-[1.8]"
                  aria-hidden
                />
              )}
            </button>
          );
        })}

        {showNext ? (
          <DockNavButton ariaLabel="Next slide" onClick={onNext}>
            <ChevronRight className="h-5 w-5 stroke-[2]" aria-hidden />
          </DockNavButton>
        ) : null}
    </nav>
  );
}
