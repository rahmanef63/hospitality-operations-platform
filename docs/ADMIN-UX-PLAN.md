# Kamyna Admin UI/UX Plan

## Goal

Make every operational task feel like one connected workflow rather than a collection of CRUD forms. The system must remain truthful: it may derive values from saved property, unit, reservation, and transaction data, but it must never invent rates, capacity, availability, or guest records.

## Product principles

1. **One input, many consequences.** Select an accommodation once; property, unit, currency, default rate, inventory rules, and calendar context follow it.
2. **Server-authoritative calculations.** The browser previews derived values, while Convex independently recalculates nights, accommodation subtotal, total, currency, and availability conflicts.
3. **Tags instead of cryptic selects.** Enums and relationships use icon-based, keyboard-accessible tag selectors with consistent semantic colors.
4. **Calendar before conflict.** Reservations and availability blocks share a monthly operational calendar, with a mobile agenda fallback and half-open checkout semantics.
5. **Progressive disclosure.** Creation and editing forms are grouped into meaningful sections and stay collapsed until needed.
6. **Search at the point of work.** Long lists support instant client-side search, status filtering, deep links, and `/` keyboard focus.
7. **Mobile parity.** Every primary workflow is usable above the existing safe-area dock without horizontal scrolling or hidden actions.
8. **No destructive surprises.** Archive actions explain their effect and require confirmation; data remains in the audit history.

## Feature plan and implementation

| Feature | Previous friction | Implemented experience | Acceptance criteria |
|---|---|---|---|
| Dashboard | Metrics were passive and actions were several clicks away | Clickable metrics, dated operations overview, quick-create actions, arrivals/departures, priority tasks, property links, and audit trail | Every card leads to its source workflow; mobile stays single-column without overflow |
| Reservations | Property/unit, totals, and currency were manually coordinated | One icon-based accommodation selector, linked guest/source/status tags, automatic checkout guard, guest/capacity feedback, live nights/subtotal/total, server-recalculated currency and totals, payment context | Client cannot submit authoritative subtotal/total/currency; backend derives them from saved facts and inputs |
| Reservation calendar | Booking data existed only as rows | Integrated 42-day month grid on Reservations plus mobile agenda and event deep links | Previous/current/next month navigation works; reservations and blocks are distinguishable |
| Availability calendar | Date filter showed two disconnected lists | Unified month calendar, property filter, responsive agenda, block creation with accommodation selector and duration feedback | Whole-property/unit context is explicit; overlap validation remains in Convex |
| Guests | Contact records were difficult to scan | Contact completeness metrics, instant search, grouped identity/service form, deep links, and direct reservation handoff | Search covers name/email/phone/nationality; private notes remain internal |
| Properties | One dense form mixed public and internal concerns | Grouped identity, location, facts/rate, and content sections; tag status/type/publication; completeness and inherited rate context | Unknown facts can remain empty; public and internal copy stay clearly separated |
| Units | Native selects and unclear rate inheritance | Icon tags for property/type/status, bookable card, capacity/rate grouping, inherited property-rate explanation, searchable inventory | Non-bookable/inactive units do not appear as reservation accommodation choices |
| Amenities | Public/active/featured state was hard to compare | Category tags, three explicit status cards, public/featured pills, search and category filter | Only active + public amenities remain in public projection |
| Finance | Category was free text and linked reservation context was weak | Icon category/kind/method/status tags, reservation link, automatic property/currency, outstanding-balance payment suggestion, ledger search | Completed linked payments update reservation paid/outstanding amounts; void remains excluded from totals |
| Tasks | Flat list obscured work state and relationships | Status board plus editable ledger, icon tags, reservation-derived property/unit/due-date suggestions, search/filter | Board links to full editor; no task is created from sample data |
| Welcome | Editors lacked unsaved protection and realistic preview | Locale jump links, sample guest name, token insertion, dirty-state indicator, unload warning, reset/restore, sticky save/publish controls | Draft and published state remain separate; preview sanitization uses shared renderer |
| Navigation | New records required entering a module first | Desktop and mobile quick-create reservation entry while retaining the existing sidebar and dock | Admin modules remain reachable; public navigation and chatbot are unchanged |

## Calculation contract

For a reservation, the source of truth is:

```text
nightly rate = explicit reservation rate
            ?? selected unit base rate
            ?? selected property base rate

nights = check-out − check-in
accommodation subtotal = nightly rate × nights
reservation total = accommodation subtotal + extra fees − discount
currency = selected property currency
outstanding = reservation total − completed linked payments + completed linked refunds
```

The browser presents this calculation immediately. Convex repeats it inside the mutation and rejects invalid ranges, unavailable inventory, and discounts larger than subtotal plus fees.

## Responsive interaction model

- Desktop calendar: seven-column grid, visible event chips, sticky form summaries.
- Mobile calendar: chronological agenda; no horizontal calendar pan is required.
- Save bars sit above the admin mobile dock and use safe-area padding.
- Custom selectors support mouse, touch, arrow keys, Enter, Space, Escape, and click-outside dismissal.
- All interactive targets remain at least 44px high.

## Verification plan

- Unit tests for month normalization, Monday-aligned 42-day grids, date range math, dynamic reservation calculations, and public/private boundaries.
- Static contract tests for tag selects, calendar integration, search, unsaved welcome protection, and removal of client-authoritative total fields.
- Full TypeScript, ESLint, architecture audits, test suite, and production build.
- Authenticated desktop and mobile browser audits for every admin route, creation flows, custom selects, calendar navigation, no overflow, no undersized targets, no console errors, and no failed requests.
- Deploy Convex first when backend signatures change, then deploy the exact frontend Git revision and run production smoke tests.
