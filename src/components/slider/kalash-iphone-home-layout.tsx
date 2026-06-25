"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { KalashAppScreen } from "@/components/slider/kalash-app-screen";
import { IphoneHomeIndicator } from "@/components/slider/iphone-home-indicator";
import { KalashMobilePrototypeShell, IPHONE_SCREEN_RADIUS_PX } from "@/components/slider/kalash-mobile-prototype-shell";
import { FOCUS_RING, TARGET_HIT_AREA } from "@/lib/a11y";
import { useClickSound } from "@/hooks/use-click-sound";
import { getKalashDevScreen, type KalashDevScreen } from "@/lib/kalash-dev";

type KalashPhoneScreen = KalashDevScreen;

const SPLASH_DURATION_MS = 2000;
const SCREEN_RADIUS = `${IPHONE_SCREEN_RADIUS_PX}px`;

/** Kalash app icon hit area — aligned to Figma home screen grid (402×874). */
const KALASH_ICON_HOTSPOT = {
  top: "33.2%",
  left: "75.6%",
  width: "17.9%",
  height: "9.5%",
} as const;

export function KalashIphoneHomeLayout() {
  const [screen, setScreen] = useState<KalashPhoneScreen>("home");
  const playClick = useClickSound();

  useLayoutEffect(() => {
    const devScreen = getKalashDevScreen();
    if (devScreen) setScreen(devScreen);
  }, []);

  const goHome = useCallback(() => {
    playClick();
    setScreen("home");
  }, [playClick]);

  const openKalash = useCallback(() => {
    playClick();
    setScreen("splash");
  }, [playClick]);

  useEffect(() => {
    if (screen !== "splash") return;

    const timer = window.setTimeout(() => {
      setScreen("app");
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [screen]);

  return (
    <div
      className="relative h-full w-full min-h-0 overflow-hidden"
      data-cursor-surface={
        screen === "home" || screen === "splash" ? "dark" : "light"
      }
    >
      {screen === "home" && (
        <div className="absolute inset-0" data-cursor-surface="dark">
          <KalashMobilePrototypeShell mode="immersive">
            <Image
              src="/assets/slide-8-kalash-home.png"
              alt="iPhone home screen showing the Kalash app icon"
              width={804}
              height={1748}
              className="h-full w-full max-w-full object-cover object-top"
              style={{ borderRadius: SCREEN_RADIUS }}
              priority
            />

            <button
              type="button"
              aria-label="Open Kalash"
              className={`absolute z-10 rounded-2xl transition-colors hover:bg-white/10 focus-visible:bg-white/10 ${TARGET_HIT_AREA} ${FOCUS_RING}`}
              style={KALASH_ICON_HOTSPOT}
              onClick={openKalash}
            />
          </KalashMobilePrototypeShell>
        </div>
      )}

      {screen === "splash" && (
        <div className="absolute inset-0 z-10" data-cursor-surface="dark">
          <KalashMobilePrototypeShell mode="immersive">
            <div
              className="flex h-full w-full items-center justify-center bg-[#184546]"
              style={{ borderRadius: SCREEN_RADIUS }}
              aria-label="Kalash app splash screen"
            >
              <Image
                src="/assets/kalash-logo-full.svg"
                alt="Kalash"
                width={87}
                height={109}
                className="h-auto w-[min(21%,80px)] max-w-full object-contain"
                priority
              />
            </div>
          </KalashMobilePrototypeShell>
          <div className="absolute inset-x-0 bottom-0 z-[60]">
            <IphoneHomeIndicator tone="light" onPress={goHome} />
          </div>
        </div>
      )}

      {screen === "app" && (
        <div
          className="absolute inset-0 z-10 kalash-screen-enter"
          data-cursor-surface="light"
        >
          <KalashMobilePrototypeShell
            mode="app"
            homeIndicator={<IphoneHomeIndicator tone="dark" onPress={goHome} />}
          >
            <KalashAppScreen />
          </KalashMobilePrototypeShell>
        </div>
      )}
    </div>
  );
}
