import React, { useState } from "react"
import { Tag } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { Card, Pill, SectionTitle, QR } from "../../components/ui.jsx"

export default function Offers({ user }) {
  const s = useStore()
  const names = Object.keys(s.cities)
  const myTrip = s.trips.find((t) => t.userId === user?.id && t.end >= new Date().toISOString().slice(0, 10))
  const [city, setCity] = useState(myTrip?.city || names[0])
  const [cat, setCat] = useState("All")
  const offers = s.cities[city].offers || []
  const cats = ["All", ...new Set(offers.map((o) => o.cat))]
  const shown = cat === "All" ? offers : offers.filter((o) => o.cat === cat)

  return (
    <div className="space-y-5">
      <SectionTitle sub="Discounts and partnerships the concierge team has negotiated, city by city. Show the QR, quote the code — the partner does the rest. New partners appear here as they're signed.">
        Partner offers
      </SectionTitle>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {names.map((n) => (
          <button key={n} onClick={() => { setCity(n); setCat("All") }}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition"
            style={city === n ? { backgroundColor: C.navy, color: "#fff" } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            {n}
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {cats.map((k) => (
          <button key={k} onClick={() => setCat(k)}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition"
            style={cat === k ? { backgroundColor: C.confident, color: "#fff" } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            {k}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((o) => (
          <Card key={o.code}>
            <div className="flex gap-4">
              <div className="min-w-0 flex-1">
                <Pill tone="info"><Tag size={10} /> {o.cat}</Pill>
                <div className="mt-1.5 text-sm font-black" style={{ color: C.navy }}>{o.name}</div>
                <div className="mt-1 text-sm leading-snug" style={{ color: C.ink }}>{o.offer}</div>
                <div className="mt-1.5 text-xs leading-relaxed" style={{ color: C.muted }}>{o.how}</div>
                <div className="mt-2 inline-block rounded-md px-2 py-1 font-mono text-[11px] font-bold tracking-wider"
                  style={{ backgroundColor: C.paper, color: C.confident, border: `1px solid ${C.rule}` }}>
                  {o.code}
                </div>
              </div>
              <div className="shrink-0 self-center rounded-lg bg-white p-1" style={{ border: `1px solid ${C.rule}` }}>
                <QR text={`CONSTRUCTOR:${o.code}`} size={96} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
        Personal-use spillover: many partner discounts extend to employees and their families off-duty — the same
        code applies unless the offer says otherwise. Codes are sample data pending the signed vendor network.
      </p>
    </div>
  )
}
