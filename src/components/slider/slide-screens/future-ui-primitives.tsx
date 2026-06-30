"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

export function FutureUiCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[10px] border bg-white p-2.5 ${className}`}
      style={{ borderColor: SALTMINE_HAIRLINE }}
    >
      {title ? (
        <h2
          className={`m-0 mb-2 font-bold uppercase tracking-[0.06em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function FutureUiBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "warning" | "success" | "danger";
}) {
  const styles = {
    neutral: { bg: "rgba(145, 158, 171, 0.12)", color: SALTMINE.textMuted },
    brand: { bg: "rgba(0, 111, 236, 0.12)", color: SALTMINE.primary },
    warning: { bg: "rgba(245, 158, 11, 0.14)", color: "#B45309" },
    success: { bg: "rgba(34, 197, 94, 0.14)", color: "#15803D" },
    danger: { bg: "rgba(220, 38, 38, 0.12)", color: "#B91C1C" },
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 font-semibold ${TEXT_MICRO}`}
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {children}
    </span>
  );
}

export function FutureUiRow({
  icon: Icon,
  label,
  detail,
  status,
  statusTone = "neutral",
  action,
}: {
  icon: LucideIcon;
  label: string;
  detail?: string;
  status?: string;
  statusTone?: "neutral" | "brand" | "warning" | "success" | "danger";
  action?: ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-[8px] border px-2 py-1.5"
      style={{ borderColor: SALTMINE_HAIRLINE }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.65} style={{ color: SALTMINE.textMuted }} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className={`m-0 font-semibold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
          {label}
        </p>
        {detail ? (
          <p className={`m-0 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {detail}
          </p>
        ) : null}
      </div>
      {status ? <FutureUiBadge tone={statusTone}>{status}</FutureUiBadge> : null}
      {action}
    </div>
  );
}

export function FutureUiButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles =
    variant === "primary"
      ? { backgroundColor: SALTMINE.primary, color: "#fff", border: "transparent" }
      : variant === "secondary"
        ? {
            backgroundColor: "rgba(0, 111, 236, 0.06)",
            color: SALTMINE.primary,
            border: SALTMINE.primary,
          }
        : { backgroundColor: "transparent", color: SALTMINE.textMuted, border: SALTMINE_HAIRLINE };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-6 items-center justify-center rounded-[6px] border px-2 font-semibold ${TEXT_MICRO} ${FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={styles}
    >
      {children}
    </button>
  );
}

export function FutureUiBanner({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "warning";
}) {
  const bg = tone === "warning" ? "rgba(245, 158, 11, 0.1)" : "rgba(0, 111, 236, 0.08)";
  const color = tone === "warning" ? "#92400E" : SALTMINE.primary;

  return (
    <div
      className={`rounded-[8px] px-2.5 py-2 font-medium ${TEXT_2XS}`}
      style={{ backgroundColor: bg, color }}
      role="status"
    >
      {children}
    </div>
  );
}
