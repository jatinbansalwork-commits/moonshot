export type CursorSurface = "light" | "dark";

export function colorToRgb(color: string): [number, number, number] | null {
  const trimmed = color.trim().toLowerCase();

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return [
        Number.parseInt(hex[0] + hex[0], 16),
        Number.parseInt(hex[1] + hex[1], 16),
        Number.parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length >= 6) {
      return [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ];
    }
  }

  const rgbMatch = trimmed.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/,
  );
  if (rgbMatch) {
    return [
      Number(rgbMatch[1]),
      Number(rgbMatch[2]),
      Number(rgbMatch[3]),
    ];
  }

  return null;
}

function getAlpha(color: string): number {
  const match = color.match(/rgba\([^)]+,\s*([\d.]+)\s*\)/);
  return match ? Number(match[1]) : 1;
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const channel = (value: number) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channel(r) +
    0.7152 * channel(g) +
    0.0722 * channel(b)
  );
}

/** True for white/yellow slide surfaces where the brand-yellow cursor disappears. */
export function isLightColor(color: string, threshold = 0.65): boolean {
  const rgb = colorToRgb(color);
  if (!rgb) return false;
  return getRelativeLuminance(...rgb) > threshold;
}

export function getCursorSurfaceForFrame(backgroundColor?: string): CursorSurface {
  const bg = backgroundColor ?? "#ffffff";
  return isLightColor(bg) ? "light" : "dark";
}

export function resolveCursorSurfaceAt(
  clientX: number,
  clientY: number,
): CursorSurface {
  const stack =
    typeof document.elementsFromPoint === "function"
      ? document.elementsFromPoint(clientX, clientY)
      : [document.elementFromPoint(clientX, clientY)].filter(Boolean);

  for (const node of stack) {
    if (!(node instanceof Element)) continue;

    const marked = node.closest("[data-cursor-surface]");
    if (marked instanceof HTMLElement) {
      const surface = marked.dataset.cursorSurface;
      if (surface === "light" || surface === "dark") return surface;
    }
  }

  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;

    let current: HTMLElement | null = node;
    while (current) {
      const { backgroundColor } = getComputedStyle(current);
      if (
        backgroundColor &&
        backgroundColor !== "transparent" &&
        getAlpha(backgroundColor) > 0.05
      ) {
        return isLightColor(backgroundColor) ? "light" : "dark";
      }
      current = current.parentElement;
    }
  }

  return "dark";
}
