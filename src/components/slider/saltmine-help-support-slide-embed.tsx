"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CircleHelp,
  Globe,
  Image,
  Inbox,
  LayoutGrid,
  Megaphone,
  MessageSquare,
  Presentation,
  Search,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { SALTMINE_DEMO_USER } from "@/lib/saltmine-demo-personas";
import { SaltmineDeckAvatar } from "@/components/slider/saltmine-initial-avatar";
import { SaltmineBookingsDashboard } from "@/components/slider/saltmine-bookings-dashboard";
import { DECK_FILTER_DEFAULTS } from "@/lib/saltmine-deck-bookings-data";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  HELP_SUPPORT_CATEGORIES,
  HELP_SUPPORT_POPULAR_TOPICS,
  HELP_SUPPORT_RECENT_SEARCHES,
  type HelpSupportCategory,
} from "@/lib/saltmine-help-support-data";
import { SALTMINE_HELP_SUPPORT_CONTENT } from "@/lib/saltmine-help-support-content";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const dashboardContent = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const content = SALTMINE_HELP_SUPPORT_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const RAIL_WIDTH = 148;
import {
  SALTMINE_DECK_TEXT_2XS,
  SALTMINE_DECK_TEXT_MICRO,
  SALTMINE_DECK_TEXT_XS,
} from "@/lib/saltmine-deck-typography";

const TEXT_XS = SALTMINE_DECK_TEXT_XS;
const TEXT_2XS = SALTMINE_DECK_TEXT_2XS;
const TEXT_MICRO = SALTMINE_DECK_TEXT_MICRO;

const WORKSPACE_NAV: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "bookings", label: "My bookings", icon: CalendarDays },
  { id: "find-space", label: "Find a space", icon: Search },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "teams", label: "My teams", icon: Users },
  { id: "booking-grid", label: "Booking grid", icon: LayoutGrid },
  { id: "conference-grid", label: "Conference grid", icon: Presentation },
];

type WorkspaceNavId = (typeof WORKSPACE_NAV)[number]["id"];

