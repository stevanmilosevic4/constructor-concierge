/* =====================================================================
   Local store — persistence for the prototype.

   Everything lives in localStorage under one key, seeded on first run.
   When this moves behind a real backend, this file is the only one that
   changes: every screen goes through useStore()/update().
   ===================================================================== */

import { useSyncExternalStore } from "react"
import { SEED_CITIES } from "../data/cities.js"

const KEY = "constructor-concierge-v1"

/* The People registry — seeded with the pilot group; the concierge team
   maintains it in the admin panel (People tab). role: employee | ea | admin.
   Tier (Standard vs Executive) is derived from level via isVip(). */
export const SEED_PEOPLE = [
  { id: "u-ana",    email: "ana.petrovic@constructor.university", name: "Ana Petrović",   role: "employee", level: "Employee",          entity: "Constructor University", managerEmail: "manager@constructor.university" },
  { id: "u-viktor", email: "viktor.hahn@constructor.org",         name: "Viktor Hahn",    role: "employee", level: "VP / Director",     entity: "Constructor Knowledge",  managerEmail: "manager@constructor.org" },
  { id: "u-serg",   email: "sb@constructor.org",                  name: "S. Bell",        role: "employee", level: "C-level",           entity: "Constructor Group",      managerEmail: "" },
  { id: "u-lena",   email: "lena.krug@constructor.org",           name: "Lena Krug",      role: "ea",       level: "Employee",          entity: "Constructor Group",      assistsEmail: "sb@constructor.org" },
  { id: "u-conc",   email: "concierge@constructor.org",           name: "Concierge team", role: "admin",    level: "Employee",          entity: "Constructor Knowledge" },
]

/* Work-email domains allowed to sign in. Editable in the People tab. */
export const SEED_DOMAINS = ["constructor.university", "constructor.org", "constructor.academy", "weareconstructor.com"]

function seed() {
  return {
    session: null, // { userId }
    people: structuredClone(SEED_PEOPLE),
    allowedDomains: [...SEED_DOMAINS],
    cities: structuredClone(SEED_CITIES),

    /* Requests the guidance engine has produced — the admin sees these
       as a log. Status is informational: the concierge team routes and
       observes; it never holds an approval state of its own. */
    requests: [
      { id: "r1", userId: "u-viktor", userName: "Viktor Hahn", type: "flight", label: "Book a flight", dest: "Istanbul", created: "2026-08-18T09:12:00", status: "routed", gates: ["Late booking"], routedTo: "Booking partner cc T&E Officer" },
      { id: "r2", userId: "u-ana", userName: "Ana Petrović", type: "visa", label: "Visa, entry rules or passport", dest: "Brazil", created: "2026-08-17T14:40:00", status: "routed", gates: [], routedTo: "Mobility" },
    ],

    /* Booked trips per user — powers "my trip", wallet, hotel-nearby,
       who's in town. In production this arrives from BCD itinerary data
       (tier 2 of the integration brief) instead of manual entry. */
    trips: [
      { id: "t1", userId: "u-ana", city: "Istanbul", start: "2026-08-24", end: "2026-08-28", hotelIdx: 0, purpose: "Partner university visit", family: false },
      { id: "t2", userId: "u-serg", city: "Istanbul", start: "2026-08-25", end: "2026-08-27", hotelIdx: 0, purpose: "Board dinner", family: false },
      { id: "t3", userId: "u-viktor", city: "Bremen", start: "2026-09-02", end: "2026-09-05", hotelIdx: 1, purpose: "Campus review", family: true },
    ],

    /* Who's in town is opt-in per user. */
    presenceOptIn: { "u-ana": true, "u-serg": true, "u-viktor": true },

    /* Agenda — meetings per principal userId. EAs with assistsUserId
       edit their principal's list; briefs attach per meeting. */
    meetings: [
      { id: "m1", userId: "u-serg", day: "2026-08-25", time: "19:30", title: "Board dinner — Bosphorus restaurant", place: "Partner restaurant, Bebek", brief: "Host: rector's office. Dietary: one vegetarian. Gift for Prof. K. in the car.", by: "Lena Krug" },
      { id: "m2", userId: "u-serg", day: "2026-08-26", time: "09:00", title: "Partner university — presidents' meeting", place: "Levent campus, room 4.1", brief: "Briefing pack attached in email. Names and pronunciation sheet printed.", by: "Lena Krug" },
    ],

    /* Receipt capture — photographed at the moment of paying, tagged to
       the trip, held until the report. */
    receipts: [],

    /* Guest links — no-login shareable pages. */
    guestLinks: [
      {
        id: "g-demo", guest: "Prof. Elena Marinescu", host: "Office of the CEO", city: "Bremen",
        arrive: "2026-09-10", flight: "LH 2442 → BRE 17:35",
        driver: { name: "M. Weber", plate: "HB-CU 2026", phone: "+49 421 555 0100" },
        hotel: "Partner hotel, Altstadt — Am Markt 1", contact: "+49 421 555 0199 (guest hotline)",
        agenda: [
          { time: "17:35", item: "Arrival BRE — driver meets inside arrivals, name board" },
          { time: "19:30", item: "Dinner with the president, Ratskeller" },
          { time: "Next 09:00", item: "Keynote — Constructor University campus, main auditorium" },
        ],
        notes: "Vegetarian. Prefers still water. Return transfer booked for 14:00 next day.",
      },
    ],

    /* Group trips — one trip, many travellers. */
    groupTrips: [
      {
        id: "gr1", name: "Supervisory board visit", city: "Bremen", start: "2026-09-10", end: "2026-09-12",
        travellers: [
          { name: "Prof. Elena Marinescu", flight: "LH 2442 → BRE 17:35", room: "Partner hotel Altstadt #201", driver: "M. Weber · HB-CU 2026" },
          { name: "Dr. James Wei", flight: "KL 1753 → BRE 18:10", room: "Partner hotel Altstadt #204", driver: "M. Weber · HB-CU 2026 (second run)" },
          { name: "S. Bell", flight: "LH 038 → BRE 12:20", room: "Corporate apartment 3", driver: "T. Yilmaz · HB-CU 2027" },
        ],
      },
    ],

    /* Pack update broadcasts — pushed to everyone travelling to that
       city in the next 30 days. */
    broadcasts: [
      { id: "b1", city: "Istanbul", created: "2026-08-19T10:00:00", text: "IST fast-track desk has moved to the east end of arrivals — follow 'CIP' signs. Rate card unchanged." },
    ],

    /* Per-user read state of broadcasts. */
    broadcastReads: {},
  }
}

