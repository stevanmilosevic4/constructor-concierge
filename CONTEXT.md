# CONTEXT.md — Constructor · Travel & Concierge

Live at **https://concierge.weareconstructor.com** (GitHub Pages, repo
`stevanmilosevic4/constructor-concierge`, auto-deploys on every push to `main`).
React 19 + Vite + Tailwind 3. **No backend yet** — all state is localStorage.

## Purpose

Guidance app for Constructor Group's 2–3-person concierge team serving ~1,000
employees. The one rule everything enforces: **the concierge team curates,
informs and routes — it never approves and never books.** Every request flow
ends in a self-service answer, a pre-filled email to the actual decision-maker
(line manager → T&E Officer → C-level = oz@ cc bojana@ for every entity,
per the Global T&E Policy v1 of 4 Sep 2025), or a routed escalation (HR, Finance, Mobility). Approval gates
(business class, rental car, late booking, weekend nights, 2-weeks/60-days
rules) are encoded from the policy matrix in `src/lib/policy.js`.

Second rule (`src/data/cities.js` header): **nothing invented.** City packs
ship real facts (emergency numbers, transport, history); partner areas
(hotels, transfers, offers, drivers) ship EMPTY until the team signs real
partnerships and fills them in the admin panel.

## User roles (resolved from the People registry, never chosen at login)

| Role       | How they get in                              | What they see |
|------------|----------------------------------------------|---------------|
| `employee` | Work email on an allowed domain              | 8 traveller tabs; level (`Employee`/`VP / Director`/`Managing Director`/`C-level`) sets the travel tier; `isVip(level)` ⇒ Executive badge + exec content |
| `ea`       | Work email; admin sets `assistsEmail` → principal | Principal's agenda, city packs, offers, guest links |
| `admin`    | Access code (SHA-256 hash in `src/lib/auth.js`; code known to Stevan) or email flagged admin | 7 admin tabs |
| guest      | **No login** — shareable `#/guest/:id` link  | One spare page: driver, hotel, agenda, one phone number |

Unknown email on an allowed domain (`constructor.university`, `constructor.org`,
`constructor.academy`, `weareconstructor.com` — editable) auto-registers as a
Standard employee. Entity is derived from the email domain. Production phase
replaces this with Microsoft Entra ID SSO; `auth.js` is the swap point.

## Store schema (localStorage key `constructor-concierge-v2`, `src/lib/store.js`)

All writes go through `update()`; `useStore()` subscribes. Shapes:

- **session** — `{ userId }` | null
- **people** — `{ id, email, name, role: employee|ea|admin, level, entity,
  managerEmail?, assistsEmail? }` · seeded with only the concierge account
- **allowedDomains** — `string[]`
- **cities** — map keyed by name (Bremen, Istanbul, Belgrade, "São Paulo",
  Schaffhausen). Facts: `tag, country, currency, currencyName, emergency,
  police, tz, lat, lon, wikiTitle, language, plugs, water, owner, updatedAt,
  intro, transport[[label,url]], history[], funFacts[]`. Attached from code
  (always win over saved copies): `countryProfile{ geography[], history[],
  culture[] }` (data/countries.js), `places[[name,note]]`, `practical{}` and
  `relocation{}` — researched `{ text, src }[]` per key (data/facts.js,
  203 items, 23 Aug 2026). Partner areas, all empty until signed, keys from
  `PARTNER_SECTIONS` in data/packSections.js: `transfers` (3-tuple),
  `eat, health, wellbeing, coworking, carRental, visaHandler, dutyOfCare,
  servicedApartments, family, relocationAgents, taxAdvisors, offsite,
  suppliers` ([label,note]), `hotels{ name, area, address, addressLocal,
  note, near[[label,cat,minutes,note]] }`, `offers{ name, cat, offer, how,
  code }` (QR from code), `wallet{ hotelLocal, driver, fixedFare, insurance,
  embassyNote }`. Each partner section carries `audience: visit|relocate|both`.
- **requests** — `{ id, userId, userName, type, label, dest, created,
  status: "routed", gates[], routedTo }` · a log, not a work queue
- **trips** — `{ id, userId, city, start, end, hotelIdx, purpose, family }`
- **presenceOptIn** — `{ [userId]: bool }` (who-else-is-in-town consent)
- **meetings** — `{ id, userId(principal), day, time, title, place, brief, by }`
- **receipts** — `{ id, userId, tripId, note, img(dataURL), taken }`
- **guestLinks** — `{ id, guest, host, city, arrive, flight,
  driver{ name, plate, phone }, hotel, contact, agenda[{ time, item }], notes }`
