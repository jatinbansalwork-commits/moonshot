"use client";

import { motion } from "framer-motion";
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
      className="frame-panel outline-none select-none"
      style={getFramePanelStyle(index, frame, trackHeight)}
    >
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
