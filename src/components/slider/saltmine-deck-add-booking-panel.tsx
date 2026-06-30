"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Car,
  CheckCircle2,
  DoorOpen,
  LampDesk,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  DECK_ADD_BOOKING_FLOW,
  getDeckAddBookingResultLabel,
  type DeckAddBookingActionId,
} from "@/lib/saltmine-deck-add-booking-flow-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
} from "@/lib/saltmine-onboarding-tokens";

export type { DeckAddBookingActionId };

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
import {
  SALTMINE_DECK_TEXT_2XS,
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";

const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_2XS = SALTMINE_DECK_TEXT_2XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;
const SUBMIT_DELAY_MS = 900;

const MENU_ICONS: Record<DeckAddBookingActionId, LucideIcon> = {
  "team-day": Building2,
  "car-parking": Car,
  "meeting-space": DoorOpen,
  desk: LampDesk,
};

const FIRST_TIME_MENU_ORDER: DeckAddBookingActionId[] = [
  "desk",
  "meeting-space",
  "car-parking",
  "team-day",
];

type FlowStep =
  | "intro"
  | "menu"
  | "choose"
  | "confirm"
  | "processing"
  | "success"
  | "error";

function stepLabel(current: number, total: number) {
  return content.addBookingFlowStepLabel
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export function DeckAddBookingPanel({
  dayTitle,
  firstTime = false,
  onClose,
  onComplete,
}: {
  dayTitle: string;
  /** Onboarding — guided intro before the booking menu. */
  firstTime?: boolean;
  onClose: () => void;
  onComplete: (result: {
    actionId: DeckAddBookingActionId;
    label: string;
  }) => void;
}) {
  const [step, setStep] = useState<FlowStep>(firstTime ? "intro" : "menu");
  const [actionId, setActionId] = useState<DeckAddBookingActionId | null>(null);
  const [optionId, setOptionId] = useState<string | null>(null);

  const flow = actionId ? DECK_ADD_BOOKING_FLOW[actionId] : null;
  const selectedOption = flow?.options.find((option) => option.id === optionId) ?? null;
  const menuItem = content.addBookingMenuItems.find((item) => item.id === actionId);

  const resetFlow = useCallback(() => {
    setStep(firstTime ? "intro" : "menu");
    setActionId(null);
    setOptionId(null);
  }, [firstTime]);

  const handleClose = useCallback(() => {
    resetFlow();
    onClose();
  }, [onClose, resetFlow]);

  useEffect(() => {
    if (step !== "processing") return;

    const timer = window.setTimeout(() => {
      if (selectedOption?.simulateFailure) {
        setStep("error");
        return;
      }
      setStep("success");
    }, SUBMIT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [step, selectedOption]);

  const handleComplete = () => {
    if (!actionId || !selectedOption) return;
    onComplete({
      actionId,
      label: getDeckAddBookingResultLabel(actionId, selectedOption.label),
    });
    resetFlow();
  };

  const renderHeader = (showBack: boolean) => (
    <div className="mb-2 flex items-center justify-between gap-1">
      {showBack ? (
        <button
          type="button"
          aria-label={content.addBookingFlowBackLabel}
          onClick={() => {
            if (step === "confirm") {
              setStep("choose");
              return;
            }
            if (step === "choose") {
              setActionId(null);
              setOptionId(null);
              setStep("menu");
              return;
            }
            if (step === "menu" && firstTime) {
              setStep("intro");
            }
          }}
          className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-[6px] transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      ) : (
        <span className="min-w-6" aria-hidden />
      )}
      <button
        type="button"
        aria-label={content.addBookingMenuCloseLabel}
        onClick={handleClose}
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-[6px] transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
        style={{ color: SALTMINE.textMuted }}
      >
        <X className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
    </div>
  );

  if (step === "success" && selectedOption && actionId) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(false)}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <CheckCircle2
            className="mb-2 h-8 w-8"
            strokeWidth={1.75}
            style={{ color: "#16A34A" }}
            aria-hidden
          />
          <p className={`m-0 mb-1 font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            {selectedOption.label}
          </p>
          <p className={`m-0 mb-3 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {content.addBookingFlowSuccessBody}
          </p>
          <button
            type="button"
            onClick={handleComplete}
            className={`flex min-h-7 w-full items-center justify-center rounded-[8px] px-2 font-semibold leading-none text-white ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{ backgroundColor: SALTMINE.primary }}
          >
            {content.addBookingFlowSuccessDoneLabel}
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(false)}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <AlertCircle
            className="mb-2 h-8 w-8"
            strokeWidth={1.75}
            style={{ color: "#DC2626" }}
            aria-hidden
          />
          <p
            className={`mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {content.addBookingFlowErrorTitle}
          </p>
          <p className={`m-0 mb-3 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {content.addBookingFlowErrorBody}
          </p>
          <button
            type="button"
            onClick={() => {
              setOptionId(null);
              setStep("choose");
            }}
            className={`mb-1.5 flex min-h-7 w-full items-center justify-center rounded-[8px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              borderColor: SALTMINE.primary,
              color: SALTMINE.primary,
              backgroundColor: "rgba(0, 111, 236, 0.06)",
            }}
          >
            {content.addBookingFlowRetryLabel}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`flex min-h-7 w-full items-center justify-center rounded-[8px] px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{ color: SALTMINE.textMuted }}
          >
            {content.addBookingMenuCloseLabel}
          </button>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(false)}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <Loader2
            className="mb-2 h-7 w-7 animate-spin"
            strokeWidth={1.75}
            style={{ color: SALTMINE.primary }}
            aria-hidden
          />
          <p className={`m-0 font-semibold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
            {content.addBookingFlowProcessingLabel}
          </p>
          {selectedOption ? (
            <p className={`m-0 mt-1 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
              {selectedOption.label}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (step === "confirm" && flow && selectedOption && menuItem) {
    const Icon = MENU_ICONS[actionId!];
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(true)}
        <p className={`mb-0.5 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          {stepLabel(2, 2)}
        </p>
        <p
          className={`mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {flow.confirmTitle}
        </p>
        <h2
          className={`mb-3 font-extrabold tracking-[-0.03em] ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {dayTitle}
        </h2>

        <div
          className="mb-3 rounded-[8px] border p-2"
          style={{
            borderColor: HAIRLINE,
            backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]"
              style={{
                backgroundColor: "rgba(0, 111, 236, 0.1)",
                color: SALTMINE.primary,
              }}
            >
              <Icon className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
            </span>
            <span className={`font-bold ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
              {selectedOption.label}
            </span>
          </div>
          <p className={`m-0 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
            {menuItem.label}
          </p>
          <p className={`m-0 mt-0.5 ${TEXT_MICRO}`} style={{ color: SALTMINE.textSecondary }}>
            {selectedOption.meta}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStep("processing")}
          className={`mt-auto flex min-h-8 w-full items-center justify-center rounded-[8px] px-2 font-semibold leading-none text-white ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{ backgroundColor: SALTMINE.primary }}
        >
          {content.addBookingFlowConfirmLabel}
        </button>
      </div>
    );
  }

  if (step === "choose" && flow && actionId) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(true)}
        <p className={`mb-0.5 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          {stepLabel(1, 2)}
        </p>
        <p
          className={`mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {flow.pickTitle}
        </p>
        <h2
          className={`mb-3 font-extrabold tracking-[-0.03em] ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {dayTitle}
        </h2>

        <ul className="no-scrollbar m-0 min-h-0 flex-1 list-none space-y-1.5 overflow-y-auto p-0">
          {flow.options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                disabled={!option.available}
                onClick={() => {
                  setOptionId(option.id);
                  setStep("confirm");
                }}
                className={`flex min-h-8 w-full flex-col rounded-[8px] border px-2 py-1.5 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55 ${FOCUS_RING} ${
                  option.available
                    ? "hover:border-[rgba(0,111,236,0.36)] hover:bg-[rgba(0,111,236,0.06)]"
                    : ""
                }`}
                style={{
                  borderColor: HAIRLINE,
                  backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                }}
              >
                <span className={`font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
                  {option.label}
                </span>
                <span className={`${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
                  {option.available
                    ? option.meta
                    : (option.unavailableReason ?? "Unavailable")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {renderHeader(false)}
        <p
          className={`mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
          style={{ color: SALTMINE.textMuted }}
        >
          {content.addBookingPanelLabel}
        </p>
        <h2
          className={`mb-2 font-extrabold tracking-[-0.03em] ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {content.addBookingFirstTimeTitle}
        </h2>
        <p className={`m-0 mb-1 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
          {dayTitle}
        </p>
        <p className={`m-0 mt-2 flex-1 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          {content.addBookingFirstTimeBody}
        </p>
        <button
          type="button"
          onClick={() => setStep("menu")}
          className={`mt-auto flex min-h-8 w-full items-center justify-center rounded-[8px] px-2 font-semibold leading-none text-white ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{ backgroundColor: SALTMINE.primary }}
        >
          {content.addBookingFirstTimeCta}
        </button>
      </div>
    );
  }

  const menuItems = firstTime
    ? FIRST_TIME_MENU_ORDER.map(
        (id) => content.addBookingMenuItems.find((item) => item.id === id)!,
      )
    : content.addBookingMenuItems;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {renderHeader(firstTime)}
      <p
        className={`mb-1 font-bold uppercase tracking-[0.08em] ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {content.addBookingPanelLabel}
      </p>
      <h2
        className={`mb-3 font-extrabold tracking-[-0.03em] ${TEXT_XS}`}
        style={{ color: SALTMINE.text }}
      >
        {dayTitle}
      </h2>

      <ul className="m-0 list-none space-y-1.5 p-0">
        {menuItems.map((item) => {
          const Icon = MENU_ICONS[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setActionId(item.id);
                  setStep("choose");
                }}
                className={`flex min-h-8 w-full items-center gap-2 rounded-[8px] border px-2 text-left transition-colors duration-150 hover:border-[rgba(0,111,236,0.36)] hover:bg-[rgba(0,111,236,0.06)] ${FOCUS_RING}`}
                style={{
                  borderColor: HAIRLINE,
                  backgroundColor: SALTMINE_ONBOARDING.color.canvas,
                }}
              >
                <span
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]"
                  style={{
                    backgroundColor: "rgba(0, 111, 236, 0.1)",
                    color: SALTMINE.primary,
                  }}
                >
                  <Icon className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
                </span>
                <span className={`font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={`m-0 mt-3 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
        {content.addBookingPanelHint}
      </p>
    </div>
  );
}