- **groupTrips** — `{ id, name, city, start, end,
  travellers[{ name, flight, room, driver }] }` · exports a WhatsApp brief
- **broadcasts** — `{ id, city, created, text }` (pack updates, 30-day window)
- **broadcastReads** — `{ [userId]: { [broadcastId]: true } }`

## Routes / pages

Hash-routed; `#/guest/:id` bypasses login entirely; `#/pack/:city/:mode`
(mode = visit|relocate, signed-in only) renders the printable A4 pack and
triggers the browser's Save-as-PDF (`src/screens/PackPrint.jsx`;
append `?noprint` to suppress the dialog). Sources are footnoted.

**Traveller** — Home "My trip" (next trip, weather, hotel + nearby, who's in
town, pack updates, exec card) · Request (13 guided types: flight, hotel,
transfer, rentalcar, businessclass, extended, visa, expense, citypack,
vipguest, relocation, offsite, other → gates → who-decides answer +
`mailto:` compose) · City packs (Visiting/Relocating toggle; sub-pages
Pack / Practical / Country & culture / Places to visit; Download PDF) ·
Offers (QR codes, `src/lib/qr.js`, no lib) ·
Agenda · Expenses (receipt capture, 30/90-day clocks) · Wallet (offline,
printable, local-script hotel address) · Tools (per-diem statutory sources,
passport/visa check vs `VISA_MATRIX`, presence opt-in)

**EA** — Principal's agenda (briefs) · City packs · Offers · Guest links

**Admin** — Dashboard · Requests log · Cities & partners editor (registry-
driven: one TupleEditor per partner section, tagged Visiting/Relocating/Both;
"only real partners" rule; researched facts are code-maintained, not editable
here) · Guest links ·
Group trips · Pack updates (broadcasts) · People & access (roles, tiers,
EA links, domains; last-admin lockout guard)

Global: red Help button (concierge emergency line) on all non-admin screens.

## External integrations (all client-side, keyless, cached in localStorage)

- **Open-Meteo** — live weather, 30-min TTL (`src/lib/live.js`)
- **open.er-api.com** — EUR-based FX incl. RSD/TRY/BRL, 12-h TTL
- **Wikipedia REST** — city lead photo, 1-week TTL
- Stale cache served on network failure; screens render sanely offline.
- **BCD Travel**: not integrated. Deep-link/SSO + read-only itinerary data
  (tiers 1–2 of the integration brief) is the planned source for `trips`;
  booking APIs (tier 3) deliberately declined.

## Built vs TODO

**Built:** everything above; brand system per Constructor web palette + ALS
Hauss (fallback Arial — font files not yet in `public/fonts/`); deployed with
HTTPS enforced; policy engine with entity-specific approver emails.

**TODO / known gaps:**
- **No trip-creation UI** — `trips` seeds empty and nothing writes it yet, so
  My trip / Wallet / Expenses show empty states until BCD data or a manual
  form lands. (Highest-impact gap.)
- No backend: data is **per-device** — guest links/partner edits made on one
  machine don't exist elsewhere; admin code is a gate, not security. Backend +
  Entra ID SSO is the production phase.
- Partner areas empty by design — team fills as partnerships sign.
- Receipts as dataURLs will hit the ~5 MB localStorage ceiling.
- `VISA_MATRIX` covers a starter passport×destination set; per-diem tool links
  statutory sources rather than quoting rates (policy-compliant, by intent).
- Researched facts carry a research date (23 Aug 2026) and some items are
  explicitly marked "unverified" (e.g. English-speaking ER staff in Bremen and
  Schaffhausen); they need a quarterly re-check. Prices (SIM packs, fares,
  Istanbul IMEI fee) change yearly.
- Facts are not editable in the admin panel — corrections are code edits in
  data/facts.js (one line, one source). An admin "suggest a correction" flow
  would be the natural next step.
- Rule (23 Aug 2026): anything with a figure that changes — prices, fares,
  fees, thresholds — is never quoted; it is an `L(text, src, liveLabel)` item
  rendered as a prominent link to the live page (42 of 203 facts). Only
  stable facts (addresses, phone numbers, rules, deadlines) are plain `F()`.
- Photos: Wikipedia lead image per article (`useCityImage`; `de:` prefix for
  German-only articles; SVG diagrams and disambiguation pages rejected) on
  country/culture blocks, places to visit, and in the PDF.
- Final approval for ALL entities = oz@constructor.org cc bojana@constructor.org
  (tt@constructor.university removed 23 Aug 2026).
- PDF = browser print; headless generation/emailing of packs needs a backend.
- ALS Hauss woff2 files pending licence; drop into `public/fonts/`.
- Old `-v1` localStorage keys are orphaned (harmless).
