"use client";

import { useState } from "react";
import { TeamColumn } from "@/components/slider/saltmine-teams-view";
import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
import { MY_TEAMS_DUMMY } from "@/lib/saltmine-teams-data";

const EMBED_MEMBER_COUNT = 6;

/**
 * Slide 20 (right) — team filter list.
 * Edit this file to change this slice of slide 20 only.
 */
export function Slide20TeamListScreen() {
  const sourceTeam = MY_TEAMS_DUMMY.find(
    (entry) => entry.id === SALTMINE_PROJECT_SYNC.id,
  );
  const team = sourceTeam
    ? {
        ...sourceTeam,
        members: sourceTeam.members.slice(0, EMBED_MEMBER_COUNT),
      }
    : null;
  const [checkedIds, setCheckedIds] = useState(
    () => new Set(team?.members.map((member) => member.id) ?? []),
  );

  if (!team) return null;

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <TeamColumn
        team={team}
        checkedIds={checkedIds}
        onToggleMember={(memberId) => {
          setCheckedIds((prev) => {
            const next = new Set(prev);
            if (next.has(memberId)) next.delete(memberId);
            else next.add(memberId);
            return next;
          });
        }}
        onSelectAll={() =>
          setCheckedIds(new Set(team.members.map((member) => member.id)))
        }
        onSelectNone={() => setCheckedIds(new Set())}
        onRemoveMember={() => undefined}
        onMenu={() => undefined}
        hideMemberControls
        hideMenu
        embedFilter
      />
    </div>
  );
}
