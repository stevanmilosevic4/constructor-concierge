import React, { useRef, useState } from "react"
import { Camera, Receipt, Trash2, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, uid } from "../../lib/store.js"
import { REIMBURSEMENT, DEADLINE_ROWS, SCAN_COUNTRIES, DEADLINES, fmtDate } from "../../lib/policy.js"
import { Card, SectionTitle, Btn, Pill, Label, inputCls, inputStyle, Banner, Empty } from "../../components/ui.jsx"

const POS_META = {
  pays: ["good", "Company pays"],
  yes: ["good", "Reimbursed"],
  maybe: ["warn", "Conditional"],
  no: ["stop", "Not reimbursed"],
}

function ageDays(iso) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export default function Expenses({ user }) {
  const s = useStore()
  const fileRef = useRef(null)
  const myTrips = s.trips.filter((t) => t.userId === user.id)
  const [tripId, setTripId] = useState(myTrips[0]?.id || "")
  const [note, setNote] = useState("")
  const receipts = s.receipts.filter((r) => r.userId === user.id)

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      update((st) => ({
        receipts: [
          { id: uid(), userId: user.id, tripId, note, img: reader.result, taken: new Date().toISOString() },
          ...st.receipts,
        ],
      }))
      setNote("")
    }
    reader.readAsDataURL(f)
    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <SectionTitle sub="Photograph the receipt the moment you pay, tag it to the trip, and it waits here until the report. The 30-day problem is an “I'll do it later” problem — this solves it at source.">
        Expenses
      </SectionTitle>

      {/* Capture */}
      <Card>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <Label>Trip</Label>
            <select className={inputCls} style={inputStyle} value={tripId} onChange={(e) => setTripId(e.target.value)}>
              {myTrips.length === 0 && <option value="">No trips yet</option>}
              {myTrips.map((t) => (
                <option key={t.id} value={t.id}>{t.city} · {fmtDate(t.start)}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>What is it?</Label>
            <input className={inputCls} style={inputStyle} placeholder="Dinner, taxi from the airport…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Btn onClick={() => fileRef.current?.click()}><Camera size={15} /> Capture receipt</Btn>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
          </div>
        </div>
        <p className="mt-2 text-[11px]" style={{ color: C.muted }}>
          Scans are accepted in {SCAN_COUNTRIES.join(", ")}. Everywhere else keep the hard copy too — local law decides, not the company.
        </p>
      </Card>

      {/* Held receipts with the running clock */}
      {receipts.length === 0 ? (
        <Empty icon={Receipt} title="No receipts held" body="Captured receipts appear here with a running 30-day clock, so nothing quietly slides past the deadline." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => {
            const age = ageDays(r.taken)
            const left30 = DEADLINES.expenseDays - age
            const left90 = DEADLINES.expenseHardLimitDays - age
            const trip = s.trips.find((t) => t.id === r.tripId)
            const tone = left90 <= 0 ? "stop" : left30 <= 7 ? "warn" : "good"
            return (
              <Card key={r.id}>
                <img src={r.img} alt="Receipt" className="h-36 w-full rounded-lg object-cover" style={{ border: `1px solid ${C.rule}` }} />
                <div className="mt-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold" style={{ color: C.navy }}>{r.note || "Receipt"}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{trip ? `${trip.city} trip` : "Untagged"} · {fmtDate(r.taken.slice(0, 10))}</div>
                  </div>
                  <button onClick={() => update((st) => ({ receipts: st.receipts.filter((x) => x.id !== r.id) }))} aria-label="Delete receipt">
                    <Trash2 size={14} style={{ color: C.red }} />
                  </button>
                </div>
                <div className="mt-2">
                  <Pill tone={tone}>
                    <Clock size={10} />
                    {left90 <= 0 ? "Past 90 days — not reimbursable" : left30 > 0 ? `${left30} days to submit` : `${left90} days to the hard limit`}
                  </Pill>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Deadlines */}
      <Card>
        <div className="mb-3 text-sm font-black" style={{ color: C.navy }}>The clock — miss it and this happens</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-wide" style={{ color: C.muted }}>
                <th className="pb-2 pr-4">What</th><th className="pb-2 pr-4">When</th><th className="pb-2">If you miss it</th>
              </tr>
            </thead>
            <tbody>
              {DEADLINE_ROWS.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: C.rule }}>
                  <td className="py-2.5 pr-4 font-bold" style={{ color: C.navy }}>{r[0]}</td>
                  <td className="py-2.5 pr-4" style={{ color: C.ink }}>{r[1]}</td>
                  <td className="py-2.5" style={{ color: r[2].includes("Not reimbursed") ? "#A81000" : C.muted }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Banner tone="stop" icon={AlertTriangle} title="The two rules that cause every problem">
        1. Approval comes before booking — never the other way round. 2. No valid invoice, no reimbursement.
        Everything else is detail.
      </Banner>

      {/* What gets paid */}
      <Card>
        <div className="mb-3 text-sm font-black" style={{ color: C.navy }}>What gets paid, and what does not</div>
        <div className="space-y-3">
          {REIMBURSEMENT.map((r, i) => {
            const [tone, label] = POS_META[r.pos]
            return (
              <div key={i} className="flex flex-wrap items-start justify-between gap-2 border-t pt-3 first:border-0 first:pt-0" style={{ borderColor: C.rule }}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold" style={{ color: C.navy }}>{r.cat}</div>
                  <div className="mt-0.5 text-xs leading-relaxed" style={{ color: C.muted }}>{r.rule}</div>
                  {r.evidence !== "—" && <div className="mt-0.5 text-[11px]" style={{ color: C.confident }}>Evidence: {r.evidence}</div>}
                </div>
                <Pill tone={tone}>{label}</Pill>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
