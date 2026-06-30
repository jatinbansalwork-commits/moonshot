"use client";

import { useEffect } from "react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const HAIRLINE = SALTMINE_HAIRLINE;

export function SaltmineDashboardSideOverlay({
  ariaLabel,
  width,
  onClose,
  children,
}: {
  ariaLabel: string;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label={`Close ${ariaLabel}`}
        className={`absolute inset-0 bg-[rgba(28,37,46,0.38)] ${FOCUS_RING}`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="relative flex h-full max-h-full flex-col overflow-hidden bg-white px-2 py-2.5 shadow-[-10px_0_40px_rgba(28,37,46,0.14)]"
        style={{
          width,
          borderLeft: `1px solid ${HAIRLINE}`,
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
