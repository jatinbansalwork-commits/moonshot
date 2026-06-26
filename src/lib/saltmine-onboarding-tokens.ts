import { SALTMINE_MOCKUP_FONT_FAMILY } from "@/lib/saltmine-mockup-font";

/**
 * Onboarding mockup design tokens — Minimals.cc UI kit aesthetic.
 * Palette and shape follow Minimal UI defaults (MUI-based SaaS kit).
 * @see https://docs.minimals.cc/colors/
 */
export const SALTMINE_ONBOARDING = {
  color: {
    canvas: "#FFFFFF",
    text: {
      primary: "#1C252E",
      secondary: "#637381",
      muted: "#919EAB",
      disabled: "#919EAB",
      inverse: "#FFFFFF",
    },
    brand: {
      primary: "#006FEC",
      primaryHover: "#0056C7",
      primaryLight: "#4D9BF7",
      primaryLighter: "#D6EBFF",
      primaryDark: "#0047B8",
    },
    border: {
      default: "rgba(145, 158, 171, 0.32)",
      input: "#DFE3E8",
      focus: "#006FEC",
    },
    surface: {
      accent: "rgba(0, 111, 236, 0.16)",
      accentSolid: "#D6EBFF",
      neutral: "#F4F6F8",
      complete: "#F4F6F8",
      disabled: "rgba(145, 158, 171, 0.08)",
      disabledButton: "#F4F6F8",
    },
    progress: {
      inactive: "#DFE3E8",
      loading: "rgba(0, 111, 236, 0.32)",
    },
    theme: {
      darkPreview: "#1C252E",
      lightDot: "#637381",
      darkDot: "#919EAB",
    },
    placeholder: "#919EAB",
    menuHighlight: "#F4F6F8",
    link: "#006FEC",
  },
  font: {
    family: SALTMINE_MOCKUP_FONT_FAMILY,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  shadow: {
    surface:
      "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
    menu: "0 8px 16px 0 rgba(145, 158, 171, 0.24)",
    button: "0 1px 2px 0 rgba(145, 158, 171, 0.16)",
  },
} as const;

/** Back-compat colour map for inline styles. */
export const SALTMINE = {
  primary: SALTMINE_ONBOARDING.color.brand.primary,
  primaryHover: SALTMINE_ONBOARDING.color.brand.primaryHover,
  primaryDark: SALTMINE_ONBOARDING.color.brand.primaryDark,
  primaryLighter: SALTMINE_ONBOARDING.color.brand.primaryLighter,
  text: SALTMINE_ONBOARDING.color.text.primary,
  textSecondary: SALTMINE_ONBOARDING.color.text.secondary,
  textMuted: SALTMINE_ONBOARDING.color.text.muted,
  border: SALTMINE_ONBOARDING.color.border.input,
  borderFocus: SALTMINE_ONBOARDING.color.border.focus,
  dotInactive: SALTMINE_ONBOARDING.color.progress.inactive,
  darkPreview: SALTMINE_ONBOARDING.color.theme.darkPreview,
  accentSurface: SALTMINE_ONBOARDING.color.surface.accent,
  accentSolid: SALTMINE_ONBOARDING.color.surface.accentSolid,
  neutral: SALTMINE_ONBOARDING.color.surface.neutral,
  link: SALTMINE_ONBOARDING.color.link,
  placeholder: SALTMINE_ONBOARDING.color.placeholder,
} as const;

export const ONBOARDING_FRAME_CLASS =
  "flex h-full w-full flex-col overflow-hidden bg-white px-12 pb-6 pt-8";

export const ONBOARDING_CONTENT_CLASS =
  "no-scrollbar flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-1";

export const ONBOARDING_INTRO_WRAP_CLASS =
  "mx-auto w-full max-w-[306px] text-center";

export const ONBOARDING_FORM_WRAP_CLASS =
  "mx-auto mt-4 w-[272px] max-w-full";

export const ONBOARDING_FIELD_STACK_CLASS = "space-y-1.5";

export const ONBOARDING_TITLE_CLASS =
  "m-0 text-balance text-[19px] font-bold leading-6 tracking-[-0.01em]";

export const ONBOARDING_BODY_CLASS = "m-0 mt-2 text-[12px] leading-4";

export const ONBOARDING_FIELD_LABEL_CLASS =
  "mb-1 block text-left text-[10px] font-semibold leading-3";

export type OnboardingFieldVariant = "outlined" | "filled";

export const ONBOARDING_FIELD_INPUT_OUTLINED_CLASS =
  "h-[34px] w-full rounded-lg border bg-white px-3 text-[10px] leading-4 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[#919EAB]";

export const ONBOARDING_FIELD_INPUT_FILLED_CLASS =
  "h-[34px] w-full rounded-lg border border-transparent bg-[#F4F6F8] px-3 text-[10px] leading-4 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[#919EAB] hover:bg-[#F2F4F7]";

/** @deprecated Use ONBOARDING_FIELD_INPUT_OUTLINED_CLASS */
export const ONBOARDING_FIELD_INPUT_CLASS = ONBOARDING_FIELD_INPUT_OUTLINED_CLASS;

export const ONBOARDING_SELECT_TRIGGER_OUTLINED_CLASS =
  "flex h-[34px] w-full items-center rounded-lg border bg-white px-3 pr-8 text-left text-[10px] leading-4 transition-[border-color,box-shadow,background-color] duration-150";

export const ONBOARDING_SELECT_TRIGGER_FILLED_CLASS =
  "flex h-[34px] w-full items-center rounded-lg border border-transparent bg-[#F4F6F8] px-3 pr-8 text-left text-[10px] leading-4 transition-[border-color,box-shadow,background-color] duration-150 hover:bg-[#F2F4F7]";

/** @deprecated Use ONBOARDING_SELECT_TRIGGER_OUTLINED_CLASS */
export const ONBOARDING_SELECT_TRIGGER_CLASS = ONBOARDING_SELECT_TRIGGER_OUTLINED_CLASS;

export function onboardingFieldInputClass(variant: OnboardingFieldVariant = "outlined") {
  return variant === "filled"
    ? ONBOARDING_FIELD_INPUT_FILLED_CLASS
    : ONBOARDING_FIELD_INPUT_OUTLINED_CLASS;
}

export function onboardingSelectTriggerClass(variant: OnboardingFieldVariant = "outlined") {
  return variant === "filled"
    ? ONBOARDING_SELECT_TRIGGER_FILLED_CLASS
    : ONBOARDING_SELECT_TRIGGER_OUTLINED_CLASS;
}

export function onboardingFieldSurfaceStyle(
  variant: OnboardingFieldVariant,
  focused: boolean,
  disabled = false,
): {
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  boxShadow?: string;
  paddingLeft: number;
  paddingRight: number;
} {
  const accentGlow = `0 0 0 3px ${SALTMINE_ONBOARDING.color.surface.accent}`;

  if (variant === "filled") {
    return {
      borderWidth: focused ? 2 : 1,
      borderColor: focused
        ? SALTMINE_ONBOARDING.color.border.focus
        : "transparent",
      backgroundColor: disabled
        ? SALTMINE_ONBOARDING.color.surface.disabled
        : SALTMINE_ONBOARDING.color.surface.neutral,
      boxShadow: focused ? accentGlow : SALTMINE_SURFACE_INSET,
      paddingLeft: focused ? 11 : 12,
      paddingRight: focused ? 11 : 12,
    };
  }

  return {
    borderWidth: focused ? 2 : 1,
    borderColor: focused
      ? SALTMINE_ONBOARDING.color.border.focus
      : disabled
        ? SALTMINE_ONBOARDING.color.border.default
        : SALTMINE_ONBOARDING.color.border.input,
    backgroundColor: disabled
      ? SALTMINE_ONBOARDING.color.surface.disabled
      : SALTMINE_ONBOARDING.color.canvas,
    boxShadow: focused ? accentGlow : undefined,
    paddingLeft: focused ? 11 : 12,
    paddingRight: focused ? 11 : 12,
  };
}

export const ONBOARDING_CAPTION_CLASS =
  "m-0 mt-1.5 text-center text-[10px] leading-3";

export const ONBOARDING_FOOTER_CLASS =
  "mt-auto flex shrink-0 flex-col items-center gap-1.5 px-3 pb-2 pt-1";

export const ONBOARDING_NEXT_BUTTON =
  "inline-flex h-8 w-[272px] max-w-full items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-[0_1px_2px_0_rgba(145,158,171,0.16)] transition-[background-color,transform] duration-150 active:scale-[0.99]";

export const ONBOARDING_SECONDARY_LINK_CLASS =
  "inline-flex min-h-6 max-w-full items-center justify-center px-2 text-center text-[10px] font-semibold transition-[color,opacity,transform] duration-150 hover:opacity-80 active:scale-[0.98]";

/** Shared surface tokens — match bookings dashboard mockup. */
export const SALTMINE_HAIRLINE = "rgba(145, 158, 171, 0.2)";
export const SALTMINE_SURFACE_INSET =
  "inset 0 0 0 1px rgba(145, 158, 171, 0.14)";
export const SALTMINE_MENU_SHADOW =
  "0 8px 24px rgba(28, 37, 46, 0.12), 0 0 0 1px rgba(145, 158, 171, 0.12)";
export const SALTMINE_ONLINE_GREEN = "#22C55E";
/** Above SiteCursor (9999) so portaled onboarding menus stay clickable. */
export const SALTMINE_ONBOARDING_PORTAL_Z_INDEX = 10050;

export const SALTMINE_TEXT_LINK =
  "inline font-semibold transition-colors duration-150 hover:opacity-80";

export const ONBOARDING_PRODUCT_SURFACE_STYLE = {
  boxShadow: SALTMINE_ONBOARDING.shadow.surface,
} as const;
