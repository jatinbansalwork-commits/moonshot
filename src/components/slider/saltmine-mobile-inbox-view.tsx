"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Check, ChevronLeft, ListFilter, MoreHorizontal, Search } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { InboxDetailPanel } from "@/components/slider/saltmine-inbox-view";
import { SaltmineMobileInboxNotificationPopup } from "@/components/slider/saltmine-mobile-inbox-notification-popup";
import {
  SaltmineMobileEmptyState,
  SaltmineMobilePageHeader,
  SaltmineMobileProfileButton,
} from "@/components/slider/saltmine-mobile-chrome";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import { SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING } from "@/lib/saltmine-mobile-tokens";
import {
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_BORDER_COLOR,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CARD_PAD_CLASS,
  SALTMINE_MOBILE_CARD_SHADOW_STYLE,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_LIST_GAP_COMPACT_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_OVERLAY_HEADER_CLASS,
  SALTMINE_MOBILE_OVERLAY_TITLE_CLASS,
  SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SCROLL_SURFACE_ATTR,
  SALTMINE_MOBILE_SECONDARY_CLASS,
  SALTMINE_MOBILE_SEGMENTED_CONTROL_CLASS,
  SALTMINE_MOBILE_SEGMENTED_TAB_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  filterInboxNotifications,
  getInboxNotificationById,
  INBOX_FILTER_OPTIONS,
  INBOX_NOTIFICATIONS,
  INBOX_SHOW_OPTIONS,
  type InboxNotification,
} from "@/lib/saltmine-inbox-data";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [enabled, onClose, ref]);
}

function MobileInboxSegmentedControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className={SALTMINE_MOBILE_SEGMENTED_CONTROL_CLASS}
      style={{ backgroundColor: "rgba(145, 158, 171, 0.12)" }}
      role="tablist"
      aria-label="Inbox view"
    >
      {INBOX_SHOW_OPTIONS.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option)}
            className={SALTMINE_MOBILE_SEGMENTED_TAB_CLASS}
            style={{
              color: selected ? SALTMINE.text : SALTMINE.textMuted,
              backgroundColor: selected ? "#FFFFFF" : "transparent",
              boxShadow: selected ? "0 1px 4px rgba(28, 37, 46, 0.08)" : undefined,
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function MobileNotificationIcon({
  notification,
}: {
  notification: InboxNotification;
}) {
  if (notification.kind === "check-in" && !notification.avatar) {
    return (
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(145, 158, 171, 0.14)" }}
        aria-hidden
      >
        <Check className="h-5 w-5" strokeWidth={2} style={{ color: SALTMINE.textMuted }} />
      </span>
    );
  }

  const avatar = notification.avatar ?? { initials: "?", color: "#637381" };
  return (
    <SaltmineDeckAvatar
      memberId={avatar.memberId}
      letter={avatar.initials}
      color={avatar.color}
      size={40}
    />
  );
}

function MobileInboxNotificationCard({
  notification,
  onSelect,
  onMenu,
}: {
  notification: InboxNotification;
  onSelect: () => void;
  onMenu: () => void;
}) {
  const isUnread = notification.unread;

  return (
    <li>
      <div
        className={`flex items-center gap-2 ${SALTMINE_MOBILE_CARD_CLASS} overflow-hidden ${isUnread ? "py-3 pl-0 pr-3" : `${SALTMINE_MOBILE_CARD_PAD_CLASS} opacity-90`}`}
        style={{
          borderColor: isUnread ? "rgba(0, 111, 236, 0.18)" : SALTMINE_MOBILE_CARD_BORDER_COLOR,
          backgroundColor: isUnread ? "#FFFFFF" : "rgba(255, 255, 255, 0.72)",
          ...(isUnread ? SALTMINE_MOBILE_CARD_SHADOW_STYLE : {}),
        }}
      >
        {isUnread ? (
          <span
            className="w-1 shrink-0 self-stretch rounded-l-[16px]"
            style={{ backgroundColor: SALTMINE.primary }}
            aria-hidden
          />
        ) : null}

        <button
          type="button"
          onClick={onSelect}
          className={`flex min-w-0 flex-1 items-center gap-2.5 text-left ${FOCUS_RING}`}
          aria-label={`${notification.title}. ${notification.subtitle}${isUnread ? ". Unread" : ""}`}
        >
          <MobileNotificationIcon notification={notification} />
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-baseline justify-between gap-2">
              <span
                className={`min-w-0 truncate ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`}
                style={{
                  color: SALTMINE.text,
                  fontWeight: isUnread ? 700 : 600,
                }}
              >
                {notification.title}
              </span>
              {notification.relativeTime ? (
                <span
                  className={`shrink-0 ${SALTMINE_MOBILE_CAPTION_CLASS} tabular-nums`}
                  style={{ color: isUnread ? SALTMINE.primary : SALTMINE.textMuted }}
                >
                  {notification.relativeTime}
                </span>
              ) : null}
            </span>
            <span
              className={`mt-0.5 block truncate ${SALTMINE_MOBILE_SECONDARY_CLASS}`}
              style={{ color: SALTMINE.textMuted }}
            >
              {notification.subtitle}
            </span>
          </span>
        </button>

        <button
          type="button"
          aria-label={`Options for ${notification.title}`}
          onClick={onMenu}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.textMuted }}
        >
          <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
      </div>
    </li>
  );
}

