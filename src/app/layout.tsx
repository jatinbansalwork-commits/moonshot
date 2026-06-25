import type { Metadata } from "next";
import { Geist, Inter, Libre_Franklin, Red_Hat_Mono } from "next/font/google";
import { saltmineMockupFont } from "@/lib/saltmine-mockup-font";
import { Analytics } from "@vercel/analytics/next";
import CacheManager from "@/components/CacheManager";
import { SiteEntryAnalytics } from "@/components/site-entry-analytics";
import ScrollToTop from "@/components/ScrollToTop";
import { SiteCursor } from "@/components/site-cursor-loader";
import { SkipToContentLink } from "@/components/skip-to-content-link";
import { BLOB_CDN_ORIGIN } from "@/lib/asset-cdn";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-red-hat-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "An experimental interface exploring latency and intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable} ${libreFranklin.variable} ${redHatMono.variable} ${saltmineMockupFont.variable} bg-background`}>
      <head>
        <link rel="preconnect" href={BLOB_CDN_ORIGIN} crossOrigin="anonymous" />
      </head>
      <body className="relative min-h-screen bg-background text-white antialiased">
        <SkipToContentLink />
        <CacheManager />
        <ScrollToTop />
        <SiteCursor />
        {children}
        <Analytics />
        <SiteEntryAnalytics />
      </body>
    </html>
  );
}
