"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";
import { FOCUS_RING } from "@/lib/a11y";
import {
  ONBOARDING_BODY_CLASS,
  ONBOARDING_CAPTION_CLASS,
  ONBOARDING_CONTENT_CLASS,
  ONBOARDING_FIELD_LABEL_CLASS,
  ONBOARDING_FIELD_STACK_CLASS,
  ONBOARDING_FOOTER_CLASS,
  ONBOARDING_FORM_WRAP_CLASS,
  ONBOARDING_FRAME_CLASS,
  ONBOARDING_INTRO_WRAP_CLASS,
  ONBOARDING_NEXT_BUTTON,
  ONBOARDING_PRODUCT_SURFACE_STYLE,
  ONBOARDING_SECONDARY_LINK_CLASS,
  ONBOARDING_TITLE_CLASS,
  SALTMINE,
  SALTMINE_MENU_SHADOW,
  SALTMINE_ONBOARDING,
  SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
  SALTMINE_ONLINE_GREEN,
  SALTMINE_SURFACE_INSET,
  SALTMINE_TEXT_LINK,
  onboardingFieldInputClass,
  onboardingFieldSurfaceStyle,
  onboardingSelectTriggerClass,
  type OnboardingFieldVariant,
} from "@/lib/saltmine-onboarding-tokens";

type FlowStep =
  | "sign-in"
  | "sign-in-loading"
  | "welcome"
  | "set-location"
  | "workspace-loading"
  | "create-team"
  | "choose-theme"
  | "dashboard";

type ThemeOption = "dark" | "light" | "system";

/** Indexed onboarding screens — matches progress dot order. */
const ONBOARDING_STEP_ORDER = [
  "welcome",
  "set-location",
  "create-team",
  "choose-theme",
] as const satisfies readonly FlowStep[];

const ONBOARDING_STEP_LABELS = [
  "Welcome",
  "Default location",
  "Create team",
  "Choose theme",
] as const;

const BUILDINGS_BY_CITY: Record<string, readonly string[]> = {
  London: ["St. Mary Axe", "Canary Wharf", "Kings Cross"],
  Manchester: ["Spinningfields", "MediaCity"],
  Birmingham: ["Brindleyplace", "Snow Hill"],
};

const CITY_OPTIONS = ["London", "Manchester", "Birmingham"] as const;

const MINIMALS_TEXT_LINK =
  `inline-flex min-h-6 items-center justify-center px-1 text-[10px] font-semibold leading-4 transition-[color,opacity,transform] duration-150 hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`;

function useDemoToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, showToast };
}

function DemoToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute bottom-3 left-1/2 z-[100] -translate-x-1/2 rounded-full border px-3 py-1 text-[10px] font-semibold shadow-lg"
      style={{
        borderColor: "rgba(0, 111, 236, 0.24)",
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        color: SALTMINE.text,
        boxShadow: SALTMINE_MENU_SHADOW,
      }}
    >
      {message}
    </div>
  );
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.includes("@") && trimmed.includes(".");
}

function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return "Jatin Bansal";

  if (/jatin/i.test(local)) return "Jatin Bansal";

  const segment = local.split(/[._-]/).find((part) => part.length > 0) ?? "";
  if (!segment) return "Jatin Bansal";

  if (/^[A-Z][a-z]+$/.test(segment)) return segment;

  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}

function ButtonSpinner({ className = "text-white" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ProgressDots({
  activeIndex,
  onStepSelect,
}: {
  activeIndex: number;
  onStepSelect: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Onboarding steps"
      className="mt-3 flex justify-center gap-[4px]"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onStepSelect(index)}
          aria-label={`Go to step ${index + 1}: ${ONBOARDING_STEP_LABELS[index]}`}
          aria-current={index === activeIndex ? "step" : undefined}
          className={`h-2 w-2 shrink-0 rounded-full transition-all duration-200 hover:scale-125 ${FOCUS_RING} ${
            index === activeIndex ? "scale-110" : ""
          }`}
          style={{
            backgroundColor:
              index === activeIndex ? SALTMINE.primary : SALTMINE.dotInactive,
          }}
        />
      ))}
    </nav>
  );
}

