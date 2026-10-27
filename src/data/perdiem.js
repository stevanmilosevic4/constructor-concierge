/* =====================================================================
   COMPANY PER DIEM RATES — one easy-to-edit table.

   These are the company's own daily meal allowances, set by the
   concierge/finance side per destination country and entity. Edit this
   file to change them — nothing else needs touching; the Tools screen
   and the city packs read from here. A rate of null renders as
   "Rate pending — contact concierge@constructor.org", never as a number.

   Last updated: 15 October 2026 (rates provided by the concierge team).
   The underlying statutory sources per employing entity stay linked in
   the per-diem tool (policy.js PER_DIEM_SOURCES).
   ===================================================================== */

export const PER_DIEM_ENTITIES = [
  "Constructor University",
  "Constructor Knowledge",
  "Constructor Capital",
]

export const PER_DIEM_UPDATED = "2026-10-15"

/* rate: { [entity]: amount } or a single number when identical for all.
   null = rate pending. Currency per country. */
export const PER_DIEM_RATES = {
  "Germany":     { currency: "EUR", rate: 50 },
  "Bulgaria":    { currency: "EUR", rate: 35 },
  "Serbia":      { currency: "EUR", rate: 50 },
  "Türkiye":     { currency: "EUR", rate: 50, aka: "Turkey" },
  "Singapore":   { currency: "EUR", rate: 50 },
  "Switzerland": { currency: "EUR", rate: null },
  "Brazil":      { currency: "EUR", rate: null },
}

export function perDiemFor(country, entity) {
  const row = PER_DIEM_RATES[country]
  if (!row) return { known: false }
  const rate = typeof row.rate === "object" && row.rate !== null ? row.rate[entity] ?? null : row.rate
  return { known: true, rate, currency: row.currency }
}

export const PER_DIEM_COUNTRIES = Object.keys(PER_DIEM_RATES)
