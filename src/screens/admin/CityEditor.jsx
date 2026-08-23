import React, { useState } from "react"
import {
  Plus, Trash2, Tag, Building2, Save, Bed, Wallet, ChevronRight,
} from "lucide-react"
import { C } from "../../brand.js"
import { useStore, update } from "../../lib/store.js"
import { Card, SectionTitle, Btn, Label, inputCls, inputStyle, Pill, Banner } from "../../components/ui.jsx"
import { PARTNER_SECTIONS, emptyPartnerAreas } from "../../data/packSections.js"

/* The admin edits structured records; the traveller-facing pack renders
   from them — the strategy note's cure for stale documents. Everything
   saved here persists and shows for every traveller immediately.
   The rule of the seed data holds here too: only REAL partners go in. */

const OFFER_CATS = ["Stay", "Transfer", "Eat", "Health", "Wellbeing", "Airport", "Transport", "Shop", "Service"]
const NEAR_CATS = ["Food", "Shop", "Health", "Work", "Move", "Transport", "Service", "Wellbeing"]
const blankOffer = { name: "", cat: "Stay", offer: "", how: "", code: "" }

function Section({ icon: Icon, title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
          <Icon size={15} style={{ color: C.confident }} /> {title}
          {badge && <Pill tone={badge === "Both" ? "neutral" : badge === "Relocating" ? "vip" : "info"}>{badge}</Pill>}
        </div>
        <ChevronRight size={16} style={{ color: C.blue, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && <div className="mt-3 border-t pt-3" style={{ borderColor: C.rule }}>{children}</div>}
    </Card>
  )
}

/* Editor for [a, b] or [a, b, c] tuple lists (transfers, eat, health…). */
function TupleEditor({ rows, cols, onChange, addLabel }) {
  const [draft, setDraft] = useState(cols.map(() => ""))
  const add = () => {
    if (!draft[0]) return
    onChange([...rows, [...draft]])
    setDraft(cols.map(() => ""))
  }
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-start justify-between gap-3 rounded-lg p-2.5" style={{ backgroundColor: C.paper }}>
          <div className="min-w-0 text-sm">
            <span className="font-bold" style={{ color: C.navy }}>{r[0]}</span>
            {r.slice(1).filter(Boolean).map((x, j) => <span key={j} style={{ color: C.muted }}> · {x}</span>)}
          </div>
          <button onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="Remove row">
            <Trash2 size={14} style={{ color: C.red }} />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-2 rounded-xl2 p-3" style={{ border: `1px dashed ${C.rule}` }}>
        {cols.map((c, i) => (
          <div key={i} className="min-w-[140px] flex-1">
            <Label>{c}{i === 0 ? " *" : ""}</Label>
            <input className={inputCls} style={inputStyle} value={draft[i]}
              onChange={(e) => setDraft(draft.map((v, j) => (j === i ? e.target.value : v)))}
              onKeyDown={(e) => e.key === "Enter" && add()} />
          </div>
        ))}
        <Btn kind="ghost" onClick={add}><Plus size={14} /> {addLabel || "Add"}</Btn>
      </div>
    </div>
  )
}

