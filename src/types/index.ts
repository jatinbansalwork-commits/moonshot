export type FrameVariant = "main" | "default";

export interface Frame {
  id: string;
  label: string;
  variant: FrameVariant;
  backgroundColor?: string;
  frameSize?: { width: number; height: number };
}
