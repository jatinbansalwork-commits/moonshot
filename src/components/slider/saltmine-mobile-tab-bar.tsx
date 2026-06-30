"use client";

import { FOCUS_RING } from "@/lib/a11y";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT,
  SALTMINE_MOBILE_TABS,
  isSaltmineMobileTabDisabled,
  type SaltmineMobileTabId,
} from "@/lib/saltmine-mobile-nav";
import {
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_TAB_ACTIVE_PILL_BG,
  SALTMINE_MOBILE_TAB_BAR_CLASS,
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
  const reducedMotion = useReducedMotion();
  const pressClass = reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS;

  return (
    <div
      className={SALTMINE_MOBILE_TAB_BAR_CLASS}
      style={{ borderColor: SALTMINE_HAIRLINE, height: SALTMINE_MOBILE_BOTTOM_NAV_HEIGHT }}
    >
      <div className="flex h-full items-stretch px-1 pt-0.5">
        {SALTMINE_MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = isSaltmineMobileTabDisabled(tab.id);
          const Icon = tab.icon;
          const ariaLabel = isDisabled
            ? `${tab.label} (unavailable)`
            : tab.id === "inbox" && inboxBadge
              ? `${tab.label}, unread notifications`
              : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={isDisabled}
              aria-current={isActive ? "page" : undefined}
              aria-disabled={isDisabled || undefined}
              aria-label={ariaLabel}
              onClick={() => {
                if (!isDisabled) onTabChange(tab.id);
              }}
              className={`relative mx-0.5 flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[12px] transition-[color,background-color] duration-150 ${isDisabled ? "cursor-not-allowed opacity-45" : pressClass} ${FOCUS_RING}`}
              style={{
                color: isActive ? SALTMINE.primary : "rgba(99, 115, 129, 0.88)",
                backgroundColor: isActive ? SALTMINE_MOBILE_TAB_ACTIVE_PILL_BG : "transparent",
              }}
            >
              <span className="relative inline-flex h-7 w-7 items-center justify-center">
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.2 : SALTMINE_MOBILE_ICON.stroke}
                  aria-hidden
                />
                {tab.id === "inbox" && inboxBadge && !isDisabled ? (
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: SALTMINE.primary }}
                    aria-hidden
                  />
                ) : null}
              </span>
              <span
                className={`${SALTMINE_MOBILE_TAB_LABEL_CLASS} transition-[font-weight,color] duration-150`}
                style={{ fontWeight: isActive ? 700 : 500 }}
              >
                {tab.label}
              </span>
              {isActive ? (
                <span
                  className="absolute bottom-0.5 h-[3px] w-5 rounded-full"
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