export default function CityEditor() {
  const s = useStore()
  const names = Object.keys(s.cities)
  const [city, setCity] = useState(names[0])
  const [offer, setOffer] = useState(blankOffer)
  const [newCity, setNewCity] = useState("")
  const d = s.cities[city]

  const patch = (partial) => {
    update((st) => ({
      cities: { ...st.cities, [city]: { ...st.cities[city], ...partial, updatedAt: new Date().toISOString().slice(0, 10) } },
    }))
  }
  const setField = (k) => (e) => patch({ [k]: e.target.value })
  const setWallet = (k) => (e) => patch({ wallet: { ...(d.wallet || {}), [k]: e.target.value } })
  const setDriver = (k) => (e) => patch({ wallet: { ...(d.wallet || {}), driver: { ...(d.wallet?.driver || {}), [k]: e.target.value } } })

  const addOffer = () => {
    if (!offer.name || !offer.offer || !offer.code) return
    patch({ offers: [...d.offers, offer] })
    setOffer(blankOffer)
  }

  const addCity = () => {
    const n = newCity.trim()
    if (!n || s.cities[n]) return
    update((st) => ({
      cities: {
        ...st.cities,
        [n]: {
          ...emptyPartnerAreas(),
          tag: "New", country: "", currency: "EUR", currencyName: "", emergency: "112", police: "",
          tz: "Europe/Berlin", lat: null, lon: null, wikiTitle: n, language: "", plugs: "", water: "",
          owner: "Concierge team · review quarterly", updatedAt: new Date().toISOString().slice(0, 10),
          intro: "", transport: [], history: [], funFacts: [], essentials: [],
          practical: {}, relocation: {}, countryProfile: null, places: [],
        },
      },
    }))
    setCity(n)
    setNewCity("")
  }

  return (
    <div className="space-y-5">
      <SectionTitle sub="One record per partner, one sheet per city, a named owner and a review date. Add real partners here and every traveller sees them immediately — the pack shows an honest 'being negotiated' area until then.">
        Cities & partners
      </SectionTitle>

      <div className="flex flex-wrap items-center gap-2">
        {names.map((n) => (
          <button key={n} onClick={() => setCity(n)}
            className="rounded-full px-4 py-2 text-sm font-bold transition"
            style={city === n ? { backgroundColor: C.navy, color: "#fff" } : { backgroundColor: "#fff", color: C.muted, border: `1px solid ${C.rule}` }}>
            {n}
          </button>
        ))}
        <div className="flex items-center gap-1">
          <input className={inputCls + " !w-36"} style={inputStyle} placeholder="Add city…" value={newCity}
            onChange={(e) => setNewCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCity()} />
          <Btn kind="ghost" onClick={addCity}><Plus size={14} /></Btn>
        </div>
      </div>

      {/* Basics */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black" style={{ color: C.navy }}>
            <Building2 size={15} style={{ color: C.confident }} /> {city}
          </div>
          <Pill tone="neutral">{d.owner} · updated {d.updatedAt}</Pill>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div><Label>Tag</Label><input className={inputCls} style={inputStyle} value={d.tag || ""} onChange={setField("tag")} /></div>
          <div><Label>Country</Label><input className={inputCls} style={inputStyle} value={d.country || ""} onChange={setField("country")} /></div>
          <div><Label>Currency code</Label><input className={inputCls} style={inputStyle} value={d.currency || ""} onChange={setField("currency")} /></div>
          <div><Label>Wikipedia title (drives the photo)</Label><input className={inputCls} style={inputStyle} value={d.wikiTitle || ""} onChange={setField("wikiTitle")} /></div>
          <div><Label>Latitude (drives weather)</Label><input className={inputCls} style={inputStyle} value={d.lat ?? ""} onChange={(e) => patch({ lat: parseFloat(e.target.value) || null })} /></div>
          <div><Label>Longitude</Label><input className={inputCls} style={inputStyle} value={d.lon ?? ""} onChange={(e) => patch({ lon: parseFloat(e.target.value) || null })} /></div>
          <div className="sm:col-span-3">
            <Label>Intro — the first thing a traveller reads</Label>
            <textarea rows={2} className={inputCls} style={inputStyle} value={d.intro || ""} onChange={setField("intro")} />
          </div>
        </div>
      </Card>

      {/* Offers */}
      <Section icon={Tag} title={`Offers & partnerships (${d.offers.length})`} defaultOpen>
        <div className="space-y-2">
          {d.offers.map((o) => (
            <div key={o.code} className="flex items-start justify-between gap-3 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: C.navy }}>{o.name}</span>
                  <Pill tone="info">{o.cat}</Pill>
                  <span className="font-mono text-[11px] font-bold" style={{ color: C.confident }}>{o.code}</span>
                </div>
                <div className="mt-0.5 text-xs" style={{ color: C.ink }}>{o.offer}</div>
                <div className="text-[11px]" style={{ color: C.muted }}>{o.how}</div>
              </div>
              <button onClick={() => patch({ offers: d.offers.filter((x) => x.code !== o.code) })} aria-label="Remove offer">
                <Trash2 size={14} style={{ color: C.red }} />
              </button>
            </div>
          ))}
          {d.offers.length === 0 && <p className="text-xs" style={{ color: C.muted }}>No signed offers yet for {city}. Add the first below.</p>}
        </div>
        <div className="mt-4 grid gap-3 rounded-xl2 p-4 sm:grid-cols-2" style={{ border: `1px dashed ${C.rule}` }}>
          <div><Label>Partner name *</Label><input className={inputCls} style={inputStyle} value={offer.name} onChange={(e) => setOffer({ ...offer, name: e.target.value })} /></div>
          <div>
            <Label>Category</Label>
            <select className={inputCls} style={inputStyle} value={offer.cat} onChange={(e) => setOffer({ ...offer, cat: e.target.value })}>
              {OFFER_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><Label>The offer *</Label><input className={inputCls} style={inputStyle} placeholder="e.g. 15% off the flexible rate, breakfast included" value={offer.offer} onChange={(e) => setOffer({ ...offer, offer: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>How to redeem</Label><input className={inputCls} style={inputStyle} placeholder="Quote the code when booking / show the QR at reception" value={offer.how} onChange={(e) => setOffer({ ...offer, how: e.target.value })} /></div>
          <div><Label>Code * (drives the QR)</Label><input className={inputCls} style={inputStyle} placeholder="CONSTR-XXX-YYY" value={offer.code} onChange={(e) => setOffer({ ...offer, code: e.target.value.toUpperCase() })} /></div>
          <div className="flex items-end"><Btn onClick={addOffer}><Save size={14} /> Add offer</Btn></div>
        </div>
      </Section>

      {/* Partner sections — one per registry entry, tagged by which pack they feed */}
      {PARTNER_SECTIONS.map((def) => (
        <Section key={def.key} icon={def.icon} title={`${def.title} (${(d[def.key] || []).length})`}
          badge={def.audience === "both" ? "Both" : def.audience === "relocate" ? "Relocating" : "Visiting"}>
          <p className="mb-3 text-xs" style={{ color: C.muted }}>{def.empty}</p>
          <TupleEditor rows={d[def.key] || []} cols={def.cols} addLabel="Add"
            onChange={(rows) => patch({ [def.key]: rows })} />
        </Section>
      ))}

      {/* Hotels */}
      <Section icon={Bed} title={`Accommodation (${d.hotels.length})`} badge="Both">
        <div className="space-y-2">
          {d.hotels.map((h, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-lg p-3" style={{ backgroundColor: C.paper }}>
              <div className="min-w-0 text-sm">
                <div className="font-bold" style={{ color: C.navy }}>{h.name}</div>
                <div className="text-xs" style={{ color: C.muted }}>{[h.area, h.address].filter(Boolean).join(" · ")}</div>
                {h.addressLocal && <div className="text-xs" style={{ color: C.muted }}>{h.addressLocal}</div>}
                {h.note && <div className="mt-0.5 text-[11px]" style={{ color: C.muted }}>{h.note}</div>}
              </div>
              <button onClick={() => patch({ hotels: d.hotels.filter((_, j) => j !== i) })} aria-label="Remove hotel">
                <Trash2 size={14} style={{ color: C.red }} />
              </button>
            </div>
          ))}
        </div>
        <HotelForm onAdd={(h) => patch({ hotels: [...d.hotels, h] })} />
      </Section>

      {/* Wallet */}
      <Section icon={Wallet} title="Travel wallet — offline card content">
        <p className="mb-3 text-xs" style={{ color: C.muted }}>
          What travellers carry with no signal: dispatch number, fixed-fare summary, insurance line. Emergency numbers come from the city facts.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Driver / dispatch name</Label><input className={inputCls} style={inputStyle} value={d.wallet?.driver?.name || ""} onChange={setDriver("name")} /></div>
          <div><Label>Dispatch phone</Label><input className={inputCls} style={inputStyle} value={d.wallet?.driver?.phone || ""} onChange={setDriver("phone")} /></div>
          <div className="sm:col-span-2"><Label>Fixed-fare summary</Label><input className={inputCls} style={inputStyle} placeholder="e.g. Airport → centre €NN · Station → office €NN" value={d.wallet?.fixedFare || ""} onChange={setWallet("fixedFare")} /></div>
          <div className="sm:col-span-2"><Label>Insurance line</Label><input className={inputCls} style={inputStyle} placeholder="Policy number · assistance phone" value={d.wallet?.insurance || ""} onChange={setWallet("insurance")} /></div>
          <div className="sm:col-span-2"><Label>Note for travellers</Label><input className={inputCls} style={inputStyle} value={d.wallet?.embassyNote || ""} onChange={setWallet("embassyNote")} /></div>
        </div>
      </Section>

      <Banner tone="info" title="Vetting standard">
        A recommendation is an endorsement in practice. Every record here implies: licensed operator, insurance
        certificate on file, named contact, agreed rate, review date. If a vendor would not pass that sentence,
        it does not go in the pack — and nothing invented is ever entered as a placeholder.
      </Banner>
    </div>
  )
}

function HotelForm({ onAdd }) {
  const blank = { name: "", area: "", address: "", addressLocal: "", note: "", near: [] }
  const [h, setH] = useState(blank)
  const set = (k) => (e) => setH({ ...h, [k]: e.target.value })
  return (
    <div className="mt-3 grid gap-3 rounded-xl2 p-4 sm:grid-cols-2" style={{ border: `1px dashed ${C.rule}` }}>
      <div><Label>Name *</Label><input className={inputCls} style={inputStyle} value={h.name} onChange={set("name")} /></div>
      <div><Label>Area</Label><input className={inputCls} style={inputStyle} placeholder="e.g. city centre, near campus" value={h.area} onChange={set("area")} /></div>
      <div><Label>Address</Label><input className={inputCls} style={inputStyle} value={h.address} onChange={set("address")} /></div>
      <div><Label>Address in local script</Label><input className={inputCls} style={inputStyle} placeholder="Shown to drivers on the offline wallet" value={h.addressLocal} onChange={set("addressLocal")} /></div>
      <div className="sm:col-span-2"><Label>Note</Label><input className={inputCls} style={inputStyle} placeholder="Rate arrangement, who it suits" value={h.note} onChange={set("note")} /></div>
      <div className="flex items-end">
        <Btn disabled={!h.name} onClick={() => { onAdd(h); setH(blank) }}><Save size={14} /> Add accommodation</Btn>
      </div>
    </div>
  )
}
