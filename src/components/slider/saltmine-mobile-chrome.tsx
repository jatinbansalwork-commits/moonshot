"use client";

import type { ReactNode } from "react";
import { FOCUS_RING, TARGET_HIT_AREA } from "@/lib/a11y";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_PAGE_HEADER_CLASS,
  SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open profile"
      onClick={onClick}
      className={`inline-flex ${TARGET_HIT_AREA} items-center justify-center rounded-full ${FOCUS_RING}`}
    >
      <SaltmineDeckAvatar
        memberId={SALTMINE_DEMO_USER.id}
        letter={SALTMINE_DEMO_USER.floorLetter}
        size={32}
        color="#1C252E"
      />
    </button>
  );
}

export function SaltmineMobilePageHeader({
  title,
  children,
  className,
  border = true,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
  /** When false, omits the bottom hairline (use inside a parent chrome block). */
  border?: boolean;
}) {
  const resolvedClass =
    className ??
    (border ? SALTMINE_MOBILE_PAGE_HEADER_STRIP_CLASS : SALTMINE_MOBILE_PAGE_HEADER_CLASS);

  return (
    <div
      className={resolvedClass}
      style={border ? { borderColor: SALTMINE_HAIRLINE } : undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <h1
          className={`min-w-0 flex-1 truncate ${SALTMINE_MOBILE_PAGE_TITLE_CLASS}`}
          style={{ color: SALTMINE.text }}
        >
          {title}
        </h1>
        {children ? (
          <div className="flex shrink-0 items-center gap-0.5">{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export function SaltmineMobileSheetHandle() {
  return (
    <div className="mb-3 flex justify-center pt-1" aria-hidden>
      <span
        className="h-1 w-10 rounded-full"
        style={{ backgroundColor: "rgba(145, 158, 171, 0.32)" }}
      />
    </div>
  );
}

export function SaltmineMobileEmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[16px] border border-dashed px-4 py-10 text-center"
      style={{
        borderColor: "rgba(145, 158, 171, 0.28)",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
      }}
    >
      <p className={`m-0 ${SALTMINE_MOBILE_BODY_CLASS}`} style={{ color: SALTMINE.textMuted }}>
        {children}
      </p>
    </div>
  );
}
