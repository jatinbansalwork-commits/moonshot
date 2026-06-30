"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineAvatarStack } from "@/components/slider/saltmine-avatar-stack";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import {
  SaltmineMobilePageHeader,
  SaltmineMobileProfileButton,
} from "@/components/slider/saltmine-mobile-chrome";
import {
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CARD_BORDER_COLOR,
  SALTMINE_MOBILE_CARD_CLASS,
  SALTMINE_MOBILE_CARD_PAD_CLASS,
  SALTMINE_MOBILE_CARD_SHADOW_STYLE,
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_LIST_GAP_CLASS,
  SALTMINE_MOBILE_OUTLINE_BUTTON_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SCROLL_SURFACE_ATTR,
  SALTMINE_MOBILE_SECONDARY_CLASS,
  SALTMINE_MOBILE_SECTION_EYEBROW_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
import { MY_TEAMS_DUMMY, type TeamGroup } from "@/lib/saltmine-teams-data";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const AVATAR_SIZE = 24;

/** Mobile deck label for slide 25 — matches reference mock. */
const MOBILE_TEAM_DISPLAY_NAMES: Record<string, string> = {
  [SALTMINE_PROJECT_SYNC.id]: "Project X",
};

function mobileTeamLabel(team: TeamGroup): string {
  return MOBILE_TEAM_DISPLAY_NAMES[team.id] ?? team.name;
}

function MobileTeamAvatarGrid({ members }: { members: TeamGroup["members"] }) {
  return (
    <SaltmineAvatarStack
      people={members.map((member) => ({
        memberId: member.id,
        letter: member.floorLetter,
        color: member.color,
      }))}
      size={AVATAR_SIZE}
      maxVisible={8}
      overflowClassName="text-[10px] font-bold leading-none"
    />
  );
}

function MobileTeamCard({
  team,
  onAddTeamDay,
  onDeleteTeam,
}: {
  team: TeamGroup;
  onAddTeamDay: () => void;
  onDeleteTeam: () => void;
}) {
  const label = mobileTeamLabel(team);

  return (
    <article
      className={`${SALTMINE_MOBILE_CARD_CLASS} ${SALTMINE_MOBILE_CARD_PAD_CLASS}`}
      style={{ borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR, ...SALTMINE_MOBILE_CARD_SHADOW_STYLE }}
      aria-label={label}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 pt-0.5">
          <h3 className={`m-0 truncate ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`} style={{ color: SALTMINE.text }}>
            {label}
          </h3>
          <span
            className={`mt-1.5 inline-flex h-6 items-center rounded-full px-2 ${SALTMINE_MOBILE_CAPTION_CLASS} font-semibold tabular-nums`}
            style={{
              backgroundColor: "rgba(145, 158, 171, 0.1)",
              color: SALTMINE.textSecondary,
            }}
          >
            {team.members.length} {team.members.length === 1 ? "member" : "members"}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddTeamDay}
          className={`${SALTMINE_MOBILE_OUTLINE_BUTTON_CLASS} shrink-0 transition-colors hover:bg-[rgba(145,158,171,0.04)] ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(145, 158, 171, 0.38)",
            color: SALTMINE.text,
            backgroundColor: "#FFFFFF",
          }}
        >
          Add team day
        </button>
      </div>

      <div
        className="mb-3.5 min-h-[44px] rounded-[10px] border px-3 py-2.5"
        style={{
          borderColor: "rgba(145, 158, 171, 0.16)",
          backgroundColor: "rgba(244, 246, 248, 0.72)",
        }}
      >
        <p
          className={`m-0 mb-2 ${SALTMINE_MOBILE_SECTION_EYEBROW_CLASS}`}
          style={{ color: SALTMINE.textMuted }}
        >
          Roster
        </p>
        <MobileTeamAvatarGrid members={team.members} />
      </div>

      <div
        className="flex justify-end gap-2 border-t pt-3"
        style={{ borderColor: "rgba(145, 158, 171, 0.16)" }}
      >
        <button
          type="button"
          onClick={onDeleteTeam}
          className={`${SALTMINE_MOBILE_OUTLINE_BUTTON_CLASS} transition-colors hover:bg-[rgba(239,68,68,0.04)] ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(239, 68, 68, 0.32)",
            color: "#E11D48",
            backgroundColor: "#FFFFFF",
          }}
        >
          Delete team
        </button>
      </div>
    </article>
  );
}

export function SaltmineMobileTeamsView({
  showToast,
}: {
  showToast: (message: string) => void;
}) {
  const { setSearchOpen, openOverlay } = useSaltmineMobileApp();
  const [teams, setTeams] = useState<TeamGroup[]>(() =>
    MY_TEAMS_DUMMY.map((team) => ({ ...team, members: [...team.members] })),
  );

  function handleDeleteTeam(teamId: string, teamName: string) {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    showToast(`${teamName} deleted`);
  }

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}
    >
      <SaltmineMobilePageHeader title={content.teamsPageTitle}>
        <button
          type="button"
          aria-label="Search teams"
          onClick={() => setSearchOpen(true)}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.textSecondary }}
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
        <SaltmineMobileProfileButton onClick={() => openOverlay("profile")} />
      </SaltmineMobilePageHeader>

      <div
        {...SALTMINE_MOBILE_SCROLL_SURFACE_ATTR}
        className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} pt-3 ${SALTMINE_MOBILE_LIST_GAP_CLASS}`}
        style={{ paddingBottom: SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING + 16 }}
      >
        <p
          className={`m-0 -mt-1 ${SALTMINE_MOBILE_SECTION_EYEBROW_CLASS}`}
          style={{ color: SALTMINE.textMuted }}
        >
          Your teams
        </p>
        {teams.map((team) => (
          <MobileTeamCard
            key={team.id}
            team={team}
            onAddTeamDay={() =>
              showToast(`${content.addedBookingToast} ${mobileTeamLabel(team)}`)
            }
            onDeleteTeam={() => handleDeleteTeam(team.id, mobileTeamLabel(team))}
          />
        ))}

        <button
          type="button"
          aria-label="Create a team"
          onClick={() => showToast("Create a team — demo")}
          className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-[16px] border border-dashed bg-white transition-colors hover:bg-[#F8FAFC] ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(145, 158, 171, 0.32)",
            ...SALTMINE_MOBILE_CARD_SHADOW_STYLE,
          }}
        >
          <Plus
            className="h-5 w-5"
            strokeWidth={1.75}
            style={{ color: SALTMINE.primary }}
            aria-hidden
          />
          <span className={`${SALTMINE_MOBILE_SECONDARY_CLASS} font-semibold`} style={{ color: SALTMINE.text }}>
            Add team
          </span>
        </button>
      </div>
    </div>
  );
}
