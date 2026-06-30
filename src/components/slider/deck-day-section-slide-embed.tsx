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

/** Static today row for slide embeds (Office Presence band). */
export function DeckDaySectionSlideEmbed() {
  const day = DECK_TIMELINE_DAYS[0];
  const leadAvatar = DECK_OFFICE_AVATARS[0];
  const coworkers = Array.from({ length: 3 }, () => ({
    initials: leadAvatar.initials,
    color: leadAvatar.color,
    memberId: leadAvatar.memberId,
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
          occupancyLabel={teamOccupancyLabel(coworkers.length, SALTMINE_PROJECT_SYNC.name)}
          bookings={[]}
          isToday={day.isToday}
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
