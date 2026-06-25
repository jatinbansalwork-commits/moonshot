"use client";

import { motion } from "framer-motion";
import { getFrameDisplayNumber } from "@/lib/slide-display";
import { getFramePanelStyle } from "@/lib/frame-size";
import { getCursorSurfaceForFrame } from "@/lib/cursor-surface";
import type { Frame } from "@/types";

interface FrameShellProps {
  frame: Frame;
  index: number;
  trackHeight: number;
  children: React.ReactNode;
  onInteract: () => void;
}

function getFrameSheetClass(frame: Frame): string {
  if (frame.backgroundColor) {
    return "relative h-full w-full overflow-hidden";
  }
  return "relative h-full w-full overflow-hidden bg-white";
}

function getFrameSheetStyle(frame: Frame): React.CSSProperties | undefined {
  if (frame.backgroundColor) {
    return { backgroundColor: frame.backgroundColor };
  }
  return undefined;
}

export function FrameShell({
  frame,
  index,
  trackHeight,
  children,
  onInteract,
}: FrameShellProps) {
  return (
    <motion.article
      tabIndex={0}
      data-variant={frame.variant}
      className="frame-panel relative overflow-visible outline-none select-none"
      style={getFramePanelStyle(index, frame, trackHeight)}
    >
      <span
        className="index-slide-about-title pointer-events-none absolute bottom-full left-0 mb-3 text-[14px] font-normal leading-none tracking-tight text-white/55"
        aria-hidden
      >
        {getFrameDisplayNumber(frame.id, index)}
      </span>
      <div
        data-sheet
        data-cursor-surface={getCursorSurfaceForFrame(frame.backgroundColor)}
        className={getFrameSheetClass(frame)}
        style={getFrameSheetStyle(frame)}
        onMouseDown={onInteract}
      >
        {children}
      </div>
    </motion.article>
  );
}
