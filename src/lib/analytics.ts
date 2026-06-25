import { track } from "@vercel/analytics";

export type ContactMethod = "linkedin" | "email" | "jb_manual";

export type IndexNavigateMethod = "scroll" | "nav" | "keyboard" | "minimap";

export function trackContactClick(method: ContactMethod): void {
  track("contact_click", { method });
}

/** Once per session — landing context; pair with Countries filter in Vercel Analytics. */
export function trackSiteEntry(properties: {
  landing_path: string;
  referrer_host: string;
  timezone: string;
  locale: string;
}): void {
  track("site_entry", properties);
}

export function trackResumeDownload(): void {
  track("resume_download");
}

export function trackIndexFrameView(properties: {
  frame_id: string;
  frame_label: string;
  index: number;
}): void {
  track("index_frame_view", {
    frame_id: properties.frame_id,
    frame_label: properties.frame_label,
    index: String(properties.index),
  });
}

export function trackIndexFrameNavigate(properties: {
  from: string;
  to: string;
  method: IndexNavigateMethod;
}): void {
  track("index_frame_navigate", properties);
}
