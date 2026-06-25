import { Public_Sans } from "next/font/google";

/** Public Sans — sole typeface for Saltmine slides 17–18 UI mockups. */
export const saltmineMockupFont = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const SALTMINE_MOCKUP_FONT_FAMILY =
  'var(--font-public-sans), "Public Sans", sans-serif';
