"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Heart, ListFilter, Search, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { FloorPlanPods } from "@/components/slider/saltmine-find-space-view";
import {
  SaltmineMobilePageHeader,
  SaltmineMobileProfileButton,
} from "@/components/slider/saltmine-mobile-chrome";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_BUTTON_LABEL_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CARD_SHADOW_STYLE,
  SALTMINE_MOBILE_FAB_BOTTOM_OFFSET,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_PRESS_CLASS,
  SALTMINE_MOBILE_PAGE_TITLE_CLASS,
  SALTMINE_MOBILE_SCROLL_CLASS,
  SALTMINE_MOBILE_SCROLL_SURFACE_ATTR,
  SALTMINE_MOBILE_SCROLL_Y_CLASS,
  SALTMINE_MOBILE_SHEET_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  computeFindSpaceFloorPlan,
  FIND_SPACE_DEFAULT_FILTER_VALUES,
  FIND_SPACE_FILTER_DEFINITIONS,
  FIND_SPACE_PRIMARY_FILTER_IDS,
  FIND_SPACE_SECONDARY_FILTER_IDS,
  type FindSpaceFilterId,
  type FindSpaceFilterValues,
} from "@/lib/saltmine-find-space-filters";
import { DEFAULT_CHECKED_MEMBER_IDS, floorLettersForMemberIds } from "@/lib/saltmine-teams-data";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const FLOOR_CANVAS_BG = "#E8ECF0";
const MOBILE_FLOOR_ZOOM = 62;

