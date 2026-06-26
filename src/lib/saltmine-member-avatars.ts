/**
 * Human emoji avatars for Saltmine deck mockups.
 */

import { SALTMINE_DEMO_MEMBERS } from "@/lib/saltmine-demo-personas";

export const SALTMINE_EMOJI_PLACEHOLDER = "👤";

export const SALTMINE_MEMBER_EMOJI: Record<string, string> = {
  jw: "👩🏻‍💼",
  am: "👩🏽",
  ww: "👨🏻",
  ch: "👩🏼",
  dr: "👩🏻",
  af: "👨🏽",
  jj: "👨🏿",
  bs: "👩🏾",
  sc: "👩🏻‍💻",
  jo: "👨🏾‍💼",
  jb: "👨🏽‍💻",
  dw: "👨🏻‍🦱",
};

/** Floor-plan / attendee letter → primary member id (synced with demo personas). */
const SALTMINE_FLOOR_LETTER_MEMBER = Object.fromEntries(
  SALTMINE_DEMO_MEMBERS.map((member) => [member.floorLetter, member.id]),
) as Record<string, keyof typeof SALTMINE_MEMBER_EMOJI>;

export function resolveSaltmineMemberEmoji({
  memberId,
  letter,
}: {
  memberId?: string;
  letter?: string;
}): string | undefined {
  if (memberId && SALTMINE_MEMBER_EMOJI[memberId]) {
    return SALTMINE_MEMBER_EMOJI[memberId];
  }

  const key = letter?.trim().charAt(0).toUpperCase();
  if (key && SALTMINE_FLOOR_LETTER_MEMBER[key]) {
    return SALTMINE_MEMBER_EMOJI[SALTMINE_FLOOR_LETTER_MEMBER[key]];
  }

  return undefined;
}
