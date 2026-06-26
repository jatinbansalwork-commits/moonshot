"use client";

import { DeckDaySection } from "@/components/slider/saltmine-deck-bookings-view";
import {
  DECK_OFFICE_AVATARS,
  DECK_TIMELINE_DAYS,
  SALTMINE_PROJECT_SYNC,
  teamOccupancyLabel,
} from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_MOCKUP_FONT_FAMILY } from "@/lib/saltmine-mockup-font";

const EMBED_SOURCE_WIDTH = 320;
const EMBED_SCALE = 2.08;

/**
 * Slide 20 (left) — office presence timeline row.
 * Edit this file to change this slice of slide 20 only.
 */
export function Slide20DeckDayScreen() {
  const day = DECK_TIMELINE_DAYS[0];
  const coworkers = DECK_OFFICE_AVATARS.slice(0, 3).map((avatar) => ({
    initials: avatar.initials,
    color: avatar.color,
    memberId: avatar.memberId,
  }));

  return (
    <div
      className="relative mx-auto mt-[50px] flex w-1/2 max-w-xl justify-center antialiased"
      style={{
        fontFamily: SALTMINE_MOCKUP_FONT_FAMILY,
        height: Math.ceil(30 * EMBED_SCALE),
      }}
      aria-label="Office presence preview"
    >
      <div
        style={{
          width: EMBED_SOURCE_WIDTH,
          transform: `scale(${EMBED_SCALE})`,
          transformOrigin: "top center",
        }}
      >
        <DeckDaySection
          title={day.title}
          weatherLabel={day.weatherLabel}
          weatherIcon={day.weatherIcon}
          coworkers={coworkers}
          occupancyLabel={teamOccupancyLabel(
            coworkers.length,
            SALTMINE_PROJECT_SYNC.name,
          )}
          bookings={[]}
          isToday={day.isToday}
          showCommutePill={day.showCommutePill}
          hideDayHeader
          hideBookings
          presenceRowOnly
          presenceCompact
          avatarStackSize={13}
          onView={() => undefined}
          onAddBooking={() => undefined}
          onBookingAction={() => undefined}
          onExternalLink={() => undefined}
        />
      </div>
    </div>
  );
}
