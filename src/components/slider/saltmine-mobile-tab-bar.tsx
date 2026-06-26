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
  SALTMINE_MOBILE_TAB_LABEL_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileTabBar({
  activeTab,
  onTabChange,
  inboxBadge = false,
}: {
  activeTab: SaltmineMobileTabId;
  onTabChange: (tab: SaltmineMobileTabId) => void;
  inboxBadge?: boolean;
}) {
  return (
    <div
      className="shrink-0 border-t bg-white"
      style={{ borderColor: SALTMINE_HAIRLINE, height: SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT }}
    >
      <div className="flex h-full items-stretch px-2 pt-1">
        {SALTMINE_MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const ariaLabel =
            tab.id === "inbox" && inboxBadge ? `${tab.label}, unread notifications` : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-label={ariaLabel}
              onClick={() => onTabChange(tab.id)}
              className={`relative mx-0.5 flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[10px] transition-[color,background-color,transform] duration-150 ${SALTMINE_MOBILE_PRESS_CLASS} ${FOCUS_RING}`}
              style={{
                color: isActive ? SALTMINE.primary : SALTMINE.textMuted,
                backgroundColor: isActive ? "rgba(0, 111, 236, 0.08)" : "transparent",
              }}
            >
              <span className="relative inline-flex h-6 w-6 items-center justify-center">
                <Icon
                  className="h-[19px] w-[19px]"
                  strokeWidth={isActive ? 2.15 : SALTMINE_MOBILE_ICON.stroke}
                  aria-hidden
                />
                {tab.id === "inbox" && inboxBadge ? (
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: SALTMINE.primary }}
                    aria-hidden
                  />
                ) : null}
              </span>
              <span
                className={SALTMINE_MOBILE_TAB_LABEL_CLASS}
                style={{ fontWeight: isActive ? 700 : 600 }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
