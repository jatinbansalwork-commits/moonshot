"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { PodCluster } from "@/components/slider/saltmine-pod-cluster";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SALTMINE_BOOKINGS_DASHBOARD_CONTENT } from "@/lib/saltmine-bookings-dashboard-content";
import {
  FIND_SPACE_TABLE_POD,
} from "@/lib/saltmine-find-space-data";
import {
  DISPLAY_POD_IDS,
  FLOOR_PLAN_ARTBOARD,
  MEETING_CENTRAL_SLOTS,
  MEETING_NORTH_SLOTS,
  POD_SLOTS,
  ZONE_LABEL_SLOTS,
  type ArtboardSlot,
} from "@/lib/saltmine-find-space-layout";
import {
  computeFindSpaceFloorPlan,
  FIND_SPACE_DEFAULT_FILTER_VALUES,
  FIND_SPACE_FILTER_DEFINITIONS,
  FIND_SPACE_PRIMARY_FILTER_IDS,
  FIND_SPACE_SECONDARY_FILTER_IDS,
  type DisplayPod,
  type FindSpaceFilterId,
  type FindSpaceFilterValues,
  type FindSpaceFloorPlanResult,
} from "@/lib/saltmine-find-space-filters";
import { floorLettersForMemberIds } from "@/lib/saltmine-teams-data";
import {
  SALTMINE,
  SALTMINE_HAIRLINE,
  SALTMINE_ONBOARDING,
  SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
  SALTMINE_SURFACE_INSET,
} from "@/lib/saltmine-onboarding-tokens";

const content = SALTMINE_BOOKINGS_DASHBOARD_CONTENT;
const HAIRLINE = SALTMINE_HAIRLINE;
const ICON_STROKE = 1.65;
const TEXT_XS = "text-[9px] leading-[13px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";
const FLOOR_CANVAS_BG = "#E8ECF0";
const MENU_SHADOW = "0 8px 24px rgba(28, 37, 46, 0.12), 0 2px 6px rgba(28, 37, 46, 0.06)";
const ZOOM_LEVELS = [50, 75, 100, 125, 150] as const;
const DEFAULT_ZOOM_INDEX = ZOOM_LEVELS.indexOf(100);

function filterDefinition(id: FindSpaceFilterId) {
  return FIND_SPACE_FILTER_DEFINITIONS.find((entry) => entry.id === id)!;
}

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [enabled, onClose, ref]);
}

function FindSpaceFilterMenu({
  id,
  options,
  value,
  onSelect,
  onClose,
}: {
  id: string;
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <ul
      id={id}
      role="listbox"
      className="no-scrollbar absolute left-0 right-0 top-[calc(100%+4px)] z-[1] max-h-[140px] overflow-y-auto rounded-lg border bg-white py-0.5 shadow-lg"
      style={{
        borderColor: HAIRLINE,
        boxShadow: MENU_SHADOW,
        zIndex: SALTMINE_ONBOARDING_PORTAL_Z_INDEX,
      }}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <li key={option} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
              className={`flex w-full items-center gap-1 px-2 py-1 text-left ${TEXT_XS} ${FOCUS_RING}`}
              style={{
                color: selected ? SALTMINE.primary : SALTMINE.text,
                fontWeight: selected ? 700 : 500,
                backgroundColor: selected ? "rgba(0, 111, 236, 0.06)" : "transparent",
              }}
            >
              {selected ? (
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: SALTMINE.primary }}
                  aria-hidden
                />
              ) : (
                <span className="h-1 w-1 shrink-0" aria-hidden />
              )}
              {option}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FindSpaceFilterField({
  filterId,
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onSelect,
}: {
  filterId: FindSpaceFilterId;
  label: string;
  value: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose, open);

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <p
        className={`mb-0.5 truncate px-0.5 font-medium ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${filterId}-menu` : undefined}
        aria-label={`${label} ${value}`}
        onClick={onToggle}
        className={`flex h-[28px] w-full items-center gap-0.5 rounded-md border-0 px-1.5 text-left ${TEXT_XS} font-semibold ${FOCUS_RING}`}
        style={{
          color: SALTMINE.text,
          backgroundColor: open ? SALTMINE_ONBOARDING.color.canvas : SALTMINE.neutral,
          boxShadow: open ? "0 0 0 3px rgba(0, 111, 236, 0.12)" : SALTMINE_SURFACE_INSET,
        }}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-2.5 w-2.5 shrink-0 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
      </button>
      {open ? (
        <FindSpaceFilterMenu
          id={`${filterId}-menu`}
          options={options}
          value={value}
          onSelect={onSelect}
          onClose={onClose}
        />
      ) : null}
    </div>
  );
}

