"use client";

import { Car, MapPin, Monitor, Users, Video, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import type { OfficePresencePerson } from "@/lib/saltmine-office-presence-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

const LOCATION_ICONS = {
  desk: Monitor,
  meeting: Video,
  parking: Car,
} as const;

function PresenceAvatar({ person }: { person: OfficePresencePerson }) {
  const isEmoji = person.initials.length > 2;

  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white font-bold leading-none text-white"
      style={{
        backgroundColor: person.color,
        fontSize: isEmoji ? 12 : 10,
      }}
      aria-hidden
    >
      {person.initials}
    </span>
  );
}

export function OfficePresencePanel({
  officeName,
  teamName,
  dayTitle,
  summary,
  people,
  onClose,
  onFloorPlan,
}: {
  officeName: string;
  teamName: string;
  dayTitle: string;
  summary: string;
  people: readonly OfficePresencePerson[];
  onClose: () => void;
  onFloorPlan: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <span
            className={`mb-0.5 inline-flex rounded-full px-1.5 py-px font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
            style={{
              backgroundColor: "rgba(0, 111, 236, 0.12)",
              color: SALTMINE.primary,
            }}
          >
            {content.officePresenceEyebrow}
          </span>
          <p
            className={`m-0 truncate font-bold tracking-[-0.02em] ${TEXT_XS}`}
            style={{ color: SALTMINE.text }}
          >
            {content.officePresenceTitle.replace("{office}", officeName)}
          </p>
        </div>
        <button
          type="button"
          aria-label={content.officePresenceCloseLabel}
          onClick={onClose}
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <X className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>

      <p className={`m-0 mb-2 font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.textSecondary }}>
        {dayTitle} · {teamName}
      </p>

      <div
        className="mb-2 flex items-center gap-1 rounded-[8px] border px-2 py-1.5"
        style={{
          borderColor: HAIRLINE,
          backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        }}
      >
        <Users
          className="h-2.5 w-2.5 shrink-0"
          strokeWidth={ICON_STROKE}
          style={{ color: SALTMINE.primary }}
          aria-hidden
        />
        <p className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.textSecondary }}>
          {summary}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {people.length === 0 ? (
          <div className="flex min-h-[100px] items-center justify-center px-1 text-center">
            <p className={`m-0 font-medium ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
              {content.officePresenceEmptyLabel}
            </p>
          </div>
        ) : (
          <ul className="m-0 list-none space-y-1 p-0">
            {people.map((person) => {
              const LocationIcon = LOCATION_ICONS[person.locationKind];
              return (
                <li key={person.id}>
                  <div
                    className="flex items-center gap-1.5 rounded-[8px] border px-1.5 py-1.5"
                    style={{
                      borderColor: HAIRLINE,
                      backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                    }}
                  >
                    <PresenceAvatar person={person} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`m-0 truncate font-bold tracking-[-0.01em] ${TEXT_XS}`}
                        style={{ color: SALTMINE.text }}
                      >
                        {person.name}
                      </p>
                      <p
                        className={`m-0 flex min-w-0 items-center gap-0.5 font-medium ${TEXT_MICRO}`}
                        style={{ color: SALTMINE.textMuted }}
                      >
                        <LocationIcon
                          className="h-2 w-2 shrink-0"
                          strokeWidth={ICON_STROKE}
                          aria-hidden
                        />
                        <span className="truncate">{person.location}</span>
                      </p>
                    </div>
                    <MapPin
                      className="h-2 w-2 shrink-0 opacity-50"
                      strokeWidth={ICON_STROKE}
                      style={{ color: SALTMINE.primary }}
                      aria-hidden
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-auto space-y-1 pt-2">
        <button
          type="button"
          onClick={onFloorPlan}
          className={`flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.32)",
            color: SALTMINE.primary,
            backgroundColor: "rgba(0, 111, 236, 0.08)",
          }}
        >
          {content.officePresenceFloorPlanCta}
        </button>
      </div>
    </div>
  );
}
