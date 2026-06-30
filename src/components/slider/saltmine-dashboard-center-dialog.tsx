"use client";

import { useEffect } from "react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const HAIRLINE = SALTMINE_HAIRLINE;

/** Centred modal overlay for deck slide flows (e.g. safety booking reminder). */
export function SaltmineDashboardCenterDialog({
  ariaLabel,
  onClose,
  children,
  maxWidth = 340,
}: {
  ariaLabel: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3" role="presentation">
      <button
        type="button"
        aria-label={`Close ${ariaLabel}`}
        className={`absolute inset-0 bg-[rgba(28,37,46,0.38)] ${FOCUS_RING}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="relative mx-auto flex max-h-[calc(100%-1rem)] w-full flex-col overflow-hidden rounded-[12px] border bg-white px-3 py-2.5 shadow-[0_16px_48px_rgba(28,37,46,0.18)]"
        style={{
          maxWidth,
          borderColor: HAIRLINE,
        }}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
