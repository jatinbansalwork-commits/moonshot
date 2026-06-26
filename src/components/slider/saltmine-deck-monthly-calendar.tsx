"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import { CALENDAR_MONTHS } from "@/lib/saltmine-bookings-dashboard-data";
import {
  DECK_MONTHLY_DAY_HEADERS,
  DECK_MONTHLY_TODAY,
  deckMonthlyBookingsForDay,
  deckMonthlyWeekLabel,
  type DeckMonthlyBookingChip,
} from "@/lib/saltmine-deck-monthly-calendar-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

const CHIP_STYLES: Record<
  DeckMonthlyBookingChip["kind"],
  { backgroundColor: string; color: string }
> = {
  parking: {
    backgroundColor: "rgba(0, 111, 236, 0.14)",
    color: "#006FEC",
  },
  desk: {
    backgroundColor: "rgba(139, 92, 246, 0.14)",
    color: "#7C3AED",
  },
  meeting: {
    backgroundColor: "rgba(139, 92, 246, 0.14)",
    color: "#7C3AED",
  },
};

function filterChipsByKind(
  chips: readonly DeckMonthlyBookingChip[],
  bookingTypeFilter: string,
): DeckMonthlyBookingChip[] {
  if (bookingTypeFilter === "Show all") return [...chips];

  const kindMap: Record<string, DeckMonthlyBookingChip["kind"]> = {
    Desk: "desk",
    "Car park": "parking",
    "Meeting room": "meeting",
  };
  const kind = kindMap[bookingTypeFilter];
  if (!kind) return [...chips];
  return chips.filter((chip) => chip.kind === kind);
}

function MonthlyBookingChip({ chip }: { chip: DeckMonthlyBookingChip }) {
  const style = CHIP_STYLES[chip.kind];

  return (
    <div
      className={`flex min-h-[14px] items-center gap-0.5 rounded-[4px] px-0.5 py-px font-semibold leading-none ${TEXT_MICRO}`}
      style={style}
      title={`${chip.timeLabel} ${chip.title}`}
    >
      <span className="shrink-0 tabular-nums opacity-90">{chip.timeLabel}</span>
      <span className="min-w-0 truncate">{chip.title}</span>
      {chip.recurring ? (
        <Repeat className="ml-auto h-2 w-2 shrink-0 opacity-70" strokeWidth={ICON_STROKE} aria-hidden />
      ) : null}
    </div>
  );
}

