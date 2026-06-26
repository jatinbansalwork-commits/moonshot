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
  SaltmineMobileTabId,
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
  inboxBadge: boolean;
  clearInboxBadge: () => void;
  activeTab: SaltmineMobileTabId;
  setActiveTab: (tab: SaltmineMobileTabId) => void;
  showToast: (message: string) => void;
  navigateToFind: () => void;
}

const SaltmineMobileAppContext = createContext<SaltmineMobileAppContextValue | null>(null);

export function SaltmineMobileAppProvider({
  displayName,
  initialTab,
  showToast,
  children,
}: {
  displayName: string;
  initialTab: SaltmineMobileTabId;
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
  const [inboxBadge, setInboxBadge] = useState(true);
  const [activeTab, setActiveTab] = useState<SaltmineMobileTabId>(initialTab);

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

  const clearInboxBadge = useCallback(() => {
    setInboxBadge(false);
  }, []);

  const navigateToFind = useCallback(() => {
    setOverlayRoute(null);
    setActiveTab("find");
  }, []);

  const handleSetActiveTab = useCallback(
    (tab: SaltmineMobileTabId) => {
      setActiveTab(tab);
      if (tab === "inbox") clearInboxBadge();
    },
    [clearInboxBadge],
  );

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
      inboxBadge,
      clearInboxBadge,
      activeTab,
      setActiveTab: handleSetActiveTab,
      showToast,
      navigateToFind,
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
      inboxBadge,
      clearInboxBadge,
      activeTab,
      handleSetActiveTab,
      showToast,
      navigateToFind,
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
