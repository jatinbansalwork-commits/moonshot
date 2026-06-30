"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DECK_FILTER_DEFAULTS,
  DECK_TEAM_OPTIONS,
} from "@/lib/saltmine-deck-bookings-data";
import { WORK_LOCATION_OPTIONS } from "@/lib/saltmine-bookings-dashboard-data";
import type {
  SaltmineMobileBookingsViewMode,
  SaltmineMobileOverlayRoute,
} from "@/lib/saltmine-mobile-nav";

export interface SaltmineMobileAppContextValue {
  displayName: string;
  filterValues: Record<string, string>;
  setFilterValue: (id: string, value: string) => void;
  workLocation: string;
  setWorkLocation: (value: string) => void;
  bookingsViewMode: SaltmineMobileBookingsViewMode;
  setBookingsViewMode: (mode: SaltmineMobileBookingsViewMode) => void;
  overlayRoute: SaltmineMobileOverlayRoute | null;
  openOverlay: (route: SaltmineMobileOverlayRoute) => void;
  closeOverlay: () => void;
  hubOpen: boolean;
  setHubOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  showToast: (message: string) => void;
}

const SaltmineMobileAppContext = createContext<SaltmineMobileAppContextValue | null>(null);

export function SaltmineMobileAppProvider({
  displayName,
  showToast,
  children,
}: {
  displayName: string;
  showToast: (message: string) => void;
  children: ReactNode;
}) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    ...DECK_FILTER_DEFAULTS,
  });
  const [workLocation, setWorkLocation] = useState<string>(WORK_LOCATION_OPTIONS[2]);
  const [bookingsViewMode, setBookingsViewMode] =
    useState<SaltmineMobileBookingsViewMode>("Daily");
  const [overlayRoute, setOverlayRoute] = useState<SaltmineMobileOverlayRoute | null>(null);
  const [hubOpen, setHubOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const setFilterValue = useCallback((id: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const openOverlay = useCallback((route: SaltmineMobileOverlayRoute) => {
    setHubOpen(false);
    setOverlayRoute(route);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayRoute(null);
  }, []);

  const value = useMemo(
    () => ({
      displayName,
      filterValues,
      setFilterValue,
      workLocation,
      setWorkLocation,
      bookingsViewMode,
      setBookingsViewMode,
      overlayRoute,
      openOverlay,
      closeOverlay,
      hubOpen,
      setHubOpen,
      searchOpen,
      setSearchOpen,
      showToast,
    }),
    [
      displayName,
      filterValues,
      setFilterValue,
      workLocation,
      bookingsViewMode,
      overlayRoute,
      openOverlay,
      closeOverlay,
      hubOpen,
      searchOpen,
      showToast,
    ],
  );

  return (
    <SaltmineMobileAppContext.Provider value={value}>
      {children}
    </SaltmineMobileAppContext.Provider>
  );
}

export function useSaltmineMobileApp() {
  const context = useContext(SaltmineMobileAppContext);
  if (!context) {
    throw new Error("useSaltmineMobileApp must be used within SaltmineMobileAppProvider");
  }
  return context;
}

export function useSaltmineMobileTeamFilter() {
  const { filterValues } = useSaltmineMobileApp();
  return filterValues.team ?? DECK_TEAM_OPTIONS[0];
}
