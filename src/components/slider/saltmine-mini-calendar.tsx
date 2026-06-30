"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { CALENDAR_MONTHS } from "@/lib/saltmine-bookings-dashboard-data";
import {
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_MENU_SHADOW,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

const HAIRLINE = SALTMINE_HAIRLINE;
const MENU_SHADOW = SALTMINE_MENU_SHADOW;
const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;
const ICON_STROKE = 1.75;

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEKEND_COLUMN_INDEXES = new Set([5, 6]);

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, enabled]);
}

function motionClass(reducedMotion: boolean, className: string) {
  return reducedMotion ? "" : className;
}

function parseMonthLabel(label: string) {
  const match = label.match(/^(.+)\s+(\d{4})$/);
  return {
    monthName: match?.[1] ?? label,
    year: match?.[2] ?? "",
  };
}

export function SaltmineMiniCalendar({
  monthIndex,
  selectedDay,
  bookingDays = [],
  todayDay,
  monthMenuOpen,
  onPrevMonth,
  onNextMonth,
  onToggleMonthMenu,
  onSelectMonth,
  onCloseMonthMenu,
  onSelectDay,
  reducedMotion,
}: {
  monthIndex: number;
  selectedDay: number;
  bookingDays?: readonly number[];
  todayDay?: number;
  monthMenuOpen: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleMonthMenu: () => void;
  onCloseMonthMenu: () => void;
  onSelectMonth: (index: number) => void;
  onSelectDay: (day: number) => void;
  reducedMotion: boolean;
}) {
  const month = CALENDAR_MONTHS[monthIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const { monthName, year } = parseMonthLabel(month.label);

  useClickOutside(containerRef, onCloseMonthMenu, monthMenuOpen);

  const navButtonClass = `inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border transition-[background-color,color,border-color] duration-150 hover:bg-[rgba(145,158,171,0.08)] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`;

  return (
    <div
      ref={containerRef}
      className="rounded-[10px] border p-2"
      style={{
        borderColor: HAIRLINE,
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        boxShadow:
          "0 1px 2px rgba(28, 37, 46, 0.04), 0 4px 10px rgba(28, 37, 46, 0.03)",
      }}
      aria-label="Mini calendar"
    >
      <div className="relative mb-2 flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous month"
          onClick={onPrevMonth}
          disabled={monthIndex === 0}
          className={navButtonClass}
          style={{
            borderColor: HAIRLINE,
            color: SALTMINE.textSecondary,
            backgroundColor: "rgba(244, 246, 248, 0.6)",
          }}
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
        </button>

        <button
          type="button"
          aria-expanded={monthMenuOpen}
          aria-haspopup="listbox"
          aria-label={`${month.label}, choose month`}
          onClick={onToggleMonthMenu}
          className={`flex min-h-6 min-w-0 flex-1 items-center justify-center gap-0.5 rounded-[6px] px-1 transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`}
        >
          <span className="min-w-0 truncate text-center">
            <span
              className={`font-bold tracking-[-0.02em] ${TEXT_XS}`}
              style={{ color: SALTMINE.text }}
            >
              {monthName}
            </span>
            {year ? (
              <span
                className={`ml-1 font-semibold tabular-nums ${TEXT_MICRO}`}
                style={{ color: SALTMINE.textMuted }}
              >
                {year}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={`h-2.5 w-2.5 shrink-0 opacity-70 ${motionClass(reducedMotion, "transition-transform duration-150")} ${monthMenuOpen ? "rotate-180" : ""}`}
            strokeWidth={ICON_STROKE}
            style={{ color: SALTMINE.textSecondary }}
            aria-hidden
          />
        </button>

        <button
          type="button"
          aria-label="Next month"
          onClick={onNextMonth}
          disabled={monthIndex === CALENDAR_MONTHS.length - 1}
          className={navButtonClass}
          style={{
            borderColor: HAIRLINE,
            color: SALTMINE.textSecondary,
            backgroundColor: "rgba(244, 246, 248, 0.6)",
          }}
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
        </button>

        {monthMenuOpen ? (
          <ul
            role="listbox"
            aria-label="Months"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 m-0 max-h-[168px] list-none overflow-y-auto rounded-[8px] border bg-white py-0.5"
            style={{ borderColor: HAIRLINE, boxShadow: MENU_SHADOW }}
          >
            {CALENDAR_MONTHS.map((item, index) => {
              const isActive = index === monthIndex;
              return (
                <li key={item.label} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onSelectMonth(index);
                      onCloseMonthMenu();
                    }}
                    className={`flex min-h-6 w-full items-center px-2 text-left ${TEXT_XS} ${FOCUS_RING}`}
                    style={{
                      color: isActive ? SALTMINE.primary : SALTMINE.text,
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? "rgba(0, 111, 236, 0.08)" : "transparent",
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <div
        className="mb-1.5 grid grid-cols-7 rounded-[6px] px-0.5 py-1"
        style={{ backgroundColor: "rgba(244, 246, 248, 0.85)" }}
        aria-hidden
      >
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={`weekday-${index}`}
            className={`flex h-4 items-center justify-center font-semibold uppercase leading-none tracking-[0.06em] ${TEXT_MICRO}`}
            style={{
              color: WEEKEND_COLUMN_INDEXES.has(index)
                ? "rgba(99, 115, 129, 0.72)"
                : SALTMINE.textMuted,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {month.weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (date === null) {
              return (
                <span
                  key={`empty-${weekIndex}-${dayIndex}`}
                  className="flex h-6 items-center justify-center"
                  aria-hidden
                />
              );
            }

            const selected = date === selectedDay;
            const isToday = todayDay === date;
            const hasBooking = bookingDays.includes(date);
            const weekend = dayIndex >= 5;

            let backgroundColor = "transparent";
            let color: string = weekend ? SALTMINE.textMuted : SALTMINE.textSecondary;
            let boxShadow: string | undefined;

            if (selected) {
              backgroundColor = SALTMINE.primary;
              color = SALTMINE_ONBOARDING.color.text.inverse;
              boxShadow = "0 1px 4px rgba(0, 111, 236, 0.32)";
            } else if (isToday) {
              backgroundColor = "rgba(0, 111, 236, 0.12)";
              color = SALTMINE.primary;
              boxShadow = "inset 0 0 0 1.5px rgba(0, 111, 236, 0.42)";
            }

            return (
              <span
                key={`${weekIndex}-${date}`}
                className="flex h-6 items-center justify-center"
              >
                <button
                  type="button"
                  aria-label={`${date} ${month.label}${hasBooking ? ", has booking" : ""}${isToday ? ", today" : ""}`}
                  aria-pressed={selected}
                  aria-current={isToday ? "date" : undefined}
                  onClick={() => onSelectDay(date)}
                  className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold tabular-nums leading-none transition-[background-color,box-shadow,color,transform] duration-150 hover:bg-[rgba(0,111,236,0.1)] active:scale-95 ${TEXT_MICRO} ${FOCUS_RING} ${motionClass(reducedMotion, "")} ${!selected && !isToday ? "hover:text-[#1C252E]" : ""}`}
                  style={{
                    backgroundColor,
                    color,
                    boxShadow,
                  }}
                >
                  {date}
                  {hasBooking ? (
                    <span
                      className="absolute bottom-[4px] left-1/2 h-[3.5px] w-[3.5px] -translate-x-1/2 rounded-full"
                      style={{
                        backgroundColor: selected
                          ? "rgba(255, 255, 255, 0.92)"
                          : SALTMINE.primary,
                        boxShadow: selected
                          ? undefined
                          : "0 0 0 1px rgba(255, 255, 255, 0.95)",
                      }}
                      aria-hidden
                    />
                  ) : null}
                </button>
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
