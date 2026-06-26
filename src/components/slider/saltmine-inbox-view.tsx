"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ClipboardList, MoreHorizontal, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  filterInboxNotifications,
  INBOX_FILTER_OPTIONS,
  INBOX_NOTIFICATION_POPUP_FEATURED_ID,
  INBOX_NOTIFICATION_POPUP_TIME,
  INBOX_NOTIFICATIONS,
  INBOX_SHOW_OPTIONS,
  type InboxNotification,
} from "@/lib/saltmine-inbox-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
  SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const MENU_SHADOW = "0 8px 24px rgba(28, 37, 46, 0.12), 0 2px 6px rgba(28, 37, 46, 0.06)";
const POPUP_PANEL_SHADOW =
  "0 16px 40px rgba(28, 37, 46, 0.16), 0 4px 12px rgba(28, 37, 46, 0.08)";

const KIND_ACCENT: Record<InboxNotification["kind"], string> = {
  arrival: "#006FEC",
  invite: "#8B5CF6",
  "check-in": "#22C55E",
  booking: "#F59E0B",
};

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [enabled, onClose, ref]);
}

function InboxFilterMenu({
  id,
  options,
  value,
  onSelect,
  onClose,
}: {
  id: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <ul
      id={id}
      role="listbox"
      className="no-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-[1] max-h-[120px] overflow-y-auto rounded-lg border bg-white py-0.5 shadow-lg"
      style={{
        borderColor: HAIRLINE,
        boxShadow: MENU_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      }}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <li key={option} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
              className={`flex w-full items-center gap-1 px-2 py-1 text-left ${TEXT_XS} ${FOCUS_RING}`}
              style={{
                color: selected ? SALTMINE.primary : SALTMINE.text,
                fontWeight: selected ? 700 : 500,
                backgroundColor: selected ? "rgba(0, 111, 236, 0.06)" : "transparent",
              }}
            >
              {selected ? (
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: SALTMINE.primary }}
                  aria-hidden
                />
              ) : (
                <span className="h-1 w-1 shrink-0" aria-hidden />
              )}
              {option}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function InboxFilterField({
  filterId,
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onSelect,
}: {
  filterId: string;
  label: string;
  value: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose, open);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <p
        className={`mb-0.5 truncate px-0.5 font-medium ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${filterId}-menu` : undefined}
        aria-label={`${label} ${value}`}
        onClick={onToggle}
        className={`flex h-[28px] w-full items-center gap-0.5 rounded-md border-0 px-1.5 text-left ${TEXT_XS} font-semibold ${FOCUS_RING}`}
        style={{
          color: SALTMINE.text,
          backgroundColor: open ? SALTMINE_ONBOARDING.color.canvas : SALTMINE.neutral,
          boxShadow: open ? "0 0 0 3px rgba(0, 111, 236, 0.12)" : SALTMINE_SURFACE_INSET,
        }}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-2.5 w-2.5 shrink-0 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
      </button>
      {open ? (
        <InboxFilterMenu
          id={`${filterId}-menu`}
          options={options}
          value={value}
          onSelect={onSelect}
          onClose={onClose}
        />
      ) : null}
    </div>
  );
}

function NotificationAvatar({
  notification,
  size = 22,
}: {
  notification: InboxNotification;
  size?: number;
}) {
  if (
    (notification.kind === "check-in" || notification.kind === "booking") &&
    !notification.avatar
  ) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Check style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={3} />
      </span>
    );
  }

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

function InboxNotificationRow({
  notification,
  selected,
  onSelect,
  onMenu,
}: {
  notification: InboxNotification;
  selected: boolean;
  onSelect: () => void;
  onMenu: () => void;
}) {
  return (
    <li>
      <div
        className={`flex items-center gap-1.5 rounded-[8px] border px-2 py-2 transition-[border-color,box-shadow,background-color] duration-150 ${selected ? "ring-2 ring-[rgba(0,111,236,0.2)]" : ""}`}
        style={{
          borderColor: selected
            ? "rgba(0, 111, 236, 0.28)"
            : notification.unread
              ? "rgba(0, 111, 236, 0.12)"
              : HAIRLINE,
          backgroundColor: selected
            ? "rgba(0, 111, 236, 0.08)"
            : notification.unread
              ? "rgba(0, 111, 236, 0.05)"
              : "#FFFFFF",
          boxShadow: selected
            ? "0 2px 6px rgba(0, 111, 236, 0.1)"
            : "0 1px 2px rgba(145, 158, 171, 0.05)",
        }}
      >
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={`flex min-w-0 flex-1 items-center gap-1.5 text-left ${FOCUS_RING}`}
        >
          <span className="flex w-2 shrink-0 justify-center" aria-hidden>
            {notification.unread ? (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: SALTMINE.primary }}
              />
            ) : null}
          </span>

          <NotificationAvatar notification={notification} />

          <span className="min-w-0 flex-1">
            <span
              className={`block truncate font-bold tracking-[-0.01em] ${TEXT_XS}`}
              style={{ color: SALTMINE.text }}
            >
              {notification.title}
            </span>
            <span
              className={`block truncate font-medium ${TEXT_2XS}`}
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
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <MoreHorizontal className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>
    </li>
  );
}