export function SaltmineMobileInboxView({
  showToast,
  showNotificationPopup = false,
}: {
  showToast: (message: string) => void;
  showNotificationPopup?: boolean;
}) {
  const { setSearchOpen, openOverlay } = useSaltmineMobileApp();
  const [showTab, setShowTab] = useState<string>(INBOX_SHOW_OPTIONS[0]);
  const [filter, setFilter] = useState<string>(INBOX_FILTER_OPTIONS[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);

  const notifications = useMemo(
    () => filterInboxNotifications(INBOX_NOTIFICATIONS, showTab, filter),
    [showTab, filter],
  );

  const notification = getInboxNotificationById(selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setDetailOpen(true);
  }

  function handleAction(label: string) {
    if (label === "Accept") {
      showToast(content.inboxAcceptToast);
      setDetailOpen(false);
      return;
    }
    if (label === "Decline") {
      showToast(content.inboxDeclineToast);
      setDetailOpen(false);
      return;
    }
    showToast(`${label} — demo`);
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col" style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}>
      <div
        className={SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS}
        style={{ borderColor: SALTMINE_HAIRLINE }}
      >
        <SaltmineMobilePageHeader title={content.inboxMobilePageTitle} className="pb-2 pt-0" border={false}>
        <div ref={filterRef} className="relative">
          <button
            type="button"
            aria-label={`${content.inboxFilterLabel}: ${filter}`}
            aria-expanded={filterOpen}
            aria-haspopup="listbox"
            onClick={() => setFilterOpen((open) => !open)}
            className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
            style={{ color: SALTMINE.textSecondary }}
          >
            <ListFilter className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
          </button>
          {filterOpen ? (
            <ul
              role="listbox"
              className="no-scrollbar absolute right-0 top-[calc(100%+4px)] z-50 min-w-[148px] overflow-y-auto overscroll-contain rounded-[12px] border bg-white py-1 shadow-lg"
              style={{ borderColor: SALTMINE_HAIRLINE }}
            >
              {INBOX_FILTER_OPTIONS.map((option) => (
                <li key={option} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={option === filter}
                    onClick={() => {
                      setFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`flex min-h-11 w-full items-center px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} ${FOCUS_RING}`}
                    style={{
                      color: option === filter ? SALTMINE.primary : SALTMINE.text,
                      fontWeight: option === filter ? 700 : 500,
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Search inbox"
          onClick={() => setSearchOpen(true)}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.textSecondary }}
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
        <SaltmineMobileProfileButton onClick={() => openOverlay("profile")} />
        </SaltmineMobilePageHeader>

        <div className={`${SALTMINE_MOBILE_CONTENT_X_CLASS} pb-3 pt-0`}>
          <MobileInboxSegmentedControl value={showTab} onChange={setShowTab} />
        </div>
      </div>

      <div
        {...SALTMINE_MOBILE_SCROLL_SURFACE_ATTR}
        className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} pt-3`}
        style={{
          paddingBottom: showNotificationPopup
            ? SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING + 220
            : SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
        }}
      >
        {notifications.length === 0 ? (
          <SaltmineMobileEmptyState>{content.inboxEmptyLabel}</SaltmineMobileEmptyState>
        ) : (
          <ul className={`m-0 list-none p-0 ${SALTMINE_MOBILE_LIST_GAP_COMPACT_CLASS}`}>
            {notifications.map((item) => (
              <MobileInboxNotificationCard
                key={item.id}
                notification={item}
                onSelect={() => handleSelect(item.id)}
                onMenu={() => showToast(content.inboxMenuToast)}
              />
            ))}
          </ul>
        )}
      </div>

      {detailOpen && notification ? (
        <div
          className="absolute inset-0 z-30 flex flex-col bg-white"
          role="dialog"
          aria-label="Notification details"
        >
          <div
            className={SALTMINE_MOBILE_OVERLAY_HEADER_CLASS}
            style={{ borderColor: SALTMINE_HAIRLINE }}
          >
            <button
              type="button"
              aria-label="Back to inbox"
              onClick={() => setDetailOpen(false)}
              className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
              style={{ color: SALTMINE.text }}
            >
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
            </button>
            <span className={SALTMINE_MOBILE_OVERLAY_TITLE_CLASS} style={{ color: SALTMINE.text }}>
              {content.inboxDetailPanelLabel}
            </span>
          </div>
          <div className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} py-3`}>
            <InboxDetailPanel
              notification={notification}
              onAction={handleAction}
              onClose={() => setDetailOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {showNotificationPopup ? (
        <SaltmineMobileInboxNotificationPopup
          notifications={INBOX_NOTIFICATIONS}
          selectedId={selectedId}
          onSelect={handleSelect}
          onBookings={() => {
            showToast(content.inboxNotificationPopupBookingsToast);
          }}
        />
      ) : null}
    </div>
  );
}
