import React, { useState } from "react"
import { Users, Copy, Check, MessageCircle } from "lucide-react"
import { C } from "../../brand.js"
import { useStore } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { Card, SectionTitle, Btn, Pill, Empty } from "../../components/ui.jsx"

/* Group mode: one trip, many travellers — rooming list, arrival manifest,
   driver schedule, and an export straight into a WhatsApp brief. */

function whatsappBrief(g) {
  const lines = [
    `*${g.name}* — ${g.city}`,
    `${fmtDate(g.start)} → ${fmtDate(g.end)}`,
    ``,
    `*Arrivals*`,
    ...g.travellers.map((t) => `• ${t.name} — ${t.flight}`),
    ``,
    `*Rooming*`,
    ...g.travellers.map((t) => `• ${t.name} — ${t.room}`),
    ``,
    `*Drivers*`,
    ...g.travellers.map((t) => `• ${t.name} — ${t.driver}`),
  ]
  return lines.join("\n")
}

export default function Groups() {
  const s = useStore()
  const [copied, setCopied] = useState("")

  const copy = async (g) => {
    try {
      await navigator.clipboard.writeText(whatsappBrief(g))
      setCopied(g.id)
      setTimeout(() => setCopied(""), 1500)
    } catch { /* blocked */ }
  }

  return (
    <div className="space-y-5">
      <SectionTitle sub="One trip, many travellers: the rooming list, the arrival manifest and the driver schedule live together, and export straight into a WhatsApp brief for the people on the ground.">
        Group trips
      </SectionTitle>

      {s.groupTrips.length === 0 && (
        <Empty icon={Users} title="No group trips" body="Board visits, delegations and event cohorts are managed here as one trip with many travellers." />
      )}

      {s.groupTrips.map((g) => (
        <Card key={g.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black" style={{ color: C.navy }}>{g.name}</span>
                <Pill tone="vip">{g.travellers.length} travellers</Pill>
              </div>
              <div className="text-sm" style={{ color: C.muted }}>{g.city} · {fmtDate(g.start)} → {fmtDate(g.end)}</div>
            </div>
            <Btn kind="blue" onClick={() => copy(g)}>
              {copied === g.id ? <Check size={14} /> : <MessageCircle size={14} />}
              {copied === g.id ? "Brief copied" : "Copy WhatsApp brief"}
            </Btn>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[11px] font-black uppercase tracking-wide" style={{ color: C.muted }}>
                  <th className="pb-2 pr-4">Traveller</th>
                  <th className="pb-2 pr-4">Arrival</th>
                  <th className="pb-2 pr-4">Room</th>
                  <th className="pb-2">Driver</th>
                </tr>
              </thead>
              <tbody>
                {g.travellers.map((t, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: C.rule }}>
                    <td className="py-2.5 pr-4 font-bold" style={{ color: C.navy }}>{t.name}</td>
                    <td className="py-2.5 pr-4" style={{ color: C.ink }}>{t.flight}</td>
                    <td className="py-2.5 pr-4" style={{ color: C.ink }}>{t.room}</td>
                    <td className="py-2.5" style={{ color: C.ink }}>{t.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
