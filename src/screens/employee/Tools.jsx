import React, { useState } from "react"
import {
  Calculator, ShieldCheck, Users, ExternalLink, AlertTriangle, CheckCircle2,
  Globe, Baby,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update, colleaguesInTown } from "../../lib/store.js"
import { PER_DIEM_SOURCES, CONTACTS, fmtDate, daysUntil } from "../../lib/policy.js"
import { VISA_MATRIX, PASSPORTS, VISA_DESTS } from "../../data/cities.js"
import { Card, SectionTitle, Label, inputCls, inputStyle, Pill, Banner } from "../../components/ui.jsx"

/* ------------------------------------------------------------------ */

function PerDiem() {
  const [entity, setEntity] = useState("Germany")
  const src = PER_DIEM_SOURCES[entity]
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <Calculator size={15} style={{ color: C.confident }} /> Per diem lookup
      </div>
      <p className="mb-3 text-xs leading-relaxed" style={{ color: C.muted }}>
        Meals follow the statutory rate of your <b>employing entity's country</b> — not the destination's habit,
        and not a company table. The app links the live source instead of quoting figures, because the rates
        change annually and a stale number is worse than none.
      </p>
      <Label>Where is your employing entity?</Label>
      <select className={inputCls} style={inputStyle} value={entity} onChange={(e) => setEntity(e.target.value)}>
        {Object.keys(PER_DIEM_SOURCES).map((k) => <option key={k}>{k}</option>)}
      </select>
      <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
        <div className="text-sm font-bold" style={{ color: C.navy }}>{src.source}</div>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: C.muted }}>{src.note}</p>
        <a href={src.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: C.confident }}>
          Open the current rates <ExternalLink size={12} />
        </a>
      </div>
      <p className="mt-2 text-[11px]" style={{ color: C.muted }}>
        Breakfast is separate: should be in the room rate; if not, up to 15 EUR/CHF/USD per day against a receipt.
      </p>
    </Card>
  )
}

/* ------------------------------------------------------------------ */

function VisaCheck() {
  const [passport, setPassport] = useState("")
  const [dest, setDest] = useState("")
  const [expiry, setExpiry] = useState("")
  const [family, setFamily] = useState(false)
  const hit = VISA_MATRIX.find((v) => v.passport === passport && v.dest === dest)
  const expiryDays = expiry ? daysUntil(expiry) : null
  const expiryWarn = expiryDays !== null && expiryDays < 183

  const NEED_META = {
    none: { tone: "good", label: "No visa needed" },
    evisa: { tone: "warn", label: "e-Visa required" },
    visa: { tone: "stop", label: "Visa required" },
  }

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <ShieldCheck size={15} style={{ color: C.confident }} /> Passport & visa check
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Passport</Label>
          <select className={inputCls} style={inputStyle} value={passport} onChange={(e) => setPassport(e.target.value)}>
            <option value="">Choose…</option>
            {PASSPORTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <Label>Destination</Label>
          <select className={inputCls} style={inputStyle} value={dest} onChange={(e) => setDest(e.target.value)}>
            <option value="">Choose…</option>
            {VISA_DESTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <Label>Passport expiry date</Label>
          <input type="date" className={inputCls} style={inputStyle} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </div>
        <div className="flex items-end pb-1">
          <button
            onClick={() => setFamily(!family)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition"
            style={family ? { backgroundColor: "#E6F6FF", color: C.confident, border: `1.5px solid ${C.blue}` } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
          >
            <Baby size={14} /> Family travelling too
          </button>
        </div>
      </div>

      {expiryWarn && (
        <div className="mt-3">
          <Banner tone="stop" icon={AlertTriangle} title={`Passport expires in ${expiryDays} days`}>
            Many countries refuse entry inside six months of expiry. Renew before you book — and remember the
            renewal itself is a personal cost, not a reimbursable one.
          </Banner>
        </div>
      )}

      {hit && (
        <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
          <Pill tone={NEED_META[hit.need].tone}>{NEED_META[hit.need].label}</Pill>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: C.ink }}>{hit.note}</p>
          {hit.need !== "none" && (
            <p className="mt-2 text-xs" style={{ color: C.muted }}>
              The vetted handler for this corridor does the application; <a className="font-bold" style={{ color: C.confident }} href={`mailto:${CONTACTS.mobility.email}`}>{CONTACTS.mobility.email}</a> owns the case. Visa fees for the trip are reimbursed.
            </p>
          )}
        </div>
      )}
      {passport && dest && !hit && (
        <div className="mt-3">
          <Banner tone="info" icon={Globe}>
            That corridor is not in the matrix yet — ask <a className="font-bold underline" href={`mailto:${CONTACTS.mobility.email}`}>{CONTACTS.mobility.email}</a> and
            the concierge team will add the answer for the next traveller.
          </Banner>
        </div>
      )}
      {family && (
        <p className="mt-3 text-xs leading-relaxed" style={{ color: C.muted }}>
          <b>Family:</b> run the same check per passport — children's passports expire faster, and some corridors
          need parental-consent letters for minors. The city pack's family layer lists paediatric and school contacts.
        </p>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */

function WhoInTown({ user }) {
  const s = useStore()
  const optedIn = Boolean(s.presenceOptIn[user.id])
  const nearby = optedIn ? colleaguesInTown(s, user) : []
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
        <Users size={15} style={{ color: C.confident }} /> Who else is in town
      </div>
      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
        Opt-in only. When on, colleagues travelling to the same city on overlapping dates can see you, and you them.
        It saves duplicate trips, enables shared cars — and doubles as duty of care.
      </p>
      <button
        onClick={() => update((st) => ({ presenceOptIn: { ...st.presenceOptIn, [user.id]: !optedIn } }))}
        className="mt-3 w-full rounded-lg py-2.5 text-sm font-bold transition"
        style={optedIn ? { backgroundColor: "#E2FAF3", color: "#00654C", border: "1.5px solid #A8EFDA" } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}
      >
        {optedIn ? "Sharing is on — tap to turn off" : "Sharing is off — tap to opt in"}
      </button>
      {optedIn && nearby.length > 0 && (
        <div className="mt-3 space-y-2">
          {nearby.map((n, i) => (
            <div key={i} className="rounded-lg p-3" style={{ backgroundColor: C.paper }}>
              <div className="text-sm font-bold" style={{ color: C.navy }}>{n.who.name}</div>
              <div className="text-xs" style={{ color: C.muted }}>{n.overlapCity} · {fmtDate(n.trip.start)} → {fmtDate(n.trip.end)}</div>
            </div>
          ))}
        </div>
      )}
      {optedIn && nearby.length === 0 && (
        <p className="mt-3 text-xs" style={{ color: C.muted }}>No overlaps right now.</p>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */

export default function Tools({ user }) {
  return (
    <div className="space-y-5">
      <SectionTitle sub="The lookups nobody actually does until an app makes them one tap: statutory per diems, visa requirements, and who else is where you're going.">
        Tools
      </SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <PerDiem />
        <VisaCheck />
        <WhoInTown user={user} />
      </div>
    </div>
  )
}
