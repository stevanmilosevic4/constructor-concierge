import React, { useState } from "react"
import { Megaphone, Send } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, uid } from "../../lib/store.js"
import { fmtDate } from "../../lib/policy.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, Pill, Banner } from "../../components/ui.jsx"

/* Pack updates pushed: when a city pack changes, everyone travelling
   there in the next 30 days hears about it. Otherwise you're maintaining
   documents nobody re-reads. */

export default function Broadcasts() {
  const s = useStore()
  const names = Object.keys(s.cities)
  const [city, setCity] = useState(names[0])
  const [text, setText] = useState("")

  const horizon = new Date(); horizon.setDate(horizon.getDate() + 30)
  const today = new Date().toISOString().slice(0, 10)
  const willHear = s.trips
    .filter((t) => t.city === city && t.end >= today && t.start <= horizon.toISOString().slice(0, 10))
    .map((t) => s.people.find((u) => u.id === t.userId))
    .filter(Boolean)

  const send = () => {
    if (!text.trim()) return
    update((st) => ({ broadcasts: [{ id: uid(), city, created: new Date().toISOString(), text: text.trim() }, ...st.broadcasts] }))
    setText("")
  }

  return (
    <div className="space-y-5">
      <SectionTitle sub="When a city pack changes, everyone travelling there in the next 30 days hears about it — on their home screen, before the trip. Otherwise you are maintaining documents nobody re-reads.">
        Pack updates
      </SectionTitle>

      <Card>
        <div className="grid gap-3 sm:grid-cols-[200px_1fr_auto]">
          <div>
            <Label>City</Label>
            <select className={inputCls} style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)}>
              {names.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <Label>What changed?</Label>
            <input className={inputCls} style={inputStyle} placeholder="e.g. Fast-track desk has moved — follow CIP signs" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          </div>
          <div className="flex items-end">
            <Btn onClick={send} disabled={!text.trim()}><Send size={14} /> Push</Btn>
          </div>
        </div>
        <div className="mt-3 text-xs" style={{ color: C.muted }}>
          {willHear.length > 0
            ? <>Will reach now: {willHear.map((u) => <Pill key={u.id} tone="info" className="ml-1">{u.name}</Pill>)} — travelling to {city} in the next 30 days.</>
            : <>No one is currently travelling to {city} in the next 30 days — the update still saves to the pack.</>}
        </div>
      </Card>

      <div className="space-y-3">
        {s.broadcasts.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start gap-3">
              <Megaphone size={16} className="mt-0.5 shrink-0" style={{ color: C.confident }} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black" style={{ color: C.navy }}>{b.city}</span>
                  <span className="text-[11px]" style={{ color: C.muted }}>{fmtDate(b.created.slice(0, 10))}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed" style={{ color: C.ink }}>{b.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Banner tone="info" title="Why 30 days">
        A pack update is only useful to someone about to rely on the pack. Everyone else sees the current pack
        when they next open it — no noise, no “update fatigue”.
      </Banner>
    </div>
  )
}