export function DeckMonthlyCalendar({
  monthIndex,
  selectedDay,
  bookingTypeFilter,
  monthMenuOpen,
  onPrevMonth,
  onNextMonth,
  onToggleMonthMenu,
  onCloseMonthMenu,
  onSelectMonth,
  onSelectDay,
  onToday,
}: {
  monthIndex: number;
  selectedDay: number;
  bookingTypeFilter: string;
  monthMenuOpen: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleMonthMenu: () => void;
  onCloseMonthMenu: () => void;
  onSelectMonth: (index: number) => void;
  onSelectDay: (day: number) => void;
  onToday: () => void;
}) {
  const month = CALENDAR_MONTHS[monthIndex];

  return (
    <div className="flex h-full min-h-0 flex-col" aria-label="Monthly bookings calendar">
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={onToggleMonthMenu}
            className={`inline-flex min-h-6 max-w-full items-center gap-1 rounded-[6px] border px-1.5 font-bold leading-none ${TEXT_2XS} ${FOCUS_RING}`}
            style={{
              borderColor: HAIRLINE,
              backgroundColor: SALTMINE_ONBOARDING.color.canvas,
              color: SALTMINE.text,
            }}
            aria-expanded={monthMenuOpen}
            aria-haspopup="listbox"
          >
            <CalendarDays className="h-2.5 w-2.5 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
            <span className="truncate">{month?.label ?? "Calendar"}</span>
            <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-70" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
          {monthMenuOpen ? (
            <ul
              role="listbox"
              className="absolute left-0 top-[calc(100%+4px)] z-20 m-0 min-w-[120px] list-none rounded-[8px] border bg-white p-0.5 shadow-lg"
              style={{ borderColor: HAIRLINE }}
            >
              {CALENDAR_MONTHS.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === monthIndex}
                    onClick={() => {
                      onSelectMonth(index);
                      onCloseMonthMenu();
                    }}
                    className={`flex w-full items-center rounded-[6px] px-1.5 py-1 text-left font-semibold ${TEXT_2XS} ${FOCUS_RING}`}
                    style={{
                      color: index === monthIndex ? SALTMINE.primary : SALTMINE.text,
                      backgroundColor:
                        index === monthIndex ? "rgba(0, 111, 236, 0.08)" : "transparent",
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onToday}
            className={`min-h-6 rounded-[6px] border px-1.5 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: HAIRLINE,
              color: SALTMINE.textSecondary,
              backgroundColor: "white",
            }}
          >
            {content.monthlyTodayLabel}
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPrevMonth}
            disabled={monthIndex === 0}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] border disabled:opacity-40 ${FOCUS_RING}`}
            style={{ borderColor: HAIRLINE, color: SALTMINE.textMuted }}
          >
            <ChevronLeft className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            disabled={monthIndex === CALENDAR_MONTHS.length - 1}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] border disabled:opacity-40 ${FOCUS_RING}`}
            style={{ borderColor: HAIRLINE, color: SALTMINE.textMuted }}
          >
            <ChevronRight className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-hidden rounded-[8px] border bg-white"
        style={{ borderColor: HAIRLINE }}
      >
        <div
          className="grid grid-cols-7 border-b"
          style={{ borderColor: HAIRLINE, backgroundColor: SALTMINE_ONBOARDING.color.canvas }}
        >
          {DECK_MONTHLY_DAY_HEADERS.map((label) => (
            <div
              key={label}
              className={`px-0.5 py-1 text-center font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
              style={{ color: SALTMINE.textMuted }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid h-[calc(100%-20px)] grid-rows-5">
          {month?.weeks.map((week, weekRowIndex) => (
            <div
              key={`week-${weekRowIndex}`}
              className="grid min-h-0 grid-cols-7 border-b last:border-b-0"
              style={{ borderColor: HAIRLINE }}
            >
              {week.map((day, columnIndex) => {
                const isWeekend = columnIndex >= 5;
                const isMonday = columnIndex === 0;
                const isToday =
                  day !== null &&
                  monthIndex === DECK_MONTHLY_TODAY.monthIndex &&
                  day === DECK_MONTHLY_TODAY.day;
                const isSelected = day !== null && day === selectedDay;
                const chips =
                  day === null
                    ? []
                    : filterChipsByKind(
                        deckMonthlyBookingsForDay(monthIndex, day),
                        bookingTypeFilter,
                      );
                const weekLabel =
                  isMonday && day !== null ? deckMonthlyWeekLabel(monthIndex, day) : null;

                return (
                  <div
                    key={`${weekRowIndex}-${columnIndex}`}
                    className="min-h-0 border-r p-0.5 last:border-r-0"
                    style={{
                      borderColor: HAIRLINE,
                      backgroundColor: isWeekend
                        ? "#FFFFFF"
                        : "rgba(244, 246, 248, 0.72)",
                    }}
                  >
                    {day !== null ? (
                      <button
                        type="button"
                        onClick={() => onSelectDay(day)}
                        className={`flex h-full w-full min-w-0 flex-col rounded-[4px] text-left ${FOCUS_RING}`}
                      >
                        <div className="mb-0.5 flex items-start justify-between gap-0.5">
                          <span className="min-w-0">
                            {weekLabel ? (
                              <span
                                className={`block font-medium leading-none ${TEXT_MICRO}`}
                                style={{ color: SALTMINE.textMuted }}
                              >
                                {weekLabel}
                              </span>
                            ) : null}
                            <span
                              className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full font-bold tabular-nums leading-none ${TEXT_MICRO}`}
                              style={{
                                color: isToday || isSelected ? SALTMINE.primary : SALTMINE.text,
                                backgroundColor:
                                  isToday || isSelected
                                    ? "rgba(0, 111, 236, 0.12)"
                                    : "transparent",
                                boxShadow:
                                  isSelected && !isToday
                                    ? `inset 0 0 0 1px rgba(0, 111, 236, 0.35)`
                                    : undefined,
                              }}
                            >
                              {day}
                            </span>
                          </span>
                        </div>
                        <div className="min-h-0 flex-1 space-y-0.5 overflow-hidden">
                          {chips.map((chip) => (
                            <MonthlyBookingChip key={`${day}-${chip.id}`} chip={chip} />
                          ))}
                        </div>
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
