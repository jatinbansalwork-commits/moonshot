"use client";

import { Car, MapPin, Monitor, Users, Video, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import type { OfficePresencePerson } from "@/lib/saltmine-office-presence-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

function panelTextClasses(layout: "desktop" | "mobile") {
  if (layout === "mobile") {
    return {
      eyebrow: `${SALTMINE_MOBILE_CAPTION_CLASS} font-bold uppercase tracking-[0.06em]`,
      title: SALTMINE_MOBILE_CARD_TITLE_CLASS,
      meta: SALTMINE_MOBILE_SECONDARY_CLASS,
      summary: SALTMINE_MOBILE_SECONDARY_CLASS,
      empty: SALTMINE_MOBILE_BODY_CLASS,
      personName: `${SALTMINE_MOBILE_BODY_CLASS} font-bold`,
      personLocation: SALTMINE_MOBILE_CAPTION_CLASS,
      cta: `${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} min-h-11`,
    };
  }
  return {
    eyebrow: `font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`,
    title: `truncate font-bold tracking-[-0.02em] ${TEXT_XS}`,
    meta: `font-medium ${TEXT_2XS}`,
    summary: `font-semibold ${TEXT_2XS}`,
    empty: `font-medium ${TEXT_XS}`,
    personName: `truncate font-bold tracking-[-0.01em] ${TEXT_XS}`,
    personLocation: `flex min-w-0 items-center gap-0.5 font-medium ${TEXT_MICRO}`,
    cta: `flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO}`,
  };
}

const LOCATION_ICONS = {
  desk: Monitor,
  meeting: Video,
  parking: Car,
} as const;

function PresenceAvatar({
  person,
  layout,
}: {
  person: OfficePresencePerson;
  layout: "desktop" | "mobile";
}) {
  return (
    <SaltmineDeckAvatar
      memberId={person.id}
      letter={person.initials}
      size={layout === "mobile" ? 28 : 14}
      color={person.color}
    />
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
  layout = "desktop",
}: {
  officeName: string;
  teamName: string;
  dayTitle: string;
  summary: string;
  people: readonly OfficePresencePerson[];
  onClose: () => void;
  onFloorPlan: () => void;
  layout?: "desktop" | "mobile";
}) {
  const text = panelTextClasses(layout);
  const iconStroke = layout === "mobile" ? SALTMINE_MOBILE_ICON.stroke : ICON_STROKE;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <span
            className={`mb-0.5 inline-flex rounded-full px-1.5 py-px ${text.eyebrow}`}
            style={{
              backgroundColor: "rgba(0, 111, 236, 0.12)",
              color: SALTMINE.primary,
            }}
          >
            {content.officePresenceEyebrow}
          </span>
          <p className={`m-0 ${text.title}`} style={{ color: SALTMINE.text }}>
            {content.officePresenceTitle.replace("{office}", officeName)}
          </p>
        </div>
        {layout === "desktop" ? (
          <button
            type="button"
            aria-label={content.officePresenceCloseLabel}
            onClick={onClose}
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            <X className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </button>
        ) : null}
      </div>

      <p className={`m-0 mb-2 font-medium ${text.meta}`} style={{ color: SALTMINE.textSecondary }}>
        {dayTitle} · {teamName}
      </p>

      <div
        className={`mb-2 flex items-center gap-1.5 rounded-[8px] border ${layout === "mobile" ? "px-3 py-2.5" : "px-2 py-1.5"}`}
        style={{
          borderColor: HAIRLINE,
          backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        }}
      >
        <Users
          className={layout === "mobile" ? "h-4 w-4 shrink-0" : "h-2.5 w-2.5 shrink-0"}
          strokeWidth={iconStroke}
          style={{ color: SALTMINE.primary }}
          aria-hidden
        />
        <p className={`m-0 font-semibold ${text.summary}`} style={{ color: SALTMINE.textSecondary }}>
          {summary}
        </p>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {people.length === 0 ? (
          <div className="flex min-h-[100px] items-center justify-center px-1 text-center">
            <p className={`m-0 font-medium ${text.empty}`} style={{ color: SALTMINE.textMuted }}>
              {content.officePresenceEmptyLabel}
            </p>
          </div>
        ) : (
          <ul className={`m-0 list-none p-0 ${layout === "mobile" ? "space-y-2" : "space-y-1"}`}>
            {people.map((person) => {
              const LocationIcon = LOCATION_ICONS[person.locationKind];
              return (
                <li key={person.id}>
                  <div
                    className={`flex items-center gap-2 rounded-[8px] border ${layout === "mobile" ? "px-3 py-2.5" : "gap-1.5 px-1.5 py-1.5"}`}
                    style={{
                      borderColor: HAIRLINE,
                      backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                    }}
                  >
                    <PresenceAvatar person={person} layout={layout} />
                    <div className="min-w-0 flex-1">
                      <p className={`m-0 ${text.personName}`} style={{ color: SALTMINE.text }}>
                        {person.name}
                      </p>
                      <p
                        className={`m-0 ${text.personLocation}`}
                        style={{ color: SALTMINE.textMuted }}
                      >
                        <LocationIcon
                          className={layout === "mobile" ? "h-3.5 w-3.5 shrink-0" : "h-2 w-2 shrink-0"}
                          strokeWidth={iconStroke}
                          aria-hidden
                        />
                        <span className="truncate">{person.location}</span>
                      </p>
                    </div>
                    <MapPin
                      className={layout === "mobile" ? "h-4 w-4 shrink-0 opacity-50" : "h-2 w-2 shrink-0 opacity-50"}
                      strokeWidth={iconStroke}
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
          className={`flex w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${text.cta} ${FOCUS_RING}`}
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
