"use client";

import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  MY_TEAMS_DUMMY,
  type TeamGroup,
  type TeamMember,
} from "@/lib/saltmine-teams-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const AVATAR_SIZE = 17;

function avatarLetter(label: string) {
  return label.trim().charAt(0).toUpperCase();
}

function memberAvatarLetter(member: TeamMember) {
  if (member.initials.length === 1) return member.initials.toUpperCase();
  return avatarLetter(member.name);
}

function MemberAvatar({ member, size = AVATAR_SIZE }: { member: TeamMember; size?: number }) {
  const fontSize = Math.round(size * 0.5 * 10) / 10;

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white"
      style={{
        width: size,
        height: size,
        fontSize,
        lineHeight: 1,
        backgroundColor: member.color,
      }}
      aria-hidden
    >
      <span className="block translate-y-px leading-none">{memberAvatarLetter(member)}</span>
    </span>
  );
}

function TeamMemberRow({
  member,
  checked,
  onToggle,
  onRemove,
}: {
  member: TeamMember;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group flex items-center gap-1 py-1">
      <button
        type="button"
        onClick={onToggle}
        className={`flex min-w-0 flex-1 items-center gap-1 rounded-md text-left transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${FOCUS_RING}`}
        aria-pressed={checked}
      >
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
          <span
            className={`flex h-3 w-3 items-center justify-center rounded-[3px] border transition-colors duration-150 ${
              checked
                ? "border-[#006FEC] bg-[#006FEC] text-white"
                : "border-[#DFE3E8] bg-white"
            }`}
          >
            {checked ? (
              <svg viewBox="0 0 12 12" className="h-2 w-2 stroke-current stroke-[2] fill-none">
                <path d="M2 6.2 4.8 9 10 3" />
              </svg>
            ) : null}
          </span>
        </span>
        <MemberAvatar member={member} />
        <span
          className={`min-w-0 flex-1 truncate font-medium ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {member.name}
        </span>
      </button>
      <button
        type="button"
        aria-label={`Remove ${member.name}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-[rgba(145,158,171,0.12)] active:scale-95 group-focus-within:opacity-100 ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <X className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} />
      </button>
    </div>
  );
}

function TeamColumn({
  team,
  checkedIds,
  onToggleMember,
  onSelectAll,
  onSelectNone,
  onRemoveMember,
  onMenu,
}: {
  team: TeamGroup;
  checkedIds: Set<string>;
  onToggleMember: (memberId: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onRemoveMember: (memberId: string) => void;
  onMenu: () => void;
}) {
  const allChecked = team.members.every((member) => checkedIds.has(member.id));
  const noneChecked = team.members.every((member) => !checkedIds.has(member.id));

  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col rounded-[10px] border px-2 py-1.5"
      style={{
        borderColor: SALTMINE_HAIRLINE,
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)",
      }}
      aria-label={team.name}
    >
      <div className="mb-1 flex items-start justify-between gap-1">
        <div className="min-w-0">
          <h2
            className={`m-0 truncate font-bold tracking-[-0.02em] ${TEXT_XS}`}
            style={{ color: SALTMINE.text }}
          >
            {team.name}
          </h2>
          <div className="flex items-center gap-1">
            <p className={`m-0 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
              {team.members.length} {content.teamsMemberLabel}
            </p>
            <span className={TEXT_MICRO} style={{ color: SALTMINE.textMuted }} aria-hidden>
              ·
            </span>
            <button
              type="button"
              onClick={onSelectAll}
              disabled={allChecked}
              className={`m-0 font-semibold disabled:cursor-default disabled:opacity-50 ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{ color: SALTMINE.primary }}
            >
              {content.teamsSelectAll}
            </button>
            <span className={TEXT_MICRO} style={{ color: SALTMINE.textMuted }} aria-hidden>
              /
            </span>
            <button
              type="button"
              onClick={onSelectNone}
              disabled={noneChecked}
              className={`m-0 font-semibold disabled:cursor-default disabled:opacity-50 ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{ color: SALTMINE.primary }}
            >
              {content.teamsSelectNone}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label={`${team.name} options`}
          onClick={onMenu}
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] active:scale-95 ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <MoreHorizontal className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>
      <ul className="m-0 min-h-0 flex-1 list-none space-y-px overflow-y-auto p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {team.members.map((member) => (
          <li key={member.id}>
            <TeamMemberRow
              member={member}
              checked={checkedIds.has(member.id)}
              onToggle={() => onToggleMember(member.id)}
              onRemove={() => onRemoveMember(member.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MyTeamsMainView({
  checkedMemberIds,
  onCheckedMemberIdsChange,
  showToast,
}: {
  checkedMemberIds: Set<string>;
  onCheckedMemberIdsChange: (ids: Set<string>) => void;
  showToast: (message: string, onUndo?: () => void) => void;
}) {
  const [teams, setTeams] = useState<TeamGroup[]>(() =>
    MY_TEAMS_DUMMY.map((team) => ({
      ...team,
      members: [...team.members],
    })),
  );

  function toggleMember(memberId: string) {
    onCheckedMemberIdsChange(
      (() => {
        const next = new Set(checkedMemberIds);
        if (next.has(memberId)) next.delete(memberId);
        else next.add(memberId);
        return next;
      })(),
    );
  }

  function selectAllInTeam(teamId: string) {
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) return;
    onCheckedMemberIdsChange(
      (() => {
        const next = new Set(checkedMemberIds);
        for (const member of team.members) next.add(member.id);
        return next;
      })(),
    );
  }

  function selectNoneInTeam(teamId: string) {
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) return;
    onCheckedMemberIdsChange(
      (() => {
        const next = new Set(checkedMemberIds);
        for (const member of team.members) next.delete(member.id);
        return next;
      })(),
    );
  }

  function removeMember(teamId: string, member: TeamMember) {
    const teamIndex = teams.findIndex((entry) => entry.id === teamId);
    const memberIndex = teams[teamIndex]?.members.findIndex((entry) => entry.id === member.id) ?? -1;
    if (teamIndex < 0 || memberIndex < 0) return;

    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, members: team.members.filter((entry) => entry.id !== member.id) }
          : team,
      ),
    );
    onCheckedMemberIdsChange(
      (() => {
        const next = new Set(checkedMemberIds);
        next.delete(member.id);
        return next;
      })(),
    );

    showToast(content.teamsUndoRemove, () => {
      setTeams((prev) =>
        prev.map((team, index) => {
          if (index !== teamIndex) return team;
          const members = [...team.members];
          members.splice(Math.min(memberIndex, members.length), 0, member);
          return { ...team, members };
        }),
      );
      onCheckedMemberIdsChange(
        (() => {
          const next = new Set(checkedMemberIds);
          next.add(member.id);
          return next;
        })(),
      );
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-1">
      <p className={`m-0 px-0.5 font-medium ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        {content.teamsHelperCopy}
      </p>
      <div className="flex min-h-0 flex-1 gap-1.5">
        {teams.map((team) => (
          <TeamColumn
            key={team.id}
            team={team}
            checkedIds={checkedMemberIds}
            onToggleMember={toggleMember}
            onSelectAll={() => selectAllInTeam(team.id)}
            onSelectNone={() => selectNoneInTeam(team.id)}
            onRemoveMember={(memberId) => {
              const member = team.members.find((entry) => entry.id === memberId);
              if (member) removeMember(team.id, member);
            }}
            onMenu={() => showToast(content.teamsMenuToast)}
          />
        ))}
      </div>
    </div>
  );
}
