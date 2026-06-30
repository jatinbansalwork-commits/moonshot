"use client";

import type { CSSProperties } from "react";
import {
  SaltmineDeckAvatar,
  saltmineAvatarOverlap,
} from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE } from "@/lib/saltmine-onboarding-tokens";

export type SaltmineAvatarStackPerson = {
  initials?: string;
  letter?: string;
  color: string;
  memberId?: string;
};

export function SaltmineAvatarStack({
  people,
  size = 14,
  maxVisible = 5,
  showOverflowCount = true,
  showEmptyPlaceholder = false,
  overflowClassName = "text-[9px] font-bold leading-none",
}: {
  people: readonly SaltmineAvatarStackPerson[];
  size?: number;
  maxVisible?: number;
  showOverflowCount?: boolean;
  showEmptyPlaceholder?: boolean;
  overflowClassName?: string;
}) {
  if (people.length === 0 && showEmptyPlaceholder) {
    const overlap = saltmineAvatarOverlap(size);
    return (
      <span className="inline-flex shrink-0 items-center py-px" aria-hidden>
        {["placeholder-a", "placeholder-b"].map((key, index) => (
          <SaltmineDeckAvatar
            key={key}
            size={size}
            placeholder
            stacked
            style={{ zIndex: 2 - index, marginLeft: index === 0 ? 0 : -overlap }}
          />
        ))}
      </span>
    );
  }

  if (people.length === 0) return null;

  const overlap = saltmineAvatarOverlap(size);
  const capped = Math.max(1, maxVisible);
  const visiblePeople = people.slice(0, capped);
  const overflow = people.length - visiblePeople.length;
  const stackOverlap = visiblePeople.length > 1;

  return (
    <span className="inline-flex max-w-full items-center py-px" aria-hidden>
      {visiblePeople.map((person, index) => {
        const avatarStyle: CSSProperties = {
          zIndex: visiblePeople.length - index,
          marginLeft: index === 0 ? 0 : -overlap,
        };
        return (
          <SaltmineDeckAvatar
            key={`${person.memberId ?? person.letter ?? person.initials ?? "?"}-${index}`}
            memberId={person.memberId}
            letter={person.letter ?? person.initials}
            color={person.color}
            size={size}
            stacked={stackOverlap}
            style={avatarStyle}
          />
        );
      })}
      {showOverflowCount && overflow > 0 ? (
        <span
          className={`ml-1 inline-flex shrink-0 items-center justify-center rounded-full border bg-white px-1.5 py-0.5 tabular-nums ${overflowClassName}`}
          style={{
            borderColor: "rgba(145, 158, 171, 0.28)",
            color: SALTMINE.textSecondary,
            minHeight: Math.round(size * 1.15),
          }}
        >
          +{overflow}
        </span>
      ) : null}
    </span>
  );
}
