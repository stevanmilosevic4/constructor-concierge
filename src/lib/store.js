/* =====================================================================
   Local store — persistence for the prototype.

   Everything lives in localStorage under one key, seeded on first run.
   When this moves behind a real backend, this file is the only one that
   changes: every screen goes through useStore()/update().
   ===================================================================== */

import { useSyncExternalStore } from "react"
import { SEED_CITIES } from "../data/cities.js"

const KEY = "constructor-concierge-v2"

/* The People registry — seeded with the pilot group; the concierge team
   maintains it in the admin panel (People tab). role: employee | ea | admin.
   Tier (Standard vs Executive) is derived from level via isVip(). */
export const SEED_PEOPLE = [
  { id: "u-conc", email: "concierge@constructor.org", name: "Concierge team", role: "admin", level: "Employee", entity: "Constructor Knowledge" },
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
    requests: [],

    /* Booked trips per user — powers "my trip", wallet, hotel-nearby,
       who's in town. In production this arrives from BCD itinerary data
       (tier 2 of the integration brief) instead of manual entry. */
    trips: [],

    /* Who's in town is opt-in per user. */
    presenceOptIn: {},

    /* Agenda — meetings per principal userId. EAs (assistsEmail) edit
       their principal's list; briefs attach per meeting. */
    meetings: [],

    /* Receipt capture — photographed at the moment of paying, tagged to
       the trip, held until the report. */
    receipts: [],

    /* Guest links — no-login shareable pages. */
    guestLinks: [],

    /* Group trips — one trip, many travellers. */
    groupTrips: [],

    /* Pack update broadcasts — pushed to everyone travelling to that
       city in the next 30 days. */
    broadcasts: [],

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