function OnboardingStepFooter({
  label,
  activeIndex,
  onAction,
  onGoToStep,
  secondaryAction,
  disabled = false,
}: {
  label: string;
  activeIndex: number;
  onAction: () => void;
  onGoToStep: (index: number) => void;
  secondaryAction?: { label: string; onClick: () => void };
  disabled?: boolean;
}) {
  return (
    <div className={ONBOARDING_FOOTER_CLASS}>
      {secondaryAction ? (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          className={`${ONBOARDING_SECONDARY_LINK_CLASS} ${FOCUS_RING}`}
          style={{ color: SALTMINE.link }}
        >
          {secondaryAction.label}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className={`${ONBOARDING_NEXT_BUTTON} transition-[background-color,transform,opacity] duration-150 ${FOCUS_RING} ${
          disabled
            ? "cursor-not-allowed border border-[rgba(145,158,171,0.32)] bg-[#F4F6F8] text-[#919EAB]"
            : "bg-[#006FEC] text-white hover:bg-[#0056C7]"
        }`}
      >
        {label}
      </button>
      <ProgressDots activeIndex={activeIndex} onStepSelect={onGoToStep} />
    </div>
  );
}

function OnboardingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={ONBOARDING_FRAME_CLASS}
      style={{
        fontFamily: SALTMINE_ONBOARDING.font.family,
        ...ONBOARDING_PRODUCT_SURFACE_STYLE,
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

interface MinimalsTextFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  describedBy?: string;
  onChange: (value: string) => void;
  trailing?: React.ReactNode;
  labelAccessory?: React.ReactNode;
  compact?: boolean;
  variant?: OnboardingFieldVariant;
}

function MinimalsTextField({
  id,
  label,
  type = "text",
  value,
  disabled = false,
  required = false,
  autoComplete,
  describedBy,
  onChange,
  trailing,
  labelAccessory,
  compact = false,
  variant = "outlined",
}: MinimalsTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const surfaceStyle = onboardingFieldSurfaceStyle(variant, focused, disabled);

  return (
    <div className="w-full text-left">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className={`block font-semibold ${compact ? "text-[10px] leading-3" : "text-[12px] leading-4"}`}
          style={{ color: disabled ? SALTMINE.textMuted : SALTMINE.textSecondary }}
        >
          {label}
          {required ? <span className="sr-only"> (required)</span> : null}
        </label>
        {labelAccessory}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-describedby={describedBy}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-lg outline-none transition-[border-color,box-shadow,background-color] duration-150 disabled:cursor-not-allowed ${trailing ? "pr-14" : ""} ${compact ? "h-[34px] text-[10px] leading-4" : "h-10 text-[12px] leading-4"} ${variant === "filled" ? "border border-transparent hover:bg-[#F2F4F7]" : "border bg-white"} ${FOCUS_RING}`}
          style={{
            color: SALTMINE.text,
            borderWidth: surfaceStyle.borderWidth,
            borderStyle: "solid",
            borderColor: surfaceStyle.borderColor,
            paddingLeft: surfaceStyle.paddingLeft,
            paddingRight: trailing ? undefined : surfaceStyle.paddingRight,
            backgroundColor: surfaceStyle.backgroundColor,
            boxShadow: surfaceStyle.boxShadow,
          }}
        />
        {trailing}
      </div>
    </div>
  );
}

function MinimalsCheckbox({
  id,
  checked,
  disabled,
  label,
  onChange,
  compact = false,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  compact?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center text-left ${compact ? "gap-2" : "gap-2.5"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`flex items-center justify-center rounded-[4px] border-2 transition-colors duration-150 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#3291ff] peer-disabled:opacity-40 ${
            compact ? "h-3.5 w-3.5" : "h-4 w-4"
          } ${
            checked
              ? "border-[#006FEC] bg-[#006FEC] text-white"
              : "border-[#DFE3E8] bg-white text-transparent"
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            className={`fill-none stroke-current stroke-[2] ${compact ? "h-2 w-2" : "h-2.5 w-2.5"} ${checked ? "opacity-100" : "opacity-0"}`}
          >
            <path d="M2 6.2 4.8 9 10 3" />
          </svg>
        </span>
      </span>
      <span
        className={compact ? "text-[10px] leading-4" : "text-[12px] leading-4"}
        style={{ color: disabled ? SALTMINE.textMuted : SALTMINE.text }}
      >
        {label}
      </span>
    </label>
  );
}

function MinimalsOnboardingField({
  id,
  label,
  value,
  placeholder,
  onChange,
  trailing,
  compact = false,
  onKeyDown,
  ariaDescribedBy,
  variant = "filled",
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  trailing?: React.ReactNode;
  compact?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  ariaDescribedBy?: string;
  variant?: OnboardingFieldVariant;
}) {
  const [focused, setFocused] = useState(false);
  const surfaceStyle = onboardingFieldSurfaceStyle(variant, focused);

  if (compact) {
    return (
      <div className="relative w-full">
        <label
          htmlFor={id}
          className={ONBOARDING_FIELD_LABEL_CLASS}
          style={{ color: SALTMINE.textSecondary }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-describedby={ariaDescribedBy}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${onboardingFieldInputClass(variant)} ${trailing ? "pr-10" : ""} ${FOCUS_RING}`}
            style={{
              borderWidth: surfaceStyle.borderWidth,
              borderColor: surfaceStyle.borderColor,
              color: SALTMINE.text,
              paddingLeft: surfaceStyle.paddingLeft,
              paddingRight: trailing ? undefined : surfaceStyle.paddingRight,
              backgroundColor: surfaceStyle.backgroundColor,
              boxShadow: surfaceStyle.boxShadow,
            }}
          />
          {trailing ? (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <fieldset
        className="m-0 rounded-lg border px-3 pb-2.5 pt-0"
        style={{ borderColor: SALTMINE.border }}
      >
        <legend
          className="px-1 text-[13px] leading-4"
          style={{ color: SALTMINE.textMuted }}
        >
          {label}
        </legend>
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={`min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-5 outline-none placeholder:text-[#919EAB] ${FOCUS_RING}`}
            style={{ color: SALTMINE.text }}
          />
          {trailing}
        </div>
      </fieldset>
    </div>
  );
}

function OnboardingStepIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={ONBOARDING_INTRO_WRAP_CLASS}>
      <h2 className={ONBOARDING_TITLE_CLASS} style={{ color: SALTMINE.text }}>
        {title}
      </h2>
      <p
        className={ONBOARDING_BODY_CLASS}
        style={{ color: SALTMINE_ONBOARDING.color.text.secondary }}
      >
        {children}
      </p>
    </div>
  );
}

function WelcomeStep({
  displayName,
  onNext,
  onGoToStep,
}: {
  displayName: string;
  onNext: () => void;
  onGoToStep: (index: number) => void;
}) {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-1">
        <div className="w-full max-w-[306px] text-center">
          <div
            className="relative mx-auto mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] font-bold text-white"
            style={{
              background: `linear-gradient(145deg, ${SALTMINE.primary} 0%, #4D9BF7 100%)`,
              boxShadow: "0 2px 6px rgba(0, 111, 236, 0.24)",
            }}
            aria-hidden
          >
            {initial}
            <span
              className="absolute -bottom-px -right-px h-[7px] w-[7px] rounded-full border-[1.5px] border-white"
              style={{ backgroundColor: SALTMINE_ONLINE_GREEN }}
              aria-hidden
            />
          </div>

          <h2
            className="m-0 text-balance text-[19px] font-bold leading-6 tracking-[-0.02em]"
            style={{ color: SALTMINE.text }}
          >
            Welcome,{" "}
            <span style={{ color: SALTMINE.primary }}>{displayName}</span>
          </h2>

          <p
            className="m-0 mt-2 text-[12px] leading-4"
            style={{ color: SALTMINE_ONBOARDING.color.text.secondary }}
          >
            Let&apos;s get you up and running
          </p>
        </div>
      </div>

      <OnboardingStepFooter
        label="Next"
        activeIndex={0}
        onAction={onNext}
        onGoToStep={onGoToStep}
      />
    </>
  );
}

function LocationSelect({
  id,
  label,
  value,
  options,
  onChange,
  compact = false,
  variant = "filled",
  placeholder = "Select…",
  disabled = false,
  preferUpward = false,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  compact?: boolean;
  variant?: OnboardingFieldVariant;
  placeholder?: string;
  disabled?: boolean;
  preferUpward?: boolean;
}) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const hasValue = value.length > 0;
  const [activeIndex, setActiveIndex] = useState(() =>
    hasValue ? Math.max(0, options.indexOf(value)) : 0,
  );
  const isActive = open && !disabled;
  const surfaceStyle = onboardingFieldSurfaceStyle(variant, isActive, disabled);

  useEffect(() => {
    if (!hasValue) {
      setActiveIndex(0);
      return;
    }
    const index = options.indexOf(value);
    if (index >= 0) setActiveIndex(index);
  }, [value, options, hasValue]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const menuHeight = Math.min(options.length * (compact ? 28 : 32) + 8, 192);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward =
        preferUpward ||
        (spaceBelow < menuHeight + 8 && rect.top > menuHeight + 8);

      setMenuStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, options.length, compact, preferUpward]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function optionId(index: number) {
    return `${listboxId}-option-${index}`;
  }

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((index) => Math.max(0, index - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        selectOption(options[activeIndex] ?? value);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor={id}
        className={
          compact
            ? ONBOARDING_FIELD_LABEL_CLASS
            : "mb-1 block text-left text-[12px] font-semibold leading-4"
        }
        style={{ color: SALTMINE.textSecondary }}
      >
        {label}
      </label>
      <div className="relative">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open && !disabled}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-activedescendant={open && !disabled ? optionId(activeIndex) : undefined}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((current) => !current);
          }}
          onKeyDown={handleKeyDown}
          className={`${compact ? onboardingSelectTriggerClass(variant) : variant === "filled" ? "flex h-10 w-full items-center rounded-lg border border-transparent bg-[#F4F6F8] px-4 pr-10 text-left text-[12px] leading-4 transition-[border-color,box-shadow,background-color] duration-150 hover:bg-[#F2F4F7]" : "flex h-10 w-full items-center rounded-lg border bg-white px-4 pr-10 text-left text-[12px] leading-4 transition-[border-color,box-shadow,background-color] duration-150"} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#F4F6F8] ${FOCUS_RING}`}
          style={{
            borderWidth: surfaceStyle.borderWidth,
            borderColor: surfaceStyle.borderColor,
            color: hasValue ? SALTMINE.text : SALTMINE.placeholder,
            backgroundColor: surfaceStyle.backgroundColor,
            boxShadow: surfaceStyle.boxShadow,
          }}
        >
          <span className={`truncate ${hasValue ? "font-medium" : "font-normal"}`}>
            {hasValue ? value : placeholder}
          </span>
        </button>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transition-transform duration-150 ${compact ? "right-2.5 h-2.5 w-2.5" : "right-3 h-3 w-3"} ${open && !disabled ? "rotate-180" : ""}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <path fill="currentColor" d="M4.5 6 8 9.5 11.5 6H4.5z" />
        </svg>

        {open && !disabled && typeof document !== "undefined"
          ? createPortal(
              <ul
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-label={label}
                className="saltmine-onboarding-portal-menu max-h-48 overflow-y-auto rounded-lg border bg-white py-0.5"
                style={{
                  ...menuStyle,
                  fontFamily: SALTMINE_ONBOARDING.font.family,
                  borderColor: SALTMINE_ONBOARDING.color.border.input,
                  boxShadow: SALTMINE_MENU_SHADOW,
                }}
              >
                {options.map((option, index) => {
                  const selected = option === value;
                  const highlighted = index === activeIndex;

                  return (
                    <li
                      key={option}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selected}
                      className={`cursor-pointer text-left transition-colors duration-100 hover:bg-[rgba(0,111,236,0.06)] ${compact ? "px-3 py-1.5 text-[10px] leading-3" : "px-4 py-2 text-[12px] leading-4"} ${FOCUS_RING}`}
                      style={{
                        backgroundColor: selected
                          ? SALTMINE.accentSolid
                          : highlighted
                            ? SALTMINE.neutral
                            : undefined,
                        color: selected ? SALTMINE.primaryDark : SALTMINE.text,
                        fontWeight: selected ? 700 : 500,
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        selectOption(option);
                      }}
                    >
                      {option}
                    </li>
                  );
                })}
              </ul>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

const FLOOR_OPTIONS = ["Floor 21", "Floor 18", "Floor 12"] as const;
const DEPARTMENT_OPTIONS = ["Design", "Engineering", "Operations"] as const;

function SetLocationStep({
  onNext,
  onGoToStep,
  onProfileClick,
}: {
  onNext: () => void;
  onGoToStep: (index: number) => void;
  onProfileClick: () => void;
}) {
  const cityId = useId();
  const buildingId = useId();
  const floorId = useId();
  const departmentId = useId();

  const [city, setCity] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [department, setDepartment] = useState("");

  const buildingOptions = useMemo(
    () => (city ? BUILDINGS_BY_CITY[city] ?? [] : []),
    [city],
  );

  const isComplete = Boolean(city && building && floor && department);

  const locationSummary = isComplete
    ? `${city} · ${building} · ${floor} · ${department}`
    : "Select each field to set your default location";

  function handleCityChange(nextCity: string) {
    setCity(nextCity);
    setBuilding("");
    setFloor("");
    setDepartment("");
  }

  function handleBuildingChange(nextBuilding: string) {
    setBuilding(nextBuilding);
    setFloor("");
    setDepartment("");
  }

  return (
    <>
      <div className={ONBOARDING_CONTENT_CLASS}>
        <OnboardingStepIntro title="Set your default location">
          Choose where you usually work. You can change this at any time in{" "}
          <button
            type="button"
            className={`${SALTMINE_TEXT_LINK} ${FOCUS_RING}`}
            style={{ color: SALTMINE.link }}
            aria-label="Profile settings (demo)"
            onClick={onProfileClick}
          >
            your profile
          </button>
          .
        </OnboardingStepIntro>

        <div className={ONBOARDING_FORM_WRAP_CLASS}>
          <div className={ONBOARDING_FIELD_STACK_CLASS}>
            <LocationSelect
              id={cityId}
              label="City"
              value={city}
              options={CITY_OPTIONS}
              onChange={handleCityChange}
              placeholder="Select a city"
              compact
              variant="filled"
            />
            <LocationSelect
              id={buildingId}
              label="Building"
              value={building}
              options={buildingOptions}
              onChange={handleBuildingChange}
              placeholder="Select a building"
              disabled={!city}
              compact
              variant="filled"
            />
            <LocationSelect
              id={floorId}
              label="Floor"
              value={floor}
              options={FLOOR_OPTIONS}
              onChange={setFloor}
              placeholder="Select a floor"
              disabled={!building}
              preferUpward
              compact
              variant="filled"
            />
            <LocationSelect
              id={departmentId}
              label="Department"
              value={department}
              options={DEPARTMENT_OPTIONS}
              onChange={setDepartment}
              placeholder="Select a department"
              disabled={!floor}
              preferUpward
              compact
              variant="filled"
            />
          </div>

          <p
            className={ONBOARDING_CAPTION_CLASS}
            style={{
              color: isComplete ? SALTMINE.textSecondary : SALTMINE.textMuted,
            }}
            aria-live="polite"
          >
            {locationSummary}
          </p>
        </div>
      </div>

      <OnboardingStepFooter
        label="Next"
        activeIndex={1}
        onAction={onNext}
        onGoToStep={onGoToStep}
        disabled={!isComplete}
      />
    </>
  );
}

function WorkspaceLoadingStep({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
      aria-label="Loading your workspace"
    >
      <div className="mb-5 flex h-5 items-end justify-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={reducedMotion ? "" : "saltmine-workspace-loading-dot"}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: SALTMINE.primary,
              opacity: reducedMotion ? (index === 1 ? 1 : 0.35) : undefined,
            }}
          />
        ))}
      </div>
      <p
        className="m-0 text-[18px] font-semibold leading-7 tracking-[-0.02em]"
        style={{ color: SALTMINE.text }}
      >
        Loading your workspace
      </p>
      <p
        className="m-0 mt-1 text-[12px] leading-4"
        style={{ color: SALTMINE.textMuted }}
        aria-hidden
      >
        Setting up your bookings and calendar…
      </p>
    </div>
  );
}

