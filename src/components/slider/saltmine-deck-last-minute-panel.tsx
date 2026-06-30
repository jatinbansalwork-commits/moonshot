"use client";

import { Car, LampDesk, MapPin } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import type { DeckLastMinuteContext } from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const ICON_STROKE = 1.65;

const KIND_ICON = {
  desk: LampDesk,
  parking: Car,
  meeting: MapPin,
} as const;

/** Waitlist + alternatives block on My bookings for last-minute lane (slide 39). */
export function DeckLastMinutePanel({
  context,
  onViewWaitlist,
  onBookAlternative,
}: {
  context: DeckLastMinuteContext;
  onViewWaitlist?: () => void;
  onBookAlternative?: (label: string) => void;
}) {
  return (
    <div className="space-y-2">
      {context.waitlist ? (
      <section
        className="rounded-[8px] border bg-white px-2 py-1.5"
        style={{ borderColor: SALTMINE_HAIRLINE }}
        aria-labelledby="last-minute-waitlist-heading"
      >
        <div className="mb-1 flex items-center justify-between gap-1">
          <h4
            id="last-minute-waitlist-heading"
            className={`m-0 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            Waitlist
          </h4>
          {onViewWaitlist ? (
            <button
              type="button"
              onClick={onViewWaitlist}
              className={`font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{ color: SALTMINE.primary }}
            >
              View details
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-[12px]"
            style={{ backgroundColor: "rgba(0, 111, 236, 0.12)", color: SALTMINE.primary }}
            aria-label={`Queue position ${context.waitlist.position}`}
          >
            {context.waitlist.position}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`m-0 font-semibold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
              {context.waitlist.resource}
            </p>
            <p className={`m-0 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
              Est. release {context.waitlist.estRelease}
            </p>
          </div>
        </div>
      </section>
      ) : null}

      {context.alternatives.length > 0 ? (
        <section
          className="rounded-[8px] border bg-white px-2 py-1.5"
          style={{ borderColor: SALTMINE_HAIRLINE }}
          aria-labelledby="last-minute-alternatives-heading"
        >
          <h4
            id="last-minute-alternatives-heading"
            className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            Available while you wait
          </h4>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {context.alternatives.map((item) => {
              const Icon = KIND_ICON[item.kind];
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-2 rounded-[6px] border px-1.5 py-1"
                  style={{ borderColor: SALTMINE_HAIRLINE }}
                >
                  <Icon
                    className="h-3 w-3 shrink-0"
                    strokeWidth={ICON_STROKE}
                    style={{ color: SALTMINE.textMuted }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`m-0 font-semibold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
                      {item.label}
                    </p>
                    <p className={`m-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
                      {item.detail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onBookAlternative?.(item.label)}
                    className={`shrink-0 rounded-[6px] border px-1.5 py-0.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
                    style={{
                      borderColor: "rgba(0, 111, 236, 0.32)",
                      color: SALTMINE.primary,
                      backgroundColor: "rgba(0, 111, 236, 0.06)",
                    }}
                  >
                    Book
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
