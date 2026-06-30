"use client";

import { FOCUS_RING } from "@/lib/a11y";
import {
  SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT,
  SALTMINE_MOBILE_TABS,
  type SaltmineMobileTabId,
} from "@/lib/saltmine-mobile-nav";
import {
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_TAB_BAR_CLASS,
  SALTMINE_MOBILE_TAB_LABEL_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: SaltmineMobileTabId;
  onTabChange: (tab: SaltmineMobileTabId) => void;
}) {
  return (
    <div
      className={SALTMINE_MOBILE_TAB_BAR_CLASS}
      style={{ borderColor: SALTMINE_HAIRLINE, height: SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT }}
    >
      <div className="flex h-full items-stretch px-1.5 pt-0.5">
        {SALTMINE_MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={`relative mx-0.5 flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[12px] transition-[color,transform] duration-150 ${SALTMINE_MOBILE_PRESS_CLASS} ${FOCUS_RING}`}
              style={{
                color: isActive ? SALTMINE.primary : "rgba(99, 115, 129, 0.88)",
              }}
            >
              <span className="relative inline-flex h-7 w-7 items-center justify-center">
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.2 : SALTMINE_MOBILE_ICON.stroke}
                  aria-hidden
                />
              </span>
              <span
                className={`${SALTMINE_MOBILE_TAB_LABEL_CLASS} transition-[font-weight,color] duration-150`}
                style={{ fontWeight: isActive ? 700 : 500 }}
              >
                {tab.label}
              </span>
              {isActive ? (
                <span
                  className="absolute bottom-1 h-0.5 w-4 rounded-full"
                  style={{ backgroundColor: SALTMINE.primary }}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
