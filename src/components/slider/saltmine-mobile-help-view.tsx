"use client";

import { useEffect, useRef, useState } from "react";
import { HelpSupportMainView } from "@/components/slider/saltmine-help-support-slide-embed";
import { SALTMINE_HELP_SUPPORT_CONTENT } from "@/lib/saltmine-help-support-content";
import {
  SALTMINE_MOBILE_BODY_CLASS,
  SALTMINE_MOBILE_CANVAS_BG,
  SALTMINE_MOBILE_CAPTION_CLASS,
  SALTMINE_MOBILE_CONTENT_X_CLASS,
  SALTMINE_MOBILE_MENU_ITEM_CLASS,
  SALTMINE_MOBILE_SECONDARY_CLASS,
} from "@/lib/saltmine-mobile-tokens";
import { SALTMINE, SALTMINE_ONBOARDING } from "@/lib/saltmine-onboarding-tokens";
import { FOCUS_RING } from "@/lib/a11y";

import { HELP_SUPPORT_RECENT_SEARCHES } from "@/lib/saltmine-help-support-data";

const content = SALTMINE_HELP_SUPPORT_CONTENT;

function HelpSearchPanel({
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main className={`flex h-full min-h-0 flex-col bg-white ${SALTMINE_MOBILE_CONTENT_X_CLASS} py-3`} role="dialog" aria-label="Search help">
      <div className="mb-3 flex items-center gap-2 border-b pb-3" style={{ borderColor: "rgba(145,158,171,0.2)" }}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={content.searchOverlayPlaceholder}
          className={`min-w-0 flex-1 border-0 bg-transparent p-0 ${SALTMINE_MOBILE_BODY_CLASS} outline-none placeholder:text-[#919EAB]`}
          style={{ color: SALTMINE.text }}
        />
        <button
          type="button"
          onClick={onClose}
          className={`min-h-11 px-2 ${SALTMINE_MOBILE_SECONDARY_CLASS} font-semibold ${FOCUS_RING}`}
          style={{ color: SALTMINE.primary }}
        >
          {content.searchOverlayCloseLabel}
        </button>
      </div>
      <p className={`m-0 mb-2 ${SALTMINE_MOBILE_CAPTION_CLASS} font-bold`} style={{ color: SALTMINE.textMuted }}>
        {content.searchRecentLabel}
      </p>
      <ul className="m-0 list-none space-y-1 p-0">
        {HELP_SUPPORT_RECENT_SEARCHES.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => onSelectRecent(term)}
              className={`flex min-h-11 w-full items-center rounded-[10px] px-2 text-left ${SALTMINE_MOBILE_MENU_ITEM_CLASS} hover:bg-[rgba(145,158,171,0.06)] ${FOCUS_RING}`}
              style={{ color: SALTMINE.text }}
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function SaltmineMobileHelpView({ showToast }: { showToast: (message: string) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div
      ref={rootRef}
      className="flex h-full min-h-0 flex-col overflow-hidden"
      style={{ fontFamily: SALTMINE_ONBOARDING.font.family, backgroundColor: SALTMINE_MOBILE_CANVAS_BG }}
      tabIndex={-1}
    >
      {searchOpen ? (
        <HelpSearchPanel
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
      ) : (
        <HelpSupportMainView
          layout="mobile"
          onOpenSearch={() => setSearchOpen(true)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