function HelpSupportCategoryCard({
  category,
  onSelect,
}: {
  category: HelpSupportCategory;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col overflow-hidden rounded-[8px] border bg-white text-left transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(28,37,46,0.08)] ${FOCUS_RING}`}
      style={{ borderColor: HAIRLINE }}
    >
      <div
        className="flex aspect-[16/10] w-full shrink-0 items-center justify-center"
        style={{
          backgroundColor: SALTMINE.neutral,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
        aria-hidden
      >
        <Image
          className="h-5 w-5 opacity-35"
          strokeWidth={ICON_STROKE}
          style={{ color: SALTMINE.textMuted }}
        />
      </div>
      <div className="px-1.5 py-1">
        <p className={`m-0 font-bold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
          {category.title}
        </p>
        <p className={`m-0 mt-0.5 line-clamp-3 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
          {category.description}
        </p>
      </div>
    </button>
  );
}

export function HelpSupportMainView({
  layout = "desktop",
  onOpenSearch,
  showToast,
}: {
  layout?: "desktop" | "mobile";
  onOpenSearch: () => void;
  showToast: (message: string) => void;
}) {
  const isMobile = layout === "mobile";

  return (
    <main
      className={`relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F4F6F8] ${isMobile ? "px-2.5 py-2" : "px-3 py-2"}`}
    >
      {isMobile ? (
        <div className="mb-2 shrink-0">
          <h2
            className="m-0 font-extrabold tracking-[-0.03em]"
            style={{ color: SALTMINE.text, fontSize: "14px", lineHeight: "17px" }}
          >
            {content.pageTitle}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={() => showToast(content.contactUsToast)}
              className={`inline-flex min-h-6 items-center gap-0.5 font-semibold text-[8px] leading-[11px] ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <MessageSquare className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {content.contactUsLabel}
            </button>
            <button
              type="button"
              onClick={() => showToast(content.submitFeedbackToast)}
              className={`inline-flex min-h-6 items-center gap-0.5 font-semibold text-[8px] leading-[11px] ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <Megaphone className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {content.submitFeedbackLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-1.5 flex shrink-0 items-start justify-between gap-2">
          <h2
            className="m-0 font-extrabold tracking-[-0.03em]"
            style={{ color: SALTMINE.text, fontSize: "12px", lineHeight: "15px" }}
          >
            {content.pageTitle}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => showToast(content.contactUsToast)}
              className={`inline-flex min-h-6 items-center gap-0.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <MessageSquare className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {content.contactUsLabel}
            </button>
            <button
              type="button"
              onClick={() => showToast(content.submitFeedbackToast)}
              className={`inline-flex min-h-6 items-center gap-0.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
              style={{ color: SALTMINE.textSecondary }}
            >
              <Megaphone className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
              {content.submitFeedbackLabel}
            </button>
          </div>
        </div>
      )}

      <label className={`relative block shrink-0 ${isMobile ? "mb-2" : "mb-1.5"}`}>
        <span className="sr-only">{content.helpSearchPlaceholder}</span>
        <Search
          className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-80"
          strokeWidth={ICON_STROKE}
          style={{ color: SALTMINE.textMuted }}
          aria-hidden
        />
        <input
          type="search"
          readOnly
          placeholder={content.helpSearchPlaceholder}
          onFocus={onOpenSearch}
          onClick={onOpenSearch}
          className={`h-[28px] w-full cursor-pointer rounded-[8px] border bg-white py-0 pl-[26px] pr-2 ${isMobile ? "text-[10px] leading-[14px]" : TEXT_XS} font-medium outline-none placeholder:font-normal placeholder:text-[#919EAB] focus-visible:shadow-[0_0_0_3px_rgba(0,111,236,0.16)] ${FOCUS_RING}`}
          style={{ borderColor: HAIRLINE, color: SALTMINE.text }}
        />
      </label>

      <p className={`m-0 shrink-0 ${isMobile ? "mb-2 text-[7px] leading-[10px]" : `mb-1.5 ${TEXT_MICRO}`}`} style={{ color: SALTMINE.textMuted }}>
        <span className="font-medium">{content.popularTopicsLabel} </span>
        {HELP_SUPPORT_POPULAR_TOPICS.map((topic, index) => (
          <span key={topic}>
            {index > 0 ? " " : null}
            <button
              type="button"
              onClick={() => showToast(`${content.popularTopicToast}: ${topic}`)}
              className={`font-semibold underline-offset-2 hover:underline ${FOCUS_RING}`}
              style={{ color: SALTMINE.primary }}
            >
              {topic}
            </button>
            {index < HELP_SUPPORT_POPULAR_TOPICS.length - 1 ? (
              <span aria-hidden>{", "}</span>
            ) : null}
          </span>
        ))}
      </p>

      <div
        className={`no-scrollbar grid min-h-0 flex-1 gap-1.5 overflow-y-auto pb-0.5 content-start ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}
      >
        {HELP_SUPPORT_CATEGORIES.map((category) => (
          <HelpSupportCategoryCard
            key={category.id}
            category={category}
            onSelect={() => showToast(`${content.categoryToast}: ${category.title}`)}
          />
        ))}
      </div>
    </main>
  );
}

function HelpSupportNavButton({
  label,
  icon: Icon,
  active = false,
  solidActive = false,
  localeFlag,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  solidActive?: boolean;
  localeFlag?: string;
  onClick?: () => void;
}) {
  const useSolid = solidActive && active;
  const ariaLabel = active ? `${label}, current page` : label;

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`group relative flex w-full min-h-[32px] items-center gap-1.5 rounded-lg px-1.5 py-1 text-left transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.99] ${useSolid ? "" : "hover:bg-[rgba(145,158,171,0.08)]"} ${FOCUS_RING}`}
      style={{
        backgroundColor: useSolid
          ? SALTMINE.primary
          : active
            ? SALTMINE.accentSolid
            : "transparent",
        color: useSolid ? "#FFFFFF" : active ? SALTMINE.primaryDark : SALTMINE.textSecondary,
        boxShadow:
          active && !useSolid
            ? "inset 0 0 0 1px rgba(0, 111, 236, 0.28), 0 1px 2px rgba(0, 111, 236, 0.08)"
            : undefined,
        fontWeight: active ? 700 : 500,
      }}
    >
      {active && !useSolid ? (
        <span
          className="absolute left-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: SALTMINE.primary }}
          aria-hidden
        />
      ) : null}
      <span
        className="relative inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px]"
        style={{
          backgroundColor: useSolid
            ? "transparent"
            : active
              ? SALTMINE_ONBOARDING.color.canvas
              : "transparent",
          color: useSolid ? "#FFFFFF" : active ? SALTMINE.primary : SALTMINE.textMuted,
        }}
      >
        {localeFlag ? (
          <span className="text-[9px] leading-none" aria-hidden>
            {localeFlag}
          </span>
        ) : (
          <Icon className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        )}
      </span>
      <span className={`min-w-0 flex-1 truncate font-semibold ${TEXT_XS}`}>{label}</span>
    </button>
  );
}

function HelpSupportSearchPanel({
  query,
  onQueryChange,
  onClose,
  onSelectRecent,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onSelectRecent: (term: string) => void;
}) {
  const overlayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    overlayInputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white" role="dialog" aria-label="Search">
      <div
        className="flex shrink-0 items-center gap-1.5 border-b px-3 py-2"
        style={{ borderColor: HAIRLINE }}
      >
        <Search
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={ICON_STROKE}
          style={{ color: SALTMINE.textMuted }}
          aria-hidden
        />
        <input
          ref={overlayInputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={content.searchOverlayPlaceholder}
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 ${TEXT_XS} font-medium outline-none placeholder:font-normal placeholder:text-[#919EAB] ${FOCUS_RING}`}
          style={{ color: SALTMINE.text }}
        />
        <button
          type="button"
          aria-label={content.searchOverlayCloseLabel}
          onClick={onClose}
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-[rgba(145,158,171,0.1)] ${FOCUS_RING}`}
          style={{ color: SALTMINE.textMuted }}
        >
          <X className="h-3 w-3" strokeWidth={ICON_STROKE} />
        </button>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
        <p
          className={`m-0 mb-1.5 font-bold ${TEXT_XS}`}
          style={{ color: SALTMINE.text }}
        >
          {content.searchRecentLabel}
        </p>
        <ul className="m-0 list-none space-y-0.5 p-0" aria-label={content.searchRecentLabel}>
          {HELP_SUPPORT_RECENT_SEARCHES.map((term) => (
            <li key={term}>
              <button
                type="button"
                onClick={() => onSelectRecent(term)}
                className={`flex w-full items-center gap-1.5 rounded-[6px] px-1 py-1 text-left hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
              >
                <Search
                  className="h-3 w-3 shrink-0"
                  strokeWidth={ICON_STROKE}
                  style={{ color: SALTMINE.textMuted }}
                  aria-hidden
                />
                <span className={`font-medium ${TEXT_XS}`} style={{ color: SALTMINE.text }}>
                  {term}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function workspacePageTitle(nav: WorkspaceNavId): string {
  const titles: Record<WorkspaceNavId, string> = {
    bookings: dashboardContent.pageTitle,
    "find-space": dashboardContent.findSpacePageTitle,
    inbox: dashboardContent.inboxPageTitle,
    teams: dashboardContent.teamsPageTitle,
    "booking-grid": dashboardContent.bookingGridPageTitle,
    "conference-grid": dashboardContent.conferenceGridPageTitle,
  };
  return titles[nav];
}

function HelpSupportDashboardPanel({
  displayName,
  activeNav,
}: {
  displayName: string;
  activeNav: WorkspaceNavId;
}) {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      <div
        className="absolute inset-y-0 right-0"
        style={{ left: -RAIL_WIDTH, width: `calc(100% + ${RAIL_WIDTH}px)` }}
      >
        <SaltmineBookingsDashboard
          key={activeNav}
          displayName={displayName}
          variant="deck"
          initialActiveNav={activeNav}
          initialFilterValues={{ ...DECK_FILTER_DEFAULTS }}
          navigationDisabled
        />
      </div>
    </div>
  );
}

function HelpSupportSidebar({
  displayName,
  searchOpen,
  activeWorkspaceNav,
  onOpenSearch,
  onNavToWorkspace,
  onHelp,
  onLocale,
  onLanguage,
  onProfileClick,
}: {
  displayName: string;
  searchOpen: boolean;
  activeWorkspaceNav: WorkspaceNavId | null;
  onOpenSearch: () => void;
  onNavToWorkspace: (id: WorkspaceNavId) => void;
  onHelp: () => void;
  onLocale: () => void;
  onLanguage: () => void;
  onProfileClick: () => void;
}) {
  return (
    <aside
      className="flex shrink-0 flex-col border-r bg-white px-2 py-2.5"
      style={{ width: RAIL_WIDTH, borderColor: HAIRLINE }}
      aria-label="Main navigation"
    >
      <div className="mb-2 flex items-center gap-1.5 px-0.5">
        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#1C252E] p-0.5">
          <img
            src={dashboardContent.brandLogoSrc}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain"
            decoding="async"
            draggable={false}
          />
        </span>
        <span
          className="truncate text-[10px] font-extrabold leading-3 tracking-[-0.035em]"
          style={{ color: SALTMINE.text }}
        >
          {dashboardContent.brandName}
        </span>
      </div>

      {searchOpen ? (
        <nav className="mb-2 space-y-px" aria-label="Search navigation">
          <HelpSupportNavButton
            label="Search"
            icon={Search}
            active
            solidActive
            onClick={onOpenSearch}
          />
        </nav>
      ) : (
        <label className="relative mb-2 block">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-80"
            strokeWidth={ICON_STROKE}
            style={{ color: SALTMINE.textMuted }}
            aria-hidden
          />
          <input
            type="search"
            readOnly
            placeholder={content.searchPlaceholder}
            onFocus={onOpenSearch}
            onClick={onOpenSearch}
            className={`h-[30px] w-full cursor-pointer rounded-[8px] border-0 py-0 pl-[26px] pr-8 ${TEXT_XS} font-medium outline-none placeholder:font-normal placeholder:text-[#919EAB] focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(0,111,236,0.16)] ${FOCUS_RING}`}
            style={{
              color: SALTMINE.text,
              backgroundColor: SALTMINE.neutral,
              boxShadow: SALTMINE_SURFACE_INSET,
            }}
          />
          <kbd
            className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border px-1 font-medium ${TEXT_MICRO}`}
            style={{ borderColor: HAIRLINE, color: SALTMINE.textMuted, backgroundColor: "#FFFFFF" }}
          >
            /
          </kbd>
        </label>
      )}

      {!searchOpen ? (
        <p
          className="mb-0.5 w-full px-1.5 text-left font-bold uppercase tracking-[0.1em] text-[6px] leading-3"
          style={{ color: SALTMINE.textMuted }}
        >
          {dashboardContent.navSectionWorkspace}
        </p>
      ) : null}
      <nav className="space-y-px" aria-label="Workspace">
        {WORKSPACE_NAV.map((item) => (
          <HelpSupportNavButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={!searchOpen && activeWorkspaceNav === item.id}
            onClick={() => onNavToWorkspace(item.id)}
          />
        ))}
      </nav>

      <div className="my-1.5 h-px shrink-0" style={{ backgroundColor: HAIRLINE }} aria-hidden />

      <div className="mt-auto space-y-px pt-1">
        <p
          className="mb-0.5 w-full px-1.5 text-left font-bold uppercase tracking-[0.1em] text-[6px] leading-3"
          style={{ color: SALTMINE.textMuted }}
        >
          {dashboardContent.navSectionSupport}
        </p>
        <HelpSupportNavButton
          label={dashboardContent.secondaryNav[0].label}
          icon={CircleHelp}
          active={!searchOpen && activeWorkspaceNav === null}
          solidActive
          onClick={onHelp}
        />
        <HelpSupportNavButton
          label={dashboardContent.secondaryNav[1].label}
          icon={Globe}
          localeFlag={dashboardContent.secondaryNav[1].localeFlag}
          onClick={onLocale}
        />
        <HelpSupportNavButton
          label="English"
          icon={Globe}
          onClick={onLanguage}
        />
      </div>

      <button
        type="button"
        aria-label={`${displayName} profile`}
        onClick={onProfileClick}
        className={`mt-2 flex min-h-[38px] w-full items-center gap-1 rounded-lg border px-1 py-1 text-left transition-[border-color,box-shadow,transform] duration-150 hover:border-[rgba(0,111,236,0.24)] hover:shadow-[0_2px_8px_rgba(145,158,171,0.1)] active:scale-[0.99] ${FOCUS_RING}`}
        style={{
          borderColor: HAIRLINE,
          backgroundColor: SALTMINE_ONBOARDING.color.canvas,
          boxShadow: "0 1px 2px rgba(145, 158, 171, 0.06)",
        }}
      >
        <SaltmineDeckAvatar memberId="jb" letter={SALTMINE_DEMO_USER.floorLetter} size={22} color="#4D9BF7" />
        <span className={`min-w-0 truncate font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
          {displayName}
        </span>
      </button>
    </aside>
  );
}

function HelpSupportToast({
  message,
}: {
  message: string | null;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`absolute bottom-3 left-1/2 z-[100] flex max-w-[90%] -translate-x-1/2 items-center rounded-full border px-3 py-1 font-semibold shadow-lg transition-opacity duration-200 ${TEXT_XS} ${message ? "opacity-100" : "pointer-events-none opacity-0"}`}
      style={{
        borderColor: "rgba(0, 111, 236, 0.24)",
        backgroundColor: SALTMINE_ONBOARDING.color.canvas,
        color: SALTMINE.text,
      }}
    >
      {message ?? ""}
    </div>
  );
}

/** Slide 24 / 25 — isolated Help & Support mockup (not shared with other dashboard slides). */
export function SaltmineHelpSupportSlideEmbed({
  displayName = SALTMINE_DEMO_USER.name,
  layout = "desktop",
  showWorkspaceNav = true,
}: {
  displayName?: string;
  layout?: "desktop" | "mobile";
  /** When false, help content fills the frame (slide 24). */
  showWorkspaceNav?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspaceNav, setActiveWorkspaceNav] = useState<WorkspaceNavId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || searchOpen) return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      event.preventDefault();
      setSearchOpen(true);
    }
    const root = rootRef.current;
    root?.addEventListener("keydown", onKeyDown);
    return () => root?.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  if (layout === "mobile") {
    return (
      <div
        ref={rootRef}
        className="relative flex h-full w-full flex-col overflow-hidden antialiased text-left"
        style={{
          fontFamily: SALTMINE_ONBOARDING.font.family,
          backgroundColor: "#F4F6F8",
        }}
        role="application"
        aria-label={searchOpen ? "Search" : content.pageTitle}
        tabIndex={-1}
      >
        <div className="shrink-0 px-3 pb-1 pt-2" aria-hidden>
          <div className="mx-auto h-[5px] w-[52px] rounded-full bg-[#1C252E]" />
        </div>

        {searchOpen ? (
          <main className="relative min-h-0 flex-1 overflow-hidden">
            <HelpSupportSearchPanel
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onClose={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              onSelectRecent={(term) => {
                setSearchQuery(term);
                showToast(`Searching for ${term}`);
              }}
            />
          </main>
        ) : (
          <HelpSupportMainView
            layout="mobile"
            onOpenSearch={() => setSearchOpen(true)}
            showToast={showToast}
          />
        )}

        <HelpSupportToast message={toast} />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative flex h-full w-full overflow-hidden antialiased text-left"
      style={{
        fontFamily: SALTMINE_ONBOARDING.font.family,
        backgroundColor: "#F4F6F8",
      }}
      role="application"
      aria-label={
        searchOpen
          ? "Search"
          : activeWorkspaceNav
            ? workspacePageTitle(activeWorkspaceNav)
            : content.pageTitle
      }
      tabIndex={-1}
    >
      {showWorkspaceNav ? (
        <HelpSupportSidebar
          displayName={displayName}
          searchOpen={searchOpen}
          activeWorkspaceNav={activeWorkspaceNav}
          onOpenSearch={() => setSearchOpen(true)}
          onNavToWorkspace={(id) => {
            setSearchOpen(false);
            setSearchQuery("");
            setActiveWorkspaceNav(id);
          }}
          onHelp={() => {
            setSearchOpen(false);
            setSearchQuery("");
            setActiveWorkspaceNav(null);
          }}
          onLocale={() => showToast("Region set to India")}
          onLanguage={() => showToast("Language set to English")}
          onProfileClick={() => showToast(`Opening profile for ${SALTMINE_DEMO_USER.name}`)}
        />
      ) : null}

      {searchOpen ? (
        <main className="relative min-w-0 flex-1 overflow-hidden">
          <HelpSupportSearchPanel
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onClose={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            onSelectRecent={(term) => {
              setSearchQuery(term);
              showToast(`Searching for ${term}`);
            }}
          />
        </main>
      ) : activeWorkspaceNav ? (
        <HelpSupportDashboardPanel
          displayName={displayName}
          activeNav={activeWorkspaceNav}
        />
      ) : (
        <HelpSupportMainView
          onOpenSearch={() => setSearchOpen(true)}
          showToast={showToast}
        />
      )}

      <HelpSupportToast message={toast} />
    </div>
  );
}
