const CDN_BASE =
  process.env.NEXT_PUBLIC_BLOB_CDN_BASE?.replace(/\/$/, "") ??
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com";

const ABSOLUTE_URL = /^https?:\/\//i;
const BLOB_HOST = /\.blob\.vercel-storage\.com/i;

/** Canonical Vercel Blob public origin for this project. */
export const BLOB_CDN_ORIGIN = CDN_BASE;

export function isAbsoluteAssetUrl(src: string): boolean {
  return ABSOLUTE_URL.test(src);
}

export function isRemoteCdnUrl(src: string): boolean {
  if (!isAbsoluteAssetUrl(src)) return false;
  if (BLOB_HOST.test(src)) return true;
  return CDN_BASE !== "" && src.startsWith(CDN_BASE);
}

/**
 * Builds a live Blob CDN URL from a `/public`-style path segment.
 * Example: `/assets/experiments/scroll-slider.mp4`
 */
export function cdnAsset(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BLOB_CDN_ORIGIN}${normalizedPath}`;
}

/**
 * Resolves registry paths to live CDN URLs when `NEXT_PUBLIC_BLOB_CDN_BASE` is set.
 * Absolute URLs pass through unchanged; local `/public` paths stay relative when no CDN is configured.
 */
export function resolveAssetUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith("data:")) return src;
  if (isAbsoluteAssetUrl(src)) return src;

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;
  if (!CDN_BASE) return normalizedPath;

  return `${CDN_BASE}${normalizedPath}`;
}

export function getBlobCdnBase(): string {
  return CDN_BASE;
}