function CreateTeamStep({
  onNext,
  onSkip,
  onGoToStep,
  onProfileClick,
}: {
  onNext: () => void;
  onSkip: () => void;
  onGoToStep: (index: number) => void;
  onProfileClick: () => void;
}) {
  const teamNameId = useId();
  const coworkerId = useId();
  const coworkerListId = useId();
  const [teamName, setTeamName] = useState("London Design");
  const [coworker, setCoworker] = useState("");
  const [coworkers, setCoworkers] = useState<string[]>([
    "Sarah Chen",
    "James Okonkwo",
  ]);

  function addCoworker() {
    const name = coworker.trim();
    if (!name || coworkers.some((entry) => entry.toLowerCase() === name.toLowerCase())) {
      return;
    }
    setCoworkers((current) => [...current, name]);
    setCoworker("");
  }

  function removeCoworker(name: string) {
    setCoworkers((current) => current.filter((entry) => entry !== name));
  }

  function handleCoworkerKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCoworker();
    }
  }

  const canAddCoworker = coworker.trim().length > 0;

  return (
    <>
      <div className={ONBOARDING_CONTENT_CLASS}>
        <OnboardingStepIntro title="Create a team and add co-workers">
          Add your co-workers and see when they&apos;re in the office. You can
          edit this at any time in{" "}
          <button
            type="button"
            className={`${SALTMINE_TEXT_LINK} ${FOCUS_RING}`}
            style={{ color: SALTMINE.link }}
            aria-label="Profile settings (demo)"
            onClick={onProfileClick}
          >
            your profile
          </button>
          .
        </OnboardingStepIntro>

        <div className={ONBOARDING_FORM_WRAP_CLASS}>
          <div className={ONBOARDING_FIELD_STACK_CLASS}>
            <MinimalsOnboardingField
              id={teamNameId}
              label="Team Name"
              value={teamName}
              placeholder="Enter Name"
              onChange={setTeamName}
              compact
              variant="filled"
            />
            <MinimalsOnboardingField
              id={coworkerId}
              label="Add a co-worker"
              value={coworker}
              placeholder="Type name"
              onChange={setCoworker}
              onKeyDown={handleCoworkerKeyDown}
              ariaDescribedBy={coworkers.length > 0 ? coworkerListId : undefined}
              compact
              variant="filled"
              trailing={
                <button
                  type="button"
                  aria-label="Add co-worker"
                  disabled={!canAddCoworker}
                  onClick={addCoworker}
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white transition-[background-color,transform] duration-150 hover:bg-[rgba(0,111,236,0.06)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
                  style={{
                    borderColor: SALTMINE.border,
                    color: SALTMINE.primary,
                    boxShadow: SALTMINE_SURFACE_INSET,
                  }}
                >
                  <span className="text-sm leading-none" aria-hidden>
                    +
                  </span>
                </button>
              }
            />

            {coworkers.length > 0 ? (
              <ul
                id={coworkerListId}
                aria-label="Added co-workers"
                className="flex flex-wrap gap-1.5 pt-0.5"
              >
                {coworkers.map((name) => (
                  <li key={name}>
                    <span
                      className="inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium leading-3"
                      style={{
                        backgroundColor: SALTMINE.accentSolid,
                        color: SALTMINE.primaryDark,
                      }}
                    >
                      <span className="truncate">{name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${name}`}
                        onClick={() => removeCoworker(name)}
                        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none transition-colors duration-150 hover:bg-[rgba(0,111,236,0.16)] ${FOCUS_RING}`}
                        style={{ color: SALTMINE.primaryDark }}
                      >
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <OnboardingStepFooter
        label="Next"
        activeIndex={2}
        onAction={onNext}
        onGoToStep={onGoToStep}
        secondaryAction={{
          label: "I'll do this later",
          onClick: onSkip,
        }}
      />
    </>
  );
}

function ChooseThemeStep({
  onComplete,
  onGoToStep,
  onProfileClick,
}: {
  onComplete: () => void;
  onGoToStep: (index: number) => void;
  onProfileClick: () => void;
}) {
  const themeGroupId = useId();
  const [theme, setTheme] = useState<ThemeOption>("light");

  const themes: { id: ThemeOption; label: string; previewBg: string; dotColor: string }[] = [
    {
      id: "dark",
      label: "Dark",
      previewBg: SALTMINE_ONBOARDING.color.theme.darkPreview,
      dotColor: SALTMINE_ONBOARDING.color.theme.darkDot,
    },
    {
      id: "light",
      label: "Light",
      previewBg: SALTMINE_ONBOARDING.color.canvas,
      dotColor: SALTMINE_ONBOARDING.color.theme.lightDot,
    },
    {
      id: "system",
      label: "System",
      previewBg: SALTMINE_ONBOARDING.color.theme.darkPreview,
      dotColor: SALTMINE_ONBOARDING.color.theme.darkDot,
    },
  ];

  return (
    <>
      <div className={ONBOARDING_CONTENT_CLASS}>
        <OnboardingStepIntro title="Choose a theme">
          You can change this any time in{" "}
          <button
            type="button"
            className={`${SALTMINE_TEXT_LINK} ${FOCUS_RING}`}
            style={{ color: SALTMINE.link }}
            aria-label="Profile settings (demo)"
            onClick={onProfileClick}
          >
            your profile
          </button>
          .
        </OnboardingStepIntro>

        <div
          id={themeGroupId}
          role="radiogroup"
          aria-label="Choose a theme"
          className="mx-auto mt-4 flex w-full max-w-[360px] justify-center gap-7"
        >
          {themes.map((option) => {
            const selected = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(option.id)}
                className={`flex flex-col items-center gap-2 transition-transform duration-150 active:scale-[0.98] ${FOCUS_RING}`}
              >
                <span
                  className="flex h-[94px] w-[128px] items-start rounded-xl border-2 p-2.5 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-px"
                  style={{
                    backgroundColor: option.previewBg,
                    borderColor: selected ? SALTMINE.primary : SALTMINE.border,
                    boxShadow: selected
                      ? SALTMINE_ONBOARDING.shadow.button
                      : "0 1px 2px rgba(145, 158, 171, 0.06)",
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: option.dotColor }}
                    aria-hidden
                  />
                </span>
                <span
                  className="text-[12px] font-semibold leading-4"
                  style={{
                    color: selected ? SALTMINE.primary : SALTMINE.textSecondary,
                  }}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <OnboardingStepFooter
        label="Get Started"
        activeIndex={3}
        onAction={onComplete}
        onGoToStep={onGoToStep}
      />
    </>
  );
}

function SignInStep({
  isLoading,
  onSubmit,
  showToast,
}: {
  isLoading: boolean;
  onSubmit: (email: string) => void;
  showToast: (message: string) => void;
}) {
  const headingId = useId();
  const emailId = useId();
  const passwordId = useId();
  const staySignedInId = useId();
  const passwordHintId = useId();
  const continueHintId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const passwordIsValid = password.trim().length > 8;
  const canUsePassword = emailIsValid;
  const canUseCheckbox = emailIsValid && passwordIsValid;
  const canContinue = emailIsValid && passwordIsValid;
  const isButtonActive = canContinue || isLoading;

  const passwordDescribedBy = !canUsePassword ? passwordHintId : undefined;
  const continueDescribedBy = !canContinue ? continueHintId : undefined;

  return (
    <form
      className={ONBOARDING_FRAME_CLASS}
      style={{ fontFamily: SALTMINE_ONBOARDING.font.family, ...ONBOARDING_PRODUCT_SURFACE_STYLE }}
      aria-labelledby={headingId}
      onSubmit={(event) => {
        event.preventDefault();
        if (!canContinue || isLoading) return;
        onSubmit(email);
      }}
      noValidate
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="w-full max-w-[306px]">
            <h2
              id={headingId}
              className={ONBOARDING_TITLE_CLASS}
              style={{ color: SALTMINE.text }}
            >
              Sign in to your account
            </h2>
            <p
              className={`${ONBOARDING_BODY_CLASS} text-left`}
              style={{ color: SALTMINE.textSecondary }}
            >
              Use your work email and password to continue.
            </p>

            <p id={passwordHintId} className="sr-only">
              Enter a valid email address to enable the password field.
            </p>
            <p id={continueHintId} className="sr-only" aria-live="polite">
              {canContinue
                ? ""
                : "Enter a valid email and a password longer than 8 characters to continue."}
            </p>

            <div className="mt-4 space-y-2.5">
              <MinimalsTextField
                id={emailId}
                label="Email address"
                type="email"
                autoComplete="email"
                required
                compact
                value={email}
                disabled={isLoading}
                onChange={(value) => {
                  setEmail(value);
                  if (!isValidEmail(value)) {
                    setPassword("");
                    setStaySignedIn(false);
                  }
                }}
              />

              <MinimalsTextField
                id={passwordId}
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                compact
                value={password}
                disabled={!canUsePassword || isLoading}
                describedBy={passwordDescribedBy}
                onChange={(value) => {
                  setPassword(value);
                  if (value.trim().length <= 8) {
                    setStaySignedIn(false);
                  }
                }}
                labelAccessory={
                  <button
                    type="button"
                    disabled={!canUsePassword || isLoading}
                    onClick={() => showToast("Password reset link would be sent")}
                    className={`shrink-0 text-[10px] ${MINIMALS_TEXT_LINK}`}
                    style={{
                      color: canUsePassword ? SALTMINE.link : SALTMINE.textMuted,
                    }}
                  >
                    Forgot password?
                  </button>
                }
                trailing={
                  canUsePassword ? (
                    <span className="absolute right-1 top-1/2 inline-flex h-6 min-w-12 -translate-y-1/2 items-center justify-center">
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        disabled={password.length === 0 || isLoading}
                        onClick={() => setShowPassword((current) => !current)}
                        className={`min-h-6 min-w-6 rounded-md px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                        style={{ color: SALTMINE.link }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </span>
                  ) : undefined
                }
              />

              <MinimalsCheckbox
                id={staySignedInId}
                checked={staySignedIn}
                disabled={!canUseCheckbox || isLoading}
                compact
                label="Stay signed in for a week"
                onChange={setStaySignedIn}
              />

              <button
                type="submit"
                disabled={!canContinue || isLoading}
                aria-busy={isLoading}
                aria-describedby={continueDescribedBy}
                className={`flex h-8 w-full items-center justify-center gap-2 rounded-lg text-[10px] font-bold shadow-[0_1px_2px_0_rgba(145,158,171,0.16)] transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:cursor-not-allowed ${FOCUS_RING} ${
                  isButtonActive
                    ? "bg-[#006FEC] text-white hover:bg-[#0056C7] active:bg-[#003D9E] disabled:bg-[#006FEC] disabled:text-white disabled:opacity-90"
                    : "border border-[rgba(145,158,171,0.32)] bg-[#F4F6F8] text-[#919EAB]"
                }`}
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner className="h-3.5 w-3.5 text-white" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <div
                className="border-t pt-2.5"
                style={{ borderColor: SALTMINE_ONBOARDING.color.border.default }}
              >
                <button
                  type="button"
                  disabled={!canUsePassword || isLoading}
                  onClick={() => showToast("Single sign-on would open here")}
                  className={`flex w-full justify-center text-[11px] ${MINIMALS_TEXT_LINK}`}
                  style={{ color: canUsePassword ? SALTMINE.link : SALTMINE.textMuted }}
                >
                  Use single sign-on (SSO) instead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function SaltmineDashboardSlideCard({
  displayName = "Jatin Bansal",
  /** Deck slide 18 uses a populated demo; onboarding ends on an empty My bookings screen. */
  preset = "onboarding",
  initialActiveNav = "bookings",
}: {
  displayName?: string;
  preset?: "onboarding" | "deck";
  initialActiveNav?: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <SaltmineBookingsDashboard
        displayName={displayName}
        variant={preset === "deck" ? "deck" : "onboarding"}
        initialActiveNav={initialActiveNav}
      />
    </div>
  );
}

/** Interactive sign-in + onboarding flow for the Saltmine slide mockup. */
export function SaltmineSignInCard() {
  const reducedMotion = useReducedMotion();
  const { message: toast, showToast } = useDemoToast();
  const [step, setStep] = useState<FlowStep>("sign-in");
  const [displayName, setDisplayName] = useState("Jatin Bansal");

  const profileToast = () => showToast("Profile settings would open here");

  useEffect(() => {
    if (step === "sign-in-loading") {
      const timer = window.setTimeout(() => setStep("welcome"), 1400);
      return () => window.clearTimeout(timer);
    }
    if (step === "workspace-loading") {
      const timer = window.setTimeout(() => setStep("dashboard"), 2200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [step]);

  const handleSignIn = (email: string) => {
    setDisplayName(deriveDisplayName(email));
    setStep("sign-in-loading");
  };

  const goToOnboardingStep = (index: number) => {
    const nextStep = ONBOARDING_STEP_ORDER[index];
    if (nextStep) setStep(nextStep);
  };

  const isSignInPhase = step === "sign-in" || step === "sign-in-loading";
  const isDashboard = step === "dashboard";

  return (
    <div
      className="relative h-full w-full overflow-hidden antialiased"
      style={{ fontFamily: SALTMINE_ONBOARDING.font.family }}
    >
      {isSignInPhase ? (
        <SignInStep
          isLoading={step === "sign-in-loading"}
          onSubmit={handleSignIn}
          showToast={showToast}
        />
      ) : isDashboard ? (
        <SaltmineDashboardSlideCard displayName={displayName} />
      ) : (
        <OnboardingFrame>
          {step === "welcome" ? (
            <WelcomeStep
              displayName={displayName}
              onNext={() => setStep("set-location")}
              onGoToStep={goToOnboardingStep}
            />
          ) : null}
          {step === "set-location" ? (
            <SetLocationStep
              onNext={() => setStep("create-team")}
              onGoToStep={goToOnboardingStep}
              onProfileClick={profileToast}
            />
          ) : null}
          {step === "workspace-loading" ? (
            <WorkspaceLoadingStep reducedMotion={reducedMotion} />
          ) : null}
          {step === "create-team" ? (
            <CreateTeamStep
              onNext={() => setStep("choose-theme")}
              onSkip={() => setStep("choose-theme")}
              onGoToStep={goToOnboardingStep}
              onProfileClick={profileToast}
            />
          ) : null}
          {step === "choose-theme" ? (
            <ChooseThemeStep
              onComplete={() => setStep("workspace-loading")}
              onGoToStep={goToOnboardingStep}
              onProfileClick={profileToast}
            />
          ) : null}
        </OnboardingFrame>
      )}
      <DemoToast message={toast} />
    </div>
  );
}
