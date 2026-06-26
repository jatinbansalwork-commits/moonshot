import type { CSSProperties } from "react";
import {
  resolveSaltmineMemberEmoji,
  SALTMINE_EMOJI_PLACEHOLDER,
} from "@/lib/saltmine-member-avatars";

export const SALTMINE_AVATAR_SCALE = 1.5;

export const SALTMINE_INITIAL_AVATAR_CLASS =
  "inline-grid shrink-0 place-items-center rounded-full font-bold leading-none text-white";

export const SALTMINE_EMOJI_AVATAR_FILL = "#FFFFFF";
export const SALTMINE_EMOJI_AVATAR_RING = "#E5E7EB";
export const SALTMINE_EMOJI_AVATAR_RATIO = 0.58;

export function scaleSaltmineAvatarSize(size: number) {
  return Math.round(size * SALTMINE_AVATAR_SCALE * 10) / 10;
}

export function saltmineAvatarOverlap(size: number) {
  return Math.round(size * 0.25 * SALTMINE_AVATAR_SCALE * 10) / 10;
}

export function saltmineAvatarLetter(label: string) {
  return label.trim().charAt(0).toUpperCase();
}

export function saltmineInitialAvatarFontSize(size: number, label: string) {
  if (label.length > 1) return size * 0.32;
  return Math.round(size * 0.5 * 10) / 10;
}

export function SaltmineEmojiAvatar({
  emoji,
  size,
  className = "",
  style,
  stacked = false,
}: {
  emoji: string;
  size: number;
  className?: string;
  style?: CSSProperties;
  stacked?: boolean;
}) {
  const renderedSize = scaleSaltmineAvatarSize(size);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full border-2 bg-white leading-none ${
        stacked ? "border-white" : "border-[#E5E7EB]"
      } ${className}`}
      style={{
        width: renderedSize,
        height: renderedSize,
        minWidth: renderedSize,
        minHeight: renderedSize,
        backgroundColor: SALTMINE_EMOJI_AVATAR_FILL,
        boxSizing: "border-box",
        ...style,
      }}
      aria-hidden
    >
      <span
        className="select-none"
        style={{
          fontSize: renderedSize * SALTMINE_EMOJI_AVATAR_RATIO,
          lineHeight: 1,
        }}
      >
        {emoji}
      </span>
    </span>
  );
}

/** Deck slides: human emoji portrait with outline, or initial fallback. */
export function SaltmineDeckAvatar({
  size,
  memberId,
  letter,
  color = "#637381",
  className = "",
  style,
  stacked = false,
  placeholder = false,
}: {
  size: number;
  memberId?: string;
  letter?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  stacked?: boolean;
  placeholder?: boolean;
}) {
  const emoji = placeholder
    ? SALTMINE_EMOJI_PLACEHOLDER
    : resolveSaltmineMemberEmoji({ memberId, letter });

  if (emoji) {
    return (
      <SaltmineEmojiAvatar
        emoji={emoji}
        size={size}
        className={className}
        style={style}
        stacked={stacked}
      />
    );
  }

  if (letter && [...letter].length > 2) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 bg-white text-center leading-none ${
          stacked ? "border-white" : "border-[#E5E7EB]"
        } ${className}`}
        style={{
          width: scaleSaltmineAvatarSize(size),
          height: scaleSaltmineAvatarSize(size),
          minWidth: scaleSaltmineAvatarSize(size),
          minHeight: scaleSaltmineAvatarSize(size),
          fontSize: scaleSaltmineAvatarSize(size) * SALTMINE_EMOJI_AVATAR_RATIO,
          boxSizing: "border-box",
          ...style,
        }}
        aria-hidden
      >
        {letter}
      </span>
    );
  }

  return (
    <SaltmineInitialAvatar
      label={letter ?? "?"}
      size={size}
      color={color}
      className={className}
      style={style}
    />
  );
}

export function SaltmineInitialAvatar({
  label,
  size,
  color,
  className = "border-[1.5px] border-white",
  style,
}: {
  label: string;
  size: number;
  color: string;
  className?: string;
  style?: CSSProperties;
}) {
  const renderedSize = scaleSaltmineAvatarSize(size);
  const resolvedEmoji = resolveSaltmineMemberEmoji({ letter: label });
  if (resolvedEmoji) {
    return (
      <SaltmineEmojiAvatar
        emoji={resolvedEmoji}
        size={size}
        className={className}
        style={style}
      />
    );
  }

  const display =
    label.length <= 2 ? label.toUpperCase() : saltmineAvatarLetter(label);
  const fontSize =
    label.length > 2
      ? renderedSize * 0.38
      : saltmineInitialAvatarFontSize(renderedSize, display);

  return (
    <span
      className={`${SALTMINE_INITIAL_AVATAR_CLASS} ${className}`}
      style={{
        width: renderedSize,
        height: renderedSize,
        fontSize,
        lineHeight: 1,
        backgroundColor: color,
        ...style,
      }}
      aria-hidden
    >
      {label.length > 2 ? label : display}
    </span>
  );
}
