"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiButton,
} from "@/components/slider/slide-screens/future-ui-primitives";

export const FP_TEXT_XS = "text-[9px] leading-[13px]";
export const FP_TEXT_2XS = "text-[8px] leading-[11px]";
export const FP_TEXT_MICRO = "text-[7px] leading-[10px]";

export type FuturePlanMetric = {
  label: string;
  value: string;
  tone?: "neutral" | "brand" | "warning" | "success" | "danger";
};

export function FuturePlanDialogHeader({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: ReactNode;
}) {
  return (
    <>
      <p
        className={`m-0 mb-1 font-bold uppercase tracking-[0.06em] ${FP_TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      <h2 className={`m-0 mb-1 font-bold ${FP_TEXT_XS}`} style={{ color: SALTMINE.text }}>
        {title}
      </h2>
      <p className={`m-0 mb-2 ${FP_TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {body}
      </p>
    </>
  );
}

export function FuturePlanMetricGrid({ metrics }: { metrics: FuturePlanMetric[] }) {
  return (
    <div
      className="mb-2 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 3)}, minmax(0, 1fr))` }}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[8px] border px-1.5 py-1 text-center"
          style={{ borderColor: SALTMINE_HAIRLINE, backgroundColor: "#fff" }}
        >
          <p className={`m-0 font-medium ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {metric.label}
          </p>
          <p className="m-0">
            <FutureUiBadge tone={metric.tone ?? "neutral"}>{metric.value}</FutureUiBadge>
          </p>
        </div>
      ))}
    </div>
  );
}

export function FuturePlanInsightPanel({
  title,
  icon: Icon,
  tone = "brand",
  children,
}: {
  title: string;
  icon: LucideIcon;
  tone?: "brand" | "warning" | "success";
  children: ReactNode;
}) {
  const styles = {
    brand: { border: "rgba(0, 111, 236, 0.24)", bg: "rgba(0, 111, 236, 0.06)", icon: SALTMINE.primary },
    warning: { border: "rgba(245, 158, 11, 0.28)", bg: "rgba(245, 158, 11, 0.06)", icon: "#B45309" },
    success: { border: "rgba(34, 197, 94, 0.28)", bg: "rgba(34, 197, 94, 0.08)", icon: "#15803D" },
  }[tone];

  return (
    <section
      className="mb-2 rounded-[10px] border px-2.5 py-2"
      style={{ borderColor: styles.border, backgroundColor: styles.bg }}
      aria-label={title}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.65} style={{ color: styles.icon }} aria-hidden />
        <h3 className={`m-0 font-bold ${FP_TEXT_XS}`} style={{ color: SALTMINE.text }}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function FuturePlanBulletList({
  items,
}: {
  items: { emphasis: string; rest: string; tone?: "danger" | "success" | "neutral" }[];
}) {
  const dotColor = { danger: "#DC2626", success: "#15803D", neutral: SALTMINE.textMuted };
  return (
    <ul className={`m-0 list-none space-y-1 p-0 ${FP_TEXT_MICRO}`}>
      {items.map((item) => (
        <li key={item.emphasis} className="flex items-start gap-1.5" style={{ color: SALTMINE.text }}>
          <span
            className="mt-px shrink-0 font-bold leading-none"
            style={{ color: dotColor[item.tone ?? "neutral"] }}
            aria-hidden
          >
            ·
          </span>
          <span>
            <strong>{item.emphasis}</strong>
            <span style={{ color: SALTMINE.textMuted }}> {item.rest}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function FuturePlanResourceStrip({
  icon: Icon,
  title,
  detail,
  accent = "#D97706",
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  accent?: string;
}) {
  return (
    <div
      className="mb-3 rounded-[8px] border px-2 py-1.5"
      style={{ borderColor: SALTMINE_HAIRLINE, backgroundColor: "rgba(245, 158, 11, 0.08)" }}
      role="status"
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0" style={{ color: accent }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={`m-0 font-semibold ${FP_TEXT_XS}`} style={{ color: SALTMINE.text }}>
            {title}
          </p>
          <p className={`m-0 ${FP_TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FuturePlanSuccess({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-1 text-center">
      <CheckCircle2 className="mb-2 h-8 w-8" strokeWidth={1.75} style={{ color: "#16A34A" }} aria-hidden />
      <p className={`m-0 mb-1 font-bold ${FP_TEXT_XS}`} style={{ color: SALTMINE.text }}>
        {title}
      </p>
      <p className={`m-0 mb-3 max-w-[280px] ${FP_TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
        {body}
      </p>
      <FutureUiButton variant="primary" className="w-full" onClick={onClose}>
        Back to My bookings
      </FutureUiButton>
    </div>
  );
}

export function FuturePlanDialogActions({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  ghostLabel,
  onGhost,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  ghostLabel?: string;
  onGhost?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FutureUiButton variant="primary" className="w-full" onClick={onPrimary}>
        {primaryLabel}
      </FutureUiButton>
      {secondaryLabel && onSecondary ? (
        <FutureUiButton variant="secondary" className="w-full" onClick={onSecondary}>
          {secondaryLabel}
        </FutureUiButton>
      ) : null}
      {ghostLabel && onGhost ? (
        <FutureUiButton variant="ghost" className="w-full" onClick={onGhost}>
          {ghostLabel}
        </FutureUiButton>
      ) : null}
    </div>
  );
}