function InboxNotificationPopupRow({
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
      className={`flex w-full items-center gap-1 rounded-[6px] border px-1 py-0.5 text-left transition-[border-color,background-color] duration-150 ${FOCUS_RING}`}
      style={{
        borderColor: selected ? "rgba(0, 111, 236, 0.28)" : HAIRLINE,
        backgroundColor: selected ? "rgba(0, 111, 236, 0.06)" : "#FFFFFF",
      }}
    >
      <span className="flex w-1.5 shrink-0 justify-center" aria-hidden>
        {notification.unread ? (
          <span
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: SALTMINE.primary }}
          />
        ) : null}
      </span>
      <NotificationAvatar notification={notification} size={14} />
      <span
        className={`min-w-0 flex-1 truncate font-semibold ${TEXT_MICRO}`}
        style={{ color: SALTMINE.text }}
      >
        {notification.title}
      </span>
    </button>
  );
}

export function InboxNotificationPopup({
  notifications,
  featuredId,
  selectedId,
  onSelect,
  onBookings,
}: {
  notifications: readonly InboxNotification[];
  featuredId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBookings: () => void;
}) {
  const featured =
    notifications.find((item) => item.id === featuredId) ?? notifications[0] ?? null;
  const latest = notifications.slice(0, 5);

  if (!featured) return null;

  return (
    <aside
      className="pointer-events-auto absolute top-1/2 z-50 flex w-[118px] -translate-y-1/2 flex-col overflow-hidden rounded-[18px] border bg-white"
      style={{
        right: -54,
        borderColor: HAIRLINE,
        boxShadow: POPUP_PANEL_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX + 1,
      }}
      aria-label={content.inboxNotificationPopupLabel}
    >
      <p
        className={`m-0 px-2 pt-2 text-center font-bold tabular-nums tracking-[-0.02em] ${TEXT_XS}`}
        style={{ color: SALTMINE.text }}
      >
        {INBOX_NOTIFICATION_POPUP_TIME}
      </p>

      <div className="px-1.5 pt-1">
        <button
          type="button"
          onClick={() => onSelect(featured.id)}
          aria-pressed={selectedId === featured.id}
          aria-label={`${content.inboxNotificationOpenLabel}: ${featured.title}`}
          className={`flex w-full items-center gap-1 rounded-full px-1.5 py-1 text-left ${FOCUS_RING}`}
          style={{ backgroundColor: "#1C252E" }}
        >
          <NotificationAvatar notification={featured} size={16} />
          <span className="min-w-0 flex-1">
            <span
              className={`block truncate font-semibold ${TEXT_MICRO}`}
              style={{ color: "#FFFFFF" }}
            >
              {featured.title}
            </span>
          </span>
          <span
            className={`shrink-0 font-medium tabular-nums ${TEXT_MICRO}`}
            style={{ color: "rgba(255, 255, 255, 0.72)" }}
          >
            09:45
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 px-1.5 py-1">
        <p
          className={`m-0 mb-0.5 px-0.5 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {content.inboxNotificationPopupLatestLabel}
        </p>
        <ul className="m-0 list-none space-y-0.5 p-0" aria-label={content.inboxNotificationPopupLatestLabel}>
          {latest.map((notification) => (
            <li key={`popup-${notification.id}`}>
              <InboxNotificationPopupRow
                notification={notification}
                selected={selectedId === notification.id}
                onSelect={() => onSelect(notification.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        className="border-t px-1.5 py-1"
        style={{ borderColor: HAIRLINE, backgroundColor: "#FAFBFC" }}
      >
        <button
          type="button"
          onClick={onBookings}
          className={`flex min-h-6 w-full items-center justify-center gap-0.5 rounded-[6px] font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{ color: SALTMINE.textSecondary }}
        >
          <ClipboardList className="h-2.5 w-2.5 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
          {content.inboxNotificationPopupBookingsLabel}
        </button>
      </div>
    </aside>
  );
}