function FindSpaceFilterRow({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className={`mb-1.5 block ${SALTMINE_MOBILE_BODY_CLASS}`} style={{ color: SALTMINE.textMuted }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onSelect(event.target.value)}
        className={`min-h-11 w-full rounded-[12px] border bg-white px-3 ${SALTMINE_MOBILE_BODY_CLASS} outline-none ${FOCUS_RING}`}
        style={{ borderColor: SALTMINE_HAIRLINE, color: SALTMINE.text }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MobileFindSpaceFilterSheet({
  open,
  filters,
  onClose,
  onChange,
  onClear,
}: {
  open: boolean;
  filters: FindSpaceFilterValues;
  onClose: () => void;
  onChange: (id: FindSpaceFilterId, value: string) => void;
  onClear: () => void;
}) {
  if (!open) return null;

  const allFilterIds = [...FIND_SPACE_PRIMARY_FILTER_IDS, ...FIND_SPACE_SECONDARY_FILTER_IDS];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-[rgba(28,37,46,0.4)]"
        onClick={onClose}
      />
      <div
        className={`no-scrollbar relative max-h-[78%] overflow-y-auto overscroll-contain ${SALTMINE_MOBILE_SHEET_CLASS}`}
        role="dialog"
        aria-label="Find a space filters"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className={`m-0 ${SALTMINE_MOBILE_PAGE_TITLE_CLASS} text-[18px]`} style={{ color: SALTMINE.text }}>
            {content.findSpaceMobileFiltersCta}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
            style={{ color: SALTMINE.textMuted }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
          </button>
        </div>

        <div className="space-y-3">
          {allFilterIds.map((id) => {
            const definition = FIND_SPACE_FILTER_DEFINITIONS.find((entry) => entry.id === id);
            if (!definition) return null;
            return (
              <FindSpaceFilterRow
                key={id}
                label={definition.label}
                value={filters[id]}
                options={definition.options}
                onSelect={(value) => onChange(id, value)}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClear}
          className={`mt-4 flex min-h-11 w-full items-center justify-center rounded-full border ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.28)",
            color: SALTMINE.primary,
            backgroundColor: "rgba(0, 111, 236, 0.06)",
          }}
        >
          {content.findSpaceClearFilters}
        </button>
      </div>
    </div>
  );
}

export function SaltmineMobileFindSpaceView({
  showToast,
}: {
  showToast: (message: string) => void;
}) {
  const { setSearchOpen, openOverlay } = useSaltmineMobileApp();
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<FindSpaceFilterValues>(FIND_SPACE_DEFAULT_FILTER_VALUES);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);

  const checkedFloorLetters = useMemo(
    () => floorLettersForMemberIds(DEFAULT_CHECKED_MEMBER_IDS),
    [],
  );

  const floorPlanResult = useMemo(
    () => computeFindSpaceFloorPlan(filters, undefined, undefined, checkedFloorLetters),
    [filters, checkedFloorLetters],
  );

  useEffect(() => {
    setPulseKey((key) => key + 1);
  }, [filters]);

  function handleFilterChange(id: FindSpaceFilterId, value: string) {
    setFilters((current) => ({ ...current, [id]: value }));
    const definition = FIND_SPACE_FILTER_DEFINITIONS.find((entry) => entry.id === id);
    showToast(`${definition?.label ?? id}: ${value}`);
  }

  function handleClearFilters() {
    setFilters({ ...FIND_SPACE_DEFAULT_FILTER_VALUES });
    setFilterSheetOpen(false);
    showToast(content.findSpaceClearFilters);
  }

  function handleSeatClick(deskId: string, label: string) {
    setSelectedDeskId(deskId);
    showToast(content.findSpaceBookDemo.replace("{desk}", label));
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col" style={{ backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}>
      <SaltmineMobilePageHeader title={content.findSpacePageTitle}>
        <button
          type="button"
          aria-label={content.findSpaceFavoritesLabel}
          aria-expanded={favoritesOpen}
          onClick={() => {
            setFavoritesOpen((open) => !open);
            showToast(content.findSpaceFavoritesLabel);
          }}
          className={`${SALTMINE_MOBILE_ICON_BUTTON_CLASS} !w-auto gap-1 rounded-full px-2.5`}
          style={{ color: SALTMINE.textSecondary }}
        >
          <Heart className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
          <ChevronDown className="h-4 w-4 opacity-70" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Search spaces"
          onClick={() => setSearchOpen(true)}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.textSecondary }}
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
        <SaltmineMobileProfileButton onClick={() => openOverlay("profile")} />
      </SaltmineMobilePageHeader>

      <div
        className="relative mx-4 mb-3 min-h-0 flex-1 overflow-hidden rounded-[16px] border"
        style={{
          borderColor: SALTMINE_HAIRLINE,
          backgroundColor: FLOOR_CANVAS_BG,
          ...SALTMINE_MOBILE_CARD_SHADOW_STYLE,
        }}
      >
        <div {...SALTMINE_MOBILE_SCROLL_SURFACE_ATTR} className={`h-full min-h-0 ${SALTMINE_MOBILE_SCROLL_CLASS}`}>
          <FloorPlanPods
            result={floorPlanResult}
            zoomPercent={MOBILE_FLOOR_ZOOM}
            pulseKey={pulseKey}
            selectedDeskId={selectedDeskId}
            reducedMotion={reducedMotion}
            onSeatClick={handleSeatClick}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-0 right-0 z-20 flex justify-center px-4"
        style={{ bottom: SALTMINE_MOBILE_FAB_BOTTOM_OFFSET }}
      >
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          className={`pointer-events-auto inline-flex min-h-11 min-w-[240px] items-center justify-center gap-2 rounded-full border bg-white px-5 ${SALTMINE_MOBILE_BUTTON_LABEL_CLASS} ${reducedMotion ? "" : SALTMINE_MOBILE_PRESS_CLASS} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.2)",
            color: SALTMINE.primaryDark,
            boxShadow: "0 4px 16px rgba(28, 37, 46, 0.1)",
          }}
        >
          <ListFilter className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} aria-hidden />
          {content.findSpaceMobileFiltersCta}
        </button>
      </div>

      <MobileFindSpaceFilterSheet
        open={filterSheetOpen}
        filters={filters}
        onClose={() => setFilterSheetOpen(false)}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
