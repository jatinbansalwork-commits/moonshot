"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import { useSaltmineMobileApp } from "@/components/slider/saltmine-mobile-app-context";
import { SEARCH_ITEMS } from "@/lib/saltmine-bookings-dashboard-data";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_ICON,
  SALTMINE_MOBILE_ICON_BUTTON_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";

export function SaltmineMobileSearchOverlay() {
  const { searchOpen, setSearchOpen, showToast, setActiveTab } = useSaltmineMobileApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  if (!searchOpen) return null;

  function handleSelect(term: string) {
    const lower = term.toLowerCase();
    if (lower.includes("inbox")) setActiveTab("inbox");
    else if (lower.includes("find")) setActiveTab("find");
    else if (lower.includes("team")) setActiveTab("teams");
    else setActiveTab("bookings");
    setSearchOpen(false);
    showToast(`Opening ${term}`);
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white" role="dialog" aria-label="Search workspace">
      <div
        className={`flex shrink-0 items-center gap-2 border-b ${SALTMINE_MOBILE_CONTENT_X_CLASS} py-3`}
        style={{ borderColor: SALTMINE_HAIRLINE }}
      >
        <Search
          className="h-[18px] w-[18px] shrink-0"
          strokeWidth={SALTMINE_MOBILE_ICON.stroke}
          style={{ color: SALTMINE.textMuted }}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search bookings, people, or spaces…"
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 ${SALTMINE_MOBILE_BODY_CLASS} outline-none placeholder:text-[#919EAB]`}
          style={{ color: SALTMINE.text }}
        />
        <button
          type="button"
          aria-label="Close search"
          onClick={() => setSearchOpen(false)}
          className={SALTMINE_MOBILE_ICON_BUTTON_CLASS}
          style={{ color: SALTMINE.textMuted }}
        >
          <X className="h-[18px] w-[18px]" strokeWidth={SALTMINE_MOBILE_ICON.stroke} />
        </button>
      </div>
      <ul className="no-scrollbar m-0 list-none space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {SEARCH_ITEMS.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => handleSelect(term)}
              className={`flex min-h-11 w-full items-center rounded-[12px] px-3 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
              style={{ color: SALTMINE.text }}
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