export function InboxDetailPanel({
  notification,
  onAction,
  onClose,
}: {
  notification: InboxNotification | null;
  onAction: (label: string) => void;
  onClose?: () => void;
}) {
  if (!notification) {
    return (
      <div className="flex h-full items-center justify-center px-2 text-center">
        <p className={`m-0 font-medium ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
          {content.inboxDetailEmptyLabel}
        </p>
      </div>
    );
  }

  const accent = KIND_ACCENT[notification.kind];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-start justify-between gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <NotificationAvatar notification={notification} size={28} />
          <div className="min-w-0">
            <span
              className={`mb-0.5 inline-flex rounded-full px-1.5 py-px font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
              style={{
                backgroundColor: `${accent}18`,
                color: accent,
              }}
            >
              {notification.typeLabel}
            </span>
            <p
              className={`m-0 truncate font-bold tracking-[-0.02em] ${TEXT_XS}`}
              style={{ color: SALTMINE.text }}
            >
              {notification.title}
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            aria-label={content.inboxDetailCloseLabel}
            onClick={onClose}
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <X className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
        ) : null}
      </div>

      <p className={`m-0 mb-2 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textSecondary }}>
        {notification.detailSummary}
      </p>

      <div
        className="mb-2 rounded-[8px] border px-2 py-1.5"
        style={{
          borderColor: HAIRLINE,
          backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        }}
      >
        <p
          className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {content.inboxDetailFieldsLabel}
        </p>
        <dl className="m-0 space-y-1">
          {notification.detailFields.map((field) => (
            <div key={`${field.label}-${field.value}`}>
              <dt className={`m-0 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
                {field.label}
              </dt>
              <dd className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-auto space-y-1">
        {notification.primaryAction ? (
          <button
            type="button"
            onClick={() => onAction(notification.primaryAction!)}
            className={`flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: "rgba(0, 111, 236, 0.32)",
              color: SALTMINE.primary,
              backgroundColor: "rgba(0, 111, 236, 0.08)",
            }}
          >
            {notification.primaryAction}
          </button>
        ) : null}
        {notification.secondaryAction ? (
          <button
            type="button"
            onClick={() => onAction(notification.secondaryAction!)}
            className={`flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: HAIRLINE,
              color: SALTMINE.textSecondary,
              backgroundColor: "#FFFFFF",
            }}
          >
            {notification.secondaryAction}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function InboxMainView({
  selectedId,
  onSelect,
  showToast,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  showToast: (message: string) => void;
}) {
  const [showValue, setShowValue] = useState<string>(INBOX_SHOW_OPTIONS[0]);
  const [filterValue, setFilterValue] = useState<string>(INBOX_FILTER_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<"show" | "filter" | null>(null);

  const notifications = useMemo(
    () => filterInboxNotifications(INBOX_NOTIFICATIONS, showValue, filterValue),
    [showValue, filterValue],
  );

  useEffect(() => {
    if (notifications.length === 0) return;
    if (!selectedId || !notifications.some((item) => item.id === selectedId)) {
      onSelect(notifications[0].id);
    }
  }, [notifications, onSelect, selectedId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-1.5 flex shrink-0 gap-1.5">
        <InboxFilterField
          filterId="inbox-show"
          label={content.inboxShowLabel}
          value={showValue}
          options={INBOX_SHOW_OPTIONS}
          open={openFilter === "show"}
          onToggle={() => setOpenFilter((current) => (current === "show" ? null : "show"))}
          onClose={() => setOpenFilter(null)}
          onSelect={(value) => {
            setShowValue(value);
            showToast(`${content.inboxShowLabel}: ${value}`);
          }}
        />
        <InboxFilterField
          filterId="inbox-filter"
          label={content.inboxFilterLabel}
          value={filterValue}
          options={INBOX_FILTER_OPTIONS}
          open={openFilter === "filter"}
          onToggle={() => setOpenFilter((current) => (current === "filter" ? null : "filter"))}
          onClose={() => setOpenFilter(null)}
          onSelect={(value) => {
            setFilterValue(value);
            showToast(`${content.inboxFilterLabel}: ${value}`);
          }}
        />
      </div>

      <ul
        className="no-scrollbar m-0 min-h-0 flex-1 list-none space-y-1 overflow-y-auto p-0"
        aria-label="Inbox notifications"
      >
        {notifications.length === 0 ? (
          <li
            className="flex h-full min-h-[120px] items-center justify-center rounded-[10px] border border-dashed px-4 py-6 text-center"
            style={{ borderColor: HAIRLINE, backgroundColor: "rgba(145, 158, 171, 0.04)" }}
          >
            <p className={`m-0 font-medium ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
              {content.inboxEmptyLabel}
            </p>
          </li>
        ) : (
          notifications.map((notification) => (
            <InboxNotificationRow
              key={notification.id}
              notification={notification}
              selected={selectedId === notification.id}
              onSelect={() => onSelect(notification.id)}
              onMenu={() => showToast(content.inboxMenuToast)}
            />
          ))
        )}
      </ul>
    </div>
  );
}