function FindSpaceFilterBar({
  filters,
  openFilterId,
  moreFiltersOpen,
  onToggleMoreFilters,
  onOpenFilter,
  onCloseFilter,
  onFilterChange,
}: {
  filters: FindSpaceFilterValues;
  openFilterId: FindSpaceFilterId | null;
  moreFiltersOpen: boolean;
  onToggleMoreFilters: () => void;
  onOpenFilter: (id: FindSpaceFilterId) => void;
  onCloseFilter: () => void;
  onFilterChange: (id: FindSpaceFilterId, value: string) => void;
}) {
  return (
    <div className="mb-1 space-y-1">
      <div className="flex w-full gap-1">
        {FIND_SPACE_PRIMARY_FILTER_IDS.map((id) => {
          const definition = filterDefinition(id);
          return (
            <FindSpaceFilterField
              key={id}
              filterId={id}
              label={definition.label}
              value={filters[id]}
              options={definition.options}
              open={openFilterId === id}
              onToggle={() => onOpenFilter(id)}
              onClose={onCloseFilter}
              onSelect={(value) => onFilterChange(id, value)}
            />
          );
        })}
      </div>
      <div>
        <button
          type="button"
          aria-expanded={moreFiltersOpen}
          onClick={onToggleMoreFilters}
          className={`inline-flex min-h-6 items-center gap-0.5 rounded-md px-1.5 font-semibold ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{ color: SALTMINE.primary }}
        >
          {content.findSpaceMoreFilters}
          <ChevronDown
            className={`h-2 w-2 transition-transform duration-150 ${moreFiltersOpen ? "rotate-180" : ""}`}
            strokeWidth={ICON_STROKE}
            aria-hidden
          />
        </button>
        {moreFiltersOpen ? (
          <div className="mt-1 flex w-full gap-1">
            {FIND_SPACE_SECONDARY_FILTER_IDS.map((id) => {
              const definition = filterDefinition(id);
              return (
                <FindSpaceFilterField
                  key={id}
                  filterId={id}
                  label={definition.label}
                  value={filters[id]}
                  options={definition.options}
                  open={openFilterId === id}
                  onToggle={() => onOpenFilter(id)}
                  onClose={onCloseFilter}
                  onSelect={(value) => onFilterChange(id, value)}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FindSpaceViewToggle({
  value,
  onChange,
}: {
  value: "floor" | "list";
  onChange: (mode: "floor" | "list") => void;
}) {
  const modes = [
    { id: "floor" as const, label: content.findSpaceViewFloor },
    { id: "list" as const, label: content.findSpaceViewList },
  ];

  return (
    <div
      role="group"
      aria-label="Results view"
      className="inline-flex rounded-full border bg-white p-0.5 shadow-sm"
      style={{ borderColor: HAIRLINE }}
    >
      {modes.map((mode) => {
        const selected = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(mode.id)}
            className={`min-h-6 rounded-full px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
            style={{
              color: selected ? SALTMINE_ONBOARDING.color.text.inverse : SALTMINE.textSecondary,
              backgroundColor: selected ? SALTMINE.primary : "transparent",
            }}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

function FloorPlanLegend() {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 ${TEXT_MICRO}`} style={{ color: SALTMINE.textMuted }}>
      <span className="inline-flex items-center gap-0.5">
        <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#22C55E]" aria-hidden />
        {content.findSpaceLegendAvailable}
      </span>
      <span className="inline-flex items-center gap-0.5">
        <span
          className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-[#006FEC] bg-[#637381]"
          aria-hidden
        />
        {content.findSpaceLegendTeam}
      </span>
      <span className="inline-flex items-center gap-0.5">
        <span
          className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white bg-[#637381] text-[5px] font-bold text-white"
          aria-hidden
        >
          J
        </span>
        {content.findSpaceLegendBooked}
      </span>
    </div>
  );
}

function ArtboardSlotFrame({
  slot,
  children,
  className = "",
}: {
  slot: ArtboardSlot;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute overflow-visible ${className}`}
      style={{
        left: `${slot.left}%`,
        top: `${slot.top}%`,
        width: `${slot.width}%`,
        height: `${slot.height}%`,
      }}
    >
      {slot.rotate ? (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="h-[90%] w-[90%]"
            style={{ transform: `rotate(${slot.rotate}deg)` }}
          >
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function ScaledArtboard({
  children,
  zoomPercent,
}: {
  children: ReactNode;
  zoomPercent: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      setBaseScale(
        Math.min(w / FLOOR_PLAN_ARTBOARD.width, h / FLOOR_PLAN_ARTBOARD.height),
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const scale = baseScale * (zoomPercent / 100);
  const scaledW = FLOOR_PLAN_ARTBOARD.width * scale;
  const scaledH = FLOOR_PLAN_ARTBOARD.height * scale;

  return (
    <div ref={hostRef} className="no-scrollbar h-full w-full overflow-auto">
      <div
        className="flex min-h-full min-w-full items-center justify-center"
        style={{ minWidth: scaledW, minHeight: scaledH }}
      >
        <div className="relative" style={{ width: scaledW, height: scaledH }}>
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: FLOOR_PLAN_ARTBOARD.width,
              height: FLOOR_PLAN_ARTBOARD.height,
              transform: `scale(${scale})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorPlanZoomControl({
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
}: {
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border bg-white shadow-sm ${TEXT_XS}`}
      style={{ borderColor: HAIRLINE }}
      role="group"
      aria-label="Floor plan zoom"
    >
      <button
        type="button"
        aria-label="Zoom out"
        disabled={!canZoomOut}
        onClick={onZoomOut}
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-l-full px-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
        style={{ color: SALTMINE.text }}
      >
        <Minus className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Reset zoom to 100%"
        onClick={onReset}
        className={`min-w-[2.25rem] border-x px-1.5 text-center font-semibold tabular-nums ${FOCUS_RING}`}
        style={{ borderColor: HAIRLINE, color: SALTMINE.text }}
        aria-live="polite"
      >
        {zoomPercent}%
      </button>
      <button
        type="button"
        aria-label="Zoom in"
        disabled={!canZoomIn}
        onClick={onZoomIn}
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-r-full px-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
        style={{ color: SALTMINE.text }}
      >
        <Plus className="h-2.5 w-2.5" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
    </div>
  );
}

function MeetingTableUnit({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full min-h-0 flex-col items-center ${available ? "" : "opacity-35"}`}
      aria-label={label}
    >
      <p
        className={`m-0 mb-px shrink-0 font-semibold ${TEXT_MICRO}`}
        style={{ color: SALTMINE.textMuted }}
      >
        {label}
      </p>
      <div className="relative min-h-0 w-full flex-1 p-[5%]">
        <Image
          src={FIND_SPACE_TABLE_POD.src}
          alt=""
          width={FIND_SPACE_TABLE_POD.width}
          height={FIND_SPACE_TABLE_POD.height}
          aria-hidden
          className="block h-full w-full object-contain object-center"
        />
      </div>
    </div>
  );
}

export function FloorPlanPods({
  result,
  zoomPercent,
  pulseKey,
  selectedDeskId,
  reducedMotion,
  onSeatClick,
  onClearFilters,
}: {
  result: FindSpaceFloorPlanResult;
  zoomPercent: number;
  pulseKey: number;
  selectedDeskId: string | null;
  reducedMotion: boolean;
  onSeatClick: (deskId: string, label: string) => void;
  onClearFilters: () => void;
}) {
  const podsById = new Map(result.pods.map((pod) => [pod.id, pod]));
  const displayPods = DISPLAY_POD_IDS.map((id) => podsById.get(id)).filter(
    (pod): pod is DisplayPod => Boolean(pod?.visible),
  );
  const northTables = result.meetingTables.filter(
    (entry) => entry.visible && entry.table.id.startsWith("m-n"),
  );
  const centralTables = result.meetingTables.filter(
    (entry) => entry.visible && entry.table.id.startsWith("m-c"),
  );
  const showDesignZone = displayPods.length > 0 || northTables.length > 0;
  const showEngineeringZone = centralTables.length > 0;
  const isEmpty = !showDesignZone && !showEngineeringZone;

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
        <p className={`m-0 text-center font-medium ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
          {content.findSpaceEmptyLabel}
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className={`min-h-6 rounded-[6px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.32)",
            color: SALTMINE.primary,
            backgroundColor: "rgba(0, 111, 236, 0.06)",
          }}
        >
          {content.findSpaceClearFilters}
        </button>
      </div>
    );
  }

  return (
    <ScaledArtboard zoomPercent={zoomPercent}>
      <div className="relative h-full w-full">
        {showDesignZone ? (
          <p
            className={`pointer-events-none absolute font-bold uppercase tracking-[0.2em] ${TEXT_XS}`}
            style={{
              left: `${ZONE_LABEL_SLOTS.design.left}%`,
              top: `${ZONE_LABEL_SLOTS.design.top}%`,
              color: "rgba(145, 158, 171, 0.22)",
              fontSize: "clamp(14px, 4.5cqw, 28px)",
            }}
            aria-hidden
          >
            Design
          </p>
        ) : null}
        {showEngineeringZone ? (
          <p
            className={`pointer-events-none absolute font-bold uppercase tracking-[0.2em] ${TEXT_XS}`}
            style={{
              left: `${ZONE_LABEL_SLOTS.engineering.left}%`,
              top: `${ZONE_LABEL_SLOTS.engineering.top}%`,
              color: "rgba(145, 158, 171, 0.22)",
              fontSize: "clamp(14px, 4.5cqw, 28px)",
            }}
            aria-hidden
          >
            Engineering
          </p>
        ) : null}

        {displayPods.map((pod, index) => {
          const slot = POD_SLOTS[index];
          if (!slot) return null;
          return (
            <ArtboardSlotFrame key={pod.id} slot={slot}>
              <PodCluster
                pod={pod}
                pulseKey={pulseKey}
                selectedDeskId={selectedDeskId}
                reducedMotion={reducedMotion}
                onSeatClick={onSeatClick}
              />
            </ArtboardSlotFrame>
          );
        })}

        {northTables.map((entry, index) => {
          const slot = MEETING_NORTH_SLOTS[index];
          if (!slot) return null;
          return (
            <ArtboardSlotFrame key={entry.table.id} slot={slot}>
              <MeetingTableUnit label={entry.table.label} available={entry.available} />
            </ArtboardSlotFrame>
          );
        })}

        {centralTables.map((entry, index) => {
          const slot = MEETING_CENTRAL_SLOTS[index];
          if (!slot) return null;
          return (
            <ArtboardSlotFrame key={entry.table.id} slot={slot}>
              <MeetingTableUnit label={entry.table.label} available={entry.available} />
            </ArtboardSlotFrame>
          );
        })}
      </div>
    </ScaledArtboard>
  );
}

function FindSpaceListView({
  spaces,
  onClearFilters,
}: {
  spaces: string[];
  onClearFilters: () => void;
}) {
  if (spaces.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
        <p className={`m-0 text-center font-medium ${TEXT_XS}`} style={{ color: SALTMINE.textMuted }}>
          {content.findSpaceEmptyLabel}
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className={`min-h-6 rounded-[6px] border px-2 font-semibold leading-none ${TEXT_MICRO} ${FOCUS_RING}`}
          style={{
            borderColor: "rgba(0, 111, 236, 0.32)",
            color: SALTMINE.primary,
            backgroundColor: "rgba(0, 111, 236, 0.06)",
          }}
        >
          {content.findSpaceClearFilters}
        </button>
      </div>
    );
  }

  return (
    <ul
      className="no-scrollbar m-0 h-full list-none space-y-1 overflow-y-auto p-2"
      aria-label="Matching spaces"
    >
      {spaces.map((space) => (
        <li key={space}>
          <div
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${TEXT_XS} font-semibold`}
            style={{ borderColor: HAIRLINE, color: SALTMINE.text, backgroundColor: "#fff" }}
          >
            <span
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white"
              aria-hidden
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {space}
          </div>
        </li>
      ))}
    </ul>
  );
}

function FloorPlanCanvas({
  result,
  viewMode,
  pulseKey,
  selectedDeskId,
  reducedMotion,
  onSeatClick,
  onClearFilters,
  onViewModeChange,
}: {
  result: FindSpaceFloorPlanResult;
  viewMode: "floor" | "list";
  pulseKey: number;
  selectedDeskId: string | null;
  reducedMotion: boolean;
  onSeatClick: (deskId: string, label: string) => void;
  onClearFilters: () => void;
  onViewModeChange: (mode: "floor" | "list") => void;
}) {
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const zoomPercent = ZOOM_LEVELS[zoomIndex];
  const canZoomOut = zoomIndex > 0;
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;

  return (
    <div
      className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[10px]"
      style={{
        backgroundColor: FLOOR_CANVAS_BG,
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        className="relative z-20 flex shrink-0 items-center justify-between gap-2 px-3 pb-1 pt-2"
        aria-label="Floor plan controls"
      >
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full border bg-white px-2 py-0.5 font-semibold shadow-sm ${TEXT_XS}`}
            style={{ borderColor: HAIRLINE, color: SALTMINE.text }}
            aria-live="polite"
          >
            {result.matchingCount} matching spaces
          </span>
        </div>
        <FindSpaceViewToggle value={viewMode} onChange={onViewModeChange} />
      </div>

      <div className="relative min-h-0 flex-1 px-1 pb-2">
        {viewMode === "list" ? (
          <FindSpaceListView spaces={result.matchingSpaces} onClearFilters={onClearFilters} />
        ) : (
          <FloorPlanPods
            result={result}
            zoomPercent={zoomPercent}
            pulseKey={pulseKey}
            selectedDeskId={selectedDeskId}
            reducedMotion={reducedMotion}
            onSeatClick={onSeatClick}
            onClearFilters={onClearFilters}
          />
        )}

        {viewMode === "floor" ? (
          <>
            <div className="pointer-events-none absolute bottom-2 left-2 z-30">
              <div
                className="pointer-events-auto rounded-full border bg-white/95 px-2 py-1 shadow-sm"
                style={{ borderColor: HAIRLINE }}
              >
                <FloorPlanLegend />
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-2 right-2 z-30 flex flex-col items-end gap-1">
              {zoomPercent > 100 ? (
                <span
                  className={`rounded-full border bg-white/90 px-2 py-0.5 font-medium shadow-sm ${TEXT_MICRO}`}
                  style={{ borderColor: HAIRLINE, color: SALTMINE.textMuted }}
                >
                  {content.findSpacePanHint}
                </span>
              ) : null}
              <div className="pointer-events-auto">
                <FloorPlanZoomControl
                  zoomPercent={zoomPercent}
                  canZoomIn={canZoomIn}
                  canZoomOut={canZoomOut}
                  onZoomIn={() =>
                    setZoomIndex((index) => Math.min(ZOOM_LEVELS.length - 1, index + 1))
                  }
                  onZoomOut={() => setZoomIndex((index) => Math.max(0, index - 1))}
                  onReset={() => setZoomIndex(DEFAULT_ZOOM_INDEX)}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function FindASpaceMainView({
  checkedMemberIds,
  showToast,
}: {
  checkedMemberIds: Set<string>;
  showToast: (message: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<FindSpaceFilterValues>(FIND_SPACE_DEFAULT_FILTER_VALUES);
  const [viewMode, setViewMode] = useState<"floor" | "list">("floor");
  const [openFilterId, setOpenFilterId] = useState<FindSpaceFilterId | null>(null);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);

  const checkedFloorLetters = useMemo(
    () => floorLettersForMemberIds(checkedMemberIds),
    [checkedMemberIds],
  );

  const floorPlanResult = useMemo(
    () => computeFindSpaceFloorPlan(filters, undefined, undefined, checkedFloorLetters),
    [filters, checkedFloorLetters],
  );

  useEffect(() => {
    setPulseKey((key) => key + 1);
  }, [filters, checkedMemberIds]);

  const handleFilterChange = (id: FindSpaceFilterId, value: string) => {
    setFilters((current) => ({ ...current, [id]: value }));
    const definition = FIND_SPACE_FILTER_DEFINITIONS.find((entry) => entry.id === id);
    showToast(`${definition?.label ?? id}: ${value}`);
  };

  const handleClearFilters = () => {
    setFilters({ ...FIND_SPACE_DEFAULT_FILTER_VALUES });
    setOpenFilterId(null);
    showToast(content.findSpaceClearFilters);
  };

  const handleSeatClick = (deskId: string, label: string) => {
    setSelectedDeskId(deskId);
    showToast(content.findSpaceBookDemo.replace("{desk}", label));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <FindSpaceFilterBar
        filters={filters}
        openFilterId={openFilterId}
        moreFiltersOpen={moreFiltersOpen}
        onToggleMoreFilters={() => setMoreFiltersOpen((open) => !open)}
        onOpenFilter={(id) => setOpenFilterId((current) => (current === id ? null : id))}
        onCloseFilter={() => setOpenFilterId(null)}
        onFilterChange={handleFilterChange}
      />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <FloorPlanCanvas
            result={floorPlanResult}
            viewMode={viewMode}
            pulseKey={pulseKey}
            selectedDeskId={selectedDeskId}
            reducedMotion={reducedMotion}
            onSeatClick={handleSeatClick}
            onClearFilters={handleClearFilters}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>
    </div>
  );
}
