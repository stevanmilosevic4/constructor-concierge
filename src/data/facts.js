/* =====================================================================
   RESEARCHED PRACTICAL FACTS — per city, each item carries its source.

   Shape per city:
     practical:  { sim, rideHailing, transportPayment, pharmacies,
                   printShops, taxi, emergency, hospitalEnglish }
     relocation: { registration, residencePermit, taxId, banking, mobile,
                   drivingLicence, schools }
   Every value is an array of { text, src }. Keys are listed in
   data/packSections.js (PRACTICAL_FACTS / RELOCATION_FACTS).

   Rule: nothing goes in without a source that was actually opened.
   Researched 23 August 2026 — re-check at each quarterly pack review.
   Where a source did not state something, the item says "unverified"
   rather than guessing.
   ===================================================================== */

const F = (text, src) => ({ text, src })
/* L = a fact whose FIGURE changes (price, fare, fee, threshold). The text
   stays stable and the link is rendered prominently as the live source —
   nothing in the pack needs editing when the number moves. */
const L = (text, src, live) => ({ text, src, live })

export const CITY_FACTS = {
  /* ------------------------------------------------------------------ */
  Bremen: {
    practical: {
      sim: [
        F("Germany requires ID verification before any prepaid SIM is activated (§172 TKG): show a passport or ID card in a shop, or use video identification.", "https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/OeffentlicheSicherheit/IdentverfahrenPrepaid/start.html"),
        L("Telekom MagentaMobil Prepaid: four tiers by data volume, 28-day validity, unused data rolls over on the larger tiers.", "https://www.telekom.de/unterwegs/tarife-und-optionen/prepaid-tarife", "Current Telekom prepaid prices"),
        L("Vodafone CallYa prepaid: 4-week tiers from a small starter to 100 GB, 5G and EU roaming included. City-centre shops at Sögestraße 21 and Knochenhauerstraße 3 (closed Sundays).", "https://www.vodafone.de/callya/", "Current CallYa prices"),
        L("Budget option: ALDI TALK starter set with starting credit, sold at any ALDI; activation needs an ID check (video-ident, partner shop or Post branch).", "https://www.alditalk.de/starter-set", "Current ALDI TALK price"),
        L("International travel eSIMs work: Airalo sells Germany data-only eSIMs on the O2 network. No local number.", "https://www.airalo.com/germany-esim", "Current eSIM plans"),
        F("Unverified: whether any shop at Bremen Airport sells SIM cards — assume you buy in the city centre or at ALDI.", "https://www.bremen-airport.com"),
      ],
      rideHailing: [
        F("Uber launched in Bremen on 20 September 2024 — UberX, Comfort, Uber Taxi and Uber Reserve (pre-book up to 90 days) via licensed local partners.", "https://www.uber.com/de/de/newsroom/uber-bremen/"),
        F("Bolt operates in Bremen with 'Bolt' (everyday cars) and 'Taxi' (licensed local taxis).", "https://bolt.eu/en/cities/bremen/"),
        F("FREE NOW books licensed taxis in Bremen; pay in-app (Apple Pay, Google Pay, PayPal, card) or in the car; pre-book up to 4 days ahead.", "https://www.free-now.com/de/fahrt/taxi-bremen/"),
      ],
      transportPayment: [
        F("Mobile tickets: the VBN 'FahrPlaner' app (also DB Navigator and FAIRTIQ). FAIRTIQ is check-in/check-out: swipe Start when boarding and Stop when leaving; it bills the best price and caps the day at the day-ticket.", "https://www.vbn.de/vbn/presse-news/presse/neue-zahlungsmoeglichkeit-mit-der-fairtiq-app-des-vbn"),
        F("On BSAG buses you pay the driver by card, Apple Pay or Google Pay only — cash has not been accepted on buses since February 2021.", "https://www.vbn.de/feed/bargeldlos-unterwegs-in-den-bussen-der-bsag"),
        F("Gotcha: on board you can only get single, day, night, connecting and short-trip tickets. Weekly and monthly passes must come from machines, customer centres, kiosks or the apps.", "https://www.bsag.de/befoerderungsbedingungen/fragen-und-antworten"),
        L("Ticket types: single (3 h), short trip, day ticket (1–5 adults), 7-day, monthly, and the Deutschlandticket (nationwide local transport, cancellable monthly).", "https://www.bsag.de/tickets/tickets-ueberblick", "Current BSAG fares"),
        F("BSAG customer centres: Domsheide (Balgebrückstraße 11) and Hauptbahnhof (Breitenweg 3a, from 07:00); over 100 kiosks and supermarkets also sell tickets. Customer service 0421 5596-666.", "https://www.bsag.de/service/rund-um-die-fahrt"),
      ],
      pharmacies: [
        F("On-duty (Notdienst) pharmacies: look up today's list on aponet.de, or dial 22 8 33 from a mobile (charged) / 0800 00 22 8 33 free from a German landline — the voice system names the nearest open pharmacy.", "https://www.apothekerkammer-bremen.de/Service-Notdienste.html"),
        F("Bremen duty pharmacies run 24 hours, from 09:00 on the duty day to 09:00 the next morning.", "https://www.apothekerkammer-bremen.de/Service-Notdienste.html"),
        F("Official lookup page for Bremen on aponet.de.", "https://www.aponet.de/apotheke/notdienstsuche/Bremen/%20/5"),
      ],
      printShops: [
        F("CopyHouse Universität, Bibliothekstraße 7 (Glashalle), 28359 Bremen — tel. 0421 17 84 72 72, Mon–Thu 09:00–15:00, Fri 09:00–14:00. Print, copy, binding on campus.", "https://my-copy.de/kontakt/"),
        F("MILDE MEDIA copyshop, Friedrich-Karl-Straße 107, 28211 Bremen — tel. +49 421 499 27 11, Mon–Fri 10–13 and 15–18.", "https://milde-copyshop.de/"),
        L("University library (SuUB): print via the Kuario app or a copy card from the desk; scanning is free.", "https://www.suub.uni-bremen.de/home-english/info-en/copy-scan-print/", "Current print prices"),
      ],
      taxi: [
        F("Taxi-Ruf Bremen: +49 421 14 0 14 — 24 hours, 365 days. WhatsApp +49 170 339 8423. Also bookable online or via the Taxi Deutschland app.", "https://www.taxi-ruf-bremen.de/en/contact/"),
      ],
      emergency: [
        F("Police 110 · Fire and ambulance 112 · Non-emergency medical on-call 116 117 · Poison control (GIZ-Nord) 0551 19240 · Dental emergency 0421 1 22 33.", "https://www.bremen.de/leben-in-bremen/gesundheit/notdienste"),
        F("112 is free from any phone and reaches Bremen's fire and rescue control centre.", "https://www.feuerwehr.bremen.de/notruf-12478"),
        F("116117 walk-in practice for adults (Bereitschaftspraxis Bremen-Mitte) at St. Joseph-Stift, Schubertstraße: Mon/Tue/Thu/Fri 19–21, Wed 15–21, Sat/Sun/holidays 10–21.", "https://patienten.kvhb.de/116117/aerztlicher-bereitschaftsdienst"),
      ],
      hospitalEnglish: [
        F("Klinikum Bremen-Mitte, Zentrale Notaufnahme: St.-Jürgen-Straße 1, Haus 1, 28205 Bremen — ER phone 0421 497-77806, switchboard 0421 497-0. Treats adults and children around the clock; trauma and stroke services.", "https://www.bremer-krankenhausspiegel.de/hilfe-im-notfall/klinikum-bremen-mitte"),
        F("Unverified: English-speaking staff or interpreters in the ER are not stated on the hospital's pages. In an emergency call 112 regardless of language.", "https://www.gesundheitnord.de/klinikum-bremen-mitte/zentrale-notaufnahme.html"),
      ],
    },
    relocation: {
      registration: [
        F("Register (Anmeldung) within 2 weeks of moving in; if no appointment is free within 2 weeks, booking one in time satisfies the deadline. Free of charge.", "https://www.service.bremen.de/dienstleistungen/wohnsitz-anmelden-zuzug-aus-dem-ausland-123039"),
        F("In person, all household members including children, at a BürgerServiceCenter: Mitte (Martinistraße 3), Nord (Gerhard-Rohlfs-Straße 62) or Stresemannstraße 48. No online option for arrivals from abroad.", "https://www.service.bremen.de/dienstleistungen/wohnsitz-anmelden-zuzug-aus-dem-ausland-123039"),
        F("Bring passport/ID, the landlord's signed Wohnungsgeberbestätigung, and marriage/birth certificates with German translation for family members. Book online at service.bremen.de or by phone via 115.", "https://www.service.bremen.de/terminbuchung-1469"),
      ],
      residencePermit: [
        F("Migrationsamt Bremen, Stresemannstraße 48 — tel. 0421 361-88630 (Mon–Thu 8–12), office@migrationsamt.bremen.de. Strictly appointment-only; walk-ins are not served.", "https://www.service.bremen.de/die-senatorin-fuer-inneres-und-sport/migrationsamt-100086"),
        L("After entering on a D visa, apply within its validity (or within 90 days for visa-free nationals) by emailing the 'Terminvergabe Einreise' form to ref11@migrationsamt.bremen.de.", "https://www.service.bremen.de/dienstleistungen/aufenthaltserlaubnis-nach-einreise-mit-visum-beantragen-122692", "Current permit fee"),
        F("Documents for an employment permit: form, passport, biometric photo (under 3 months), proof of health insurance, employment contract.", "https://www.service.bremen.de/dienstleistungen/aufenthaltserlaubnis-zur-beschaeftigung-und-selbstaendigkeit-122931"),
        L("EU Blue Card: a minimum gross salary applies (lower for shortage occupations and recent graduates), set each year; recognised degree and a contract of at least 6 months.", "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card", "Current salary thresholds"),
      ],
      taxId: [
        F("The 11-digit Steuer-ID is posted automatically and free to your registered address about 6 weeks after Anmeldung; if nothing arrives within 3 months, request it via the BZSt online form.", "https://www.service.bremen.de/dienstleistungen/steueridentifikationsnummer-erhalten-186036"),
        L("Health insurance is compulsory: employees below the annual income threshold are in statutory insurance (GKV); above it you may choose private cover. The threshold is reset each year.", "https://www.bundesgesundheitsministerium.de/gesetzlich-versicherte", "Current threshold"),
      ],
      banking: [
        F("Banks typically ask for passport or residence permit, the Meldebescheinigung (registration certificate) and a German address.", "https://handbookgermany.de/en/bank-account"),
        F("Everyone legally resident in the EU has the right to a Basiskonto (basic account); banks may refuse only on narrow grounds, with complaints to BaFin.", "https://www.verbraucherzentrale-bremen.de/wissen/geld-versicherungen/sparen-und-anlegen/das-recht-auf-ein-basiskonto-fuer-neu-in-deutschland-angekommene-12224"),
        F("Online option: N26 opens accounts for residents of Germany.", "https://support.n26.com/de-de/konto-und-personliche-informationen/eroffnung-meines-kontos/kann-ich-in-meinem-land-ein-n26-konto-eroffnen"),
      ],
      mobile: [
        F("Postpaid contracts run at most 24 months; afterwards one month's notice, and providers must warn before auto-renewal (rules since December 2021).", "https://www.bundesnetzagentur.de/DE/Vportal/TK/NeueKundenrechte/start.html"),
        L("No-contract alternative for residents: Vodafone CallYa prepaid with a free eSIM option.", "https://www.vodafone.de/callya/", "Current CallYa prices"),
      ],
      drivingLicence: [
        F("Non-EU licences are valid for 6 months after taking residence, then must be converted. Licences from 'Anlage 11' countries convert without a test; others need theory and practical exams.", "https://www.service.bremen.de/sixcms/detail.php?gsid=bremen128.c.9309.de&asl=bremen2014_sp.c.13091.de"),
        L("Führerscheinstelle, Stresemannstraße 48 — tel. 0421 361-88669, appointment required; processing 4–6 weeks. Bring the licence with an official translation, ID and a photo.", "https://www.service.bremen.de/dienstleistungen/auslaendischen-fuehrerschein-umschreiben-anlage-11-fev-123369", "Current fee"),
        F("Valid EU/EEA licences need no conversion in Germany.", "https://www.service.bremen.de/dienstleistungen/auslaendischen-fuehrerschein-umschreiben-eu-ewr-9588"),
      ],
      schools: [
        F("International School of Bremen (ISB), Badgasteiner Straße 11, 28359 Bremen — tel. +49 421 515 7790, admissions@isbremen.de; English-language, early years to IB Diploma.", "https://www.isbremen.de/contact-us"),
        F("Kita places: apply at kitaportal.bremen.de (up to 3 facilities per application). Newcomers without a Kinder-ID contact the Elternservice, hotline +49 421 361-92000.", "https://www.bildung.bremen.de/erstanmeldung-und-weiterbetreuung-378955"),
        F("Municipal KiTa Bremen reported free places in crèche, kindergarten and after-school care for 2026/27 (March 2026).", "https://www.kita.bremen.de/aktuelles/neuigkeiten-von-kita-bremen/freie-betreuungsplaetze-2026-27-32739"),
      ],
    },
  },


  /* ------------------------------------------------------------------ */
  Istanbul: {
    practical: {
      sim: [
        L("Tourist packs (28 days, new prepaid line opened with a foreign passport) from Turkcell, Türk Telekom and Vodafone TR, each with data plus local minutes; the SIM and activation are charged on top in store.", "https://www.turkcell.com.tr/kampanyalar/mobil-hat-data-hatti-kampanyalari/yeni-turkcell-musterisi/tourist-welcome-pack", "Current Turkcell tourist pack"),
        L("Airport counters at IST charge considerably more than city-centre shops for the same packs; passport registration is mandatory everywhere. Türk Telekom and Vodafone publish their tourist offers online.", "https://www.turktelekom.com.tr/en/prepaid-tourist-sim-turkey", "Current Türk Telekom tourist prices"),
        L("THE RULE TO KNOW: a phone brought from abroad works with a Turkish SIM for 120 days, then it is blocked unless you register the IMEI via e-Devlet for a substantial fee that is revalued every January. The dual-SIM/eSIM loophole ended 1 May 2026. Short trips are unaffected; relocators should plan for it.", "https://www.turkiye.gov.tr/btk-imei-sorgulama", "Current IMEI registration fee (e-Devlet)"),
        L("International travel eSIMs work (Airalo on the Türk Telekom network) and, as roaming eSIMs, are treated differently from a local Turkish SIM under the 120-day rule.", "https://www.airalo.com/turkey-esim", "Current eSIM plans"),
      ],
      rideHailing: [
        F("Uber works in Istanbul but only as a taxi-hailing app — it dispatches licensed yellow/turquoise taxis, not private cars, with in-app payment.", "https://www.uber.com/global/en/cities/istanbul/"),
        F("BiTaksi is the dominant local taxi app: licensed taxis, in-app card payment or cash, 8-seat and luxury options.", "https://apps.apple.com/tr/app/bitaksi-your-closest-taxi/id589500723"),
        F("İBB's list of licensed taxi-hailing platforms (July 2025): BiTaksi, Uber, Binbin, inDrive, Valo and Yandex Go. The city's own iTaksi app appears defunct as of August 2026 (parked domain, store listings removed) — use BiTaksi or Uber.", "https://www.ekonomim.com/ekonomi/ibb-yeni-taksi-uygulamasini-duyurdu-bitaksi-ve-uberin-ardindan-yandex-go-devreye-alindi-haberi-831220"),
        L("All apps use the same İBB-regulated meter: an opening fare, a per-km rate and a minimum fare, in three tiers (yellow, turquoise, black); the tariff is reset by İBB several times a year.", "https://tuhim.ibb.gov.tr/", "Current taxi tariff (İBB)"),
      ],
      transportPayment: [
        L("İstanbulkart is sold and topped up at BELBİM ticket machines (Biletmatik) at metro, tram, Metrobüs and ferry stations and at both airports; valid on bus, metro, tram, cable car, Marmaray, Metrobüs and ferries. The blank card itself carries a non-refundable charge.", "https://www.istanbulkart.istanbul/", "Current card price & fares"),
        L("One fare per boarding with İstanbulkart or the app, with discounted transfers; Metrobüs and Marmaray are priced by distance; ferries and the airport metro (M11) have their own tariff. İBB publishes the full table and revises it during the year.", "https://tuhim.ibb.gov.tr/", "Current İstanbulkart fares"),
        L("Contactless bank cards work at the readers on bus, metro, tram, Metrobüs and ferries — but are charged the single-ticket rate, noticeably more than the İstanbulkart fare.", "https://visit.istanbul/istanbul-card", "Current single-ticket rate"),
        F("Marmaray (distance-based, run by TCDD) does NOT accept bank-card tap at the turnstiles — use a physical İstanbulkart or the İstanbulkart Mobil QR; the maximum fare is charged at entry and the difference refunded at exit.", "https://marmaray.istanbul/marmarayda-kredi-karti-geciyor-mu/"),
        F("İstanbulkart Mobil app (iOS/Android): pay by QR on buses, metro, Metrobüs, ferries and Marmaray at the same fares as the card; top up in-app.", "https://uym.ibb.gov.tr/kurumsal/haberler-ve-duyurular/ula%C5%9F%C4%B1m-tamamen-dijitalle%C5%9Fti"),
      ],
      pharmacies: [
        F("Eczane hours are typically 09:00–19:00 Mon–Sat; on Sundays and public holidays only the on-duty 'nöbetçi eczane' opens, and it serves 24 h.", "https://www.cnnturk.com/yasam/eczane-hafta-ici-ve-hafta-sonu-calisma-saatleri-2025-eczaneler-kacta-aciliyor-kacta-kapaniyor-2133586"),
        F("Official on-duty list by district: İstanbul Eczacı Odası, istanbuleczaciodasi.org.tr/nobetci-eczane, or its free 'İEO Nöbetçi Eczaneler' app with map navigation.", "https://www.istanbuleczaciodasi.org.tr/nobetci-eczane/"),
        F("Nationwide: e-Devlet's 'Nöbetçi Eczane Sorgulama' (Ministry of Health) lists today's and tomorrow's on-duty pharmacies by district — no login needed.", "https://www.turkiye.gov.tr/saglik-titck-nobetci-eczane-sorgulama"),
      ],
      printShops: [
        F("Levent Copy Center — Esentepe Mah. Ecza Sok. No:4/31, Şişli (Levent business district); tel. 0212 264 02 15; Mon–Fri 08:30–20:00, Sat 09:00–17:00.", "https://leventcopycenter.com"),
        F("Near Taksim: Pera Yaşar Copy Center — Meşrutiyet Cad., Aslıhan Sahaflar Çarşısı No:10/15-16, Beyoğlu; tel. +90 212 243 09 03; printing, binding, lamination.", "https://www.perayasar.com.tr/fotokopi-taksim-beyoglu.php"),
        F("To find one nearby, search 'fotokopi' or 'copy center' in Google or Yandex Maps; useful words: fotokopi (copy), çıktı (printout), kırtasiye (stationery shop — usually prints too).", "https://www.perayasar.com.tr/fotokopi-taksim-beyoglu.php"),
      ],
      taxi: [
        F("Istanbul has no central taxi-booking phone number — official dispatch is only via the licensed apps (BiTaksi, Uber). If the apps fail, hail a licensed yellow taxi on the street or ask the hotel desk.", "https://www.ekonomim.com/ekonomi/ibb-yeni-taksi-uygulamasini-duyurdu-bitaksi-ve-uberin-ardindan-yandex-go-devreye-alindi-haberi-831220"),
        F("Problems with a taxi: İBB Help Desk (Beyaz Masa) 153, or the taxi drivers' chamber 444 15 23 — both available practically around the clock.", "https://visit.istanbul/important-phone-numbers"),
      ],
      emergency: [
        F("112 is Türkiye's single emergency number — ambulance, police, fire, gendarmerie and coast guard all merged under it.", "https://www.112.gov.tr/acil-durumda-tek-numara-112"),
        F("Also listed by the city: Fire 110 · Police 155 · Traffic 154 · İBB Help Desk 153 · Tourism Information 176 · Tourism Police +90 212 527 45 03 (Sultanahmet, Yerebatan Caddesi — English, German, French and Arabic spoken).", "https://visit.istanbul/important-phone-numbers"),
        F("Foreigners' helpline YİMER 157 (Göç İdaresi) is 24/7; from abroad +90 312 157 11 22.", "https://en.goc.gov.tr/general-information41"),
      ],
      hospitalEnglish: [
        F("VKV American Hospital (Amerikan Hastanesi) — Güzelbahçe Sk. No:20, Nişantaşı/Şişli; call centre 444 3 777; emergency department on the ground floor of A Block, round the clock.", "https://www.amerikanhastanesi.org/en/departments/emergency-department"),
        F("Acıbadem Maslak Hospital — Büyükdere Cad. No:40, Maslak/Sarıyer; 444 55 44; emergency service plus a Health Point Center for international patients (JCI-accredited); 24/7 multilingual support +90 212 304 4444, WhatsApp +90 536 904 8262.", "https://www.acibadem.com.tr/en/hospital/maslak-hospital/"),
        F("Memorial Şişli Hospital — Piyalepaşa Blv., Şişli; call centre 444 7 888; first JCI-accredited hospital in Türkiye, serves international patients.", "https://www.memorial.com.tr/en/hospitals/memorial-sisli-hospital"),
      ],
    },
    relocation: {
      registration: [
        F("If your address changes during the residence-permit period you must report it within 20 working days to the provincial Göç İdaresi and the Nüfus ve Vatandaşlık İşleri Müdürlüğü (rental contract or title deed, ID copies, utility bill). The residence certificate is then downloadable from e-Devlet.", "https://www.goc.gov.tr/ikamet-genel-bilgiler"),
        L("e-Devlet access: foreigners with a 98/99 ID number get an e-Devlet password at any PTT branch with their residence permit card, or work permit + passport, for a small fee.", "https://www.ptt.gov.tr/e-devlet-kapisi-sifre-verme-islemleri", "Current PTT fee"),
      ],
      residencePermit: [
        F("Work permit: the employer applies through the Ministry of Labour's e-İzin system; from abroad it starts at a Turkish consulate. Evaluation up to 30 days, and a valid work permit counts as a residence permit.", "https://www.csgb.gov.tr/en/frequently-asked-questions/directorate-general-of-international-labour-force/work-permit/"),
        F("Residence permit (ikamet): apply online at e-ikamet.goc.gov.tr, then attend the İl Göç İdaresi on the appointment date with documents — no-shows count as not having applied. Decision within 90 days; health insurance mandatory.", "https://en.goc.gov.tr/general-information41"),
        F("Warning from Göç İdaresi: apply only via goc.gov.tr / e-ikamet.goc.gov.tr — no intermediaries, and fees are never paid into personal or company bank accounts.", "https://en.goc.gov.tr/about-residence-permit-applications"),
      ],
      taxId: [
        F("Get a 'Potential Tax Identification Number' online at the Dijital Vergi Dairesi (passport photo page upload) without visiting a tax office — it is the critical first step for banking. Residence-permit holders get a tax ID automatically via their YKN.", "https://istanbul.goc.gov.tr/yabancilarin-vergi-kimlik-numarasi-temini-hakkinda"),
      ],
      banking: [
        F("To open an account: valid passport (some banks ask a second photo ID), Turkish tax number, a Turkish mobile number for SMS codes, proof of address; residence permit card for residents. Non-residents can often open a narrower account with passport + tax number.", "https://www.karanfiloglu.av.tr/en/open-bank-account-turkey-foreigners/"),
      ],
      mobile: [
        F("Foreigners open a prepaid line at an operator store with a valid passport; operator-specific postpaid eligibility for foreigners is unverified — check commitment periods and termination fees before signing.", "https://www.turkcell.com.tr/destek/turkcellli-olmak/turkcellli-olmak/yabanci-uyrukluyum-nasil-hat-alabilirim"),
        L("Bringing your own phone: works with a Turkish SIM for 120 days, then the IMEI must be registered via e-Devlet (fee revalued every January) or the device is blocked on all Turkish networks.", "https://www.turkiye.gov.tr/btk-imei-sorgulama", "Current IMEI fee (e-Devlet)"),
      ],
      drivingLicence: [
        F("Foreigners may drive on a foreign licence for 6 months after entry; after that a Turkish licence is required.", "https://www.nvi.gov.tr/sss-surucu-belgeleri-hizmetleri"),
        F("Conversion at a Nüfus Müdürlüğü: original licence + notarised Turkish translation, ID, driver health report, biometric photo, blood-group document, education certificate, criminal record and the fee; the foreign licence is returned to the issuing country.", "https://www.nvi.gov.tr/sss-surucu-belgeleri-hizmetleri"),
      ],
      schools: [
        F("Istanbul International Community School (IICS) — IB/AP, founded 1911; Hisar Campus, Rumelihisarı/Sarıyer (+90 212 287 2770) and Marmara Campus, Hadımköy.", "https://www.iics.k12.tr/"),
        F("The British International School Istanbul (BIS) — Cambridge IGCSE + IB Diploma, ages 2.5–18; Zekeriyaköy Forest Campus, Sarıyer (+90 212 202 70 27); Etiler campus.", "https://www.bis.k12.tr/about-us"),
        F("MEF International School Istanbul — Cambridge IGCSE and IB Diploma; Ulus/Beşiktaş; +90 212 362 26 33.", "https://www.mefis.k12.tr/istanbul/contact/"),
      ],
    },
  },
  /* ------------------------------------------------------------------ */
  Belgrade: {
    practical: {
      sim: [
        L("Yettel tourist pack: prepaid SIM or eSIM with a 30-day data allowance; sold in Yettel stores or online.", "https://www.yettel.rs/sr/privatni/ponuda/mobilni-internet/prepaid", "Current Yettel tourist price"),
        L("A1 'Welcome SIM': a 7-day data pack extendable to 15 or 30 days; SIM or eSIM, sold in A1 shops, online and at Nikola Tesla Airport. A valid passport is required.", "https://a1.rs/privatni/internet/prepaid_net", "Current A1 Welcome SIM price"),
        L("mts: 'Turist SIM' (5 days) or 'Super Turist SIM' (30 days).", "https://mts.rs/Privatni/Mobilna/Pripejd/Tarife/a114891-Turist-SIM-i-Super-Turist-SIM.html", "Current mts tourist prices"),
        F("Prepaid registration is mandatory (since 10 February 2025) with ID card or passport; unregistered numbers are deactivated.", "https://www.paragraf.rs/dnevne-vesti/301224/301224-vest8.html"),
        F("EU 'roam like at home' does NOT cover Serbia — the Commission only proposed opening negotiations in February 2026. EU plans incur roaming surcharges here.", "https://enlargement.ec.europa.eu/news/roam-home-commission-proposes-open-negotiations-extend-eu-roaming-western-balkans-2026-02-25_en"),
        F("International eSIMs work: Airalo's Serbia plans run on the A1 network.", "https://www.airalo.com/serbia-esim"),
      ],
      rideHailing: [
        F("Yandex Go is the app that works: order in the app or call 19810; fare shown upfront. Since February 2026 Pink Taxi also takes orders through it, so practically every Belgrade taxi association is bookable via Yandex Go.", "https://go.yandex/sr_rs/lp/calltaxi/city/belgrade/"),
        F("CarGo (members' app, in-app payment) continues to operate in Belgrade.", "https://play.google.com/store/apps/details?id=com.appcargo.user&hl=en_US"),
        F("Uber and Bolt do NOT operate in Belgrade — neither lists Serbia on its official cities page (checked August 2026).", "https://www.uber.com/global/en/cities/"),
      ],
      transportPayment: [
        F("Public transport is FREE for everyone since 1 January 2025 — all city and suburban buses, trams, trolleybuses and BG Voz. No ticket or card needed.", "https://www.tob.rs/en/info/useful-info/city-public-transport"),
        F("City of Belgrade confirms free transport including night lines; a night line to Nikola Tesla Airport was added 1 September 2025.", "https://www.beogradsad.rs/lat/gradske-inicijative/a94645/Besplatan-javni-prevoz.html"),
        L("Exception: airport minibus A1 (Slavija – Nikola Tesla Airport) is paid to the driver; runs about 06:00–01:00.", "https://www.busevi.com/red-voznje/linija-a1-trg-slavija-kralja-milutina-aerodrom-nikola-tesla/", "Current A1 fare & timetable"),
        L("Exception: minibus express E-lines (E2, E6, E9…) are paid on board, outside the free integrated system.", "https://www.gsp.rs/", "Current GSP information"),
      ],
      pharmacies: [
        F("Apoteka Beograd 'Prvi maj', Kralja Milana 9 — open 00–24 every day; tel. 011 3241-349.", "https://www.beograd94.rs/sr/za-pacijente/de%C5%BEurne-apoteke"),
        F("Apoteka Beograd 'Sveti Sava', Nemanjina 2 (opposite the main post office) — open 00–24 every day; tel. 011 2643-170.", "https://www.beograd94.rs/sr/za-pacijente/de%C5%BEurne-apoteke"),
        F("Other 24-hour branches: 'Zemun' (Glavna 34) and 'Bogdan Vujošević' (Novi Beograd) — re-confirmed April 2026.", "https://www.danubeogradu.rs/2026/04/prvi-maj-praznik-rada-2026-radno-vreme-za-praznike-parkiranje-i-druge-korisne-informacije/"),
      ],
      printShops: [
        F("Copy Land, Nemanjina 40 (TC Futura, Slavija) — print, copy, scan, binding; tel. +381 11 3650168, office@copyland-bg.com; cards accepted.", "https://copyland-bg.com/"),
        F("DOGA Print Shop, Hercegovačka 14 (BW Galerija, Belgrade Waterfront) — open 10:00–22:00 daily; email files to dogaprintshop@gmail.com.", "https://www.dogaprintshop.com/fotokopirnica/"),
        F("To find the nearest 'fotokopirnica', use the 011info directory by municipality.", "https://www.011info.com/en/photocopying"),
      ],
      taxi: [
        F("Pink Taxi: 19803 (24/7), app 'Pink Taxi Nova'; cards accepted in all vehicles.", "https://pinktaxi.info/"),
        F("Naxis Taxi: 19804, call centre +381 11 358 11 11, toll-free 0800 11 9804; cards accepted.", "https://naxis.rs/en/"),
        L("Airport: take a fixed-price voucher from one of four e-kiosks (three in baggage claim, one in the arrivals lounge) — the kiosk shows the current price for your city zone. The driver must charge exactly the voucher amount; up to 4 passengers with luggage.", "https://beg.aero/eng/practical-informations/taxi-service", "Airport taxi page (official)"),
      ],
      emergency: [
        F("Police 192 · Fire 193 · Ambulance (Hitna pomoć) 194. Use these national numbers.", "https://n1info.rs/vesti/panik-poziv-panik-taster-srbija-broj-112-broj-za-hitne-slucajeve/"),
        F("112 is NOT yet fully operational in Serbia (EC report, November 2025) — do not rely on it; call 192/193/194.", "https://n1info.rs/vesti/panik-poziv-panik-taster-srbija-broj-112-broj-za-hitne-slucajeve/"),
      ],
      hospitalEnglish: [
        F("Urgentni centar (Emergency Centre), University Clinical Centre of Serbia, Pasterova 2 — all adult emergencies, 24/7; tel. +381 11 3618-444. Listed by the UK FCDO as English-speaking.", "https://www.gov.uk/government/publications/serbia-list-of-medical-facilitiespractitioners/serbia-list-of-medical-facilities--2"),
        F("Acibadem Bel Medic General Hospital (private), Koste Jovanovića 87 — 0–24 h; tel. +381 11 309 1000; international patient line +381 60 309 1070 (Viber/WhatsApp, 07–22).", "https://www.acibadembelmedic.rs/kontakt"),
        F("MediGroup General Hospital (private), Bulevar Milutina Milankovića 3, Novi Beograd — 24 h contact centre +381 11 40 40 100; English-speaking per FCDO.", "https://www.medigroup.rs/en/"),
        F("Children: University Children's Clinic (Tiršova), Tiršova 10 — tel. +381 11 2060 600.", "https://www.gov.uk/government/publications/serbia-list-of-medical-facilitiespractitioners/serbia-list-of-medical-facilities--2"),
      ],
    },
    relocation: {
      registration: [
        F("Address registration (the 'beli karton') within 24 hours of arrival: hotels register guests electronically via eTurista; private hosts via the eUprava portal or at the police station for the address.", "https://welcometoserbia.gov.rs/registracija-po-dolasku"),
        F("The host files it at the local police station with the foreigner's passport and proof of the right to use the premises (lease or ownership).", "https://www.mup.gov.rs/wps/portal/sr/gradjani/Informacije%20za%20strance/prijava%20boravista%20stranca/"),
      ],
      residencePermit: [
        F("The 'jedinstvena dozvola' (unified residence + work permit) is applied for ONLY online via the Portal za strance (welcometoserbia.gov.rs); issued as a biometric card for up to 3 years; biometrics given in person on approval.", "https://welcometoserbia.gov.rs/privremeni-boravak"),
        F("Visa-free nationals may apply after arrival; visa-required nationals first need a D work visa. The employer can file on your behalf; decision within 15 days of a complete application.", "https://welcometoserbia.gov.rs/informacije-o-jedinstvenoj-dozvoli"),
      ],
      taxId: [
        F("The 'evidencijski broj stranca' (EBS, 13-digit foreigner ID number) is assigned by MUP and issued with the residence permit; it is needed for most rights and for the Portal za strance.", "https://welcometoserbia.gov.rs/privremeni-boravak"),
        F("Tax: non-resident individuals are assigned a 9-digit PIB (tax ID) by the Tax Administration on registration (form PR-3).", "https://www.paragraf.rs/propisi/pravilnik_o_poreskom_identifikacionom_broju.html"),
      ],
      banking: [
        F("In the first year a foreigner opens a non-resident account with passport, a document showing the address of stay, and the bank's form; after one year of approved stay it converts to a resident account.", "https://welcometoserbia.gov.rs/otvaranje-racuna-u-banci-za-rezidente-i-nerezidente"),
        F("Banks such as Raiffeisen and OTP open dinar and foreign-currency accounts for non-residents (passport plus proof of address), but without loans or overdrafts.", "https://biznis.rs/novac/strancima-dozvoljeno-otvaranje-racuna-ali-ne-i-koriscenje-svih-bankarskih-usluga/"),
      ],
      mobile: [
        F("Postpaid contracts: Yettel's terms require foreign citizens to identify with a passport (original shown in the shop).", "https://www.yettel.rs/sr/o-yettelu/o-nama/podaci-o-kompaniji/opsti-uslovi/mobilna-mreza"),
      ],
      drivingLicence: [
        F("A foreign licence stops being valid 12 months after you are granted residence longer than six months.", "https://www.paragraf.rs/dnevne-vesti/220725/220725-vest3.html"),
        F("Exchange without a test at MUP: foreign licence with certified court translation, passport, proof of residence, medical certificate (under 6 months), confirmation of categories, fee via eUprava.", "https://www.mup.gov.rs/wps/portal/sr/gradjani/dokumenta/vozacka%20dozvola/zamena%20inostrane%20vozacke%20dozvole%20za%20vozacku%20dozvolu%20republike%20srbije/"),
      ],
      schools: [
        F("International School of Belgrade (ISB) — IB, ages 3–18; primary Temišvarska 19, secondary Radivoja Lole Đukića 1a; tel. +381 11 206-9999, isb@isb.rs.", "https://www.isb.rs/"),
        F("British International School Belgrade — British curriculum, ages 3–18; primary Župana Vlastimira 8; tel. +381 11 30 66 096, info@bis.edu.rs.", "https://www.british-int-school.org.uk/"),
        F("Chartwell International School — Cambridge curriculum, pre-school to secondary, Dedinje campuses; enrolment@chartwell.edu.rs.", "http://chartwell.edu.rs/contact/"),
        F("Deutsche Schule Belgrad — German-language to Abitur, ages 3–18; Petra Čajkovskog 4 (Senjak); tel. +381 11 4116116.", "https://www.dsbelgrad.com/"),
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  "São Paulo": {
    practical: {
      sim: [
        F("Anatel rules let foreigners buy and register a prepaid SIM with only a passport — no CPF needed. In-store registration is the reliable route.", "https://acel.org.br/928-estrangeiros-podem-comprar-chip-pre-pago-de-celular-so-com-passaporte"),
        L("TIM visitor prepaid: activated with passport + Brazilian accommodation address (dial *144 or a TIM store); short web packs are sold by the week. Credits at banks, lottery shops and pharmacies.", "https://www.tim.com.br/ajuda/international-visitors", "Current TIM visitor packs"),
        L("Vivo Tourist Plan (since October 2025): digital eSIM for foreign visitors with 5G data and unlimited domestic calls for 30 days; bought on vivo.com.br with your passport number before arrival.", "https://www.vivo.com.br/", "Current Vivo tourist plan"),
        F("Claro prepaid for tourists registers with passport in store or via *552; Claro stores at GRU airport. (Claro's own site is only reachable from inside Brazil.)", "https://www.recharge.com/blog/pt/pt/chip-claro-para-turistas-guia-para-ativar-sem-cpf"),
        L("International eSIMs work: Airalo's Brazil plans run on the TIM network.", "https://www.airalo.com/brazil-esim", "Current eSIM plans"),
      ],
      rideHailing: [
        L("Uber and 99 both operate. From GRU, Uber runs 24 h — pick your terminal and pickup point in the app; allow 45–60 minutes to the centre.", "https://www.uber.com/global/pt-br/r/routes/gru-to-sao-paulo-sp-br", "Current fare estimate GRU → city"),
        F("Since 18 March 2026 GRU Terminal 2 has a dedicated 'Pick Up' plaza with 24 numbered zones for Uber, 99 and Rhino; the app assigns your zone and staff guide you.", "https://www.aeroportodeguarulhos.org/aeroporto-de-guarulhos-inaugura-nova-area-para-embarque-em-carros-de-aplicativo-com-100-vagas/"),
        F("At Congonhas (CGH) pickups use colour-coded sectors on the lower-level curb, shown in the app.", "https://www.uber.com/br/pt-br/newsroom/uber-inicia-nova-operacao-de-embarque-no-aeroporto-de-congonhas/"),
      ],
      transportPayment: [
        L("One fare per ride on buses and on Metrô/CPTM, a discounted bus+rail integration with the Bilhete Único, and a 24-hour bus pass. Bilhete Único allows 4 bus rides within 3 hours for one fare. Fares are reset each January.", "https://www.sptrans.com.br/tarifas/", "Current SPTrans fares"),
        L("Single Metrô/CPTM journey: QR-code ticket from station ticket offices, machines, the TOP app, WhatsApp (11) 3888-2200 or accredited shops. The reloadable TOP card covers Metrô, CPTM and intermunicipal buses.", "https://www.metro.sp.gov.br/pt_BR/sua-viagem/bilhetes-cartoes/", "Current Metrô fares & tickets"),
        F("Contactless bank cards (Visa, Mastercard, Elo) work only at marked turnstiles in a pilot on Metrô Lines 1, 2 and 3 and on CPTM/ViaMobilidade Lines 8 and 9 (as of May 2026); no bus integration, 30-minute reuse lock. Phone wallets accepted on the same lines since April 2026.", "https://tvtnews.com.br/metro-e-cptm-ampliam-pagamento-por-aproximacao-nas-catracas-em-sp/"),
        F("On SPTrans buses, contactless bank cards work only on a small pilot (14 lines, 3 terminals) — not system-wide. Get a Bilhete Único at a bus-terminal service post with a passport, or register online.", "https://www.sptrans.com.br/perguntas-e-respostas/?sobre=pagamento-debito-credito"),
      ],
      pharmacies: [
        F("Droga Raia's store locator lets you filter for '24 horas' units among its 91 São Paulo stores.", "https://www.drogaraia.com.br/nossas-lojas"),
        F("Drogasil's locator lists 24-hour units among 92 stores, e.g. Rua Doutor Campos Moura 251, tel. (11) 2254-4331.", "https://www.drogasil.com.br/nossas-lojas?search=S%C3%A3o+Paulo&page=50"),
        F("Drogaria São Paulo pioneered 24-hour service; its 24-hour listing is at drogariasaopaulo.com.br/24.", "https://www.drogariasaopaulo.com.br/institucional/drogarias-sao-paulo"),
      ],
      printShops: [
        F("Kalunga Copy&Print (inside Kalunga stationery stores): Av. Paulista 2421 (Mon–Fri 08–19, Sat 08–18, printavpaulista@kalunga.com.br); also Rua Iguatemi 321 (Itaim Bibi) and Av. dos Imarés 266 (Moema). Send files by WhatsApp, email or pen drive.", "https://www.kalunga.com.br/hotsite/copyprint/"),
        F("Master Copy, Av. Brigadeiro Faria Lima 2092 — tel. (11) 3816-1733, WhatsApp +55 11 94226-3400, impressao@mastercopy.com.br.", "https://mastercopy.com.br/"),
      ],
      taxi: [
        F("Coopertax (cooperative, about 550 cars): 24-hour dispatch (11) 2095-6000 or (11) 3511-1919, WhatsApp (11) 2095-6000, plus app.", "https://www.coopertax.com.br/"),
        F("Rádio Táxi Vermelho e Branco: (11) 3146-4000, with app; all zones of the city.", "https://radiotaxivermelhoebranco.com.br/"),
      ],
      emergency: [
        F("Police 190 · SAMU ambulance 192 · Fire and rescue 193 · Civil defence 199. All free.", "https://www.ssp.df.gov.br/emergencia-190-193-e-199/"),
        F("112 and 911 dialled from a mobile are redirected to 190 (police) — 190 remains the primary number.", "https://www.gazetadopovo.com.br/vida-e-cidadania/anatel-aprova-911-e-112-para-chamadas-de-emergencia-45jugp5gj6ixnvf6ukdxppo3y/"),
      ],
      hospitalEnglish: [
        F("Hospital Sírio-Libanês (Bela Vista): Rua Dona Adma Jafet 115 — main tel. (11) 3394-0200; 24 h Pronto Atendimento with its own entrance on Rua Barata Ribeiro; ambulance (11) 3394-3700.", "https://hospitalsiriolibanes.org.br/pronto-atendimento/bela-vista"),
        F("Sírio-Libanês International Patient Service: English, Spanish and Japanese; tel. +55 11 3394-5520, international@hsl.org.br; desk also at GRU Terminal 3 mezzanine (06:00–22:00 daily).", "https://hospitalsiriolibanes.org.br/international-patient/en/international-patient-service-center"),
        F("Hospital Israelita Albert Einstein, Morumbi: Av. Albert Einstein 627 — tel. +55 11 2151-1233, WhatsApp +55 11 2151-1681; 24-hour emergency care; International Patient Center Mon–Fri 07–17.", "https://www.einstein.br/n/en/units/einstein-morumbi"),
      ],
    },
    relocation: {
      registration: [
        L("Temporary-visa holders register with the Polícia Federal within 90 days of entry: fill the gov.br form, then book an in-person appointment; the CRNM card is issued in about 30 business days.", "https://www.gov.br/pt-br/servicos/registrar-se-como-estrangeiro-no-brasil", "Current fees (gov.br)"),
        L("Checklist: passport with visa, proof of Brazilian address (under 3 months), criminal-record certificates from countries lived in over the last 5 years, paid fees. Get the CPF first.", "https://www.gov.br/pt-br/servicos/registrar-se-como-estrangeiro-no-brasil", "Current document list"),
      ],
      residencePermit: [
        F("Work-based residence authorisation is requested from the Ministry of Justice via MigranteWeb (usually filed by the employer); the consulate then issues the temporary work visa; after entry you register with the Polícia Federal.", "https://portaldeimigracao.mj.gov.br/pt/destaques-e-novidades/2-sem-categoria/400846-autorizacao-de-trabalho-informacoes-e-procedimentos"),
        F("Ministry of Justice labour-immigration portal with guidance per category and digital tracking; imigrante.cgil@mj.gov.br, (61) 2025-3482.", "https://www.gov.br/mj/pt-br/assuntos/seus-direitos/migracoes/portal-de-imigracao-laboral/portal-de-imigracao-laboral"),
      ],
      taxId: [
        F("Get the CPF before arrival, free, at a Brazilian consulate (book via e-consular) with passport and the FCPF form — issued electronically. It unlocks bank accounts, contracts and most services.", "https://www.gov.br/pt-br/servicos/inscrever-no-cpf-no-exterior"),
        L("In Brazil: free online or at Receita Federal, or for a small charge at Correios, Banco do Brasil, Caixa or cartórios, using the 'Inscrever Estrangeiro no CPF' form with passport.", "https://www.gov.br/pt-br/servicos/inscrever-no-cpf", "Current CPF procedure"),
      ],
      banking: [
        F("Resident foreigners open accounts with CPF + RNM/CRNM + proof of address; most fintechs accept the RNM with a CPF. Non-resident accounts only at FX-authorised banks (C6, Rendimento, BTG Pactual).", "https://www.serasa.com.br/blog/conta-digital-para-imigrantes/"),
        F("Nubank requires Brazilian residency and a CPF; RNM is the standard ID.", "https://comunidade.nubank.com.br/t/conta-para-estrangeiros/483870"),
      ],
      mobile: [
        F("Prepaid lines register with passport, RNM or Mercosul ID plus a local address; CPF is not mandatory for prepaid. Unverified: whether postpaid plans require a CPF.", "https://www.tim.com.br/ajuda/perguntas-frequentes/celular/pre-pago/estrangeiros-no-brasil"),
      ],
      drivingLicence: [
        F("A valid foreign licence (with IDP for Vienna Convention countries) is valid for 180 days of regular stay; after that you need a Brazilian CNH via Detran-SP.", "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/carteira-internacional"),
        F("Detran-SP/Poupatempo exchange: RNE/CRNM, CPF, proof of address, original licence + sworn translation, passport, fee; practical exam waived for Vienna Convention / reciprocity countries (medical and psychological exams still apply).", "https://www.poupatempo.sp.gov.br/carta/9D7A4B1A-F6A6-465B-90BF-40CE3D4C7A45"),
      ],
      schools: [
        F("Graded – The American School of São Paulo, Av. José Galante 425, Morumbi — American curriculum + IB, Pre-K to Grade 12, 48 nationalities.", "https://www.graded.br/"),
        F("St. Paul's School (British, founded 1926), Rua Juquiá 166, Jardim Paulistano — ages 3–18.", "https://www.stpauls.br/about-us"),
        F("Chapel School, Rua Vigário João de Pontes 537, Chácara Flora — American curriculum with IB, early childhood to high school.", "http://www.chapelschool.com/homologacao/"),
        F("Colégio Visconde de Porto Seguro (founded 1878 as the Deutsche Schule), Morumbi campus Rua Floriano Peixoto Santos 55 — bilingual, German international curriculum and IB.", "https://www.portoseguro.org.br/conteudo/detalhe/quem-somos/nossa-histria"),
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  Schaffhausen: {
    practical: {
      sim: [
        F("Switzerland is NOT covered by EU 'roam like at home' — EU plans may charge extra here.", "https://digital-strategy.ec.europa.eu/en/library/roaming-european-union-brochure"),
        L("Swisscom Prepaid: a one-off SIM price that becomes your starting credit, plus 7-day and 30-day unlimited Swiss flats. SIM or eSIM — the tourist eSIM can be ordered online before arrival.", "https://www.swisscom.ch/en/residential/mobile-subscription/prepaid/tourists.html", "Current Swisscom prepaid prices"),
        L("Sunrise Prepaid: starter pack with matching credit; sold in Sunrise shops, Migros, Coop, Aldi, kiosks, SBB ticket machines and online (eSIM in minutes). Passport or ID required.", "https://www.sunrise.ch/en/mobile/prepaid", "Current Sunrise prepaid prices"),
        L("Salt PrePay: free SIM with starting credit; 30-day data packs in three sizes or a daily unlimited option.", "https://www.salt.ch/en/mobile/plan/prepay", "Current Salt PrePay prices"),
        F("All Swiss prepaid SIMs must be registered with passport or ID at the point of sale.", "https://www.moneyland.ch/en/internet-prepaid-sim-travel-tourist-switzerland"),
        F("Zurich Airport: Swisscom and Salt stores in Airport Shopping opposite Arrivals 2 (08:00–21:00).", "https://www.traveltomtom.net/destinations/europe/switzerland/sim-card-zurich"),
      ],
      rideHailing: [
        F("Uber does operate in Schaffhausen: UberX around the clock, and licensed taxi drivers may be assigned to UberX orders at UberX prices.", "https://www.uber.com/ch/de/r/cities/taxi/schaffhausen-sh-ch/"),
        F("Schaffhausen is on Uber's official list of Swiss cities.", "https://www.uber.com/global/en/r/switzerland/cities/"),
      ],
      transportPayment: [
        F("SBB EasyRide (in the SBB Mobile app): check in before departure, check out at your destination; it computes the cheapest ticket on trains, buses, trams and boats nationwide and caps the day at the Day Pass price. Pays by card, TWINT or monthly invoice — not Apple Pay.", "https://www.sbb.ch/en/travel-information/apps/sbb-mobile/easyride.html"),
        L("VBSH city buses are in the OSTWIND zone fare: a single ticket for the Schaffhausen city zone is valid 1 hour; journeys to Zurich use the Z-Pass joint fare. Digital tickets (EasyRide, FAIRTIQ) must be checked in BEFORE boarding.", "https://www.vbsh.ch/tickets/tickets-und-preise", "Current VBSH fares"),
        F("VBSH Ticketeria at Schaffhausen station: Mon–Fri 08:00–18:00, Sat 09:00–13:00; customer service +41 52 644 20 20. Unverified: whether drivers still sell tickets on board.", "https://www.vbsh.ch/tickets/ticketkauf"),
        F("Zurich Airport ↔ Schaffhausen by rail: the S24 runs Schaffhausen – Winterthur – Zürich Flughafen (about 37–40 minutes).", "https://en.wikipedia.org/wiki/S24_(ZVV)"),
      ],
      pharmacies: [
        F("Since 1 June 2025 the canton no longer runs a night-time on-duty pharmacy: pharmacies cover Mon–Sat 07:00–20:00 and Sun/holidays 08:00–18:00; outside those hours only the doctors' emergency practice and the hospital emergency department supply medication.", "https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Regierung/Staatskanzlei-16946780-DE.html"),
        L("Bahnhof-Apotheke, Bahnhofstrasse 27 — open 365 days, Mon–Sat 07:00–20:00, Sun/holidays 08:00–18:00; emergency line 052 625 26 86 (a surcharge applies outside regular hours).", "https://bahnhofapotheke.ch/notfallnummern/", "Current emergency surcharge"),
      ],
      printShops: [
        F("Copy+Print AG, Ebnatstrasse 65, 8200 Schaffhausen — tel. +41 52 624 84 77, info@copyprintsh.ch; Mon–Thu 07:45–12:00 / 13:15–17:00, Fri mornings only.", "https://copyprintsh.ch/kontakt/"),
      ],
      taxi: [
        F("Taxi-Kurier 2000: +41 52 622 22 00 (WhatsApp calls +41 79 570 22 22) — 24/7 including weekends and holidays.", "https://www.taxischaffhausen.ch/"),
        F("Helvetia-Taxi Schaffhausen: 052 672 40 40 / 079 672 40 40 — 24 h, stands at the station.", "https://www.helvetia-taxi.ch/"),
      ],
      emergency: [
        F("112 European emergency · 117 police · 118 fire · 144 ambulance · 145 Tox Info Suisse (poison) · 1414 Rega air rescue.", "https://bahnhofapotheke.ch/notfallnummern/"),
      ],
      hospitalEnglish: [
        F("Kantonsspital Schaffhausen Notfallzentrum, Geissbergstrasse 81, 8208 Schaffhausen — emergency department 24 h / 365 days, right of the main entrance; phone +41 52 634 34 00 (life-threatening: 144).", "https://www.spitaeler-sh.ch/Kliniken-Fachzentren/Notfallmedizin/Notfallstation/Leistungsangebot/"),
        F("GP walk-in Notfallpraxis at the same emergency centre: Mon–Fri 18:00–22:00, Sat/Sun/holidays 09:00–22:00. Unverified: English-language service is not stated on the hospital website.", "https://www.spitaeler-sh.ch/Kliniken-Fachzentren/Notfallmedizin/"),
        F("Nearest large alternative: University Hospital Zurich emergency, Schmelzbergstrasse 8 — 24 h, +41 44 255 11 11; information published in English.", "https://www.usz.ch/en/emergency/"),
      ],
    },
    relocation: {
      registration: [
        F("Register within 14 days of moving in at the Einwohnerkontrolle Stadt Schaffhausen — in person for arrivals from abroad. Bring passport/ID, civil-status documents (translated if needed), rental contract or landlord confirmation, and proof of Swiss health insurance (due within 3 months).", "https://www.stadt-schaffhausen.ch/dienste/100114"),
        F("Einwohnerkontrolle: Stadthausgasse 12, 8201 Schaffhausen, +41 52 632 52 75; Tue–Fri 08:00–11:30 and 14:00–17:00, Thu to 18:00, Mon afternoons; appointments bookable online.", "https://www.stadt-schaffhausen.ch/einwohnerkontrolle/30871"),
      ],
      residencePermit: [
        F("EU/EFTA workers apply to the Migrationsamt und Passbüro Schaffhausen (Mühlentalstrasse 105) online, by post or at the counter, after registering with the municipality. L = under 1 year, B = over 1 year.", "https://migrationsamt.sh.ch/erwerbstatige-eu-efta"),
        F("Non-EU/EFTA nationals are admitted only as managers, specialists or qualified workers within quotas; the employer must justify the need and prove unsuccessful recruitment in Switzerland/EU. Entry only after the permit is granted.", "https://sh.ch/CMS/get/file/63799e7c-d469-4ecd-963c-88b8432741ca"),
      ],
      taxId: [
        F("Withholding tax (Quellensteuer): B/L permit holders have tax deducted at source by the employer; an ordinary assessment can be requested by 31 March of the following year.", "https://www.estv.admin.ch/de/quellensteuer"),
        F("AHV number: 13 digits (756.XXXX.XXXX.XX); the employer reports you to the Ausgleichskasse (SVA Schaffhausen).", "https://www.svash.ch/ahv/kurzinformation/ahv-ausweis/"),
      ],
      banking: [
        F("Schaffhauser Kantonalbank: residents of the canton can open online in under 10 minutes with a passport or national ID (foreigner permits not accepted as online ID); anyone can open in person at a branch.", "https://www.shkb.ch/1063-kundin-oder-kunde-werden"),
        F("Health insurance is compulsory: basic cover must be taken out within three months of taking residence; it is retroactive to arrival if enrolled on time.", "https://www.bag.admin.ch/de/krankenversicherung-versicherungspflicht-fuer-in-der-schweiz-wohnhafte-versicherte"),
      ],
      mobile: [
        F("Postpaid contracts generally require a registered Swiss address and a residence permit (sometimes a credit check) — realistic only after registration; prepaid is the interim option.", "https://howtoswiss.com/guides/sim-cards-switzerland"),
      ],
      drivingLicence: [
        F("A valid foreign licence may be used for 12 months after taking residence; after that it must be exchanged at the Strassenverkehrs- und Schifffahrtsamt (in person, with ID and the foreigner permit).", "https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Baudepartement/Strassenverkehrs--und-Schifffahrtsamt/F-hrer--und-Lernfahrausweise/F-hrerausweise-1808291-DE.html"),
        F("The office moved in December 2024 to Ernst Müller-Strasse 2, 8207 Schaffhausen (Herblingertal); Mon–Fri 08:00–12:00 / 13:00–17:00 (address confirmed via third-party listings only).", "https://drivelab.ch/strassenverkehrsamt-schaffhausen/"),
      ],
      schools: [
        F("International School of Schaffhausen (ISSH), Mühlentalstrasse 280 — +41 52 624 17 07; English-language IB World School from nursery to IB Diploma, day and boarding.", "https://www.issh.ch/"),
        F("The city publishes an overview of Kitas, Horte and lunch tables (March 2026), e.g. municipal Kinderkrippe Lebensraum (from 4 months, Mon–Fri 06:30–18:30).", "https://www.stadt-schaffhausen.ch/_docn/6893248/Uebersichtsliste_KJB_Kita-Hort_Mittagstisch_03.2026.pdf"),
      ],
    },
  },
}
