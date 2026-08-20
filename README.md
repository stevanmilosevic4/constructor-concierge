# Constructor · Travel & Concierge

Prototype for **concierge.weareconstructor.com** — the concierge team's app for
Constructor Group travel. React + Vite + Tailwind, no backend yet (state persists
in localStorage).

## The one rule the whole app enforces

> The concierge team **curates, informs and routes. It never approves and never books.**

Every request flow ends in one of three ways: a clear self-service answer, a
named decision-owner (line manager, C-level, HR, Finance, Mobility), or a route
to a partner — with the request email already written. No branch anywhere returns
"the concierge team will arrange it".

## Sources of truth

| File | Derived from |
|---|---|
| `src/lib/policy.js` | Global T&E Policy v1 (4 Sep 2025) via the Matrix quick reference + process map |
| `src/data/cities.js` | City-pack structure from the strategy note (§1–2); **content is sample data** |
| `src/brand.js`, `tailwind.config.js` | Brand Identity Style Guide — *alternative web colors* (WCAG-required on web) + ALS Hauss type ramp |

## Sign-in — two doors, no role choice at the door

- **Work email** — anyone on an allowed domain signs in as a Standard traveller. Tier
  (Standard/Executive), entity, and EA delegation resolve from the **People registry** the
  concierge team maintains in the admin panel — never from a choice at the login screen.
  Unknown addresses on an allowed domain are auto-registered and appear in the registry.
- **Concierge team access code** — opens the admin panel. Only the code's SHA-256 hash
  ships in the bundle; on a static site this is an access gate, not security — SSO
  (Microsoft Entra ID) replaces it in the backend phase, and the registry maps onto
  directory groups.
- **Guests never sign in** — each gets a no-login page: driver + plate, hotel, programme,
  one number (`#/guest/<id>`).

## Roles

- **Traveller (Standard or Executive tier)** — request guidance, city packs, offers + QR codes, expenses with receipt capture and the 30/90-day clocks, offline travel wallet, per-diem & visa tools, who's-in-town (opt-in); executives also get EA delegation, guest links, fast-track/protocol notes
- **Executive assistant** — edits the principal's agenda and briefs; creates guest links
- **Concierge team (admin)** — People & access registry, cities & partners editor (add a discount → every traveller sees it immediately), request log (visibility, not a queue), guest links, group trips with WhatsApp-brief export, pack-update broadcasts (reach everyone travelling there in the next 30 days)

## Fonts

ALS Hauss is licensed and not committed. Drop the woff2 files into `public/fonts/`
(`ALSHauss-Regular/Medium/Bold/Black.woff2`) and the `@font-face` rules in
`src/index.css` pick them up. Until then the app falls back to Arial, per the
video styleguide's rule for systems without the corporate font.

## BCD Travel

Per the integration brief: **let BCD own booking; own the layer around it.**
- Tier 1 (now): the app deep-links to TripSource as the booking channel and holds
  the content BCD's integrations area would surface.
- Tier 2 (next): `src/lib/store.js` is the seam — trips are seeded manually today
  and would be fed by the BCD itinerary/invoice APIs, which is what makes packs,
  wallets and the expense clock trigger automatically.
- Tier 3 (booking API): declined by design; the app never books.

## Run

```bash
npm install
npm run dev
```

## Production notes (not built yet)

Real SSO, a real database, push notifications, and the BCD data feed. GDPR
positions flagged in-app (guest preference records, family data) need settling
before real data enters the system.
