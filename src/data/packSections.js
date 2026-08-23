/* =====================================================================
   PACK SECTIONS — one registry that decides what a city pack contains
   for each audience. The traveller screen, the admin editor and the
   printable PDF all read this list, so adding a section here adds it
   everywhere.

   audience:  "visit"     — short business trip
              "relocate"  — a move
              "both"
   kind:      "partner"   — concierge-negotiated, ships EMPTY, admin fills
              "facts"     — researched public facts with sources (data/facts.js)
   ===================================================================== */

import {
  Car, Utensils, Stethoscope, Baby, Dumbbell, Bed, Briefcase, KeyRound,
  Landmark, Scale, Calculator, Building, Tent, Camera, ShieldCheck,
  Smartphone, Navigation, CreditCard, Pill, Printer, Phone, Siren, Hospital,
  ClipboardList, FileBadge, PiggyBank, CarFront, Hash, School, Languages, HeartHandshake,
} from "lucide-react"

export const MODES = [
  ["visit", "Visiting", "A trip of days or weeks — what you need on arrival and around the hotel."],
  ["relocate", "Relocating", "A move — registration, permits, banking, schools, the first ninety days."],
]

export const forAudience = (items, mode) => items.filter((x) => x.audience === "both" || x.audience === mode)

/* Partner sections: [label, note] tuple lists the admin maintains.
   `hotels` and `offers` have their own editors and are not listed here. */
export const PARTNER_SECTIONS = [
  { key: "transfers", title: "Transfer rate card", audience: "both", icon: Car, cols: ["Route", "Fixed price", "Note"],
    empty: "Fixed airport-to-centre prices, billed monthly to the entity, child seats and free waiting time — the rate card appears when the partner is signed." },
  { key: "eat", title: "Eating & hosting", audience: "both", icon: Utensils, cols: ["Place / use case", "Note"],
    empty: "Vetted places for client dinners and everyday lunches, with group rates where agreed." },
  { key: "health", title: "Healthcare partners", audience: "both", icon: Stethoscope, cols: ["Provider", "Arrangement"],
    empty: "English- and German-speaking clinics, dental, priority appointments and direct billing." },
  { key: "wellbeing", title: "Wellbeing — gym, padel, tennis, spa", audience: "both", icon: Dumbbell, cols: ["Venue", "Arrangement"],
    empty: "Gyms, courts, pools and spas at partner rates." },
  { key: "coworking", title: "Co-working", audience: "both", icon: Briefcase, cols: ["Space", "Arrangement"],
    empty: "Day passes and monthly desks at a preferred rate." },
  { key: "carRental", title: "Car rental", audience: "both", icon: CarFront, cols: ["Provider", "Rate / code"],
    empty: "Corporate rate and booking code. Remember: rental cars need C-level approval in advance under the policy." },
  { key: "visaHandler", title: "Visa & immigration handler", audience: "both", icon: FileBadge, cols: ["Handler", "Corridor / scope"],
    empty: "One vetted handler for this corridor, plus the invitation-letter template. The concierge team maintains the table; the handler does the work." },
  { key: "dutyOfCare", title: "Duty of care", audience: "both", icon: ShieldCheck, cols: ["Item", "Detail"],
    empty: "Insurance summary, what to do if hospitalised or if a passport is lost, embassy contacts, risk notes." },
  { key: "servicedApartments", title: "Serviced apartments (1–4 weeks)", audience: "both", icon: Bed, cols: ["Property", "Rate / contact"],
    empty: "Negotiated rates for stays of one to four weeks." },
  { key: "family", title: "Family layer — schools, kindergartens, paediatricians", audience: "relocate", icon: Baby, cols: ["Institution / service", "Contact & waiting-time note"],
    empty: "International schools with admissions contacts and typical waiting times, kindergartens, paediatricians, language schools, partner/spouse networks." },
  { key: "relocationAgents", title: "Relocation agents & immigration lawyers", audience: "relocate", icon: KeyRound, cols: ["Firm", "Scope & contact"],
    empty: "Vetted relocation agents and immigration lawyers who handle the move end to end." },
  { key: "taxAdvisors", title: "Tax advisors", audience: "relocate", icon: Calculator, cols: ["Advisor", "Scope & contact"],
    empty: "Cross-border tax advice for the first year — residency, double taxation, filing." },
  { key: "offsite", title: "Offsite venues & DMC", audience: "visit", icon: Tent, cols: ["Venue / DMC", "Capacity & contact"],
    empty: "Vetted venues and one destination-management partner, plus the template runbook, so teams run their own offsites." },
  { key: "suppliers", title: "Interpreters, photographers, videographers", audience: "visit", icon: Camera, cols: ["Supplier", "Service & contact"],
    empty: "One vetted supplier per service per city, for events and VIP visits." },
]

/* Practical facts — researched, each with a source. Keys match data/facts.js. */
export const PRACTICAL_FACTS = [
  { key: "sim", title: "SIM & eSIM", icon: Smartphone },
  { key: "rideHailing", title: "Ride-hailing that actually works here", icon: Navigation },
  { key: "transportPayment", title: "Paying for public transport", icon: CreditCard },
  { key: "pharmacies", title: "Pharmacies", icon: Pill },
  { key: "printShops", title: "Printing documents", icon: Printer },
  { key: "taxi", title: "Taxi number when the app fails", icon: Phone },
  { key: "emergency", title: "Emergency numbers", icon: Siren },
  { key: "hospitalEnglish", title: "Nearest hospital that speaks English", icon: Hospital },
]

/* Relocation facts — public procedure, researched with sources. */
export const RELOCATION_FACTS = [
  { key: "registration", title: "Register your address", icon: ClipboardList },
  { key: "residencePermit", title: "Residence & work permit", icon: FileBadge },
  { key: "taxId", title: "Tax ID & social insurance", icon: Hash },
  { key: "banking", title: "Opening a bank account", icon: PiggyBank },
  { key: "mobile", title: "Phone contract", icon: Smartphone },
  { key: "drivingLicence", title: "Driving licence", icon: CarFront },
  { key: "schools", title: "International schools", icon: School },
]

/* Every city starts with the full set of empty partner slots. */
export const emptyPartnerAreas = () => ({
  hotels: [],
  offers: [],
  ...Object.fromEntries(PARTNER_SECTIONS.map((s) => [s.key, []])),
  wallet: { hotelLocal: "", driver: null, fixedFare: "", insurance: "", embassyNote: "" },
})

export const ICONS = { Landmark, Scale, Building, Languages, HeartHandshake }
