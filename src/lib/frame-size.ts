import type { CSSProperties } from "react";
import { FRAME_HEIGHT, FRAME_STRIDE, FRAME_WIDTH } from "@/lib/constants";
import type { Frame } from "@/types";

export interface FrameSize {
  width: number;
  height: number;
}

export function resolveFrameSize(frame: Pick<Frame, "frameSize">): FrameSize {
  return {
    width: frame.frameSize?.width ?? FRAME_WIDTH,
    height: frame.frameSize?.height ?? FRAME_HEIGHT,
  };
}

export function getTrackHeight(frames: readonly Frame[]): number {
  return Math.max(
    FRAME_HEIGHT,
    ...frames.map((frame) => frame.frameSize?.height ?? FRAME_HEIGHT),
  );
}

export function getFramePanelStyle(
  index: number,
  frame: Frame,
  trackHeight: number,
): CSSProperties {
  const { width, height } = resolveFrameSize(frame);

  return {
    width,
    height,
    position: "absolute",
    left: FRAME_STRIDE * index + (FRAME_WIDTH - width) / 2,
    top: (trackHeight - height) / 2,
  };
}
