"use client";

import { useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import { SALTMINE_PROJECT_SYNC } from "@/lib/saltmine-deck-bookings-data";
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
const EMBED_FILTER_AVATAR_SIZE = 11;
const EMBED_MEMBER_CHECKBOX = "#94A3B8";

function FilterCheckbox({
  checked,
  tone = "primary",
  size = "md",
}: {
  checked: boolean;
  tone?: "primary" | "muted";
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const icon = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[4px] transition-colors duration-150 ${
        checked
          ? tone === "primary"
            ? "bg-[#006FEC] text-white"
            : "text-white"
          : "border border-[#DFE3E8] bg-white"
      } ${dim}`}
      style={checked && tone === "muted" ? { backgroundColor: EMBED_MEMBER_CHECKBOX } : undefined}
      aria-hidden
    >
      {checked ? (
        <svg viewBox="0 0 12 12" className={`stroke-current stroke-[2] fill-none ${icon}`}>
          <path d="M2 6.2 4.8 9 10 3" />
        </svg>
      ) : null}
    </span>
  );
}

function avatarLetter(label: string) {
  return label.trim().charAt(0).toUpperCase();
}

function memberAvatarLetter(member: TeamMember) {
  if (member.initials.length === 1) return member.initials.toUpperCase();
  return avatarLetter(member.name);
}

function MemberAvatar({ member, size = AVATAR_SIZE }: { member: TeamMember; size?: number }) {
  return (
    <SaltmineDeckAvatar memberId={member.id} letter={memberAvatarLetter(member)} size={size} color={member.color} />
  );
}

function TeamMemberRow({
  member,
  checked,
  onToggle,
  onRemove,
  compact = false,
  embedFilter = false,
}: {
  member: TeamMember;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
  compact?: boolean;
  embedFilter?: boolean;
}) {
  if (embedFilter) {
    return (
      <div className="flex items-center py-1">
        <button
          type="button"
          onClick={onToggle}
          className={`flex min-w-0 flex-1 items-center gap-2 text-left ${FOCUS_RING}`}
          aria-pressed={checked}
        >
          <FilterCheckbox checked={checked} tone="muted" size="sm" />
          <MemberAvatar member={member} size={EMBED_FILTER_AVATAR_SIZE} />
          <span
            className="min-w-0 flex-1 truncate text-[10px] font-medium leading-[14px]"
            style={{ color: SALTMINE.textMuted }}
          >
            {member.name}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`group flex items-center ${compact ? "gap-0 py-0.5" : "gap-1 py-1"}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex min-w-0 flex-1 items-center rounded-md text-left transition-colors duration-150 hover:bg-[rgba(145,158,171,0.08)] ${compact ? "gap-1.5" : "gap-1"} ${FOCUS_RING}`}
        aria-pressed={checked}
      >
        <span
          className={`inline-flex shrink-0 items-center justify-center ${compact ? "h-4 w-4" : "h-5 w-5"}`}
          aria-hidden
        >
          <span
            className={`flex items-center justify-center rounded-[3px] border transition-colors duration-150 ${
              compact ? "h-2.5 w-2.5" : "h-3 w-3"
            } ${
              checked
                ? "border-[#006FEC] bg-[#006FEC] text-white"
                : "border-[#DFE3E8] bg-white"
            }`}
          >
            {checked ? (
              <svg
                viewBox="0 0 12 12"
                className={`stroke-current stroke-[2] fill-none ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`}
              >
                <path d="M2 6.2 4.8 9 10 3" />
              </svg>
            ) : null}
          </span>
        </span>
        <MemberAvatar member={member} size={compact ? 11 : AVATAR_SIZE} />
        <span
          className={`min-w-0 flex-1 truncate font-medium ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {member.name}
        </span>
      </button>
      {compact ? null : (
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
      )}
    </div>
  );
}

export function TeamColumn({
  team,
  checkedIds,
  onToggleMember,
  onSelectAll,
  onSelectNone,
  onRemoveMember,
  onMenu,
  hideMemberControls = false,
  hideMenu = false,
  compact = false,
  embedFilter = false,
}: {
  team: TeamGroup;
  checkedIds: Set<string>;
  onToggleMember: (memberId: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onRemoveMember: (memberId: string) => void;
  onMenu: () => void;
  hideMemberControls?: boolean;
  hideMenu?: boolean;
  compact?: boolean;
  embedFilter?: boolean;
}) {
  const allChecked = team.members.every((member) => checkedIds.has(member.id));
  const noneChecked = team.members.every((member) => !checkedIds.has(member.id));

  return (
    <section
      className={
        embedFilter
          ? "flex w-full flex-col rounded-[14px] border border-black/10 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(28,37,46,0.08)]"
          : compact
            ? "flex w-full flex-col rounded-[12px] border border-black/10 bg-white px-3 py-2 shadow-[0_4px_16px_rgba(28,37,46,0.08)]"
            : "flex min-h-0 min-w-0 flex-1 flex-col rounded-[10px] border px-2 py-1.5"
      }
      style={
        embedFilter || compact
          ? undefined
          : {
              borderColor: SALTMINE_HAIRLINE,
              backgroundColor: SALTMINE_ONBOARDING.color.canvas,
              boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)",
            }
      }
      aria-label={team.name}
    >
      {embedFilter ? (
        <>
          <button
            type="button"
            onClick={allChecked ? onSelectNone : onSelectAll}
            className={`flex w-full items-center gap-2.5 pb-3 text-left ${FOCUS_RING}`}
            aria-pressed={allChecked}
          >
            <FilterCheckbox checked={allChecked} tone="primary" />
            <span
              className="truncate text-[10px] font-semibold leading-[14px] tracking-[-0.01em]"
              style={{ color: SALTMINE.text }}
            >
              {team.name} – Show all
            </span>
          </button>
          <div
            className="mb-2 h-px w-full"
            style={{ backgroundColor: SALTMINE_HAIRLINE }}
            aria-hidden
          />
        </>
      ) : (
      <div className={`flex items-start justify-between gap-1 ${compact ? "mb-1.5" : "mb-1"}`}>
        <div className={`min-w-0 ${compact ? "w-full text-center" : ""}`}>
          <h2
            className={`m-0 truncate font-bold tracking-[-0.02em] ${compact ? "text-[10px] leading-[14px]" : TEXT_XS}`}
            style={{ color: SALTMINE.text }}
          >
            {team.name}
          </h2>
          {hideMemberControls ? null : (
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
          )}
        </div>
        {hideMenu ? null : (
        <button
          type="button"
          aria-label={`${team.name} options`}
          onClick={onMenu}
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] active:scale-95 ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <MoreHorizontal className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
        )}
      </div>
      )}
      <ul
        className={
          embedFilter
            ? "m-0 list-none space-y-0 p-0"
            : compact
              ? "m-0 list-none space-y-0 p-0"
              : "no-scrollbar m-0 min-h-0 flex-1 list-none space-y-px overflow-y-auto p-0"
        }
      >
        {team.members.map((member) => (
          <li key={member.id}>
            <TeamMemberRow
              member={member}
              checked={checkedIds.has(member.id)}
              onToggle={() => onToggleMember(member.id)}
              onRemove={() => onRemoveMember(member.id)}
              compact={compact}
              embedFilter={embedFilter}
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
  compact = false,
}: {
  checkedMemberIds: Set<string>;
  onCheckedMemberIdsChange: (ids: Set<string>) => void;
  showToast: (message: string, onUndo?: () => void) => void;
  compact?: boolean;
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
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

/** Project Sync team roster for slide embeds (Filters band). */
const PROJECT_SYNC_EMBED_MEMBER_COUNT = 6;

export function ProjectSyncTeamListEmbed() {
  const sourceTeam = MY_TEAMS_DUMMY.find((entry) => entry.id === SALTMINE_PROJECT_SYNC.id);
  const team = sourceTeam
    ? {
        ...sourceTeam,
        members: sourceTeam.members.slice(0, PROJECT_SYNC_EMBED_MEMBER_COUNT),
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
        onSelectAll={() => setCheckedIds(new Set(team.members.map((member) => member.id)))}
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
