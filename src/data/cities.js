/* =====================================================================
   CITY PACKS — seed data.

   SAMPLE content pending the real vendor network. The structure is the
   contract: one record per vendor, per city, with a named owner and a
   review date — the strategy note's answer to "documents go stale and
   carry implied endorsement". The concierge admin edits this in the app;
   edits persist and new partners/discounts appear for every traveller.
   ===================================================================== */

export const NEAR_CATS = ["Food", "Shop", "Health", "Work", "Move", "Transport", "Service", "Wellbeing"]

export const SEED_CITIES = {
  Bremen: {
    tag: "Campus city",
    country: "Germany",
    currency: "EUR",
    emergency: "112",
    police: "110",
    tz: "Europe/Berlin",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-01",
    intro: "Most inbound travel arrives via Hamburg or Frankfurt rather than Bremen airport. Corporate apartments are the preferred stay.",
    weather: { summary: "Mild and changeable — pack a rain layer in any month", tempNow: "19°", range: "14–22°", advice: "August: light jacket for evenings, rain likely at least one day in three." },
    wallet: {
      hotelLocal: "Constructor Apartments, Campusring 1, 28759 Bremen",
      driver: { name: "Transfer partner dispatch", phone: "+49 421 555 0100" },
      fixedFare: "BRE → campus €28 · HAM → Bremen €180",
      insurance: "Group policy CG-TRV-2026-001 · assist line +44 20 7000 0000",
      embassyNote: "EU citizens: no consular registration needed. Others: nearest consulates are in Hamburg.",
    },
    transfers: [
      ["Hamburg (HAM) → Bremen centre", "€180 fixed", "Pre-book, 60 min free wait"],
      ["Frankfurt (FRA) → Bremen centre", "€480 fixed", "Rail is usually the better call"],
      ["Bremen (BRE) → campus", "€28 fixed", "Meet & greet included"],
    ],
    health: [["English-speaking GP practice", "Priority slots under partnership"], ["Emergency", "112"]],
    family: [["International school", "Admissions contact on file"], ["Kindergarten (bilingual)", "Waiting list typically long — start early"]],
    eat: [["Dinner, hosting guests", "Partner restaurant, city centre"], ["Quick lunch near campus", "Cafeteria or the market square"]],
    wellbeing: [
      ["Gym and pool, Horn-Lehe", "Day pass at the member rate — show the QR"],
      ["Padel court, Überseestadt", "Two courts, book on the partner link, rackets on site"],
      ["Tennis club, Bürgerpark", "Guest hours weekdays 8–16"],
      ["Riverside running path", "Flat 5 km loop from the corporate apartments"],
    ],
    essentials: [["Currency", "EUR"], ["Transport", "BSAG tram — day ticket covers most trips"], ["Tipping", "Round up, 5–10%"]],
    hotels: [
      {
        name: "Corporate apartments, Horn-Lehe",
        area: "10 min to campus",
        address: "Campusring 1, 28759 Bremen",
        addressLocal: "Campusring 1, 28759 Bremen, Deutschland",
        note: "Preferred option under policy. Book through the designated route.",
        near: [
          ["Bakery, breakfast from 06:30", "Food", 3, "Opens early enough for a first flight"],
          ["Supermarket", "Shop", 5, "Closed Sundays — stock up Saturday"],
          ["Pharmacy", "Health", 6, "Night rota posted on the door"],
          ["Riverside running path", "Move", 8, "Flat 5 km loop"],
          ["Gym and pool", "Wellbeing", 10, "Partner rate with the QR"],
        ],
      },
      {
        name: "Partner hotel, Altstadt",
        area: "City centre",
        address: "Am Markt 1, 28195 Bremen",
        addressLocal: "Am Markt 1, 28195 Bremen, Deutschland",
        note: "Corporate rate, breakfast included. Best for guest-facing trips.",
        near: [
          ["Partner restaurant, Schnoor", "Food", 4, "Good for hosting four to eight"],
          ["Coffee, quiet enough for calls", "Work", 2, "Wifi reliable"],
          ["Pharmacy", "Health", 5, "Central, English spoken"],
          ["Tram stop to campus", "Transport", 3, "Roughly every 10 minutes"],
          ["Gift shop", "Shop", 6, "For guest gifts at short notice"],
        ],
      },
    ],
    offers: [
      { name: "Partner hotel Altstadt", cat: "Stay", offer: "18% off the flexible rate, breakfast included", how: "Quote the code when booking or show the QR at check-in", code: "CONSTR-BRE-STAY" },
      { name: "Airport transfer partner", cat: "Transfer", offer: "Fixed HAM–Bremen and BRE–campus rates, 60 min free wait", how: "Book on the partner link — billed monthly to the entity, you pay nothing", code: "CONSTR-BRE-CAR" },
      { name: "City-centre restaurant", cat: "Eat", offer: "10% off group dinners, private room waived above eight people", how: "Mention Constructor when reserving", code: "CONSTR-BRE-EAT" },
      { name: "Gym and pool", cat: "Wellbeing", offer: "Day pass at the member rate", how: "Show the QR at reception", code: "CONSTR-BRE-GYM" },
      { name: "Padel Überseestadt", cat: "Wellbeing", offer: "Court hour at the club-member rate, rackets included", how: "Book on the partner link, show the QR at the desk", code: "CONSTR-BRE-PADEL" },
      { name: "Deutsche Bahn business account", cat: "Transport", offer: "Business rates on HAM/FRA–Bremen rail legs, billed centrally", how: "Register once with the QR, then book normally", code: "CONSTR-BRE-RAIL" },
    ],
  },

  Istanbul: {
    tag: "High volume",
    country: "Türkiye",
    currency: "TRY",
    emergency: "112",
    police: "155",
    tz: "Europe/Istanbul",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-01",
    intro: "Airport fast-track matters more than the car here. Two airports — confirm IST or SAW before booking anything.",
    weather: { summary: "Hot and humid through August", tempNow: "29°", range: "24–31°", advice: "Meetings run on air-conditioning; carry water, expect 90-minute crosstown traffic." },
    wallet: {
      hotelLocal: "Levent Mah., Büyükdere Cad. 100, 34394 Şişli/İstanbul",
      driver: { name: "Partner dispatch (24/7)", phone: "+90 212 555 0134" },
      fixedFare: "IST → Levent €45 · SAW → European side €60",
      insurance: "Group policy CG-TRV-2026-001 · assist line +44 20 7000 0000",
      embassyNote: "Keep your passport with you — hotels register guests with it. Consulates are on the European side.",
    },
    transfers: [
      ["IST → Levent / Maslak", "€45 fixed", "Meet & greet inside arrivals"],
      ["IST → Sultanahmet", "€55 fixed", "Allow 90 min in traffic"],
      ["SAW → European side", "€60 fixed", "Confirm the airport first"],
    ],
    health: [["International hospital", "English-speaking, direct billing"], ["Emergency", "112"]],
    family: [["International schools", "Several options, listed by district"], ["Paediatric clinic", "Partner rate"]],
    eat: [["Client dinner", "Bosphorus-side partner restaurant"], ["Team lunch", "Local partner, near the office"]],
    wellbeing: [
      ["Hotel spa & hammam, Levent", "Partner rate on the traditional hammam — book a day ahead"],
      ["Gym, Kanyon", "Day pass under the corporate agreement"],
      ["Tennis, ENKA Sadi Gülçelik", "Guest booking via the partner contact"],
      ["Bosphorus morning run", "Bebek–Emirgan shore path, flat, shaded after 07:00"],
    ],
    essentials: [["Currency", "TRY"], ["Fast-track", "Airport meet-and-assist — worth it for guests"], ["Transport", "Istanbulkart for metro and ferry"]],
    hotels: [
      {
        name: "Partner hotel, Levent",
        area: "Business district",
        address: "Büyükdere Cad. 100, Levent, Şişli",
        addressLocal: "Levent Mah., Büyükdere Cad. No:100, 34394 Şişli/İstanbul",
        note: "Corporate rate, walking distance to most meetings.",
        near: [
          ["Partner restaurant, meze", "Food", 6, "Reliable for client dinners"],
          ["Shopping centre", "Shop", 4, "Pharmacy and mobile top-ups inside"],
          ["Coffee, laptop-friendly", "Work", 2, "Quiet before 10:00"],
          ["Metro station", "Transport", 5, "Direct to the old city"],
          ["Pharmacy", "Health", 3, "24h rota nearby"],
          ["Hotel spa & hammam", "Wellbeing", 0, "In the building — partner rate"],
        ],
      },
      {
        name: "Serviced apartments, Şişli",
        area: "Mid-town",
        address: "Halaskargazi Cad., Şişli",
        addressLocal: "Halaskargazi Cad., 34371 Şişli/İstanbul",
        note: "Better value beyond ten nights. Kitchen and laundry in the unit.",
        near: [
          ["Grocery", "Shop", 3, "Open late"],
          ["Local canteen", "Food", 5, "Fast, inexpensive lunch"],
          ["Laundry", "Service", 4, "Same-day if dropped before 10:00"],
          ["Park loop", "Move", 7, "Shaded, decent for a morning run"],
        ],
      },
    ],
    offers: [
      { name: "Airport fast-track", cat: "Airport", offer: "Meet-and-assist through immigration at the corporate rate", how: "Book 24h ahead through the partner link", code: "CONSTR-IST-FAST" },
      { name: "Transfer partner", cat: "Transfer", offer: "Fixed €45 IST–Levent, child seats free", how: "Partner app under the company account — no payment at the car", code: "CONSTR-IST-CAR" },
      { name: "Partner hotel Levent", cat: "Stay", offer: "Corporate rate, late checkout to 16:00 subject to availability", how: "Quote the code when booking", code: "CONSTR-IST-STAY" },
      { name: "International hospital", cat: "Health", offer: "Priority appointments, direct billing to insurance", how: "Show the QR at the international desk", code: "CONSTR-IST-MED" },
      { name: "Bosphorus restaurant", cat: "Eat", offer: "Set menu at a fixed price for groups of six or more", how: "Reserve by phone and mention Constructor", code: "CONSTR-IST-EAT" },
      { name: "Hammam & spa, Levent", cat: "Wellbeing", offer: "Partner rate on the hammam ritual", how: "Show the QR when booking", code: "CONSTR-IST-SPA" },
    ],
  },

  Belgrade: {
    tag: "Regional hub",
    country: "Serbia",
    currency: "RSD",
    emergency: "194 / 112",
    police: "192",
    tz: "Europe/Belgrade",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-01",
    intro: "Compact centre, short transfers. Receipts: scans are accepted in Serbia.",
    weather: { summary: "Hot continental summer", tempNow: "31°", range: "22–34°", advice: "August afternoons are hot — schedule walking meetings before noon." },
    wallet: {
      hotelLocal: "Хотел партнер, Његошева 10, 11000 Београд",
      driver: { name: "Partner dispatch", phone: "+381 11 555 0170" },
      fixedFare: "BEG → centre €25 · Belgrade → Novi Sad €90",
      insurance: "Group policy CG-TRV-2026-001 · assist line +44 20 7000 0000",
      embassyNote: "Scans of receipts are accepted in Serbia — photograph everything anyway.",
    },
    transfers: [["BEG → city centre", "€25 fixed", "45 min free wait"], ["Belgrade → Novi Sad", "€90 fixed", "Frequent corridor"]],
    health: [["Private clinic", "Same-day appointments under partnership"], ["Emergency", "194 / 112"]],
    family: [["International school", "Admissions contact on file"], ["Kindergarten", "English-language options in the centre"]],
    eat: [["Hosting", "Partner restaurant, Skadarlija"], ["Everyday", "Bakery and café list in the pack"]],
    wellbeing: [
      ["Padel centre, Ada Ciganlija", "Partner rate weekday mornings"],
      ["Gym, Vračar", "Day pass with the QR"],
      ["Ada lake loop", "8 km flat circuit, shaded stretches"],
      ["Spa, Stari Grad", "Partner rate on massages, book same-day"],
    ],
    essentials: [["Currency", "RSD"], ["Receipts", "Scans accepted — no hard copies needed"], ["Transport", "Taxi apps are reliable"]],
    hotels: [
      {
        name: "Partner hotel, Vračar",
        area: "Central, quiet",
        address: "Njegoševa 10, Belgrade",
        addressLocal: "Његошева 10, 11000 Београд, Србија",
        note: "Corporate rate. Walkable to most of the centre.",
        near: [
          ["Partner restaurant", "Food", 5, "Traditional, good for hosting"],
          ["Bakery", "Food", 2, "Open from 06:00"],
          ["Pharmacy", "Health", 4, "24h branch two streets over"],
          ["Coworking", "Work", 6, "Day passes available"],
          ["Gym", "Wellbeing", 5, "Partner day pass"],
        ],
      },
      {
        name: "Serviced apartments, Dorćol",
        area: "Old town edge",
        address: "Cara Dušana 25, Belgrade",
        addressLocal: "Цара Душана 25, 11000 Београд, Србија",
        note: "For longer stays. Near the river.",
        near: [
          ["Green market", "Shop", 4, "Mornings only"],
          ["Café row", "Work", 3, "Wifi varies — ask before settling in"],
          ["Riverside path", "Move", 6, "Long flat run"],
          ["Grocery", "Shop", 2, "Open Sundays"],
        ],
      },
    ],
    offers: [
      { name: "Partner hotel Vračar", cat: "Stay", offer: "15% off the flexible rate", how: "Quote the code when booking", code: "CONSTR-BEG-STAY" },
      { name: "Transfer partner", cat: "Transfer", offer: "€25 fixed airport run, monthly invoicing", how: "Partner link under the company account", code: "CONSTR-BEG-CAR" },
      { name: "Private clinic", cat: "Health", offer: "Same-day appointments, English-speaking", how: "Show the QR at reception", code: "CONSTR-BEG-MED" },
      { name: "Skadarlija restaurant", cat: "Eat", offer: "Group menu at a fixed price, welcome drink included", how: "Reserve and mention Constructor", code: "CONSTR-BEG-EAT" },
      { name: "Padel Ada Ciganlija", cat: "Wellbeing", offer: "Court hour at the partner rate, weekday mornings", how: "Show the QR at the desk", code: "CONSTR-BEG-PADEL" },
    ],
  },

  "São Paulo": {
    tag: "EBAC",
    country: "Brazil",
    currency: "BRL",
    emergency: "192",
    police: "190",
    tz: "America/Sao_Paulo",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-01",
    intro: "Security-vetted drivers only. Confirm whether armoured transport is expected for guest-level travel.",
    weather: { summary: "Southern-hemisphere winter — mild, occasionally wet", tempNow: "22°", range: "13–24°", advice: "August is dry season but evenings cool quickly. A jacket, not a coat." },
    wallet: {
      hotelLocal: "R. Joaquim Floriano 100, Itaim Bibi, São Paulo – SP, 04534-000",
      driver: { name: "Vetted driver desk", phone: "+55 11 5555 0190" },
      fixedFare: "GRU → Itaim Bibi R$390 · CGH → Pinheiros R$180",
      insurance: "Group policy CG-TRV-2026-001 · assist line +44 20 7000 0000",
      embassyNote: "Pre-booked cars only — no street hails. Keep this screen available offline.",
    },
    transfers: [["GRU → Itaim Bibi", "R$390 fixed", "Vetted driver, tracked"], ["CGH → Pinheiros", "R$180 fixed", "Domestic arrivals"]],
    health: [["International hospital", "English-speaking, direct billing"], ["Emergency", "192"]],
    family: [["International schools", "Listed by district"], ["Paediatric care", "Partner clinic"]],
    eat: [["Hosting", "Partner restaurant, Jardins"], ["Everyday", "Office-adjacent list"]],
    wellbeing: [
      ["Gym, Itaim Bibi", "Partner day pass, towel included"],
      ["Ibirapuera Park", "Morning running, busy by 08:00 — go early"],
      ["Tennis academy, Moema", "Guest hours via the partner contact"],
    ],
    essentials: [["Currency", "BRL"], ["Safety", "Pre-booked cars only — no street hails"], ["Visa", "Check requirements by passport"]],
    hotels: [
      {
        name: "Partner hotel, Itaim Bibi",
        area: "Near the office",
        address: "R. Joaquim Floriano 100, Itaim Bibi",
        addressLocal: "R. Joaquim Floriano 100, Itaim Bibi, São Paulo – SP, 04534-000",
        note: "Corporate rate. Comfortable for walking during the day.",
        near: [
          ["Partner restaurant", "Food", 5, "Good for client dinners"],
          ["Pharmacy", "Health", 3, "Chain, open 24h"],
          ["Coffee", "Work", 2, "Wifi reliable"],
          ["Grocery", "Shop", 6, "Card accepted everywhere"],
          ["Gym", "Wellbeing", 4, "Partner day pass"],
        ],
      },
      {
        name: "Serviced apartments, Jardins",
        area: "Central",
        address: "Alameda Santos 800, Jardins",
        addressLocal: "Alameda Santos 800, Jardim Paulista, São Paulo – SP",
        note: "For stays beyond two weeks.",
        near: [
          ["Restaurant row", "Food", 4, "Wide range — book Fridays ahead"],
          ["Park", "Move", 9, "Morning running, busy by 08:00"],
          ["Laundry", "Service", 3, "Two-day turnaround"],
          ["Pharmacy", "Health", 4, "Delivers to the building"],
        ],
      },
    ],
    offers: [
      { name: "Partner hotel Itaim Bibi", cat: "Stay", offer: "Corporate rate including breakfast and airport pickup", how: "Book through the partner link", code: "CONSTR-SAO-STAY" },
      { name: "Vetted driver service", cat: "Transfer", offer: "Fixed GRU and CGH rates, tracked vehicles", how: "Book 12h ahead through the concierge link", code: "CONSTR-SAO-CAR" },
      { name: "International hospital", cat: "Health", offer: "English-speaking desk, direct billing", how: "Show the QR at the international desk", code: "CONSTR-SAO-MED" },
    ],
  },

  Schaffhausen: {
    tag: "Corporate apartments",
    country: "Switzerland",
    currency: "CHF",
    emergency: "144 / 112",
    police: "117",
    tz: "Europe/Zurich",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-01",
    intro: "Corporate apartments are the preferred accommodation. Swiss per-diem rates are set by cantonal approval.",
    weather: { summary: "Pleasant late summer", tempNow: "23°", range: "14–26°", advice: "Rhine-side evenings cool fast. Trains run on time; you should too." },
    wallet: {
      hotelLocal: "Corporate Apartments, Vordergasse 20, 8200 Schaffhausen",
      driver: { name: "Partner dispatch", phone: "+41 52 555 0120" },
      fixedFare: "ZRH → Schaffhausen CHF 140 · station → office CHF 20",
      insurance: "Group policy CG-TRV-2026-001 · assist line +44 20 7000 0000",
      embassyNote: "Per diems follow the cantonal ruling, not the global figure.",
    },
    transfers: [["Zurich (ZRH) → Schaffhausen", "CHF 140 fixed", "Train is often faster"], ["Station → office", "CHF 20 fixed", "Short hop"]],
    health: [["Local practice", "English-speaking"], ["Emergency", "144 / 112"]],
    family: [["International school (Zurich area)", "Commute is significant"], ["Childcare", "Limited — book far ahead"]],
    eat: [["Hosting", "Old town partner restaurant"], ["Everyday", "Canteen and café list"]],
    wellbeing: [
      ["Rhine path", "Flat riverside route from the apartments"],
      ["Municipal pool, Rhybadi", "Historic river bath — summer only"],
      ["Gym, old town", "Partner day pass"],
    ],
    essentials: [["Currency", "CHF"], ["Per diems", "Cantonal rates apply, not the global figure"], ["Transport", "Rail — half-fare card pays back quickly"]],
    hotels: [
      {
        name: "Corporate apartments",
        area: "Walking distance to the office",
        address: "Vordergasse 20, 8200 Schaffhausen",
        addressLocal: "Vordergasse 20, 8200 Schaffhausen, Schweiz",
        note: "Preferred option under policy. Book through the designated route.",
        near: [
          ["Bakery", "Food", 3, "Closes early on Saturdays"],
          ["Supermarket", "Shop", 4, "Closed Sundays"],
          ["Pharmacy", "Health", 5, "Limited weekend hours"],
          ["Rhine path", "Move", 7, "Flat riverside route"],
        ],
      },
      {
        name: "Partner hotel, old town",
        area: "Centre",
        address: "Herrenacker 7, 8200 Schaffhausen",
        addressLocal: "Herrenacker 7, 8200 Schaffhausen, Schweiz",
        note: "Fallback when the apartments are full.",
        near: [
          ["Partner restaurant", "Food", 3, "Book ahead midweek"],
          ["Train station", "Transport", 6, "Direct to Zurich"],
          ["Coffee", "Work", 2, "Quiet mornings"],
        ],
      },
    ],
    offers: [
      { name: "Partner hotel old town", cat: "Stay", offer: "Corporate rate, breakfast included", how: "Quote the code when booking", code: "CONSTR-SHA-STAY" },
      { name: "Rail business account", cat: "Transport", offer: "Business travel rates, billed centrally", how: "Register once with the QR, then book normally", code: "CONSTR-SHA-RAIL" },
      { name: "Old town restaurant", cat: "Eat", offer: "10% off dinner for groups of four or more", how: "Mention Constructor when reserving", code: "CONSTR-SHA-EAT" },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Visa matrix — SAMPLE corridors. The concierge team maintains the   */
/*  table; the vetted handler does the work; Mobility owns the case.   */
/*  Passport validity: warn inside 6 months of expiry, always.         */
/* ------------------------------------------------------------------ */

export const VISA_MATRIX = [
  { passport: "EU member state", dest: "Germany",     need: "none",   note: "Freedom of movement. ID card is enough." },
  { passport: "EU member state", dest: "Switzerland", need: "none",   note: "No visa. Register if staying beyond 90 days." },
  { passport: "EU member state", dest: "Türkiye",     need: "none",   note: "Visa-free up to 90 days in any 180. Passport valid 150+ days on entry." },
  { passport: "EU member state", dest: "Serbia",      need: "none",   note: "Visa-free up to 90 days." },
  { passport: "EU member state", dest: "Brazil",      need: "none",   note: "Visa-free up to 90 days. Passport valid 6 months." },
  { passport: "EU member state", dest: "Singapore",   need: "none",   note: "Visa-free up to 90 days. Passport valid 6 months." },
  { passport: "Serbia",          dest: "Germany",     need: "none",   note: "Visa-free up to 90 days in any 180 (biometric passport)." },
  { passport: "Serbia",          dest: "Türkiye",     need: "none",   note: "Visa-free up to 90 days." },
  { passport: "Serbia",          dest: "Brazil",      need: "none",   note: "Visa-free up to 90 days." },
  { passport: "Türkiye",         dest: "Germany",     need: "visa",   note: "Schengen visa required. Vetted handler: 3–4 weeks typical. Invitation letter template available." },
  { passport: "Türkiye",         dest: "Serbia",      need: "none",   note: "Visa-free up to 90 days." },
  { passport: "India",           dest: "Germany",     need: "visa",   note: "Schengen visa. Handler needs 4+ weeks. Invitation letter from the entity required." },
  { passport: "India",           dest: "Türkiye",     need: "evisa",  note: "e-Visa online if holding a valid Schengen/US/UK visa; otherwise sticker visa via the handler." },
  { passport: "China",           dest: "Germany",     need: "visa",   note: "Schengen visa. Handler needs 4+ weeks." },
  { passport: "United States",   dest: "Germany",     need: "none",   note: "Visa-free up to 90 days in any 180." },
  { passport: "United States",   dest: "Türkiye",     need: "evisa",  note: "e-Visa online, minutes to obtain. Passport valid 150+ days." },
  { passport: "United States",   dest: "Brazil",      need: "evisa",  note: "e-Visa required since 2025. Apply 2+ weeks ahead." },
  { passport: "United Kingdom",  dest: "Germany",     need: "none",   note: "Visa-free up to 90 days in any 180. Passport stamped — watch the running total." },
  { passport: "Nigeria",         dest: "Germany",     need: "visa",   note: "Schengen visa. Handler needs 6+ weeks — start immediately." },
  { passport: "Russia",          dest: "Germany",     need: "visa",   note: "Schengen visa. Processing is slow and variable — talk to Mobility before promising dates." },
]

export const PASSPORTS = [...new Set(VISA_MATRIX.map((v) => v.passport))]
export const VISA_DESTS = [...new Set(VISA_MATRIX.map((v) => v.dest))]
