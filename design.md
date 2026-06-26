# Deck design system

Design reference for the index slider, case-study slides, and embedded Saltmine product mockups.

---

## Overview

The deck uses **two type systems**:

| Context | Typeface | Where |
|--------|----------|--------|
| Slide copy (headings, body, case study) | **Libre Franklin** (`.index-slide-about-body`) | Slides 17–20 titles, Saltmine problem/sync layouts |
| Product mockups | **Public Sans** (`SALTMINE_ONBOARDING.font.family`) | Dashboard, sign-in, onboarding UI inside frames |

Slide frames default to **1200×720** (`FRAME_WIDTH` × `FRAME_HEIGHT`). Saltmine case-study slides use canvas **`#F2F0F6`**.

---

## Slide layout system

Layouts are declared on `SlideDefinition.layout` and routed in `index-slide-panel.tsx`.

| Layout | Component | Typical use |
|--------|-----------|-------------|
| `default` (omit `layout`) | `IndexSlideLayout` + `IndexSlideBlock` | Title + body + image/mockup stack |
| `vertical-split` | `VerticalSplitSlideLayout` | 50/50 **columns** (slide 11) |
| `horizontal-split` | `HorizontalSplitSlideLayout` | 50/50 **rows**; bottom row can nest `bottomVerticalSplit` (50/50 columns) |
| `saltmine-problem` | `SaltmineProblemSlideLayout` | Problem / solution split |
| `saltmine-sync` | `SaltmineSyncSlideLayout` | Sync opportunity slide |
| `saltmine-bento` | `SaltmineBentoSlideLayout` | Metric bento grid |
| `saltmine-example` | `SaltmineExampleSlideLayout` | Q&A bento |

### Default slide chrome (slides 17–19)

- `align: "center"`
- `blockGap: "gap-4"`
- `className: "text-black !items-start justify-center pt-10"`
- Heading: **20px** bold (`index-slide-about-body`)
- Body: **17px**, `max-w-3xl`
- Mockup frame:

```text
mx-auto h-[530px] w-[880px] max-w-full overflow-hidden rounded-[20px]
border border-black/10 bg-white shadow-[0_8px_32px_rgba(28,37,46,0.08)]
```

### Horizontal split (`horizontal-split`)

Used on **slide 20**.

```
┌─────────────────────────────────────┐
│  Top row — centred title + body     │  #F2F0F6, pt-10, max-w-4xl
├─────────────────────────────────────┤
│  Bottom left    │  Bottom right     │  50/50 columns, #ffffff
│  title + body   │  (reserved)       │
│  + mockup slot  │                   │
└─────────────────────────────────────┘
```

- Top band: `items-center`, `text-center`, `SlideTitleBody` at 20px / 17px
- Bottom cells (compact): 14px / 13px title and body, left-aligned
- Embedded mockups scale from native **880×530** (`COMPACT_MOCKUP_SCALE = 0.36` in bottom cells)
- Dividers: `bg-black/15` at 1px (horizontal between rows, vertical between bottom columns)

**Config:** `horizontalSplit` on `SlideDefinition` — see `src/types/slide-content.ts`.

### Image / mockup placeholders

`SlideImageBlock` and `SplitSlideHalfContent` support:

| Field | Values |
|-------|--------|
| `placeholder` | `true` |
| `placeholderVariant` | `"sign-in"` \| `"dashboard"` |
| `dashboardInitialNav` | e.g. `"bookings"` |
| `dashboardInitialViewMode` | `"Daily"` \| `"Weekly"` \| `"Monthly"` |

Rendered via `SaltmineSignInCard` and `SaltmineDashboardSlideCard` in `saltmine-sign-in-card.tsx`.

---

## Saltmine case study — slides 17–20

Product walkthrough after the Sync problem/solution arc (slides 5–16).

| Slide | ID | Label | Layout | Mockup |
|-------|-----|-------|--------|--------|
| 17 | `slide-17` | Onboarding experience | default | Sign-in → onboarding flow |
| 18 | `slide-18` | Navigation: You are here | default | Deck dashboard, **Daily**, nav = bookings |
| 19 | `slide-19` | The Booking Timeline | default | Deck dashboard, **Daily**, populated timeline |
| 20 | `slide-20` | The Monthly Calendar | horizontal-split | Top: monthly copy; bottom-left: Office Presence copy + dashboard slot |

Content files: `src/lib/slide-content/slide-{17,18,19,20}.ts`.

### Slide 17 — Onboarding

- **Copy:** Confirm default office, optional team, ready to go
- **Mockup:** Full `SaltmineSignInCard` flow (sign-in → welcome → location → team → theme → empty dashboard)
- **Variant:** `onboarding` (empty My bookings)

### Slide 18 — Navigation

- **Copy:** My bookings as start screen; core tasks in nav
- **Mockup:** `preset="deck"`, `dashboardInitialNav: "bookings"`, Daily view

### Slide 19 — Booking timeline

- **Copy:** Time-sensitive overview of who, what, where, when
- **Mockup:** Same as 18; data from `DECK_TIMELINE_DAYS` in `saltmine-deck-bookings-data.ts`
- **Interactions:** Car park / desk → booking detail rail; **View** → office presence rail; meeting card → switches to **Monthly** view

### Slide 20 — Monthly calendar + office presence

**Top row**

- Title: *The Monthly Calendar*
- Body: *Switch to monthly view for a full-grid overview of car park, desk, and meeting bookings — with recurring reservations marked at a glance*

**Bottom left**

