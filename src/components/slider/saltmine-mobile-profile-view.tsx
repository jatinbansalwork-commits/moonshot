"use client";

import { Globe, Languages } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import { SALTMINE_MOBILE_HUB_ITEMS } from "@/lib/saltmine-mobile-nav";
import {
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileProfileView() {
  const { displayName, showToast, openOverlay } = useSaltmineMobileApp();

  return (
    <div
      className={`flex h-full ${SALTMINE_MOBILE_SCROLL_Y_CLASS} flex-col ${SALTMINE_MOBILE_CONTENT_X_CLASS} py-4`}
      style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}
    >
      <div className="mb-5 flex flex-col items-center text-center">
        <SaltmineDeckAvatar
          memberId={SALTMINE_DEMO_USER.id}
          letter={SALTMINE_DEMO_USER.floorLetter}
          size={64}
          color="#1C252E"
        />
        <h2 className={`m-0 mt-4 ${SALTMINE_MOBILE_PAGE_TITLE_CLASS} text-[18px]`} style={{ color: SALTMINE.text }}>
          {displayName}
        </h2>
        <p className={`m-0 mt-1.5 ${SALTMINE_MOBILE_SECONDARY_CLASS}`} style={{ color: SALTMINE.textMuted }}>
          {SALTMINE_DEMO_USER.email}
        </p>
      </div>

      <section aria-label="Workspace shortcuts">
        <ul className={`m-0 list-none space-y-1 ${SALTMINE_MOBILE_CARD_CLASS} p-1.5`}>
          {SALTMINE_MOBILE_HUB_ITEMS.filter((item) => item.id !== "profile").map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openOverlay(item.id)}
                className={`flex min-h-11 w-full items-center rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} font-semibold hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
                style={{ color: SALTMINE.text }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4" aria-label="Preferences">
        <ul
          className={`m-0 list-none space-y-1 ${SALTMINE_MOBILE_CARD_CLASS} border p-1.5`}
          style={{ borderColor: SALTMINE_HAIRLINE }}
        >
          <li>
            <button
              type="button"
              onClick={() => showToast("Language set to English")}
              className={`flex min-h-11 w-full items-center gap-2.5 rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <Languages className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
              Language
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => showToast("Region set to India")}
              className={`flex min-h-11 w-full items-center gap-2.5 rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <Globe className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
              Region
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}
