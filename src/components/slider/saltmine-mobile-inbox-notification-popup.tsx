"use client";

import { ClipboardList } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SaltmineMobileSheetHandle } from "@/components/slider/saltmine-mobile-chrome";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  INBOX_NOTIFICATION_POPUP_FEATURED_ID,
  INBOX_NOTIFICATION_POPUP_TIME,
  type InboxNotification,
} from "@/lib/saltmine-inbox-data";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_BORDER_COLOR,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
  SALTMINE_MOBILE_ELEVATION,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;

function PopupNotificationAvatar({
  notification,
  size,
}: {
  notification: InboxNotification;
  size: number;
}) {
  const avatar = notification.avatar ?? { initials: "?", color: "#637381" };
  return (
    <SaltmineDeckAvatar
      memberId={avatar.memberId}
      letter={avatar.initials}
      color={avatar.color}
      size={size}
    />
  );
}

function PopupNotificationRow({
  notification,
  selected,
  onSelect,
}: {
  notification: InboxNotification;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${content.inboxNotificationOpenLabel}: ${notification.title}`}
      className={`flex min-h-11 w-full items-center gap-2 rounded-[10px] border px-2.5 text-left transition-colors ${FOCUS_RING}`}
      style={{
        borderColor: selected ? "rgba(0, 111, 236, 0.28)" : SALTMINE_MOBILE_CARD_BORDER_COLOR,
        backgroundColor: selected ? "rgba(0, 111, 236, 0.06)" : "#FFFFFF",
      }}
    >
      <span className="flex w-2 shrink-0 justify-center" aria-hidden>
        {notification.unread ? (
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SALTMINE.primary }} />
        ) : null}
      </span>
      <PopupNotificationAvatar notification={notification} size={28} />
      <span
        className={`min-w-0 flex-1 truncate ${SALTMINE_MOBILE_MENU_ITEM_CLASS} font-semibold`}
        style={{ color: SALTMINE.text }}
      >
        {notification.title}
      </span>
    </button>
  );
}

export function SaltmineMobileInboxNotificationPopup({
  notifications,
  featuredId = INBOX_NOTIFICATION_POPUP_FEATURED_ID,
  selectedId,
  onSelect,
  onBookings,
}: {
  notifications: readonly InboxNotification[];
  featuredId?: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBookings: () => void;
}) {
  const featured =
    notifications.find((item) => item.id === featuredId) ?? notifications[0] ?? null;
  const latest = notifications
    .filter((item) => item.id !== featuredId)
    .slice(0, 4);

  if (!featured) return null;

  return (
    <aside
      className={`pointer-events-auto absolute left-4 right-4 z-40 flex flex-col overflow-hidden rounded-[20px] border bg-white ${SALTMINE_MOBILE_CARD_CLASS}`}
      style={{
        bottom: SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING + 8,
        borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR,
        boxShadow: SALTMINE_MOBILE_ELEVATION.popup,
      }}
      aria-label={content.inboxNotificationPopupLabel}
    >
      <SaltmineMobileSheetHandle />
      <p
        className={`m-0 px-4 pb-1 text-center font-bold tabular-nums ${SALTMINE_MOBILE_BODY_CLASS}`}
        style={{ color: SALTMINE.text }}
      >
        {INBOX_NOTIFICATION_POPUP_TIME}
      </p>

      <div className="px-3 pt-2">
        <button
          type="button"
          onClick={() => onSelect(featured.id)}
          aria-pressed={selectedId === featured.id}
          aria-label={`${content.inboxNotificationOpenLabel}: ${featured.title}`}
          className={`flex min-h-11 w-full items-center gap-2 rounded-full px-3 text-left ${FOCUS_RING}`}
          style={{ backgroundColor: "#1C252E" }}
        >
          <PopupNotificationAvatar notification={featured} size={32} />
          <span className="min-w-0 flex-1">
            <span
              className={`block truncate font-semibold ${SALTMINE_MOBILE_CAPTION_CLASS}`}
              style={{ color: "#FFFFFF" }}
            >
              {featured.title}
            </span>
          </span>
          <span
            className={`shrink-0 font-medium tabular-nums ${SALTMINE_MOBILE_CAPTION_CLASS}`}
            style={{ color: "rgba(255, 255, 255, 0.72)" }}
          >
            09:45
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 px-3 py-2">
        <p
          className={`m-0 mb-1.5 px-1 font-semibold ${SALTMINE_MOBILE_CAPTION_CLASS}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {content.inboxNotificationPopupLatestLabel}
        </p>
        <ul className="m-0 list-none space-y-1 p-0" aria-label={content.inboxNotificationPopupLatestLabel}>
          {latest.map((notification) => (
            <li key={`popup-${notification.id}`}>
              <PopupNotificationRow
                notification={notification}
                selected={selectedId === notification.id}
                onSelect={() => onSelect(notification.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        className="border-t px-3 py-2"
        style={{ borderColor: SALTMINE_HAIRLINE, backgroundColor: "#FAFBFC" }}
      >
        <button
          type="button"
          onClick={onBookings}
          className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-[10px] font-semibold ${SALTMINE_MOBILE_CAPTION_CLASS} ${FOCUS_RING}`}
          style={{ color: SALTMINE.textSecondary }}
        >
          <ClipboardList
            className="h-4 w-4 shrink-0"
            strokeWidth={SALTMINE_MOBILE_ICON.stroke}
            aria-hidden
          />
          {content.inboxNotificationPopupBookingsLabel}
        </button>
      </div>
    </aside>
  );
}
