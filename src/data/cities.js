/* =====================================================================
   CITY PACKS — factual layer + designated partner areas.

   RULE OF THIS FILE: nothing invented. Two kinds of content live here:

   1. FACTS — currency, emergency numbers, language, plugs, official
      transport operators, geography, history. Public, verifiable, real.
   2. PARTNER AREAS — hotels, transfers, restaurants, shops, offers,
      drivers, insurance. These ship EMPTY. The concierge team populates
      them in the admin panel as real partnerships are signed, and they
      appear for every traveller instantly. No fake names, no fake
      prices, no fake codes — an empty designated slot is honest;
      a plausible invention is not.

   Weather, exchange rates and the city photo are LIVE (src/lib/live.js),
   not stored here.
   ===================================================================== */

import { emptyPartnerAreas } from "./packSections.js"
import { COUNTRIES, PLACES } from "./countries.js"
import { CITY_FACTS } from "./facts.js"

export const NEAR_CATS = ["Food", "Shop", "Health", "Work", "Move", "Transport", "Service", "Wellbeing"]

/* Partner slots (all empty until signed) come from the section registry,
   so the pack, the editor and the PDF agree on what exists. */
export const SEED_CITIES = {
  Bremen: {
    ...emptyPartnerAreas(),
    tag: "Campus city",
    country: "Germany",
    currency: "EUR",
    currencyName: "Euro",
    emergency: "112",
    police: "110",
    tz: "Europe/Berlin",
    lat: 53.076, lon: 8.807,
    wikiTitle: "Bremen",
    language: "German — English widely understood",
    plugs: "Type F (Schuko) · 230 V",
    water: "Tap water is safe to drink",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-20",
    intro: "Home of Constructor University's campus. Bremen airport (BRE) is small — many international connections route via Hamburg (HAM) or Frankfurt (FRA). Under the travel policy, corporate apartments in Bremen are the preferred stay.",
    transport: [
      ["BSAG — trams & buses", "https://www.bsag.de"],
      ["Deutsche Bahn — rail to HAM/FRA", "https://www.bahn.de"],
      ["Bremen Airport (BRE)", "https://www.bremen-airport.com"],
    ],
    history: [
      "Bremen has been a trading city for over 1,200 years and was a leading member of the medieval Hanseatic League, the northern-European merchant alliance that made its riverside markets rich. That heritage is still visible on the market square: the ornate Town Hall and the Roland statue (erected 1404) have been UNESCO World Heritage sites since 2004.",
      "Together with Bremerhaven, the city forms the Free Hanseatic City of Bremen — the smallest of Germany's sixteen federal states, with a fierce independent streak to match. The Schnoor quarter, a maze of 15th- and 16th-century lanes near the river, is the oldest surviving neighbourhood.",
      "Modern Bremen is a science and aerospace city: satellites, rocket upper stages and the European modules of the International Space Station were built here, and the universities — including Constructor University in the north of the city — anchor one of Germany's densest research landscapes.",
    ],
    funFacts: [
      "The Town Musicians of Bremen — donkey, dog, cat and rooster — never actually reach Bremen in the Grimm tale. Rub the donkey's front legs on the statue by the Town Hall for luck.",
      "The Roland statue has stood on the market square since 1404 — legend says Bremen stays free as long as he stands.",
      "Bremen is Germany's smallest federal state but has its own parliament, anthem and a football club (Werder) with over a century of history.",
      "Beck's beer has been brewed in Bremen since 1873 and is exported to more than 100 countries.",
    ],
    essentials: [
      ["Currency", "Euro (EUR)"],
      ["Getting around", "BSAG trams and buses — a day ticket covers most trips"],
      ["Tipping", "Round up or 5–10% — never obligatory"],
      ["Shops", "Closed on Sundays — plan Saturday"],
    ],
  },

  Istanbul: {
    ...emptyPartnerAreas(),
    tag: "High volume",
    country: "Türkiye",
    currency: "TRY",
    currencyName: "Turkish lira",
    emergency: "112",
    police: "155",
    tz: "Europe/Istanbul",
    lat: 41.008, lon: 28.978,
    wikiTitle: "Istanbul",
    language: "Turkish — English common in business districts",
    plugs: "Type F · 230 V",
    water: "Drink bottled water — tap is used for washing",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-20",
    intro: "Two airports — confirm IST (European side) or SAW (Asian side) before booking anything. Crosstown traffic is measured in hours, not kilometres: plan meetings by district.",
    transport: [
      ["Istanbulkart — metro, tram, ferry", "https://www.istanbulkart.istanbul"],
      ["Metro İstanbul — network map", "https://www.metro.istanbul"],
      ["Istanbul Airport (IST)", "https://www.istairport.com"],
      ["Sabiha Gökçen (SAW)", "https://www.sabihagokcen.aero"],
    ],
    history: [
      "Founded as Byzantium around 660 BC, renamed Constantinople in 330 AD when it became the capital of the Roman Empire, and finally Istanbul — this is the only major city in the world that sits on two continents, and it served as an imperial capital for almost 1,600 years under the Romans, Byzantines and Ottomans.",
      "Hagia Sophia, completed in 537 AD, was the largest cathedral on earth for nearly a thousand years before becoming a mosque; the Grand Bazaar, begun in 1455, remains one of the largest and oldest covered markets anywhere, with thousands of shops on its covered streets.",
      "The Bosphorus strait through the city's heart links the Black Sea to the Mediterranean and has decided empires' fates for millennia. Today's Istanbul, home to more than 15 million people, is Türkiye's commercial engine — banks and business in Levent and Maslak, history on the peninsula, and ferries stitching the two continents together.",
    ],
    funFacts: [
      "Istanbul's Tünel funicular opened in 1875 — the second-oldest underground railway in the world after London's.",
      "Tulips are named into European history from Ottoman gardens — the Netherlands' famous flowers began as Istanbul exports.",
      "Agatha Christie is said to have written Murder on the Orient Express at the Pera Palace Hotel, room 411.",
      "The Grand Bazaar draws hundreds of thousands of visitors a day — arguably the world's oldest shopping mall, trading since 1455.",
    ],
    essentials: [
      ["Currency", "Turkish lira (TRY)"],
      ["Getting around", "Istanbulkart works on metro, tram, funicular and ferry"],
      ["Traffic", "Allow 90+ minutes for crosstown journeys at peak"],
      ["Airports", "Always confirm IST vs SAW — they are 80 km apart"],
    ],
  },

  Belgrade: {
    ...emptyPartnerAreas(),
    tag: "Regional hub",
    country: "Serbia",
    currency: "RSD",
    currencyName: "Serbian dinar",
    emergency: "194 (ambulance) · 112",
    police: "192",
    tz: "Europe/Belgrade",
    lat: 44.816, lon: 20.460,
    wikiTitle: "Belgrade",
    language: "Serbian (Cyrillic and Latin scripts) — English widespread",
    plugs: "Type F · 230 V",
    water: "Tap water is safe to drink",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-20",
    intro: "Compact centre at the meeting of two great rivers, short transfers from the airport. Receipts: scans are accepted in Serbia under the expense policy — no hard copies needed.",
    transport: [
      ["GSP Beograd — public transport", "https://www.gsp.rs"],
      ["Belgrade Nikola Tesla Airport (BEG)", "https://beg.aero"],
      ["Srbija Voz — rail (incl. Novi Sad fast line)", "https://www.srbijavoz.rs"],
    ],
    history: [
      "Belgrade — Beograd, 'the white city' — guards the confluence of the Sava and the Danube, a position so strategic that the city has been fought over and rebuilt dozens of times in its long history. Some of Europe's earliest settled cultures, including the Vinča civilisation, flourished on this stretch of the Danube more than 7,000 years ago.",
      "The Kalemegdan fortress above the river junction carries layers of Celtic, Roman, Byzantine, Ottoman and Austrian construction — a stone diary of everyone who wanted the crossing. Below it, the bohemian lane of Skadarlija preserved the café-and-poets culture of the 1900s.",
      "Modern Belgrade is the Balkans' largest city and Serbia's political, commercial and cultural centre — famous for an unmatched café culture, river-barge nightlife on the Sava, and the Nikola Tesla Museum, which safeguards the inventor's archive and his ashes.",
    ],
    funFacts: [
      "Belgrade is among the oldest continuously inhabited cities in Europe — settled for over 7,000 years.",
      "The city has been destroyed and rebuilt around forty times — its coat of arms shows a fortress on the rivers for a reason.",
      "The Nikola Tesla Museum holds the scientist's complete personal archive — and his ashes, in a gilded sphere.",
      "Skadarlija, the cobbled bohemian street, has functioned as the city's artists' quarter for more than a century — Belgrade's answer to Montmartre.",
    ],
    essentials: [
      ["Currency", "Serbian dinar (RSD) — cards widely accepted, keep small cash for kafanas"],
      ["Getting around", "The centre is walkable; ride-hailing apps are reliable"],
      ["Receipts", "Scans accepted under the expense policy — no hard copies needed"],
      ["Language", "Street signs appear in both Cyrillic and Latin scripts"],
    ],
  },

  "São Paulo": {
    ...emptyPartnerAreas(),
    tag: "EBAC",
    country: "Brazil",
    currency: "BRL",
    currencyName: "Brazilian real",
    emergency: "192 (ambulance) · 193 (fire)",
    police: "190",
    tz: "America/Sao_Paulo",
    lat: -23.550, lon: -46.633,
    wikiTitle: "São Paulo",
    language: "Portuguese — English limited outside business settings",
    plugs: "Type N · 127/220 V (check the socket — both voltages exist)",
    water: "Drink bottled or filtered water",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-20",
    intro: "The largest city in the Americas' southern hemisphere. Two airports: GRU (international) and CGH (domestic, close to the centre). Use pre-arranged transport rather than street hails.",
    transport: [
      ["Metrô de São Paulo", "https://www.metro.sp.gov.br"],
      ["SPTrans — buses", "https://www.sptrans.com.br"],
      ["Guarulhos Airport (GRU)", "https://www.gru.com.br"],
      ["Congonhas Airport (CGH)", "https://www.aena.com.br"],
    ],
    history: [
      "São Paulo was founded in 1554 by Jesuit missionaries on a plateau above the coast, and stayed a modest town for three centuries — until the 19th-century coffee boom turned it into the powerhouse of Brazil. Railways, banks and wave after wave of immigration followed the coffee money.",
      "That immigration made the city one of the most diverse on earth: the largest Japanese community outside Japan centres on the Liberdade district, and Italian, Portuguese, Lebanese, German and many other communities shaped its food and neighbourhoods.",
      "Today greater São Paulo is home to over 20 million people and produces a significant share of Brazil's GDP. Avenida Paulista is the symbolic spine — banks and cultural centres over a buried valley — and MASP's floating concrete gallery is the city's architectural signature.",
    ],
    funFacts: [
      "São Paulo's helicopter fleet is one of the largest of any city in the world — rooftop helipads dot the skyline.",
      "Liberdade hosts the largest Japanese community outside Japan — its street lamps are torii-inspired.",
      "Paulistanos are said to eat around a million pizzas a day — a legacy of massive Italian immigration.",
      "The city sits ~800 m above sea level, which keeps it milder than its latitude suggests — locals call the drizzle 'garoa'.",
    ],
    essentials: [
      ["Currency", "Brazilian real (BRL) — cards accepted almost everywhere"],
      ["Getting around", "Metro is clean and fast; use pre-arranged cars otherwise"],
      ["Safety", "Pre-booked transport only — no street hails"],
      ["Seasons", "Southern hemisphere — August is mild dry-season winter"],
    ],
  },

  Schaffhausen: {
    ...emptyPartnerAreas(),
    tag: "Corporate apartments",
    country: "Switzerland",
    currency: "CHF",
    currencyName: "Swiss franc",
    emergency: "144 (ambulance) · 112",
    police: "117",
    tz: "Europe/Zurich",
    lat: 47.696, lon: 8.635,
    wikiTitle: "Schaffhausen",
    language: "German — English common",
    plugs: "Type J · 230 V (Swiss three-pin — EU plugs need an adapter)",
    water: "Tap water is excellent",
    owner: "Concierge team · review quarterly",
    updatedAt: "2026-08-20",
    intro: "Reached fastest by rail from Zurich airport (ZRH) — the train usually beats a car. Under the travel policy, corporate apartments in Schaffhausen are the preferred stay. Swiss per-diem treatment follows the cantonal ruling.",
    transport: [
      ["SBB — rail from ZRH and Zurich", "https://www.sbb.ch"],
      ["VBSH — city buses", "https://www.vbsh.ch"],
      ["Zurich Airport (ZRH)", "https://www.zurich-airport.com"],
    ],
    history: [
      "Schaffhausen grew up in the Middle Ages exactly where the Rhine stops being navigable: at the Rhine Falls, Europe's most powerful waterfall, every cargo had to leave the river and cross land — and the town that handled the portage prospered on it.",
      "The Munot, the circular 16th-century fortress above the old town, was built to a concept sketched by Albrecht Dürer and is still climbed today for its view; a warden actually lives in the tower and rings the Munot bell by hand every evening at nine.",
      "The old town below is one of Switzerland's best preserved, famous for painted facades and ornate bay windows (Erker). Since 1868 the city has also been home to IWC, one of the great Swiss watchmakers — precision industry beside a medieval core, which is Schaffhausen in one sentence.",
    ],
    funFacts: [
      "The Rhine Falls near the city are Europe's most powerful waterfall — about 600,000 litres per second in summer.",
      "Deer really do live in the Munot fortress moat — the herd has been kept there since 1905.",
      "Schaffhausen canton lies almost entirely north of the Rhine — surrounded by Germany on three sides.",
      "IWC has made watches in Schaffhausen since 1868 — founded, unusually, by an American engineer.",
    ],
    essentials: [
      ["Currency", "Swiss franc (CHF) — euros sometimes accepted, change given in francs"],
      ["Getting around", "Rail first — the SBB Half Fare Card pays for itself quickly"],
      ["Per diems", "Cantonal rates apply, not the global figure"],
      ["Shops", "Close early Saturday, closed Sunday"],
    ],
  },
}