- Title: *Office Presence*
- Body: *See who's in at a glance — teammates, their desk or meeting room, and how many from your team are in the office*
- Mockup: dashboard placeholder (`dashboardInitialViewMode: "Monthly"` today — presence panel wiring TBD)

**Bottom right**

- Reserved (white cell, no content yet)

---

## Saltmine mockup design tokens

Source: `src/lib/saltmine-onboarding-tokens.ts` (Minimals.cc / MUI SaaS palette).

| Token | Value | Use |
|-------|-------|-----|
| Primary | `#006FEC` | CTAs, today ring, links |
| Text | `#1C252E` | Headings |
| Text secondary | `#637381` | Labels |
| Text muted | `#919EAB` | Meta, captions |
| Canvas / neutral | `#F4F6F8` | Main content background |
| Hairline | `rgba(145, 158, 171, 0.2)` | Borders, dividers |
| Accent solid | `#D6EBFF` | Pills, badges |
| Online green | `#22C55E` | Status dots |

### Mockup type scale

Defined inline on dashboard components:

| Token | Size / line |
|-------|-------------|
| `TEXT_XS` | 9px / 13px |
| `TEXT_2XS` | 8px / 11px |
| `TEXT_MICRO` | 7px / 10px |
| Page title | 14px |
| Profile / brand | 10px |

### Right rails

Side panels share width with the mini calendar rail:

| Rail | Width | Component |
|------|-------|-----------|
| Calendar | **148px** (`DASHBOARD_RAIL_WIDTH`) | `MiniCalendar` |
| Office presence | 148px | `OfficePresencePanel` |
| Booking detail | 148px | `DeckBookingDetailPanel` |
| Inbox detail | 168px (`INBOX_DETAIL_RAIL_WIDTH`) | `InboxDetailPanel` |

Calendar rail hides when a booking detail or presence panel is open, or when view mode is not **Daily**.

---

## Dashboard features (deck variant)

Shell: `SaltmineBookingsDashboard` (`variant="deck"`).

### Daily timeline

- Component: `DeckDaySection` in `saltmine-deck-bookings-view.tsx`
- Data: `DECK_TIMELINE_DAYS` — today (Mon 30 Jan), tomorrow, extended week rows
- **All day:** car park, desk cards
- **Up next:** meetings with attendee stacks
- Office strip: avatars + **View** → presence panel
- Filters: booking type, team

### Monthly calendar

- Component: `DeckMonthlyCalendar`
- Data: `saltmine-deck-monthly-calendar-data.ts`
- Mon–Sun grid, week labels on Mondays, booking chips by kind
- Chip colours: car park = blue; desk / meeting = purple
- Recurring icon on repeating bookings
- Month picker, **Today**, prev/next

### Office presence panel

- Component: `saltmine-office-presence-panel.tsx`
- Data: `saltmine-office-presence-data.ts`
- Who's in list with desk / meeting / car park location
- Floor plan CTA; hidden scrollbar on list
- Opens from timeline **View** (replaces calendar rail)

### Booking detail panel

- Component: `saltmine-deck-booking-detail-panel.tsx`
- Hero image (parking / desk SVGs in `public/assets/saltmine/`)
- Date badge, map + share actions, check-in / check-out
- Opens on car park or desk card click

### View modes

Segmented control: **Daily** | **Weekly** | **Monthly**.

- Deck variant: Daily and Monthly are fully interactive; Weekly shows demo placeholder
- `initialViewMode` prop on `SaltmineBookingsDashboard` / `SaltmineDashboardSlideCard`

---

## Accessibility

Helpers: `src/lib/a11y.ts`. Workspace rule: `.cursor/rules/wcag-2.2-aa.mdc`.

| Pattern | Implementation |
|---------|----------------|
| Focus | `FOCUS_RING` on all custom controls (`focus-visible`, `#3291ff`) |
| Target size | `TARGET_HIT_AREA` (44×44) on nav/icon controls |
| Skip link | `SkipToContentLink` → `#main-content` |
| Motion | `useReducedMotion` + `globals.css` |
| Semantics | `button` not `div` handlers; one `h1` per route |
| Icon-only | `aria-label` on close, map, share, calendar nav |
| Panels | `<aside aria-label="…">` on presence, booking detail, inbox rails |
| Scrollbars | Hidden in side panels while keeping scroll (`scrollbar-width: none`) |

---

## Key files

```text
src/types/slide-content.ts              — slide + layout types
src/lib/slide-content/slide-{17..20}.ts — case study copy + mockup bindings
src/lib/slide-content/extra-slides.ts   — deck order

src/components/slider/index-slide-panel.tsx
src/components/slider/horizontal-split-slide-layout.tsx
src/components/slider/saltmine-sign-in-card.tsx
src/components/slider/saltmine-bookings-dashboard.tsx
src/components/slider/saltmine-deck-bookings-view.tsx
src/components/slider/saltmine-deck-monthly-calendar.tsx
src/components/slider/saltmine-office-presence-panel.tsx
src/components/slider/saltmine-deck-booking-detail-panel.tsx

src/lib/saltmine-onboarding-tokens.ts
src/lib/saltmine-mockup-font.ts
src/lib/saltmine-deck-bookings-data.ts
src/lib/saltmine-deck-monthly-calendar-data.ts
src/lib/saltmine-office-presence-data.ts
src/lib/a11y.ts
```

---

## Copy conventions

- British English in user-visible strings (`car park`, `behaviour` where appropriate)
- Case study headings: title case via `CaseStudyH2` rules in `.cursor/rules/case-study-headings.mdc`
- Saltmine product mockup strings: `src/lib/saltmine-bookings-dashboard-content.ts`
- Run `npm run spellcheck` before shipping copy changes