/* ------------------------------------------------------------------ */

let state = load()
const listeners = new Set()

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const s = seed()
      // Shallow merge so new seed keys appear after an app update.
      return { ...s, ...parsed, cities: parsed.cities || s.cities, people: parsed.people || s.people, allowedDomains: parsed.allowedDomains || s.allowedDomains }
    }
  } catch { /* corrupted or unavailable — reseed */ }
  return seed()
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full/blocked — keep in memory */ }
}

export function update(fn) {
  state = { ...state, ...fn(state) }
  persist()
  listeners.forEach((l) => l())
}

export function resetAll() {
  state = seed()
  persist()
  listeners.forEach((l) => l())
}

export function getState() { return state }

export function useStore() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
  )
}

/* Convenience selectors ------------------------------------------- */

export const currentUser = (s) => (s.people || []).find((u) => u.id === s.session?.userId) || null

export const personByEmail = (s, email) =>
  (s.people || []).find((p) => p.email.toLowerCase() === (email || "").trim().toLowerCase()) || null

export const uid = () => Math.random().toString(36).slice(2, 9)

export function colleaguesInTown(s, user) {
  // Opt-in only, and only overlapping dates in the same city.
  const mine = s.trips.filter((t) => t.userId === user.id)
  const out = []
  for (const t of mine) {
    for (const o of s.trips) {
      if (o.userId === user.id || o.city !== t.city) continue
      if (!s.presenceOptIn[o.userId]) continue
      if (o.start <= t.end && t.start <= o.end) {
        const who = (s.people || []).find((u) => u.id === o.userId)
        if (who) out.push({ trip: o, who, overlapCity: t.city })
      }
    }
  }
  return out
}

export function upcomingBroadcasts(s, user) {
  // Broadcasts for cities the user travels to in the next 30 days.
  const now = new Date()
  const horizon = new Date(now); horizon.setDate(horizon.getDate() + 30)
  const cities = new Set(
    s.trips.filter((t) => t.userId === user.id &&
      new Date(t.end) >= now && new Date(t.start) <= horizon).map((t) => t.city))
  return s.broadcasts.filter((b) => cities.has(b.city))
}
