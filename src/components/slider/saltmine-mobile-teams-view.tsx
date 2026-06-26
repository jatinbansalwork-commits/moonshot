"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import {
  SaltmineDeckAvatar,
  scaleSaltmineAvatarSize,
} from "@/components/slider/saltmine-initial-avatar";
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
  SALTMINE_MOBILE_CARD_TITLE_CLASS,
  SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
  SALTMINE_MOBILE_FAB_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_LIST_GAP_CLASS,
  SALTMINE_MOBILE_OUTLINE_BUTTON_CLASS,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
import { MY_TEAMS_DUMMY, type TeamGroup } from "@/lib/saltmine-teams-data";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const AVATAR_SIZE = 24;
const AVATAR_RENDERED = scaleSaltmineAvatarSize(AVATAR_SIZE);

/** Mobile deck label for slide 25 — matches reference mock. */
const MOBILE_TEAM_DISPLAY_NAMES: Record<string, string> = {
  [SALTMINE_PROJECT_SYNC.id]: "Project X",
};

function mobileTeamLabel(team: TeamGroup): string {
  return MOBILE_TEAM_DISPLAY_NAMES[team.id] ?? team.name;
}

function MobileTeamAvatarGrid({ members }: { members: TeamGroup["members"] }) {
  const columns = members.length > 6 ? 8 : members.length;

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, ${AVATAR_RENDERED}px))`,
        justifyContent: members.length <= 6 ? "start" : "start",
      }}
    >
      {members.map((member) => (
        <SaltmineDeckAvatar
          key={member.id}
          memberId={member.id}
          letter={member.floorLetter}
          color={member.color}
          size={AVATAR_SIZE}
        />
      ))}
    </div>
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
      style={{ borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR }}
      aria-label={label}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 pt-0.5">
          <h3 className={`m-0 truncate ${SALTMINE_MOBILE_CARD_TITLE_CLASS}`} style={{ color: SALTMINE.text }}>
            {label}
          </h3>
          <p className={`m-0 mt-1 ${SALTMINE_MOBILE_SECONDARY_CLASS}`} style={{ color: SALTMINE.textMuted }}>
            {team.members.length} members
          </p>
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

      <div className="mb-3.5 min-h-[44px]">
        <MobileTeamAvatarGrid members={team.members} />
      </div>

      <div className="flex justify-end">
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
        className={`${SALTMINE_MOBILE_SCROLL_Y_CLASS} ${SALTMINE_MOBILE_CONTENT_X_CLASS} pt-3 ${SALTMINE_MOBILE_LIST_GAP_CLASS}`}
        style={{ paddingBottom: SALTMINE_MOBILE_CONTENT_BOTTOM_PADDING + 64 }}
      >
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
          className={`flex min-h-14 w-full items-center justify-center rounded-[12px] bg-white transition-colors hover:bg-[#F4F6F8] ${FOCUS_RING}`}
          style={{ borderColor: SALTMINE_MOBILE_CARD_BORDER_COLOR, borderWidth: 1, borderStyle: "solid" }}
        >
          <Plus
            className="h-5 w-5"
            strokeWidth={1.75}
            style={{ color: "rgba(99, 115, 129, 0.72)" }}
            aria-hidden
          />
        </button>
      </div>

      <button
        type="button"
        aria-label="Add team"
        onClick={() => showToast("Add team — demo")}
        className={`absolute right-4 z-20 ${SALTMINE_MOBILE_FAB_CLASS} ${SALTMINE_MOBILE_PRESS_CLASS}`}
        style={{
          bottom: SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
          backgroundColor: SALTMINE.primary,
        }}
      >
        <Plus className="h-[22px] w-[22px]" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