/* Attach the read-on-the-plane layer and the researched facts. Facts live
   in their own files so a correction is one edit with one source. */
for (const [name, city] of Object.entries(SEED_CITIES)) {
  city.countryProfile = COUNTRIES[city.country] || null
  city.places = PLACES[name] || []
  city.practical = CITY_FACTS[name]?.practical || {}
  city.relocation = CITY_FACTS[name]?.relocation || {}
}

/* Currencies shown in every city's rate card, per the brief:
   local ↔ EUR, USD, CHF, TRY. */
export const RATE_CURRENCIES = ["EUR", "USD", "CHF", "TRY"]

/* ------------------------------------------------------------------ */
/*  Visa matrix — FACTUAL entry requirements by passport/destination.  */
/*  Maintained by the concierge team; Mobility (le@constructor.org)    */
/*  owns the immigration question itself. Rules change — verify with   */
/*  Mobility before relying on a row.                                  */
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
  { passport: "Türkiye",         dest: "Germany",     need: "visa",   note: "Schengen visa required — start 4+ weeks ahead. Invitation letter from the entity helps." },
  { passport: "Türkiye",         dest: "Serbia",      need: "none",   note: "Visa-free up to 90 days." },
  { passport: "India",           dest: "Germany",     need: "visa",   note: "Schengen visa — start 4+ weeks ahead. Invitation letter from the entity required." },
  { passport: "India",           dest: "Türkiye",     need: "evisa",  note: "e-Visa online if holding a valid Schengen/US/UK visa; otherwise sticker visa." },
  { passport: "China",           dest: "Germany",     need: "visa",   note: "Schengen visa — start 4+ weeks ahead." },
  { passport: "United States",   dest: "Germany",     need: "none",   note: "Visa-free up to 90 days in any 180." },
  { passport: "United States",   dest: "Türkiye",     need: "evisa",  note: "e-Visa online, minutes to obtain. Passport valid 150+ days." },
  { passport: "United States",   dest: "Brazil",      need: "evisa",  note: "e-Visa required since 2025. Apply 2+ weeks ahead." },
  { passport: "United Kingdom",  dest: "Germany",     need: "none",   note: "Visa-free up to 90 days in any 180 — watch the Schengen-wide running total." },
  { passport: "Nigeria",         dest: "Germany",     need: "visa",   note: "Schengen visa — start 6+ weeks ahead." },
  { passport: "Russia",          dest: "Germany",     need: "visa",   note: "Schengen visa. Processing is slow and variable — talk to Mobility before promising dates." },
]

export const PASSPORTS = [...new Set(VISA_MATRIX.map((v) => v.passport))]
export const VISA_DESTS = [...new Set(VISA_MATRIX.map((v) => v.dest))]
